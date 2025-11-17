-- ============================================
-- VERIFICAR Y CORREGIR USUARIO ADMINISTRADOR
-- ============================================
-- Este script verifica y corrige el usuario administrador
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- ============================================
-- PASO 1: Verificar si el usuario existe en auth.users
-- ============================================
SELECT 
  'Verificando usuario en auth.users...' as paso,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@sistema-rifas.com';

-- ============================================
-- PASO 2: Verificar si el usuario existe en public.usuarios
-- ============================================
SELECT 
  'Verificando usuario en public.usuarios...' as paso,
  id,
  email,
  nombre,
  rol,
  created_at
FROM public.usuarios
WHERE email = 'admin@sistema-rifas.com';

-- ============================================
-- PASO 3: Corregir o crear el usuario administrador
-- ============================================
DO $$
DECLARE
  user_id UUID;
  usuario_existe BOOLEAN := false;
BEGIN
  -- Verificar si el usuario existe en auth.users
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'admin@sistema-rifas.com'
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE NOTICE '❌ Usuario NO encontrado en auth.users';
    RAISE NOTICE '';
    RAISE NOTICE '📋 INSTRUCCIONES:';
    RAISE NOTICE '1. Ve a Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '2. Haz clic en "Add user" o "Invite user"';
    RAISE NOTICE '3. Completa el formulario:';
    RAISE NOTICE '   - Email: admin@sistema-rifas.com';
    RAISE NOTICE '   - Password: Admin123!@#';
    RAISE NOTICE '   - Auto Confirm User: ✅ MARCADO';
    RAISE NOTICE '4. Haz clic en "Create user"';
    RAISE NOTICE '5. Ejecuta este script de nuevo';
    RAISE NOTICE '';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Usuario encontrado en auth.users con ID: %', user_id;

  -- Verificar si existe en public.usuarios
  SELECT EXISTS(
    SELECT 1 FROM public.usuarios WHERE id = user_id
  ) INTO usuario_existe;

  IF usuario_existe THEN
    -- Actualizar el usuario existente
    UPDATE public.usuarios
    SET 
      email = 'admin@sistema-rifas.com',
      nombre = 'Administrador Principal',
      rol = 'admin'
    WHERE id = user_id;
    
    RAISE NOTICE '✅ Usuario actualizado en public.usuarios con rol admin';
  ELSE
    -- Insertar nuevo usuario
    INSERT INTO public.usuarios (id, email, nombre, rol)
    VALUES (user_id, 'admin@sistema-rifas.com', 'Administrador Principal', 'admin');
    
    RAISE NOTICE '✅ Usuario creado en public.usuarios con rol admin';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '🎉 Usuario administrador configurado correctamente!';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Credenciales:';
  RAISE NOTICE '   Email: admin@sistema-rifas.com';
  RAISE NOTICE '   Contraseña: Admin123!@#';
  RAISE NOTICE '   Rol: admin';
END $$;

-- ============================================
-- PASO 4: Verificar resultado final
-- ============================================
SELECT 
  'Resultado final:' as estado,
  u.id,
  u.email,
  u.nombre,
  u.rol,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '⚠️ Email NO confirmado'
  END as estado_email,
  u.created_at
FROM public.usuarios u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@sistema-rifas.com';

-- ============================================
-- PASO 5: Si el email no está confirmado, usar esto:
-- ============================================
-- Si el email no está confirmado, ejecuta esto para confirmarlo:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW()
-- WHERE email = 'admin@sistema-rifas.com';

