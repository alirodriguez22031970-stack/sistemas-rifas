# 🚀 Pasos Rápidos para Configurar Firebase Hosting

## ✅ Archivos Ya Creados

He creado los siguientes archivos para ti:
- ✅ `firebase.json` - Configuración de Firebase
- ✅ `.firebaserc` - Configuración del proyecto (necesitas actualizar el Project ID)
- ✅ `functions/index.js` - Cloud Function para Next.js
- ✅ `functions/package.json` - Dependencias de Functions
- ✅ `next.config.js` - Configurado con `output: 'standalone'`

## 📋 Pasos a Seguir

### 1. Instalar Firebase CLI

Abre PowerShell o CMD y ejecuta:

```bash
npm install -g firebase-tools
```

### 2. Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte.

### 3. Actualizar .firebaserc

Edita el archivo `.firebaserc` y reemplaza `TU_PROJECT_ID_AQUI` con tu Project ID real.

**Para encontrar tu Project ID:**
1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a Configuración del proyecto (⚙️) → General
4. Copia el "Project ID"

### 4. Inicializar Firebase (si es necesario)

Si no has inicializado Firebase antes, ejecuta:

```bash
firebase init
```

Selecciona:
- ✅ **Functions** (presiona espacio para seleccionar)
- ✅ **Hosting** (presiona espacio para seleccionar)
- Presiona Enter

Luego:
- Selecciona tu proyecto de Firebase
- **¿Qué lenguaje?** → JavaScript
- **¿ESLint?** → No (o Sí si prefieres)
- **¿Instalar dependencias?** → Sí

### 5. Instalar Dependencias en Functions

```bash
cd functions
npm install
cd ..
```

### 6. Construir la Aplicación

```bash
npm run build
```

Esto creará la carpeta `.next` con tu aplicación compilada.

### 7. Configurar Variables de Entorno

**Opción A: Usar Firebase Functions Config (Recomendado)**

```bash
firebase functions:config:set \
  supabase.url="tu_url_de_supabase" \
  supabase.anon_key="tu_anon_key" \
  supabase.service_role_key="tu_service_role_key" \
  firebase.api_key="tu_firebase_api_key" \
  firebase.auth_domain="tu_auth_domain" \
  firebase.project_id="tu_project_id" \
  firebase.storage_bucket="tu_storage_bucket"
```

Luego actualiza `functions/index.js` para usar estas variables:

```javascript
const functions = require('firebase-functions');
const config = functions.config();

// Configurar variables de entorno
process.env.NEXT_PUBLIC_SUPABASE_URL = config.supabase?.url;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = config.supabase?.anon_key;
process.env.SUPABASE_SERVICE_ROLE_KEY = config.supabase?.service_role_key;
// ... etc
```

**Opción B: Usar .env (No recomendado para producción)**

Crea `functions/.env.production` con tus variables.

### 8. Probar Localmente (Opcional)

```bash
firebase emulators:start
```

Esto iniciará los emuladores localmente en `http://localhost:5000`

### 9. Desplegar

```bash
firebase deploy
```

O solo hosting y functions:

```bash
firebase deploy --only hosting,functions
```

## ⚠️ Notas Importantes

1. **Primera vez puede tardar**: El primer despliegue puede tardar varios minutos mientras Firebase instala las dependencias.

2. **Cold Starts**: Las Cloud Functions pueden tener "cold starts" de 1-3 segundos en la primera solicitud después de un período de inactividad.

3. **Costos**: 
   - Plan gratuito: 2 millones de invocaciones/mes
   - Después: $0.40 por millón de invocaciones

4. **Timeout**: Configurado a 60 segundos (puedes aumentar en `functions/index.js`)

## 🐛 Problemas Comunes

### Error: "Module not found"
```bash
# Asegúrate de instalar dependencias en ambos lugares
npm install
cd functions && npm install && cd ..
```

### Error: "Next.js not found"
```bash
# Next.js ya está en functions/package.json, solo instala
cd functions && npm install && cd ..
```

### Error: "Project ID not found"
- Verifica que `.firebaserc` tenga el Project ID correcto
- Ejecuta `firebase use --add` para agregar el proyecto

## 📚 Más Información

Lee `CONFIGURAR_FIREBASE_HOSTING.md` para más detalles y solución de problemas.

