-- ============================================
-- SCRIPT SIMPLE: Crear Usuario Administrador
-- ============================================
-- Ejecuta este script DESPUÉS de crear el usuario en Authentication > Users

-- Paso 1: Crear usuario en Authentication > Users (hazlo manualmente primero)
-- Email: admin@sistema-rifas.com
-- Password: Admin123!@#
-- Auto Confirm: ✅ Marcado

-- Paso 2: Ejecuta este script para configurar el rol de admin
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Obtener el ID del usuario
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'admin@sistema-rifas.com'
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado. Primero crea el usuario en Authentication > Users con email: admin@sistema-rifas.com';
  END IF;

  -- Insertar o actualizar en la tabla usuarios con rol admin
  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (user_id, 'admin@sistema-rifas.com', 'Administrador Principal', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET rol = 'admin', nombre = 'Administrador Principal', email = 'admin@sistema-rifas.com';

  RAISE NOTICE '✅ Usuario administrador configurado correctamente!';
  RAISE NOTICE 'ID: %', user_id;
  RAISE NOTICE 'Email: admin@sistema-rifas.com';
  RAISE NOTICE 'Rol: admin';
END $$;

-- Verificar
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol,
  u.created_at
FROM public.usuarios u
WHERE u.email = 'admin@sistema-rifas.com';

-- Deberías ver una fila con rol = 'admin'

