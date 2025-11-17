# Guía de Instalación - Sistema de Rifas

## Requisitos Previos

- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com)
- (Opcional) Cuenta en Firebase para almacenamiento de imágenes
- (Opcional) API de WhatsApp Business configurada

## Paso 1: Clonar e Instalar Dependencias

```bash
# Instalar dependencias
npm install
```

## Paso 2: Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings > API** y copia:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (mantén esto seguro)

3. Ve a **SQL Editor** y ejecuta el contenido del archivo `supabase/schema.sql`

4. (Opcional) Crea un bucket de storage llamado `recibos` para almacenar PDFs:
   - Ve a **Storage**
   - Crea un nuevo bucket llamado `recibos`
   - Configura las políticas RLS según necesites

## Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase (Requerido)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Firebase (Opcional - para almacenamiento de imágenes)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket

# WhatsApp API (Opcional)
WHATSAPP_API_URL=tu_whatsapp_api_url
WHATSAPP_API_TOKEN=tu_whatsapp_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Paso 4: Crear Usuario Administrador

1. Ejecuta la aplicación:
```bash
npm run dev
```

2. Regístrate en `/register` con tu email

3. En Supabase, ve a **Authentication > Users** y encuentra tu usuario

4. En **SQL Editor**, ejecuta:
```sql
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tu_email@ejemplo.com';
```

## Paso 5: Verificar Instalación

1. Inicia sesión en `/login`
2. Accede al dashboard en `/dashboard`
3. Crea una rifa de prueba
4. Verifica que todo funcione correctamente

## Configuración Adicional

### Firebase Storage (Opcional)

Si quieres usar Firebase para almacenar imágenes:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Storage**
3. Configura las reglas de seguridad
4. Agrega las credenciales a `.env.local`

### WhatsApp API (Opcional)

Para enviar notificaciones por WhatsApp, necesitas:

1. Una API de WhatsApp Business (puedes usar servicios como Twilio, MessageBird, etc.)
2. Configurar la URL y token en `.env.local`
3. Ajustar la función `enviarWhatsApp` en `lib/whatsapp.ts` según tu proveedor

## Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que todas las variables de Supabase estén en `.env.local`
- Reinicia el servidor de desarrollo después de agregar variables

### Error: "Row Level Security policy violation"
- Verifica que hayas ejecutado el schema SQL completo
- Revisa las políticas RLS en Supabase

### Las imágenes no se cargan
- Verifica la configuración de CORS en Supabase Storage
- Asegúrate de que las URLs de imágenes sean públicas o tengas las políticas correctas

## Producción

Para desplegar en producción:

1. Actualiza `NEXT_PUBLIC_APP_URL` con tu dominio
2. Configura las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.)
3. Ejecuta `npm run build` para verificar que todo compile correctamente
4. Despliega la aplicación

## Soporte

Si encuentras problemas, verifica:
- Los logs del servidor
- La consola del navegador
- Los logs de Supabase
- Las políticas RLS en Supabase

