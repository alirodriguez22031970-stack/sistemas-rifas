-- ============================================
-- POLÍTICAS DE STORAGE PARA IMÁGENES DE RIFAS
-- ============================================
-- Ejecuta estas políticas UNA POR UNA en Supabase SQL Editor
-- NO las ejecutes todas juntas

-- ============================================
-- POLÍTICA 1: Administradores pueden subir imágenes
-- ============================================
-- Ejecuta esta primera y haz clic en "Run"

CREATE POLICY "Admins pueden subir imágenes de rifas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rifas-imagenes' AND
  (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- POLÍTICA 2: Todos pueden leer las imágenes (públicas)
-- ============================================
-- Ejecuta esta segunda DESPUÉS de la primera
-- Haz clic en "Run" nuevamente

CREATE POLICY "Todos pueden leer imágenes de rifas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'rifas-imagenes');

-- ============================================
-- NOTAS:
-- ============================================
-- 1. Asegúrate de que el bucket 'rifas-imagenes' esté creado y sea público
-- 2. Ejecuta cada política por separado
-- 3. Si una política ya existe, verás un error. Puedes eliminarla primero o usar:
--    DROP POLICY IF EXISTS "nombre_de_la_politica" ON storage.objects;

