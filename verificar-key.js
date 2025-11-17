// Script para verificar qué tipo de key es
// Ejecuta esto en la consola del navegador o Node.js

const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucmd4d3NteW51aHZ6cHN2dGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg4MTk5NCwiZXhwIjoyMDc4NDU3OTk0fQ.B9wKyNc0hWi9plf-goUUK89rbuvXnmOmsKQHPs6evoc";

// Decodificar el payload del JWT
const parts = serviceRoleKey.split('.');
const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

console.log("Tipo de key:", payload.role);
console.log("Ref:", payload.ref);

// Esta key es service_role, necesitamos la anon

