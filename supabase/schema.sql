-- Tabla de usuarios (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de rifas
CREATE TABLE IF NOT EXISTS public.rifas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  total_numeros INTEGER NOT NULL CHECK (total_numeros IN (100, 1000, 10000)),
  numeros_vendidos INTEGER DEFAULT 0 CHECK (numeros_vendidos >= 0 AND numeros_vendidos <= total_numeros),
  imagen_url TEXT,
  imagenes TEXT[],
  visible BOOLEAN DEFAULT true,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CHECK (fecha_fin > fecha_inicio)
);

-- Tabla de números vendidos (para tracking rápido)
CREATE TABLE IF NOT EXISTS public.numeros_vendidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rifa_id UUID NOT NULL REFERENCES public.rifas(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL CHECK (numero > 0),
  compra_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(rifa_id, numero)
);

-- Tabla de compras
CREATE TABLE IF NOT EXISTS public.compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rifa_id UUID NOT NULL REFERENCES public.rifas(id) ON DELETE CASCADE,
  comprador_nombre TEXT NOT NULL,
  comprador_cedula TEXT NOT NULL,
  comprador_telefono TEXT NOT NULL,
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('pago_movil', 'zelle', 'transferencia')),
  referencia_pago TEXT,
  monto_total DECIMAL(10, 2) NOT NULL CHECK (monto_total > 0),
  cantidad_boletos INTEGER NOT NULL CHECK (cantidad_boletos > 0),
  numeros_asignados INTEGER[] NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  pdf_url TEXT,
  whatsapp_enviado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_rifas_visible ON public.rifas(visible) WHERE visible = true;
CREATE INDEX IF NOT EXISTS idx_rifas_activa ON public.rifas(activa) WHERE activa = true;
CREATE INDEX IF NOT EXISTS idx_numeros_vendidos_rifa ON public.numeros_vendidos(rifa_id);
CREATE INDEX IF NOT EXISTS idx_numeros_vendidos_numero ON public.numeros_vendidos(rifa_id, numero);
CREATE INDEX IF NOT EXISTS idx_compras_rifa ON public.compras(rifa_id);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON public.compras(estado);
CREATE INDEX IF NOT EXISTS idx_compras_cedula ON public.compras(comprador_cedula);
CREATE INDEX IF NOT EXISTS idx_compras_created ON public.compras(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_rifas_updated_at BEFORE UPDATE ON public.rifas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compras_updated_at BEFORE UPDATE ON public.compras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar numeros_vendidos cuando se aprueba una compra
CREATE OR REPLACE FUNCTION actualizar_numeros_vendidos()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estado = 'aprobada' AND (OLD.estado IS NULL OR OLD.estado != 'aprobada') THEN
    -- Actualizar contador de números vendidos en la rifa
    UPDATE public.rifas
    SET numeros_vendidos = numeros_vendidos + NEW.cantidad_boletos
    WHERE id = NEW.rifa_id;
    
    -- Insertar números vendidos
    INSERT INTO public.numeros_vendidos (rifa_id, numero, compra_id)
    SELECT NEW.rifa_id, unnest(NEW.numeros_asignados), NEW.id
    ON CONFLICT (rifa_id, numero) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar números vendidos
CREATE TRIGGER trigger_actualizar_numeros_vendidos
  AFTER UPDATE OF estado ON public.compras
  FOR EACH ROW
  WHEN (NEW.estado = 'aprobada' AND (OLD.estado IS NULL OR OLD.estado != 'aprobada'))
  EXECUTE FUNCTION actualizar_numeros_vendidos();

-- Políticas RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rifas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.numeros_vendidos ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id);

-- Política: Admins pueden ver todos los usuarios
CREATE POLICY "Admins pueden ver todos los usuarios"
  ON public.usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política: Usuarios pueden insertar su propio registro
CREATE POLICY "Usuarios pueden insertar su propio registro"
  ON public.usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política: Rifas visibles para todos, ocultas solo para admins
CREATE POLICY "Rifas visibles para todos"
  ON public.rifas FOR SELECT
  USING (
    visible = true OR
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política: Solo admins pueden modificar rifas
CREATE POLICY "Solo admins pueden modificar rifas"
  ON public.rifas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política: Usuarios pueden crear compras
CREATE POLICY "Usuarios pueden crear compras"
  ON public.compras FOR INSERT
  WITH CHECK (true);

-- Política: Usuarios pueden ver sus propias compras
CREATE POLICY "Usuarios pueden ver sus propias compras"
  ON public.compras FOR SELECT
  USING (
    comprador_cedula IN (
      SELECT comprador_cedula FROM public.compras
      WHERE comprador_cedula = comprador_cedula
    ) OR
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política: Solo admins pueden modificar compras
CREATE POLICY "Solo admins pueden modificar compras"
  ON public.compras FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política: Numeros vendidos visibles para todos (para validación)
CREATE POLICY "Numeros vendidos visibles para todos"
  ON public.numeros_vendidos FOR SELECT
  USING (true);

-- Política: Solo admins pueden insertar números vendidos
CREATE POLICY "Solo admins pueden insertar números vendidos"
  ON public.numeros_vendidos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

