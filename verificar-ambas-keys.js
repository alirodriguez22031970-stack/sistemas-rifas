// Script para verificar y comparar ambas keys
// Ejecuta esto cuando tengas la anon key

console.log("=== VERIFICACIÓN DE KEYS ===\n");

// Key que ya tenemos (service_role)
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucmd4d3NteW51aHZ6cHN2dGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg4MTk5NCwiZXhwIjoyMDc4NDU3OTk0fQ.B9wKyNc0hWi9plf-goUUK89rbuvXnmOmsKQHPs6evoc";

// Reemplaza esto con la anon key que encuentres
const anonKey = "PEGA_AQUI_LA_ANON_KEY";

function verificarKey(key, nombre) {
  try {
    const parts = key.split('.');
    if (parts.length !== 3) {
      console.log(`❌ ${nombre}: Formato inválido (debe tener 3 partes separadas por puntos)`);
      return false;
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log(`✅ ${nombre}:`);
    console.log(`   - Rol: ${payload.role}`);
    console.log(`   - Ref: ${payload.ref}`);
    console.log(`   - Longitud: ${key.length} caracteres`);
    return payload.role;
  } catch (error) {
    console.log(`❌ ${nombre}: Error al decodificar - ${error.message}`);
    return null;
  }
}

console.log("1. Verificando service_role key:");
const rolService = verificarKey(serviceRoleKey, "service_role");

console.log("\n2. Verificando anon key:");
const rolAnon = verificarKey(anonKey, "anon");

console.log("\n=== RESULTADO ===");
if (rolService === "service_role" && rolAnon === "anon") {
  console.log("✅ ¡Perfecto! Las keys son diferentes y correctas");
  console.log("   - service_role: Para backend");
  console.log("   - anon: Para frontend");
} else if (rolService === rolAnon) {
  console.log("⚠️  ADVERTENCIA: Ambas keys son del mismo tipo");
  console.log("   Necesitas encontrar la anon key diferente");
} else {
  console.log("❌ Hay un problema con las keys");
}

