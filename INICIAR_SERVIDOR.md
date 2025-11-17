# Cómo Iniciar el Servidor

## Problema con PowerShell

Si PowerShell muestra un error sobre scripts no firmados, usa uno de estos métodos:

## Método 1: Usar CMD (Recomendado)

Abre una nueva ventana de **CMD** (no PowerShell) y ejecuta:

```cmd
cd C:\Users\Sistema\Documents\RIFAS
npm run dev
```

## Método 2: Cambiar Política de Ejecución de PowerShell

Abre PowerShell como **Administrador** y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego ejecuta:

```powershell
cd C:\Users\Sistema\Documents\RIFAS
npm run dev
```

## Método 3: Usar Git Bash

Si tienes Git instalado, abre Git Bash y ejecuta:

```bash
cd /c/Users/Sistema/Documents/RIFAS
npm run dev
```

## Verificar que el Servidor Está Corriendo

Después de ejecutar `npm run dev`, deberías ver:

```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in X seconds
```

Luego abre tu navegador en: `http://localhost:3000`

## Si el Servidor No Inicia

1. **Verifica que tengas Node.js instalado:**
   ```cmd
   node --version
   npm --version
   ```

2. **Verifica que tengas el archivo `.env.local`** con las credenciales de Supabase

3. **Limpia la caché y reinstala:**
   ```cmd
   rmdir /s /q .next
   npm install
   npm run dev
   ```

