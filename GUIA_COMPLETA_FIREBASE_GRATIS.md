# 🚀 Guía Completa: Hospedar tu Página GRATIS en Firebase

## 📋 Resumen de lo que Necesitas

✅ Firebase CLI instalado  
✅ Archivos de configuración creados  
✅ Proyecto de Firebase creado  

## 🎯 Pasos Completos

### PASO 1: Verificar que Firebase CLI Funciona

Abre PowerShell o CMD y ejecuta:

```bash
npx firebase-tools --version
```

Si muestra una versión (ej: 14.24.1), está funcionando.

---

### PASO 2: Iniciar Sesión en Firebase

```bash
npx firebase-tools login
```

**Qué esperar:**
- Se abrirá tu navegador automáticamente
- Inicia sesión con tu cuenta de Google
- Autoriza Firebase CLI
- Verás "✔ Success! Logged in as tu-email@gmail.com" en la terminal

---

### PASO 3: Verificar tu Proyecto de Firebase

**Opción A: Si ya tienes un proyecto en Firebase Console**

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a ⚙️ Configuración del proyecto → General
4. Copia el **Project ID** (ej: "sistema-rifas-12345")

**Opción B: Ver tus proyectos desde la terminal**

```bash
npx firebase-tools projects:list
```

Esto mostrará todos tus proyectos de Firebase.

---

### PASO 4: Configurar el Project ID

Edita el archivo `.firebaserc` y reemplaza `SISTEMA-RIFAS` con tu Project ID real:

```json
{
  "projects": {
    "default": "tu-project-id-real-aqui"
  }
}
```

**Ejemplo:**
```json
{
  "projects": {
    "default": "sistema-rifas-12345"
  }
}
```

---

### PASO 5: Seleccionar el Proyecto

```bash
npx firebase-tools use
```

Selecciona tu proyecto de la lista.

---

### PASO 6: Inicializar Firebase (Solo Primera Vez)

Si es la primera vez que usas Firebase en este proyecto:

```bash
npx firebase-tools init
```

**Cuando te pregunte:**

1. **¿Qué funciones de Firebase quieres configurar?**
   - Presiona **ESPACIO** para seleccionar:
     - ✅ **Functions**
     - ✅ **Hosting**
   - Presiona **ENTER**

2. **¿Qué lenguaje quieres usar para escribir Cloud Functions?**
   - Selecciona **JavaScript** (presiona ENTER)

3. **¿Quieres usar ESLint para detectar errores?**
   - Selecciona **No** (o Sí si prefieres)

4. **¿Quieres instalar dependencias ahora?**
   - Selecciona **Sí** (presiona ENTER)

5. **¿Qué directorio público quieres usar?**
   - Presiona **ENTER** (usa "public" por defecto)

6. **¿Configurar como SPA (Single Page App)?**
   - Selecciona **No** (presiona ENTER)

7. **¿Configurar GitHub Actions?**
   - Selecciona **No** (presiona ENTER)

---

### PASO 7: Instalar Dependencias en Functions

```bash
cd functions
npm install
cd ..
```

Esto instalará:
- firebase-admin
- firebase-functions
- next
- react
- react-dom

---

### PASO 8: Construir tu Aplicación Next.js

```bash
npm run build
```

Esto creará la carpeta `.next` con tu aplicación compilada.

**⏱️ Esto puede tardar 1-3 minutos**

---

### PASO 9: Configurar Variables de Entorno

**IMPORTANTE:** Necesitas configurar tus variables de entorno para que funcionen en producción.

**Opción A: Usar Firebase Functions Config (Recomendado)**

```bash
npx firebase-tools functions:config:set \
  supabase.url="tu_url_de_supabase" \
  supabase.anon_key="tu_anon_key" \
  supabase.service_role_key="tu_service_role_key"
```

**Ejemplo:**
```bash
npx firebase-tools functions:config:set \
  supabase.url="https://xxxxx.supabase.co" \
  supabase.anon_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  supabase.service_role_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Luego, actualiza `functions/index.js` para usar estas variables. Agrega al inicio del archivo:

```javascript
const functions = require('firebase-functions');
const config = functions.config();

