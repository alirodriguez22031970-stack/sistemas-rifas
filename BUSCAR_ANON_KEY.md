# 🔍 Guía Detallada: Cómo Encontrar la anon public key

## 📍 Ubicación Exacta Paso a Paso

### Paso 1: Abre tu Proyecto en Supabase

1. Ve a **https://supabase.com**
2. Inicia sesión
3. Selecciona tu proyecto: **unrgxwsmynuhvzpsvtln** (o el nombre que le diste)

---

### Paso 2: Navega a Settings

1. En el **menú lateral izquierdo**, busca el ícono de **⚙️ Settings**
   - Está en la parte inferior del menú
   - Tiene un ícono de engranaje/rueda
2. Haz clic en **"Settings"**

---

### Paso 3: Ve a la Sección API

1. En el **submenú de Settings**, verás varias opciones:
   - General
   - API ← **HAZ CLIC AQUÍ**
   - Database
   - Auth
   - Storage
   - etc.

2. Haz clic en **"API"**

---

### Paso 4: Encuentra la Sección "Project API keys"

En la página de API verás varias secciones. Busca específicamente:

**"Project API keys"** (no "Project URL", no otras secciones)

Esta sección tiene una **tabla** con 3 columnas:
- **Name** (primera columna)
- **Type** (segunda columna)  
- **Key** (tercera columna, con íconos de ojo y copiar)

---

### Paso 5: Identifica las 2 Filas en la Tabla

La tabla debería verse así:

```
┌─────────────────────────────────────────────────────────┐
│ Project API keys                                         │
├──────────────┬──────────┬───────────────────────────────┤
│ Name         │ Type     │ Key                           │
├──────────────┼──────────┼───────────────────────────────┤
│ anon         │ public   │ eyJ... [👁️] [📋]            │ ← ESTA ES LA QUE NECESITAS
├──────────────┼──────────┼───────────────────────────────┤
│ service_role │ secret   │ eyJ... [👁️] [📋]            │ ← Esta ya la tienes
└──────────────┴──────────┴───────────────────────────────┘
```

---

### Paso 6: Haz Clic en la Fila "anon" + "public"

**IMPORTANTE**: 
- ✅ Haz clic en la fila que dice **"anon"** en la columna Name
- ✅ Y dice **"public"** en la columna Type
- ❌ NO hagas clic en la fila que dice "service_role" + "secret"

---

### Paso 7: Revela y Copia la Key

1. En la fila "anon" + "public", busca la columna "Key"
2. Verás algo como: `eyJ...` (parcialmente oculta)
3. Haz clic en el ícono de **👁️ (ojo)** para revelarla completamente
4. Verás la key completa (muy larga, empieza con `eyJ`)
5. Haz clic en el ícono de **📋 (copiar)** para copiarla

---

## 🎯 Qué Buscar Exactamente

### ✅ La anon key que necesitas:
- **Name**: `anon`
- **Type**: `public`
- **Key**: Empieza con `eyJhbGc...` (muy larga)
- **Diferencia**: En el payload JWT dice `"role": "anon"`

### ❌ La service_role key que ya tienes:
- **Name**: `service_role`
- **Type**: `secret`
- **Key**: Empieza con `eyJhbGc...` (muy larga, pero DIFERENTE)
- **Diferencia**: En el payload JWT dice `"role": "service_role"`

---

## 🔍 Verificación: ¿Son Diferentes?

Después de copiar la anon key, compárala con la service_role que ya tienes:

**Service_role que ya tienes:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucmd4d3NteW51aHZ6cHN2dGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg4MTk5NCwiZXhwIjoyMDc4NDU3OTk0fQ.B9wKyNc0hWi9plf-goUUK89rbuvXnmOmsKQHPs6evoc
```

**La anon key debería ser DIFERENTE** (aunque también empiece con `eyJ...`)

---

## 🆘 Si No Ves 2 Filas Diferentes

### Posible Problema 1: Solo ves una fila
- **Solución**: Refresca la página (F5)
- O ve a otro proyecto y vuelve

### Posible Problema 2: Las keys se ven iguales
- **Solución**: 
  1. Copia cada una por separado
  2. Pégalas en un editor de texto
  3. Compáralas carácter por carácter
  4. Deben ser diferentes

### Posible Problema 3: No encuentras la sección
- **Solución**: 
  1. Asegúrate de estar en **Settings > API**
  2. No confundas con "Project URL" (esa es otra sección)
  3. Busca específicamente "Project API keys"

---

## 📸 Descripción Visual de la Página

Cuando estés en Settings > API, deberías ver algo así:

```
┌─────────────────────────────────────────────────────────┐
│ Settings > API                                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Project URL                                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ https://unrgxwsmynuhvzpsvtln.supabase.co          │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Project API keys  ← ESTA ES LA SECCIÓN QUE BUSCAS      │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Name         │ Type     │ Key                        │  │
│ ├──────────────┼──────────┼──────────────────────────┤  │
│ │ anon         │ public   │ eyJ... [👁️] [📋]         │  │ ← CLIC AQUÍ
│ │ service_role │ secret   │ eyJ... [👁️] [📋]         │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Config (opcional)                                        │
│ ...                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

Marca cada paso cuando lo completes:

- [ ] Abrí mi proyecto en Supabase
- [ ] Fui a Settings > API
- [ ] Encontré la sección "Project API keys"
- [ ] Vi 2 filas en la tabla (anon y service_role)
- [ ] Hice clic en el 👁️ de la fila "anon" + "public"
- [ ] Copié la key completa
- [ ] Verifiqué que es diferente a la service_role key

---

## 🎯 Siguiente Paso

Una vez que tengas la anon key:
1. Cópiala completa
2. Envíamela
3. La agregaré al archivo `.env.local`

¿Ya la encontraste? Si tienes algún problema, describe qué ves exactamente en la página de API.

