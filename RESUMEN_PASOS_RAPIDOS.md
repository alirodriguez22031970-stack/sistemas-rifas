# ⚡ Resumen Rápido: Pasos para Hospedar en Firebase

## 🎯 Pasos Esenciales (Copia y Pega)

### 1. Iniciar Sesión
```bash
npx firebase-tools login
```

### 2. Verificar/Seleccionar Proyecto
```bash
npx firebase-tools use
```

### 3. Inicializar (Solo Primera Vez)
```bash
npx firebase-tools init
```
Selecciona: Functions + Hosting

### 4. Instalar Dependencias
```bash
cd functions
npm install
cd ..
```

### 5. Construir
```bash
npm run build
```

### 6. Configurar Variables (IMPORTANTE)
```bash
npx firebase-tools functions:config:set \
  supabase.url="tu_url" \
  supabase.anon_key="tu_key" \
  supabase.service_role_key="tu_service_key"
```

### 7. Desplegar
```bash
npx firebase-tools deploy
```

## ✅ ¡Listo! Tu página estará en:
- https://tu-proyecto.web.app
- https://tu-proyecto.firebaseapp.com

---

**📖 Para más detalles, lee: `GUIA_COMPLETA_FIREBASE_GRATIS.md`**

