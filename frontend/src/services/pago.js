import api from './api'

// Lógica de pago compartida entre la página de planes (/registro) y la compra
// rápida (/checkout). Tokeniza la tarjeta en el navegador con Openpay (la llave
// pública) y ejecuta el cargo en el backend. El número de tarjeta nunca pasa
// por nuestro servidor: solo viaja el token de un solo uso.
//
// Se manda qué se compra, no cuánto cuesta: con idPaquete, o bien idEvento más
// cantidad. El servidor consulta el precio en la base de datos y cobra ese, así
// que manipular la petición desde el navegador no cambia el importe.
//
// Openpay espera el mes y el año con dos dígitos exactos. La expiración se
// captura de formas distintas según la pantalla ("MM / AA" en registro, dos
// campos en checkout), así que se normaliza aquí: se quitan los no dígitos y
// del año se toman los dos últimos, para que escribir 2028 no reviente la
// tokenización con un error genérico.
const dosDigitos = (valor) => {
  const digitos = String(valor ?? '').replace(/\D/g, '')
  return digitos.slice(-2).padStart(2, '0')
}

// Referencia única del intento de compra. Viaja como order_id a Openpay, que
// la trata como llave de idempotencia: si ya se cobró un pago con esa
// referencia, el segundo intento se rechaza en vez de cobrar otra vez. Un
// cargo declinado en cambio la libera, así que reintentar con otra tarjeta
// sigue funcionando.
//
// Por eso hay que generarla UNA vez por compra y conservarla entre reintentos.
// Solo se pide una nueva cuando cambia lo que se está comprando.
export function nuevaReferencia() {
  const azar = Math.random().toString(36).slice(2, 8)
  return `FMDS-${Date.now()}-${azar}`
}

// tarjeta: { numero, nombre, mes, anio, cvv }
// Devuelve una promesa que resuelve con la respuesta del checkout,
// o rechaza con un Error cuyo mensaje ya está listo para mostrarse al usuario.
export function pagarConTarjeta({ tarjeta, idEvento, cantidad, idPaquete, nombre, correo, referencia }) {
  return new Promise((resolve, reject) => {
    const OpenPay = window.OpenPay
    if (!OpenPay) {
      reject(new Error('No se pudo cargar el sistema de pagos. Recarga la página e intenta de nuevo.'))
      return
    }

    OpenPay.setId(import.meta.env.VITE_OPENPAY_MERCHANT_ID)
    OpenPay.setApiKey(import.meta.env.VITE_OPENPAY_PUBLIC_KEY)
    // Modo prueba por defecto. Para cobros reales define VITE_OPENPAY_SANDBOX=false
    // en el entorno (Vercel). Si la variable falta, se mantiene en sandbox por
    // seguridad, para no cobrar tarjetas reales por accidente.
    OpenPay.setSandboxMode(import.meta.env.VITE_OPENPAY_SANDBOX !== 'false')

    // Huella del dispositivo para el antifraude. La API la exige en el cargo,
    // así que si el script no la generó es mejor detenerse aquí que tokenizar
    // una tarjeta para un cobro que el servidor va a rechazar.
    const deviceSessionId = OpenPay.deviceData.setup()
    if (!deviceSessionId) {
      reject(new Error('No se pudo verificar tu dispositivo. Desactiva el bloqueador de anuncios y recarga la página.'))
      return
    }

    OpenPay.token.create(
      {
        card_number:      String(tarjeta.numero).replace(/\D/g, ''),
        holder_name:      tarjeta.nombre,
        expiration_year:  dosDigitos(tarjeta.anio),
        expiration_month: dosDigitos(tarjeta.mes),
        cvv2:             String(tarjeta.cvv ?? '').replace(/\D/g, ''),
      },
      async (response) => {
        try {
          const { data } = await api.post('/checkout', {
            token_id: response.data.id,
            deviceSessionId,
            referencia,
            idEvento,
            cantidad,
            idPaquete,
            nombre,
            correo,
          })
          resolve(data)
        } catch (err) {
          reject(new Error(err.response?.data?.error || 'Error al procesar el pago'))
        }
      },
      (err) => {
        reject(new Error(err.data?.description || 'No pudimos validar tu tarjeta. Revisa los datos.'))
      }
    )
  })
}
