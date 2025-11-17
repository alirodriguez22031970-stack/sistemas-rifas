# 🔑 Cómo Obtener las Credenciales de Supabase

## Paso a Paso

### 1. Accede a tu Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto (o créalo si aún no lo tienes)

---

### 2. Navega a Settings > API

1. En el menú lateral izquierdo, busca el ícono de **⚙️ Settings**
2. Haz clic en **Settings**
3. En el submenú, haz clic en **API**

---

### 3. Encuentra las Credenciales

En la página de API verás varias secciones. Necesitas estas 3 credenciales:

#### 📍 Project URL
- Está en la sección **"Project URL"**
- Se ve así: `https://xxxxxxxxxxxxx.supabase.co`
- **Copia esta URL completa**

#### 🔓 anon public key
- Está en la sección **"Project API keys"**
- Busca la que dice **"anon" "public"**
- Es una cadena muy larga que empieza con `eyJhbGc...`
- Haz clic en el ícono de **👁️** para verla completa
- **Copia esta key completa**

#### 🔐 service_role secret key
- En la misma sección **"Project API keys"**
- Busca la que dice **"service_role" "secret"**
- También es una cadena larga que empieza con `eyJhbGc...`
- Haz clic en el ícono de **👁️** para verla completa
- **⚠️ IMPORTANTE: Esta es PRIVADA, no la compartas nunca**
- **Copia esta key completa**

---

### 4. Ubicación Visual en Supabase

```
Supabase Dashboard
├── Settings (⚙️)
    └── API
        ├── Project URL ← Aquí está la URL
        └── Project API keys
            ├── anon public ← Esta key
            └── service_role secret ← Esta key (PRIVADA)
```

---

### 5. Formato de las Credenciales

Las credenciales se ven así:

```
Project URL:
https://abcdefghijklmnop.supabase.co

anon public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

service_role secret key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

---

### 6. Verificación

Antes de continuar, asegúrate de tener:

- ✅ Project URL (empieza con `https://` y termina con `.supabase.co`)
- ✅ anon public key (muy larga, empieza con `eyJ`)
- ✅ service_role secret key (muy larga, empieza con `eyJ`)

---

## ⚠️ Seguridad

- **anon public key**: Es segura de compartir, va en el frontend
- **service_role secret key**: Es PRIVADA, solo para el backend, nunca la compartas públicamente
- No subas el archivo `.env.local` a Git (ya está en `.gitignore`)

---

## 📝 Siguiente Paso

Una vez que tengas las 3 credenciales, las usaremos para crear el archivo `.env.local`

