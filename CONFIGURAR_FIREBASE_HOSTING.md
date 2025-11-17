# 🔥 Configuración Completa de Firebase Hosting para Next.js

## 📋 Pasos para Configurar Firebase Hosting

### Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Si ya lo instalaste, verifica la versión:
```bash
firebase --version
```

### Paso 2: Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Inicializar Firebase en tu Proyecto

```bash
firebase init
```

Cuando te pregunte, selecciona:
- ✅ **Functions** (usar espacio para seleccionar)
- ✅ **Hosting** (usar espacio para seleccionar)
- Presiona Enter

Luego:
- **¿Qué proyecto de Firebase quieres usar?** 
  - Selecciona tu proyecto existente O
  - Crea un nuevo proyecto
- **¿Qué lenguaje quieres usar para escribir Cloud Functions?** → **JavaScript**
- **¿Quieres usar ESLint?** → **No** (o Sí si prefieres)
- **¿Quieres instalar dependencias ahora?** → **Sí**

### Paso 4: Actualizar .firebaserc

Edita el archivo `.firebaserc` y reemplaza `TU_PROJECT_ID_AQUI` con tu Project ID real.

Puedes encontrar tu Project ID en:
- Firebase Console → Configuración del proyecto → General → Project ID

### Paso 5: Instalar Dependencias de Functions

```bash
cd functions
npm install
cd ..
```

### Paso 6: Instalar Next.js en Functions

Necesitamos que Next.js esté disponible en Functions:

```bash
cd functions
npm install next@^14.2.0 react@^18.3.0 react-dom@^18.3.0
cd ..
```

### Paso 7: Configurar Variables de Entorno

Crea un archivo `functions/.env.production` con tus variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
```

**⚠️ IMPORTANTE:** Para variables de entorno en Firebase Functions, también necesitas configurarlas en Firebase Console:

1. Ve a Firebase Console → Functions → Configuración
2. Agrega las variables de entorno necesarias

O usa el comando:
```bash
firebase functions:config:set supabase.url="tu_url" supabase.anon_key="tu_key"
```

### Paso 8: Construir la Aplicación

```bash
npm run build
```

Esto creará la carpeta `.next` con la aplicación compilada.

### Paso 9: Probar Localmente (Opcional)

```bash
firebase emulators:start
```

Esto iniciará los emuladores de Firebase localmente.

### Paso 10: Desplegar

```bash
firebase deploy
```

O solo hosting y functions:
```bash
firebase deploy --only hosting,functions
```

## 🔧 Configuración Adicional

### Actualizar functions/index.js para Variables de Entorno

Si usas `firebase functions:config`, actualiza `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const config = functions.config();

// Las variables estarán disponibles en config.supabase.url, etc.
process.env.NEXT_PUBLIC_SUPABASE_URL = config.supabase?.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### Optimizar para Producción

En `next.config.js`, asegúrate de tener:

```javascript
const nextConfig = {
  output: 'standalone',
  // ... resto de configuración
}
```

## 📝 Estructura de Archivos Creada

```
tu-proyecto/
├── functions/
│   ├── index.js          # Cloud Function para Next.js
│   ├── package.json      # Dependencias de Functions
│   └── .gitignore
├── firebase.json         # Configuración de Firebase
├── .firebaserc          # Project ID
└── next.config.js       # Configuración de Next.js (output: 'standalone')
```

## ⚠️ Limitaciones y Consideraciones

1. **Cold Starts**: Las Cloud Functions pueden tener "cold starts" (inicio frío) que pueden tardar 1-3 segundos en la primera solicitud.

2. **Costos**: 
   - Plan gratuito: 2 millones de invocaciones/mes
   - Después: $0.40 por millón de invocaciones
   - Memoria: 1GB incluido, más cuesta extra

3. **Timeout**: Máximo 60 segundos por función (configurado en `functions/index.js`)

4. **Memoria**: Configurado a 1GB (puedes ajustar en `functions/index.js`)

## 🐛 Solución de Problemas

### Error: "Module not found"
- Asegúrate de que todas las dependencias estén en `package.json` del proyecto raíz
- Ejecuta `npm install` en la raíz del proyecto
- Ejecuta `npm install` en `functions/`

### Error: "Next.js not found"
- Instala Next.js en functions: `cd functions && npm install next react react-dom`

### Error: "Environment variables not found"
- Configura las variables en Firebase Console o usa `firebase functions:config:set`
- Asegúrate de que las variables `NEXT_PUBLIC_*` estén disponibles en el build

### Error: "Function timeout"
- Aumenta el timeout en `functions/index.js`: `timeoutSeconds: 120`

## 📚 Recursos

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting + Functions](https://firebase.google.com/docs/hosting/functions)

## ✅ Checklist Final

- [ ] Firebase CLI instalado
- [ ] Iniciado sesión en Firebase (`firebase login`)
- [ ] Proyecto inicializado (`firebase init`)
- [ ] `.firebaserc` actualizado con Project ID
- [ ] Dependencias instaladas en `functions/`
- [ ] Next.js instalado en `functions/`
- [ ] Variables de entorno configuradas
- [ ] Aplicación construida (`npm run build`)
- [ ] Desplegado exitosamente (`firebase deploy`)

