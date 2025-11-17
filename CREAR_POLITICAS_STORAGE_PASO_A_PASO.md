# Crear Políticas de Storage - Paso a Paso

## ⚠️ IMPORTANTE: Usa el SQL Editor, NO la interfaz de Policies

El error que estás viendo ocurre porque la interfaz de "New Policy" no acepta el formato completo. Usa el **SQL Editor** directamente.

## Pasos Detallados

### Paso 1: Abrir SQL Editor

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. En el menú lateral, haz clic en **"SQL Editor"** (no en Storage → Policies)
3. Haz clic en **"New query"** o usa el editor que ya está abierto

### Paso 2: Ejecutar Primera Política

1. **Borra todo** lo que esté en el editor
2. Copia y pega **SOLO** esto:

```sql
CREATE POLICY "Admins pueden subir imágenes de rifas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rifas-imagenes' AND
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'admin'
);
```

3. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)
4. Deberías ver: ✅ "Success. No rows returned"

### Paso 3: Ejecutar Segunda Política

1. **Borra todo** del editor nuevamente
2. Copia y pega **SOLO** esto:

```sql
CREATE POLICY "Todos pueden leer imágenes de rifas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'rifas-imagenes');
```

3. Haz clic en **"Run"** nuevamente
4. Deberías ver: ✅ "Success. No rows returned"

## ✅ Verificar que Funcionó

1. Ve a **Storage** → **rifas-imagenes** → **Policies**
2. Deberías ver 2 políticas listadas:
   - "Admins pueden subir imágenes de rifas"
   - "Todos pueden leer imágenes de rifas"

## 🔧 Si Aparece Error "policy already exists"

Si una política ya existe y quieres recrearla, primero elimínala:

```sql
DROP POLICY IF EXISTS "Admins pueden subir imágenes de rifas" ON storage.objects;
DROP POLICY IF EXISTS "Todos pueden leer imágenes de rifas" ON storage.objects;
```

Luego ejecuta las políticas de nuevo siguiendo los pasos 2 y 3.

## 📝 Notas

- **NO uses** la interfaz de "New Policy" en Storage → Policies
- **SÍ usa** el SQL Editor directamente
- Ejecuta cada política **por separado**
- Asegúrate de que el bucket `rifas-imagenes` esté creado y sea público antes de crear las políticas

