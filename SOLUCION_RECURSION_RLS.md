# 🔧 Solución: Error de Recursión Infinita en RLS

## ❌ Error
```
infinite recursion detected in policy for relation "usuarios"
```

## 🔍 Causa del Problema

Las políticas RLS están causando recursión infinita porque:

1. **Política "Admins pueden ver todos los usuarios"** intenta verificar si el usuario es admin leyendo de la tabla `usuarios`
2. Pero para leer de `usuarios`, necesita verificar si es admin
3. Esto crea un **loop infinito**

### Políticas Problemáticas:
- `"Admins pueden ver todos los usuarios"` - Lee de `usuarios` para verificar rol
- `"Rifas visibles para todos"` - Lee de `usuarios` para verificar si es admin
- `"Solo admins pueden modificar rifas"` - Lee de `usuarios` para verificar si es admin
- `"Solo admins pueden modificar compras"` - Lee de `usuarios` para verificar si es admin
- Y otras similares...

---

## ✅ Solución

### Paso 1: Ejecutar Script de Corrección

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre un **nuevo query**
3. Copia y pega **TODO** el contenido del archivo `CORREGIR_RECURSION_RLS_FINAL.sql`
4. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)

### Paso 2: Verificar que Funcionó

Después de ejecutar el script, deberías ver:
- ✅ Mensajes de "Success" para cada DROP POLICY
- ✅ Mensaje de "Success" para CREATE FUNCTION
- ✅ Mensajes de "Success" para cada CREATE POLICY
- ✅ Una tabla con todas las políticas creadas

### Paso 3: Probar la Aplicación

1. **Recarga la aplicación** en el navegador (F5)
2. **Intenta iniciar sesión** de nuevo
3. El error de recursión debería estar **resuelto** ✅

---

## 🔍 Cómo Funciona la Solución

### Antes (Con Recursión):
```sql
-- ❌ Esto causa recursión infinita
CREATE POLICY "Admins pueden ver todos los usuarios"
  ON public.usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios  -- ← Lee de usuarios
      WHERE id = auth.uid() AND rol = 'admin'  -- ← Para verificar si es admin
    )
  );
```

### Después (Sin Recursión):
```sql
-- ✅ Función de seguridad sin recursión
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.usuarios 
    WHERE id = user_id AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ Política usando la función
CREATE POLICY "Admins pueden ver todos los usuarios"
  ON public.usuarios FOR SELECT
  USING (
    auth.uid() = id OR
    public.is_admin(auth.uid())  -- ← Usa función, no causa recursión
  );
```

**¿Por qué funciona?**
- La función `is_admin()` usa `SECURITY DEFINER` y `SET LOCAL row_security = off`
- Esto **deshabilita RLS temporalmente** dentro de la función
- Las políticas ahora usan la función en lugar de leer directamente de `usuarios`
- Esto **rompe completamente** el ciclo de recursión

---

## 🧪 Verificación

### Verificar que la función existe:
```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'is_admin';
```

### Verificar que las políticas están correctas:
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname;
```

Deberías ver:
- ✅ "Usuarios pueden ver su propio perfil" (SELECT)
- ✅ "Admins pueden ver todos los usuarios" (SELECT)
- ✅ "Usuarios pueden insertar su propio registro" (INSERT)

---

## 🆘 Si Aún Hay Problemas

### Problema 1: El script falla al ejecutar
**Solución:**
- Asegúrate de ejecutar TODO el script de una vez
- Si hay un error específico, compártelo

### Problema 2: Sigue apareciendo el error de recursión
**Solución:**
1. Verifica que la función `is_admin` existe:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'is_admin';
   ```
2. Si no existe, ejecuta solo la parte de crear la función del script
3. Luego ejecuta el resto del script

### Problema 3: No puedo iniciar sesión después
**Solución:**
1. Verifica que tu usuario existe en la tabla `usuarios`:
   ```sql
   SELECT * FROM usuarios WHERE email = 'tu_email@ejemplo.com';
   ```
2. Si no existe, créalo manualmente o regístrate de nuevo

---

## 📝 Checklist

- [ ] Ejecuté el script `CORREGIR_RECURSION_RLS_FINAL.sql` completo
- [ ] Vi mensajes de "Success" para todas las operaciones
- [ ] Verifiqué que la función `is_admin` existe
- [ ] Verifiqué que las políticas están creadas
- [ ] Recargué la aplicación en el navegador
- [ ] Intenté iniciar sesión y funcionó sin errores

---

## ✅ Estado Esperado

Después de aplicar esta solución:
- ✅ No más errores de recursión infinita
- ✅ Los usuarios pueden iniciar sesión correctamente
- ✅ Los admins pueden acceder al dashboard
- ✅ Las políticas RLS funcionan sin loops infinitos

---

## 🎯 Próximos Pasos

1. **Ejecuta el script SQL** en Supabase
2. **Recarga la aplicación** en el navegador
3. **Inicia sesión** con tus credenciales
4. **Verifica que todo funciona** correctamente

Si después de esto aún hay problemas, comparte:
- El error exacto que ves
- Los resultados de las verificaciones SQL
- Captura de pantalla si es posible

