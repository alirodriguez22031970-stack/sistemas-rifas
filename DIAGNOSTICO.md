# 🔍 Diagnóstico: La Página Muestra "No hay rifas disponibles"

## ✅ Esto es Normal si...

La página muestra "No hay rifas disponibles en este momento" cuando:
- ✅ La aplicación está funcionando correctamente
- ✅ La conexión a Supabase está bien
- ✅ Simplemente no hay rifas creadas en la base de datos

---

## 🔧 Verificaciones Rápidas

### 1. Abre la Consola del Navegador (F12)

1. Presiona **F12** en tu navegador
2. Ve a la pestaña **Console**
3. Busca errores en **rojo**
4. Si ves errores, compártelos

**Errores comunes:**
- `Failed to fetch` → Problema de conexión
- `relation "rifas" does not exist` → Schema SQL no ejecutado
- `new row violates row-level security` → Problema con políticas RLS

---

### 2. Verifica que las Tablas Existen

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

### 3. Crea una Rifa de Prueba

**Opción A: Desde Supabase SQL Editor**

Ejecuta esto en Supabase → SQL Editor:

```sql
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
  'Esta es una rifa de prueba para verificar que todo funciona',
  10.00,
  NOW(),
  NOW() + INTERVAL '30 days',
  1000,
  true,
  true
);
```

Luego recarga la página `/rifas` y deberías ver la rifa.

**Opción B: Desde el Dashboard (si ya eres admin)**

1. Regístrate e inicia sesión
2. Hazte administrador (ver instrucciones abajo)
3. Ve a `/dashboard/rifas`
4. Crea una rifa desde ahí

---

## 🎯 Pasos para Hacerte Administrador

1. **Regístrate** en `/register` (si aún no lo has hecho)
2. **Inicia sesión** en `/login`
3. **Ve a Supabase Dashboard → SQL Editor**
4. **Ejecuta esta query** (reemplaza con tu email):

```sql
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'tu_email@gmail.com';
```

5. **Cierra sesión y vuelve a iniciar sesión** en la aplicación
6. **Ve a `/dashboard`** - deberías ver el panel de administración
7. **Crea una rifa** desde el dashboard

---

## 🆘 Si Hay Errores en la Consola

### Error: "Failed to fetch"
- **Causa**: Problema de conexión a Supabase
- **Solución**: Verifica las credenciales en `.env.local`

### Error: "relation 'rifas' does not exist"
- **Causa**: El schema SQL no se ejecutó
- **Solución**: Ejecuta `supabase/schema.sql` en Supabase SQL Editor

### Error: "new row violates row-level security"
- **Causa**: Políticas RLS bloqueando el acceso
- **Solución**: Ejecuta `fix-rls-usuarios.sql` en Supabase SQL Editor

### Error: "Missing Supabase environment variables"
- **Causa**: Variables de entorno no configuradas
- **Solución**: Verifica que `.env.local` existe y tiene las credenciales

---

## ✅ Checklist

- [ ] Abrí la consola del navegador (F12) y no hay errores
- [ ] Las tablas existen en Supabase (Table Editor)
- [ ] Ejecuté el schema SQL completo
- [ ] Creé una rifa de prueba (SQL o Dashboard)
- [ ] Recargué la página `/rifas`

---

## 📝 Siguiente Paso

**Si no hay errores en la consola:**
1. Crea una rifa de prueba usando el SQL de arriba
2. Recarga la página
3. Deberías ver la rifa

**Si hay errores:**
1. Comparte los errores de la consola
2. Te ayudo a solucionarlos

