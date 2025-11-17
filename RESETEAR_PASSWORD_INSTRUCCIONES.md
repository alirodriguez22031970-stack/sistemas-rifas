# 🔐 Resetear Contraseña del Administrador

## Método 1: Usando el Endpoint API (Recomendado)

### Paso 1: Verificar que el servidor esté corriendo
```bash
npm run dev
```

### Paso 2: Abrir la página de reset
1. Abre tu navegador
2. Ve a: `http://localhost:3000/reset-password-admin.html`
3. O crea un archivo HTML con el contenido de `RESETEAR_PASSWORD_ADMIN.html` y ábrelo

### Paso 3: Hacer clic en "Resetear Contraseña"
- El script reseteará automáticamente la contraseña
- Te mostrará las nuevas credenciales

### Paso 4: Esperar 5 minutos
- El rate limit de Supabase puede durar hasta 5 minutos
- Espera antes de intentar hacer login

---

## Método 2: Usando cURL (Terminal)

Si tienes acceso a la terminal, ejecuta:

```bash
curl -X POST http://localhost:3000/api/admin/reset-password \
  -H "Content-Type: application/json"
```

---

## Método 3: Manual desde Supabase Dashboard

### Paso 1: Ir a Supabase Dashboard
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu proyecto

### Paso 2: Ir a Authentication
1. En el menú lateral, haz clic en **Authentication**
2. Haz clic en **Users**

### Paso 3: Buscar el usuario
1. Busca el usuario: `admin@sistema-rifas.com`
2. Haz clic en los **tres puntos (⋯)** a la derecha del usuario

### Paso 4: Resetear contraseña
1. Haz clic en **"Reset password"** o **"Change password"**
2. Establece la nueva contraseña: `Admin123!@#`
3. Guarda los cambios

### Paso 5: Confirmar email (si es necesario)
1. Si el email no está confirmado, haz clic en **"Send confirmation email"**
2. O ejecuta este script en SQL Editor:

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@sistema-rifas.com';
```

---

## Método 4: Usando SQL (Solo verificación)

Este método NO resetea la contraseña directamente (las contraseñas están encriptadas), pero puedes verificar y corregir otros aspectos:

```sql
-- Verificar usuario
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email = 'admin@sistema-rifas.com';

-- Confirmar email
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@sistema-rifas.com';

-- Verificar rol en public.usuarios
SELECT id, email, rol
FROM public.usuarios
WHERE email = 'admin@sistema-rifas.com';
```

---

## ✅ Después de Resetear

1. **Espera 5 minutos** (para que se libere el rate limit)
2. Ve a `http://localhost:3000/login`
3. Ingresa:
   - **Email:** `admin@sistema-rifas.com`
   - **Contraseña:** `Admin123!@#`
4. Deberías poder iniciar sesión

---

## 🆘 Si Aún No Funciona

1. Verifica que el archivo `.env.local` tenga:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Ejecuta el script `DIAGNOSTICO_COMPLETO_ADMIN.sql` en Supabase SQL Editor

3. Verifica en la consola del navegador (F12) si hay errores

4. Espera más tiempo (el rate limit puede durar hasta 10 minutos en casos extremos)

