# 🔧 Solución al Error de Registro

## Error: "For security purposes, you can only request this after 12 seconds"

Este error aparece cuando Supabase detecta demasiados intentos de registro en poco tiempo.

---

## ✅ Soluciones Inmediatas

### Solución 1: Esperar 12 segundos
- Simplemente espera 12 segundos y vuelve a intentar
- Este es un límite de seguridad de Supabase

### Solución 2: Verificar si el email ya está registrado
1. Ve a Supabase Dashboard → **Authentication > Users**
2. Busca tu email en la lista
3. Si ya existe, ve directamente a `/login` e inicia sesión

### Solución 3: Deshabilitar verificación de email (Solo para desarrollo)

Si estás en desarrollo y quieres saltarte la verificación de email:

1. Ve a Supabase Dashboard → **Authentication > Settings**
2. Busca la sección **"Email Auth"**
3. Desmarca **"Enable email confirmations"** (solo para desarrollo)
4. Guarda los cambios

**⚠️ IMPORTANTE**: Esto solo es para desarrollo. En producción siempre debes tener la verificación de email activada.

---

## 🔍 Verificar Configuración de Base de Datos

El error también puede aparecer si la tabla `usuarios` no existe. Verifica:

1. Ve a Supabase Dashboard → **SQL Editor**
2. Ejecuta esta query para verificar:

```sql
SELECT * FROM usuarios LIMIT 1;
```

Si obtienes un error "relation does not exist", necesitas ejecutar el schema SQL:

1. Ve a **SQL Editor**
2. Abre el archivo `supabase/schema.sql` de tu proyecto
3. Copia TODO el contenido
4. Pégalo en el editor SQL de Supabase
5. Haz clic en **"Run"**

---

## 🛠️ Verificar Configuración de Autenticación

1. Ve a Supabase Dashboard → **Authentication > Providers**
2. Asegúrate de que **Email** esté habilitado (toggle en verde)
3. Si no está habilitado, actívalo

---

## 📝 Pasos para Registrar Correctamente

1. **Espera** si acabas de intentar registrar (12 segundos mínimo)
2. **Verifica** que la tabla `usuarios` existe en Supabase
3. **Intenta registrar** de nuevo con un email diferente si es necesario
4. **Revisa tu email** para el link de confirmación (si la verificación está activada)

---

## 🆘 Si el Problema Persiste

### Opción A: Crear usuario directamente en Supabase

1. Ve a Supabase Dashboard → **Authentication > Users**
2. Haz clic en **"Add user"** o **"Invite user"**
3. Ingresa el email y contraseña
4. El usuario se creará sin necesidad de verificación

### Opción B: Verificar logs de Supabase

1. Ve a Supabase Dashboard → **Logs > Auth Logs**
2. Revisa los errores recientes
3. Esto te dará más información sobre qué está fallando

---

## ✅ Checklist de Verificación

Antes de intentar registrar de nuevo, verifica:

- [ ] Esperé al menos 12 segundos desde el último intento
- [ ] La tabla `usuarios` existe en Supabase (ejecuté el schema SQL)
- [ ] El provider de Email está habilitado en Authentication > Providers
- [ ] El email no está ya registrado (verificar en Authentication > Users)
- [ ] Las credenciales en `.env.local` son correctas

---

## 🎯 Siguiente Paso

Una vez que te registres exitosamente:

1. Ve a Supabase Dashboard → **SQL Editor**
2. Ejecuta esta query para hacerte administrador:

```sql
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tu_email@ejemplo.com';
```

3. Inicia sesión en la aplicación
4. Deberías poder acceder al dashboard de administración

