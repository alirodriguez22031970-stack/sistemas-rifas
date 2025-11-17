# Solución: Error "new row violates row-level security policy" al crear rifas

## Problema

La política RLS de la tabla `rifas` solo tiene `USING` pero no tiene `WITH CHECK`, lo cual es necesario para permitir INSERT.

## Solución

Ejecuta este script SQL en Supabase SQL Editor:

```sql
-- Eliminar la política existente
DROP POLICY IF EXISTS "Solo admins pueden modificar rifas" ON public.rifas;

-- Crear política correcta con USING y WITH CHECK
CREATE POLICY "Solo admins pueden modificar rifas"
  ON public.rifas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
```

## Pasos

1. Ve a Supabase Dashboard → **SQL Editor**
2. Copia y pega el script completo de arriba
3. Haz clic en **"Run"**
4. Deberías ver: ✅ "Success. No rows returned"

## Verificar

Después de ejecutar el script:

1. Intenta crear una rifa nuevamente desde el dashboard
2. El error debería desaparecer
3. La rifa se creará correctamente con la imagen

## Nota

- `USING` se usa para SELECT, UPDATE, DELETE
- `WITH CHECK` se usa para INSERT y UPDATE
- Para `FOR ALL`, necesitas ambos

