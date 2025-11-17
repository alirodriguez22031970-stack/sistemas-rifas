# 🔍 Verificación de API Keys en Supabase

## ¿Por qué necesitas 2 keys diferentes?

En Supabase hay **2 tipos de keys** con propósitos diferentes:

1. **anon public key** → Para el frontend (pública, segura de compartir)
2. **service_role secret key** → Para el backend (privada, muy poderosa)

---

## Cómo Verificar en Supabase

### Paso 1: Ve a Settings > API

1. Abre tu proyecto en Supabase
2. Ve a **Settings** → **API**

### Paso 2: Revisa la Sección "Project API keys"

Deberías ver una tabla con estas columnas:

```
┌──────────────┬──────────┬──────────────────────────────┐
│ Name         │ Type     │ Key (oculta)                  │
├──────────────┼──────────┼──────────────────────────────┤
│ anon         │ public   │ eyJ... (muy larga) [👁️] [📋] │
│ service_role │ secret   │ eyJ... (muy larga) [👁️] [📋] │
└──────────────┴──────────┴──────────────────────────────┘
```

### Paso 3: Verifica que sean DIFERENTES

1. Haz clic en el **👁️** de la fila **"anon" "public"**
2. Copia esa key completa
3. Haz clic en el **👁️** de la fila **"service_role" "secret"**
4. Copia esa key completa
5. **Compara ambas keys** - deben ser DIFERENTES

---

## Si Ambas Keys son Iguales

### Posible Causa 1: Estás viendo la misma fila dos veces
- **Solución**: Asegúrate de hacer clic en filas DIFERENTES
- La fila "anon" debe decir "public" en la columna Type
- La fila "service_role" debe decir "secret" en la columna Type

### Posible Causa 2: Error al copiar
- **Solución**: Copia cada key por separado y compáralas

### Posible Causa 3: Problema en Supabase (raro)
- **Solución**: Intenta refrescar la página o crear nuevas keys

---

## Cómo Identificar Cada Key

### anon public key:
- **Name**: `anon`
- **Type**: `public`
- **Uso**: Frontend (Next.js)
- **Seguridad**: Pública, puede estar en el código del cliente

### service_role secret key:
- **Name**: `service_role`
- **Type**: `secret`
- **Uso**: Backend (API routes)
- **Seguridad**: PRIVADA, nunca exponerla al cliente

---

## Verificación Rápida

Abre la consola de tu navegador y ejecuta esto (solo para verificar, no para producción):

```javascript
// Decodifica el JWT para ver qué tipo de key es
const token = "TU_KEY_AQUI";
const payload = JSON.parse(atob(token.split('.')[1]));
console.log("Rol:", payload.role);
```

- Si dice `"role": "anon"` → Es la anon key
- Si dice `"role": "service_role"` → Es la service_role key

---

## Solución Temporal (NO RECOMENDADO para producción)

Si realmente ambas keys son iguales, puedes usar la misma key para ambos campos temporalmente, pero esto NO es seguro para producción:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=la_misma_key
SUPABASE_SERVICE_ROLE_KEY=la_misma_key
```

**⚠️ ADVERTENCIA**: Esto expone la service_role key al frontend, lo cual es un riesgo de seguridad.

---

## Próximos Pasos

1. Verifica en Supabase que estás viendo 2 filas diferentes
2. Copia cada key por separado
3. Compáralas para asegurarte de que son diferentes
4. Si siguen siendo iguales, avísame y te ayudo a crear nuevas keys