// Configurar variables de entorno desde Firebase Config
if (config.supabase) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = config.supabase.url;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = config.supabase.anon_key;
  process.env.SUPABASE_SERVICE_ROLE_KEY = config.supabase.service_role_key;
}
```

**Opción B: Usar .env (No recomendado para producción)**

Crea `functions/.env.production` con tus variables.

---

### PASO 10: Probar Localmente (Opcional pero Recomendado)

```bash
npx firebase-tools emulators:start
```

Esto iniciará los emuladores localmente. Presiona **Ctrl+C** para detener.

---

### PASO 11: Desplegar a Firebase

```bash
npx firebase-tools deploy
```

O solo hosting y functions:

```bash
npx firebase-tools deploy --only hosting,functions
```

**⏱️ El primer despliegue puede tardar 5-10 minutos**

**Qué esperar:**
- Se construirá tu aplicación
- Se subirán los archivos
- Se desplegarán las Cloud Functions
- Verás URLs como:
  - Hosting URL: https://tu-proyecto.web.app
  - Functions URL: https://us-central1-tu-proyecto.cloudfunctions.net/nextjs

---

### PASO 12: Verificar el Despliegue

1. Ve a la URL que te mostró Firebase (ej: https://tu-proyecto.web.app)
2. Verifica que tu aplicación funcione correctamente
3. Prueba las funcionalidades principales

---

## 🎉 ¡Listo! Tu Página Está en Línea

Tu aplicación estará disponible en:
- **https://tu-proyecto.web.app**
- **https://tu-proyecto.firebaseapp.com**

---

## 💰 Plan Gratuito de Firebase

### Hosting
- ✅ 10 GB de almacenamiento
- ✅ 360 MB/día de transferencia
- ✅ SSL/HTTPS incluido
- ✅ Dominio personalizado

### Cloud Functions
- ✅ 2 millones de invocaciones/mes
- ✅ 400,000 GB-segundos de tiempo de cómputo
- ✅ 200,000 CPU-segundos
- ✅ 5 GB de tráfico de red saliente

**⚠️ Si excedes estos límites, se te cobrará automáticamente.**

---

## 🔄 Actualizar tu Página

Cada vez que hagas cambios:

```bash
# 1. Construir
npm run build

# 2. Desplegar
npx firebase-tools deploy
```

---

## 🐛 Solución de Problemas

### Error: "Project not found"
- Verifica que el Project ID en `.firebaserc` sea correcto
- Ejecuta `npx firebase-tools use` para seleccionar el proyecto

### Error: "Module not found"
```bash
# Instala dependencias en ambos lugares
npm install
cd functions && npm install && cd ..
```

### Error: "Functions deployment failed"
- Verifica que todas las dependencias estén en `functions/package.json`
- Revisa los logs: `npx firebase-tools functions:log`

### Error: "Environment variables not found"
- Configura las variables con `firebase functions:config:set`
- O actualiza `functions/index.js` para leerlas

### La página carga pero no funciona
- Verifica que las variables de entorno estén configuradas
- Revisa la consola del navegador (F12) para errores
- Revisa los logs de Functions: `npx firebase-tools functions:log`

---

## 📝 Checklist Final

Antes de desplegar, verifica:

- [ ] Firebase CLI instalado y funcionando
- [ ] Iniciado sesión (`npx firebase-tools login`)
- [ ] Project ID correcto en `.firebaserc`
- [ ] Proyecto seleccionado (`npx firebase-tools use`)
- [ ] Firebase inicializado (`npx firebase-tools init`)
- [ ] Dependencias instaladas en `functions/`
- [ ] Aplicación construida (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] `firebase.json` configurado correctamente
- [ ] `functions/index.js` configurado correctamente

---

## 📚 Comandos Útiles

```bash
# Ver estado del proyecto
npx firebase-tools projects:list

# Ver logs de Functions
npx firebase-tools functions:log

# Ver configuración
npx firebase-tools functions:config:get

# Eliminar despliegue
npx firebase-tools hosting:disable

# Ver información del proyecto
npx firebase-tools projects:list
```

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa los logs: `npx firebase-tools functions:log`
2. Verifica la consola del navegador (F12)
3. Revisa Firebase Console → Functions → Logs
4. Consulta la documentación: https://firebase.google.com/docs

---

## ✅ Siguiente Paso

Una vez desplegado, puedes:
- Configurar un dominio personalizado
- Configurar CI/CD con GitHub Actions
- Optimizar el rendimiento
- Configurar analytics

¡Buena suerte con tu despliegue! 🚀

