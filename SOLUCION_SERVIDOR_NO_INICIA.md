# Solución: Servidor No Inicia

## Problema Identificado

El servidor de Next.js no está iniciando porque:

1. **Faltan variables de entorno**: El archivo `.env.local` no existe o no tiene las variables necesarias
2. **El código lanza errores**: `lib/supabase/client.ts` lanza un error si las variables no están definidas

## Solución Aplicada

Se modificó `lib/supabase/client.ts` para que:
- No lance errores si las variables no están definidas
- Permita que el servidor inicie aunque falten las variables
- Use valores placeholder que permitan la compilación

## Pasos para Resolver

### 1. Crear archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://unrgxwsmynuhvzpsvtln.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_QL8pPJI-ow8JU7DTOx78Kw_lKb5tLUe
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucmd4d3NteW51aHZ6cHN2dGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg4MTk5NCwiZXhwIjoyMDc4NDU3OTk0fQ.B9wKyNc0hWi9plf-goUUK89rbuvXnmOmsKQHPs6evoc
```

### 2. Reiniciar el servidor

```bash
# Detener todos los procesos de Node
taskkill /F /IM node.exe

# Limpiar caché
Remove-Item -Recurse -Force .next

# Iniciar servidor
npm run dev
```

### 3. Verificar que el servidor esté corriendo

Abre tu navegador y ve a: `http://localhost:3000`

Deberías ver:
- La página principal con las rifas (si hay alguna)
- O un mensaje indicando que no hay rifas disponibles

## Si Aún No Funciona

1. **Verifica la terminal**: Busca errores de compilación
2. **Verifica el puerto**: Asegúrate de que el puerto 3000 no esté ocupado
3. **Revisa las variables**: Verifica que `.env.local` tenga las credenciales correctas

## Nota Importante

El código ahora es más tolerante a la falta de variables de entorno, pero **debes configurar `.env.local`** para que la aplicación funcione correctamente con Supabase.

