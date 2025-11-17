# 🚀 Guía Completa: Desplegar Next.js en Firebase Hosting

## ⚠️ ADVERTENCIA IMPORTANTE

Tu aplicación Next.js usa:
- ✅ Server Components (SSR)
- ✅ API Routes
- ✅ Middleware
- ✅ Server Actions

**Firebase Hosting estático NO soporta estas características.**

Tienes 3 opciones:

---

## Opción 1: Firebase Hosting + Cloud Functions (Complejo) ⚙️

### Requisitos Previos

1. **Instalar Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Iniciar sesión:**
```bash
firebase login
```

3. **Inicializar proyecto:**
```bash
firebase init
```

Selecciona:
- ✅ Hosting
- ✅ Functions

### Configuración

1. **Actualiza `.firebaserc`** con tu Project ID:
```json
{
  "projects": {
    "default": "tu-project-id-aqui"
  }
}
```

2. **Crea `functions/package.json`:**
```json
{
  "name": "functions",
  "scripts": {
    "build": "cd .. && npm run build"
  },
  "dependencies": {
    "firebase-functions": "^4.5.0",
    "firebase-admin": "^11.11.0"
  }
}
```

3. **Crea `functions/index.js`:**
```javascript
const functions = require('firebase-functions');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

exports.nextjs = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
});
```

### Desplegar

```bash
npm run build
firebase deploy
```

**⚠️ Limitaciones:**
- Más complejo de configurar
- Cloud Functions tiene costos después del plan gratuito
- Cold starts pueden ser lentos

---

## Opción 2: Vercel (RECOMENDADO) ⭐

Vercel está optimizado para Next.js y es la opción más simple:

### Pasos Rápidos

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Desplegar:**
```bash
vercel
```

3. **Configurar variables de entorno:**
   - Ve a https://vercel.com/dashboard
   - Selecciona tu proyecto
   - Settings → Environment Variables
   - Agrega todas las variables de `.env.local`

4. **Desplegar a producción:**
```bash
vercel --prod
```

**✅ Ventajas:**
- Configuración automática
- Optimizado para Next.js
- Plan gratuito generoso
- Sin configuración adicional
- Mejor rendimiento

---

## Opción 3: Export Estático (NO RECOMENDADO) ❌

Solo funciona si eliminas:
- Server Components
- API Routes
- Middleware
- Server Actions

**No funcionará con tu aplicación actual.**

---

## 📋 Configuración Actual Creada

He creado los siguientes archivos:

1. **`firebase.json`** - Configuración de Firebase Hosting
2. **`.firebaserc`** - Configuración del proyecto (actualiza con tu Project ID)
3. **`next.config.js`** - Actualizado con `output: 'standalone'`
4. **`package.json`** - Scripts de despliegue agregados

---

## 🎯 Recomendación Final

**Para tu aplicación, recomiendo usar Vercel** porque:

1. ✅ Configuración en 2 minutos
2. ✅ Soporte completo de Next.js
3. ✅ Variables de entorno fáciles de configurar
4. ✅ Mejor rendimiento
5. ✅ Plan gratuito generoso
6. ✅ Despliegues automáticos desde Git

### Despliegue Rápido en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Desplegar
vercel

# 3. Seguir las instrucciones en pantalla
# 4. Configurar variables de entorno en el dashboard
# 5. Desplegar a producción
vercel --prod
```

---

## 🔧 Si Insistes en Firebase Hosting

Si realmente quieres usar Firebase Hosting, necesitarás:

1. Configurar Cloud Functions (ver Opción 1)
2. Manejar variables de entorno en Functions
3. Configurar rewrites en `firebase.json`
4. Aceptar los costos de Cloud Functions

**Pero te recomiendo Vercel para Next.js.**

---

## 📚 Recursos

- [Vercel Deployment](https://vercel.com/docs)
- [Firebase Hosting + Next.js](https://firebase.google.com/docs/hosting/nextjs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

