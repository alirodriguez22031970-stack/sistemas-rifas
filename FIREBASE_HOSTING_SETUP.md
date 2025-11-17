# 🚀 Configuración de Firebase Hosting para Next.js

Esta guía te ayudará a configurar Firebase Hosting para desplegar tu aplicación Next.js.

## ⚠️ Importante: Limitaciones de Firebase Hosting

Firebase Hosting es principalmente para sitios estáticos. Para Next.js con Server Components, API Routes y SSR, necesitas:

**Opción 1: Firebase Hosting + Cloud Functions (Complejo)**
- Requiere configuración adicional
- Más costoso (Cloud Functions)
- Más complejo de mantener

**Opción 2: Vercel (Recomendado para Next.js)**
- Configuración automática
- Optimizado para Next.js
- Gratis para proyectos pequeños
- Mejor rendimiento

**Opción 3: Export Estático (Limitado)**
- Solo páginas estáticas
- Sin SSR, API Routes ni Server Components
- No funcionará con tu aplicación actual

## 📋 Pasos para Configurar Firebase Hosting

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 2: Iniciar Sesión en Firebase

```bash
firebase login
```

### Paso 3: Inicializar Firebase en tu Proyecto

```bash
firebase init hosting
```

Cuando te pregunte:
- **¿Qué proyecto de Firebase quieres usar?** → Selecciona tu proyecto o crea uno nuevo
- **¿Qué directorio público quieres usar?** → `out` (para export estático) o `.next` (para standalone)
- **¿Configurar como SPA?** → No (para Next.js)
- **¿Configurar GitHub Actions?** → Opcional

### Paso 4: Actualizar .firebaserc

Edita el archivo `.firebaserc` y reemplaza `TU_PROJECT_ID_AQUI` con tu Project ID de Firebase.

Puedes encontrar tu Project ID en:
- Firebase Console → Configuración del proyecto → General

### Paso 5: Configurar Variables de Entorno en Firebase

Para usar variables de entorno en producción, necesitas configurarlas en Firebase Functions o usar Firebase Hosting con Cloud Functions.

**Opción A: Usar Firebase Functions (Recomendado para SSR)**

1. Crea un archivo `functions/index.js`:

```javascript
const { next } = require('next')
const functions = require('firebase-functions')

const nextApp = next({
  dev: false,
  conf: { distDir: '.next' }
})

const nextjsHandle = nextApp.getRequestHandler()

exports.nextjs = functions.https.onRequest((req, res) => {
  return nextApp.prepare().then(() => nextjsHandle(req, res))
})
```

2. Instala dependencias en `functions/`:

```bash
cd functions
npm install firebase-functions firebase-admin next
cd ..
```

**Opción B: Usar Export Estático (Solo si no necesitas SSR)**

1. Actualiza `next.config.js`:

```javascript
const nextConfig = {
  output: 'export', // Cambiar de 'standalone' a 'export'
  // ... resto de la configuración
}
```

2. Actualiza `package.json`:

```json
{
  "scripts": {
    "build": "next build && next export"
  }
}
```

3. Actualiza `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Paso 6: Configurar Variables de Entorno

Crea un archivo `.env.production` con tus variables de entorno:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
```

### Paso 7: Construir y Desplegar

```bash
# Construir la aplicación
npm run build

# Desplegar a Firebase Hosting
npm run firebase:deploy
```

O desplegar todo (hosting + functions):

```bash
npm run firebase:deploy:all
```

## 🔧 Configuración Alternativa: Usar Vercel (Recomendado)

Vercel está optimizado para Next.js y es más simple:

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Desplegar:**
```bash
vercel
```

3. **Configurar variables de entorno en Vercel Dashboard:**
- Ve a tu proyecto en Vercel
- Settings → Environment Variables
- Agrega todas las variables de `.env.local`

4. **Desplegar a producción:**
```bash
vercel --prod
```

## 📝 Notas Importantes

1. **Server Components y API Routes**: Si usas estas características, necesitas un servidor Node.js. Firebase Hosting estático no las soporta.

2. **Middleware**: Next.js middleware requiere un servidor Node.js.

3. **Variables de Entorno**: En Firebase Hosting estático, las variables `NEXT_PUBLIC_*` se incluyen en el build, pero las variables del servidor no funcionan.

4. **Costos**: Firebase Functions tiene un plan gratuito limitado. Vercel ofrece mejor plan gratuito para Next.js.

## 🆘 Solución de Problemas

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `package.json`
- Ejecuta `npm install` antes de construir

### Error: "Environment variables not found"
- Verifica que las variables estén configuradas en Firebase Functions o en el build
- Usa `NEXT_PUBLIC_*` para variables del cliente

### Error: "API routes not working"
- Necesitas usar Firebase Functions o Vercel
- Firebase Hosting estático no soporta API routes

## 📚 Recursos

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Deployment](https://vercel.com/docs)

