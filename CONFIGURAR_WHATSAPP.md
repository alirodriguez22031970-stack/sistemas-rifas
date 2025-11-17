# Configurar WhatsApp para Envío de Mensajes

## Descripción

El sistema envía automáticamente un mensaje por WhatsApp al comprador cuando su compra es aprobada. El mensaje incluye:
- Confirmación de aprobación
- Detalles de la compra
- Números asignados
- Link para verificar los números

## Formato del Número de Teléfono

El sistema automáticamente formatea los números de teléfono venezolanos al formato internacional:
- `04141234567` → `+584141234567`
- `4141234567` → `+584141234567`
- `584141234567` → `+584141234567`

## Configuración

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# URL de tu API de WhatsApp
WHATSAPP_API_URL=https://tu-api-whatsapp.com/api/send

# Token de autenticación de tu API de WhatsApp
WHATSAPP_API_TOKEN=tu_token_aqui

# URL de tu aplicación (para los links en los mensajes)
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 2. Formato de la API de WhatsApp

La aplicación envía una petición POST a `WHATSAPP_API_URL` con el siguiente formato:

```json
{
  "to": "+584141234567",
  "message": "Mensaje aquí..."
}
```

**Headers requeridos:**
```
Content-Type: application/json
Authorization: Bearer {WHATSAPP_API_TOKEN}
```

### 3. Ejemplo de Mensaje Enviado

```
¡Hola Juan Pérez! 👋

🎉 ¡Excelente noticia! Tu compra ha sido *APROBADA* ✅

📋 *Detalles de tu compra:*
• Rifa: Rifa de iPhone 15
• Cantidad de boletos: 4
• Monto total: $100.00
• Estado: Aprobada ✅

🎫 *Tus números asignados:*
12, 45, 78, 92

🔗 *Verifica tus números aquí:*
https://tu-dominio.com/compras?compra=123

¡Gracias por participar! 🎉
¡Mucha suerte en el sorteo! 🍀
```

## Servicios de WhatsApp Recomendados

### Opción 1: WhatsApp Business API (Oficial)
- Requiere verificación de negocio
- Más costoso pero oficial
- Mayor confiabilidad

### Opción 2: Twilio WhatsApp API
- Fácil de configurar
- Buena documentación
- Precios razonables

### Opción 3: API Gateway de WhatsApp
- Servicios como ChatAPI, Wati, etc.
- Fáciles de integrar
- Varios planes disponibles

## Prueba

1. Aprobar una compra desde el dashboard
2. Revisar los logs del servidor para ver:
   - `Enviando WhatsApp a: +584141234567`
   - `WhatsApp enviado exitosamente: {...}`
3. El comprador debería recibir el mensaje en su WhatsApp

## Solución de Problemas

### Error: "WhatsApp API no configurada"
- Verifica que `WHATSAPP_API_URL` y `WHATSAPP_API_TOKEN` estén en `.env.local`
- Reinicia el servidor después de agregar las variables

### Error: "WhatsApp API error"
- Verifica que la URL de la API sea correcta
- Verifica que el token sea válido
- Revisa los logs del servidor para más detalles

### El mensaje no se envía
- Verifica que el número de teléfono esté en formato correcto
- Verifica que la compra esté en estado "aprobada"
- Revisa los logs del servidor

## Notas

- El mensaje solo se envía cuando la compra está **aprobada**
- El número se formatea automáticamente con `+58` para Venezuela
- Si la API de WhatsApp falla, la aprobación de la compra no se cancela (solo se registra el error)

