# Guía Completa de Configuración en Supabase

## 📋 Resumen de lo que necesitas configurar

En Supabase necesitarás configurar:
1. ✅ **Proyecto y credenciales** (URL y API Keys)
2. ✅ **Base de datos** (ejecutar el esquema SQL)
3. ✅ **Autenticación** (configurar email/password)
4. ✅ **Storage** (opcional, para PDFs e imágenes)
5. ✅ **Políticas de seguridad RLS** (ya incluidas en el schema)

---

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en **"New Project"**
4. Completa el formulario:
   - **Name**: `sistema-rifas` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala bien)
   - **Region**: Elige la más cercana (ej: `South America (São Paulo)`)
   - **Pricing Plan**: Free tier está bien para empezar
5. Haz clic en **"Create new project"**
6. Espera 2-3 minutos mientras se crea el proyecto

---

## Paso 2: Obtener las Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API**
3. Encontrarás estas credenciales importantes:

### Credenciales que necesitas copiar:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc... (muy larga)
service_role secret key: eyJhbGc... (muy larga, MANTÉN ESTA SEGURA)
```

**⚠️ IMPORTANTE:**
- La `anon public key` es segura de compartir (va en el frontend)
- La `service_role secret key` es PRIVADA (solo para el backend, nunca la compartas)

4. Guarda estas credenciales, las usarás en el archivo `.env.local`

---

## Paso 3: Configurar Autenticación

1. Ve a **Authentication** en el menú lateral
2. Haz clic en **Providers**
3. Asegúrate de que **Email** esté habilitado:
   - Debe estar en verde/activado
   - Si no, haz clic en el toggle para activarlo

4. (Opcional) Configuración de Email:
   - Ve a **Settings > Auth**
   - Revisa las opciones de email
   - Para desarrollo, puedes usar el SMTP de Supabase (limitado)
   - Para producción, configura tu propio SMTP

---

## Paso 4: Ejecutar el Esquema SQL

Este paso crea todas las tablas, índices, triggers y políticas de seguridad.

1. Ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"**
3. Abre el archivo `supabase/schema.sql` de tu proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)
7. Deberías ver un mensaje de éxito: ✅ "Success. No rows returned"

**¿Qué crea este esquema?**
- ✅ Tabla `usuarios` (extiende auth.users)
- ✅ Tabla `rifas` (rifas disponibles)
- ✅ Tabla `compras` (compras de boletos)
- ✅ Tabla `numeros_vendidos` (tracking de números)
- ✅ Índices para mejor rendimiento
- ✅ Triggers para actualización automática
- ✅ Políticas RLS (Row Level Security)
- ✅ Funciones para actualizar números vendidos

---

## Paso 5: Configurar Storage (Opcional pero Recomendado)

Storage se usa para guardar:
- PDFs de recibos
- Imágenes de rifas

### 5.1 Crear Bucket para Recibos

1. Ve a **Storage** en el menú lateral
2. Haz clic en **"New bucket"**
3. Configura:
   - **Name**: `recibos`
   - **Public bucket**: ✅ Marca esta opción (para que los PDFs sean accesibles)
4. Haz clic en **"Create bucket"**

### 5.2 Crear Bucket para Imágenes de Rifas

1. Haz clic en **"New bucket"** nuevamente
2. Configura:
   - **Name**: `rifas-imagenes`
   - **Public bucket**: ✅ Marca esta opción
3. Haz clic en **"Create bucket"**

### 5.3 Configurar Políticas de Storage

Para el bucket `recibos`:
1. Haz clic en el bucket `recibos`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New Policy"**
4. Selecciona **"For full customization"**
5. Usa esta política:

```sql
-- Política para que todos puedan leer los PDFs
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'recibos');
```

6. Repite para el bucket `rifas-imagenes` con la misma política

---

## Paso 6: Verificar las Tablas Creadas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver estas tablas:
   - ✅ `usuarios`
   - ✅ `rifas`
   - ✅ `compras`
   - ✅ `numeros_vendidos`

3. Haz clic en cada una para verificar que tienen las columnas correctas

---

## Paso 7: Crear tu Primer Usuario Administrador

### Opción A: Desde la aplicación (Recomendado)

1. Ejecuta la aplicación: `npm run dev`
2. Ve a `http://localhost:3000/register`
3. Regístrate con tu email y contraseña
4. Luego, en Supabase:
   - Ve a **SQL Editor**
   - Ejecuta esta query (reemplaza el email):

```sql
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tu_email@ejemplo.com';
```

### Opción B: Directamente en Supabase

1. Ve a **Authentication > Users**
2. Haz clic en **"Add user"** o **"Invite user"**
3. Ingresa tu email
4. El usuario recibirá un email de invitación
5. Una vez que el usuario se registre, ejecuta la query SQL de arriba

---

## Paso 8: Verificar Políticas RLS

Las políticas RLS (Row Level Security) ya están configuradas en el schema, pero puedes verificarlas:

1. Ve a **Table Editor**
2. Selecciona cualquier tabla (ej: `rifas`)
3. Haz clic en la pestaña **"Policies"**
4. Deberías ver políticas como:
   - "Rifas visibles para todos"
   - "Solo admins pueden modificar rifas"
   - etc.

---

## ✅ Checklist de Configuración

Antes de continuar, verifica que tengas:

- [ ] Proyecto creado en Supabase
- [ ] Credenciales copiadas (URL, anon key, service_role key)
- [ ] Autenticación por Email habilitada
- [ ] Schema SQL ejecutado exitosamente
- [ ] Tablas creadas (usuarios, rifas, compras, numeros_vendidos)
- [ ] Buckets de Storage creados (recibos, rifas-imagenes)
- [ ] Políticas de Storage configuradas
- [ ] Usuario administrador creado

---

## 🔧 Solución de Problemas Comunes

### Error: "relation does not exist"
- **Solución**: Asegúrate de haber ejecutado el schema SQL completo

### Error: "permission denied for table"
- **Solución**: Verifica que las políticas RLS estén activas

### Error: "bucket not found"
- **Solución**: Crea los buckets de storage manualmente

### No puedo iniciar sesión
- **Solución**: Verifica que la autenticación por Email esté habilitada

---

## 📝 Próximos Pasos

Una vez completada la configuración de Supabase:

1. Crear archivo `.env.local` con las credenciales
2. Probar la conexión ejecutando `npm run dev`
3. Iniciar sesión y verificar que todo funcione

¿Necesitas ayuda con algún paso específico?

