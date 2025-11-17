# 🔑 Guía Paso a Paso: Obtener Credenciales de Supabase

## 📍 Ubicación Exacta en Supabase

Sigue estos pasos exactos para encontrar tus credenciales:

---

## Paso 1: Accede a tu Dashboard

1. Abre tu navegador
2. Ve a: **https://supabase.com**
3. Inicia sesión (si no tienes cuenta, créala primero)
4. Selecciona tu proyecto del listado

---

## Paso 2: Ve a Settings > API

1. En el **menú lateral izquierdo**, busca el ícono de **⚙️ Settings**
2. Haz clic en **"Settings"**
3. En el submenú que aparece, busca y haz clic en **"API"**

**Ruta visual:**
```
Dashboard
  └── Settings (⚙️) 
      └── API ← Haz clic aquí
```

---

## Paso 3: Encuentra las 3 Credenciales

En la página de API verás varias secciones. Aquí están las 3 que necesitas:

### 🔵 Credencial #1: Project URL

**Ubicación:** Sección **"Project URL"** (arriba de la página)

**Cómo se ve:**
```
Project URL
https://abcdefghijklmnop.supabase.co
```

**Qué hacer:**
- Copia toda la URL (desde `https://` hasta `.supabase.co`)
- Ejemplo: `https://abcdefghijklmnop.supabase.co`

---

### 🟢 Credencial #2: anon public key

**Ubicación:** Sección **"Project API keys"** → Busca **"anon" "public"**

**Cómo se ve:**
```
Project API keys

┌─────────────────────────────────────────┐
│ anon          public                    │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│ [👁️] [📋]                                │
└─────────────────────────────────────────┘
```

**Qué hacer:**
1. Busca la fila que dice **"anon"** y **"public"**
2. Haz clic en el ícono de **👁️** (ojo) para ver la key completa
3. Haz clic en el ícono de **📋** (copiar) para copiarla
4. Es una cadena MUY LARGA que empieza con `eyJ`

---

### 🔴 Credencial #3: service_role secret key

**Ubicación:** Misma sección **"Project API keys"** → Busca **"service_role" "secret"**

**Cómo se ve:**
```
Project API keys

┌─────────────────────────────────────────┐
│ service_role  secret                    │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│ [👁️] [📋]                                │
└─────────────────────────────────────────┘
```

**⚠️ IMPORTANTE:** Esta key es PRIVADA. No la compartas nunca.

**Qué hacer:**
1. Busca la fila que dice **"service_role"** y **"secret"**
2. Haz clic en el ícono de **👁️** (ojo) para ver la key completa
3. Haz clic en el ícono de **📋** (copiar) para copiarla
4. También es una cadena MUY LARGA que empieza con `eyJ`

---

## Paso 4: Verifica que Tienes las 3 Credenciales

Antes de continuar, asegúrate de tener:

- ✅ **Project URL**: Una URL que empieza con `https://` y termina con `.supabase.co`
- ✅ **anon public key**: Una cadena muy larga que empieza con `eyJ`
- ✅ **service_role secret key**: Una cadena muy larga que empieza con `eyJ`

---

## Paso 5: Guarda las Credenciales Temporalmente

Guarda las 3 credenciales en un lugar seguro (bloc de notas, por ejemplo):

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon key: eyJhbGc...
service_role key: eyJhbGc...
```

---

## 📸 Ejemplo Visual de la Página

La página de API se ve así:

```
┌─────────────────────────────────────────────────┐
│ Settings > API                                   │
├─────────────────────────────────────────────────┤
│                                                  │
│ Project URL                                      │
│ ┌────────────────────────────────────────────┐  │
│ │ https://abcdefghijklmnop.supabase.co       │  │
│ └────────────────────────────────────────────┘  │
│                                                  │
│ Project API keys                                 │
│ ┌────────────────────────────────────────────┐  │
│ │ anon          public    [👁️] [📋]         │  │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    │  │
│ └────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────┐  │
│ │ service_role  secret   [👁️] [📋]         │  │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    │  │
│ └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist

Marca cada paso cuando lo completes:

- [ ] Accedí a Supabase Dashboard
- [ ] Fui a Settings > API
- [ ] Copié el Project URL
- [ ] Copié la anon public key
- [ ] Copié la service_role secret key
- [ ] Verifiqué que las 3 credenciales están completas

---

## 🎯 Siguiente Paso

Una vez que tengas las 3 credenciales, las usaremos para crear el archivo `.env.local`

**¿Listo?** Cuando tengas las credenciales, avísame y te ayudo a crear el archivo `.env.local` con ellas.

