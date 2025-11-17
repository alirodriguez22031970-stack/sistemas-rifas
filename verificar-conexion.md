# 🔍 Verificación de Conexión y Problemas Comunes

## La página muestra "No hay rifas disponibles"

Esto puede ser por dos razones:

### ✅ Razón 1: No hay rifas creadas (Normal)
- La aplicación funciona correctamente
- Simplemente no hay rifas en la base de datos
- **Solución**: Crear una rifa desde el dashboard de administración

### ❌ Razón 2: Error de conexión o configuración

Si hay errores, verifica lo siguiente:

---

## 🔧 Verificaciones Necesarias

### 1. Verificar que el Schema SQL se ejecutó

**En Supabase Dashboard:**
1. Ve a **Table Editor**
2. Deberías ver estas tablas:
   - ✅ `usuarios`
   - ✅ `rifas`
   - ✅ `compras`
   - ✅ `numeros_vendidos`

**Si NO ves las tablas:**
- Ve a **SQL Editor**
- Ejecuta el contenido completo de `supabase/schema.sql`

---

### 2. Verificar la Consola del Navegador

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Busca errores en rojo
4. Comparte los errores que veas

**Errores comunes:**
- `Failed to fetch` → Problema de conexión a Supabase
- `relation "rifas" does not exist` → Schema SQL no ejecutado
- `new row violates row-level security` → Problema con políticas RLS

---

### 3. Verificar la Consola del Servidor

En la terminal donde corre `npm run dev`, busca errores como:
- `Missing Supabase environment variables`
- `Error connecting to Supabase`
- Errores de TypeScript

---

### 4. Verificar el Formato de la anon Key

El formato `sb_publishable_...` puede no ser compatible con la versión de Supabase que estamos usando.

**Prueba esto:**
1. Ve a Supabase Dashboard → **Settings > API**
2. Busca la key que empieza con `eyJhbGc...` (formato JWT)
3. Si la encuentras, reemplázala en `.env.local`

---

## 🎯 Pasos para Diagnosticar

### Paso 1: Verificar Tablas en Supabase
```sql
-- Ejecuta esto en Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deberías ver: `usuarios`, `rifas`, `compras`, `numeros_vendidos`

### Paso 2: Verificar Políticas RLS
```sql
-- Ejecuta esto en Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'rifas';
```

Deberías ver al menos una política para SELECT

### Paso 3: Crear una Rifa de Prueba
```sql
-- Ejecuta esto en Supabase SQL Editor para crear una rifa de prueba
INSERT INTO rifas (
  nombre,
  descripcion,
  precio,
  fecha_inicio,
  fecha_fin,
  total_numeros,
  visible,
  activa
) VALUES (
  'Rifa de Prueba',
  'Esta es una rifa de prueba',
  10.00,
  NOW(),
  NOW() + INTERVAL '30 days',
  1000,
  true,
  true
);
```

Luego recarga la página `/rifas` y deberías ver la rifa.

---

## 🆘 Si Sigue Sin Funcionar

Comparte:
1. Errores de la consola del navegador (F12 → Console)
2. Errores de la terminal del servidor
3. Si las tablas existen en Supabase
4. Si ejecutaste el schema SQL completo

