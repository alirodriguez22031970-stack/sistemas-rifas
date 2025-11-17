# 🔐 Credenciales del Usuario Administrador

## 📧 Credenciales de Acceso

**Email:** `admin@sistema-rifas.com`  
**Contraseña:** `Admin123!@#`

**⚠️ IMPORTANTE:** Cambia esta contraseña después del primer inicio de sesión por seguridad.

---

## 🚀 Pasos para Crear el Usuario Administrador

### Paso 1: Crear Usuario en Supabase Auth

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com)
2. En el menú lateral, haz clic en **Authentication**
3. Haz clic en **Users**
4. Haz clic en el botón **"Add user"** o **"Invite user"**
5. Completa el formulario:
   - **Email**: `admin@sistema-rifas.com`
   - **Password**: `Admin123!@#`
   - **Auto Confirm User**: ✅ **Marca esta casilla** (para que no necesite verificar email)
6. Haz clic en **"Create user"**

### Paso 2: Configurar Rol de Administrador

1. Ve a **SQL Editor** en Supabase
2. Haz clic en **"New query"**
3. Copia y pega este código:

```sql
-- Obtener el ID del usuario y configurarlo como admin
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
    RAISE EXCEPTION 'Usuario no encontrado. Asegúrate de crear el usuario primero en Authentication > Users';
  END IF;

  -- Insertar en la tabla usuarios con rol admin
  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (user_id, 'admin@sistema-rifas.com', 'Administrador Principal', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET rol = 'admin', nombre = 'Administrador Principal';

  RAISE NOTICE '✅ Usuario administrador configurado correctamente!';
END $$;

-- Verificar
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol
FROM public.usuarios u
WHERE u.email = 'admin@sistema-rifas.com';
```

4. Haz clic en **"Run"**
5. Deberías ver el usuario con `rol = 'admin'` en los resultados

### Paso 3: Iniciar Sesión

1. Ve a tu aplicación: `http://localhost:3000/login`
2. Ingresa las credenciales:
   - **Email**: `admin@sistema-rifas.com`
   - **Contraseña**: `Admin123!@#`
3. Haz clic en **"Iniciar Sesión"**
4. Deberías ser redirigido al dashboard de administración

---

## ✅ Funcionalidades del Panel de Administración

Una vez que inicies sesión como administrador, tendrás acceso a:

### 📊 Dashboard Principal
- Estadísticas en tiempo real
- Resumen de ventas y compras
- Rifas activas

### 🎫 Gestión de Rifas
- Crear nuevas rifas
- Editar rifas existentes
- Controlar visibilidad de rifas
- Ver progreso de ventas

### 🛒 Gestión de Compras
- Aprobar/rechazar compras pendientes
- Editar datos de compradores
- Ver historial completo
- Generar PDFs de recibos

### 👥 Gestión de Usuarios (NUEVO)
- Ver todos los usuarios del sistema
- Crear nuevos usuarios administrativos
- Cambiar roles (admin/usuario)
- Buscar usuarios por nombre o email

### 📈 Estadísticas
- Gráficas interactivas
- Top participantes
- Ventas por mes
- Métodos de pago

---

## 🎯 Cómo Agregar Más Usuarios Administrativos

### Opción 1: Desde el Panel de Administración (Recomendado)

1. Inicia sesión como administrador
2. Ve a **Dashboard > Usuarios**
3. Haz clic en **"Crear Usuario"**
4. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña
   - Rol: Selecciona **"Administrador"**
5. Haz clic en **"Crear Usuario"**

### Opción 2: Cambiar Rol de Usuario Existente

1. Ve a **Dashboard > Usuarios**
2. Busca el usuario que quieres hacer administrador
3. Haz clic en **"Hacer Admin"**
4. Confirma el cambio

---

## 🔐 Cambiar Contraseña del Administrador

### Desde Supabase:
1. Ve a **Authentication > Users**
2. Busca `admin@sistema-rifas.com`
3. Haz clic en los tres puntos (⋯)
4. Selecciona **"Reset password"** o **"Change password"**

---

## 📝 Notas Importantes

- El email `admin@sistema-rifas.com` es solo un ejemplo. Puedes usar cualquier email.
- La contraseña debe cumplir los requisitos de Supabase (mínimo 6 caracteres).
- Guarda estas credenciales en un lugar seguro.
- Cambia la contraseña después del primer uso.
- Solo los administradores pueden crear otros administradores.

---

## ✅ Checklist de Configuración

- [ ] Creé el usuario en Authentication > Users
- [ ] Ejecuté el script SQL para configurar el rol admin
- [ ] Verifiqué que el usuario tiene rol = 'admin'
- [ ] Inicié sesión exitosamente
- [ ] Accedí al dashboard de administración
- [ ] Puedo ver la sección "Usuarios" en el menú
- [ ] Puedo crear nuevos usuarios desde el panel

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de gestión de usuarios administrativos. Puedes crear y gestionar todos los usuarios del sistema desde el panel de administración.

