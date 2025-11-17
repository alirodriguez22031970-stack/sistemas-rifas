const functions = require('firebase-functions');
const { parse } = require('url');
const path = require('path');
const next = require('next');

// Cargar configuración de Firebase Functions
const config = functions.config();

// Configurar variables de entorno desde Firebase Config
if (config.supabase) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = config.supabase.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = config.supabase.anon_key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = config.supabase.service_role_key || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

if (config.firebase) {
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = config.firebase.api_key || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = config.firebase.auth_domain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = config.firebase.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = config.firebase.storage_bucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
}

// Ruta al directorio del proyecto (un nivel arriba de functions/)
const projectDir = path.resolve(__dirname, '..');

// Inicializar Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ 
  dev, 
  conf: { 
    distDir: path.join(projectDir, '.next'),
    // Configuración para producción
    reactStrictMode: true,
  },
  dir: projectDir
});
const handle = app.getRequestHandler();

// Variable para asegurar que Next.js solo se prepare una vez
let isPrepared = false;

// Cloud Function para manejar todas las rutas de Next.js
exports.nextjs = functions
  .runWith({
    // Configuración de memoria y timeout
    memory: '1GB',
    timeoutSeconds: 60,
  })
  .https
  .onRequest(async (req, res) => {
    try {
      // Preparar la aplicación Next.js solo una vez
      if (!isPrepared) {
        await app.prepare();
        isPrepared = true;
      }
      
      // Parsear la URL
      const parsedUrl = parse(req.url, true);
      
      // Manejar la solicitud con Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.status(500).send('Internal Server Error');
    }
  });

