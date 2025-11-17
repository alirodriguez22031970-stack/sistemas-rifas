# 🔧 Solución Completa: Error RLS en Registro de Usuarios

## ❌ Error Actual
```
new row violates row-level security policy for table "usuarios"
```

## 🔍 Causa del Problema

La política RLS (Row Level Security) que permite a los usuarios insertar su propio registro **no está configurada** en tu base de datos de Supabase.

---

## ✅ Solución Paso a Paso

### Paso 1: Abre Supabase SQL Editor

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com)
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **"New query"** o **"New"**

### Paso 2: Ejecuta el Script de Corrección

Copia y pega **TODO** este código SQL:

```sql
-- ============================================
-- CORRECCIÓN: Política RLS para INSERT en usuarios
-- ============================================

-- Paso 1: Eliminar la política si ya existe (para evitar conflictos)
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio registro" ON public.usuarios;

-- Paso 2: Crear la política que permite a los usuarios insertar su propio registro
CREATE POLICY "Usuarios pueden insertar su propio registro"
  ON public.usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Paso 3: Verificar que se creó correctamente
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'usuarios' AND cmd = 'INSERT';
```

### Paso 3: Ejecuta el Script

1. Pega el código en el editor SQL
2. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)
3. Deberías ver:
   - ✅ "Success. No rows returned" (para los primeros comandos)
   - ✅ Una tabla con la política creada (para el SELECT)

### Paso 4: Verifica que Funcionó

Deberías ver en los resultados una fila con:
- **policyname**: "Usuarios pueden insertar su propio registro"
- **cmd**: "INSERT"
- **with_check**: "(auth.uid() = id)"

---

## 🧪 Probar el Registro

1. Vuelve a la aplicación: `http://localhost:3000/register`
2. Intenta registrarte de nuevo
3. **Debería funcionar ahora** ✅

---

## 🔍 Si Aún No Funciona

### Verificación 1: ¿La política existe?

Ejecuta esto en Supabase SQL Editor:

```sql
SELECT * FROM pg_policies WHERE tablename = 'usuarios';
```

Deberías ver al menos 3 políticas:
- "Usuarios pueden ver su propio perfil" (SELECT)
- "Admins pueden ver todos los usuarios" (SELECT)
- "Usuarios pueden insertar su propio registro" (INSERT) ← **Esta es la importante**

### Verificación 2: ¿RLS está habilitado?

Ejecuta esto:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'usuarios';
```

**rowsecurity** debe ser `true`

### Verificación 3: ¿El usuario se crea en auth.users?

1. Ve a **Authentication > Users** en Supabase
2. Verifica si tu usuario aparece ahí (aunque falle la inserción en `usuarios`)

---

## 🆘 Solución Alternativa (Si Nada Funciona)

Si después de ejecutar el script sigue fallando, puedes **temporalmente deshabilitar RLS** solo para INSERT (NO RECOMENDADO para producción):

```sql
-- SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
```

Luego vuelve a habilitarlo:

```sql
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
```

Y ejecuta el script de corrección de nuevo.

---

## 📝 Checklist Final

- [ ] Ejecuté el script `CORREGIR_RLS_USUARIOS.sql` en Supabase SQL Editor
- [ ] Vi el mensaje "Success" después de ejecutar
- [ ] Verifiqué que la política existe con el SELECT
- [ ] Intenté registrarme de nuevo en la aplicación
- [ ] El registro funcionó correctamente

---

## 🎯 Siguiente Paso Después del Registro

Una vez que te registres exitosamente:

1. Ve a Supabase → **SQL Editor**
2. Ejecuta esto (reemplaza con tu email):

```sql
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tu_email@gmail.com';
```

3. Cierra sesión y vuelve a iniciar sesión
4. Accede a `/dashboard` como administrador

---

## ✅ Archivos Creados

- `CORREGIR_RLS_USUARIOS.sql` - Script SQL completo para corregir el problema
- `SOLUCION_COMPLETA_RLS.md` - Esta guía

**Ejecuta el script SQL ahora y el registro debería funcionar.** 🚀

