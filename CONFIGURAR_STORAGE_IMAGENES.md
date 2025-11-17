# Configurar Storage para Imágenes de Rifas

Para que la funcionalidad de subir imágenes funcione, necesitas crear un bucket en Supabase Storage.

## Pasos para Configurar

### 1. Crear el Bucket en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Storage** en el menú lateral
3. Haz clic en **"New bucket"**
4. Configura:
   - **Name**: `rifas-imagenes`
   - **Public bucket**: ✅ **Marca esta opción** (importante para que las imágenes sean accesibles públicamente)
5. Haz clic en **"Create bucket"**

### 2. Configurar Políticas de Storage

Para que los administradores puedan subir imágenes:

1. Haz clic en el bucket `rifas-imagenes`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New Policy"**
4. Selecciona **"For full customization"**
5. Usa esta política para permitir que los administradores suban imágenes:

**IMPORTANTE:** Ejecuta cada política por separado en el SQL Editor de Supabase.

**Política 1 - Permitir que administradores suban imágenes:**

```sql
CREATE POLICY "Admins pueden subir imágenes de rifas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rifas-imagenes' AND
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'admin'
);
```

Haz clic en **"Run"** para ejecutar esta primera política.

**Política 2 - Permitir que todos lean las imágenes (públicas):**

```sql
CREATE POLICY "Todos pueden leer imágenes de rifas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'rifas-imagenes');
```

Haz clic en **"Run"** nuevamente para ejecutar esta segunda política.

### 3. Verificar la Configuración

Después de crear el bucket y las políticas:

1. Ve al dashboard de administración (`/dashboard`)
2. Haz clic en **"Nueva Rifa"**
3. Deberías ver el campo **"Imagen de la Rifa (Opcional)"**
4. Selecciona una imagen y verifica que se muestre la vista previa
5. Completa el formulario y crea la rifa
6. La imagen debería aparecer en la tarjeta de la rifa

## Solución de Problemas

### Error: "Bucket not found"
- Verifica que el bucket se llame exactamente `rifas-imagenes` (con guión)
- Asegúrate de que el bucket esté marcado como público

### Error: "new row violates row-level security policy"
- Verifica que hayas ejecutado las políticas SQL anteriores
- Asegúrate de que tu usuario tenga rol `admin` en la tabla `usuarios`

### La imagen no se muestra después de subirla
- Verifica que el bucket sea público
- Revisa la consola del navegador para ver errores de CORS
- Verifica que la URL de la imagen sea accesible públicamente

## Notas

- Las imágenes se almacenan en Supabase Storage
- El tamaño máximo permitido es 5MB
- Formatos aceptados: JPG, PNG, GIF, WebP
- Las imágenes se organizan en la carpeta `rifas/` dentro del bucket

