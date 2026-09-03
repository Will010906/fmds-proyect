<template>
  <div class="page">

    <nav class="nav">
      <span class="nav-logo">FMDS</span>
      <router-link to="/eventos" class="btn-ghost-sm">← Volver a eventos</router-link>
    </nav>

    <div class="checkout-wrap">
      <div class="checkout-card">

        <div class="checkout-header">
          <span class="checkout-tag">Pago seguro</span>
          <h2 class="checkout-title">{{ evento?.titulo }}</h2>
          <p class="checkout-price">${{ evento?.precio }} <span>MXN por boleto</span></p>
        </div>

        <div v-if="mensaje" class="alert-success">
          {{ mensaje }}
          <router-link v-if="haySesion" to="/mis-boletos" class="alert-link">Ver mis boletos ⟶</router-link>
        </div>
        <div v-if="error" class="alert-error">{{ error }}</div>

        <div class="fields" v-if="!haySesion">
          <div class="field full">
            <label class="field-label">Tu nombre completo</label>
            <input v-model="comprador.nombre" type="text" placeholder="Andrés López" class="field-input" />
          </div>
          <div class="field full">
            <label class="field-label">Tu correo electrónico (con él consultas tu boleto)</label>
            <input v-model="comprador.correo" type="email" placeholder="tucorreo@ejemplo.com" class="field-input" />
          </div>
        </div>

        <div class="fields">
          <div class="field full">
            <label class="field-label">Nombre en la tarjeta</label>
            <input v-model="form.nombre" type="text" placeholder="JUAN PEREZ" class="field-input" />
          </div>
          <div class="field full">
            <label class="field-label">Número de tarjeta</label>
            <input v-model="form.numero" type="text" placeholder="4111 1111 1111 1111" maxlength="16" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">Mes exp.</label>
            <input v-model="form.mes" type="text" placeholder="12" maxlength="2" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">Año exp.</label>
            <input v-model="form.anio" type="text" placeholder="28" maxlength="2" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">CVV</label>
            <input v-model="form.cvv" type="text" placeholder="123" maxlength="4" class="field-input" />
          </div>
          <div class="field">
            <label class="field-label">Boletos</label>
            <input v-model="form.cantidad" type="number" min="1" :max="evento?.stockBoletos" class="field-input" />
          </div>
        </div>

        <div class="checkout-total">
          <span class="total-label">Total a pagar</span>
          <span class="total-amount">${{ total }} MXN</span>
        </div>

        <button @click="pagar" :disabled="loading" class="btn-primary">
          {{ loading ? 'Procesando...' : `Pagar $${total} MXN` }}
        </button>

        <p class="secure-note">🔒 Pago procesado por Openpay. Tus datos están seguros.</p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { pagarConTarjeta, nuevaReferencia } from '../services/pago'

const route   = useRoute()
const router  = useRouter()
const evento  = ref(null)
const loading = ref(false)
const error   = ref('')
const mensaje = ref('')
const haySesion = !!localStorage.getItem('token')

const form = ref({ nombre: '', numero: '', mes: '', anio: '', cvv: '', cantidad: 1 })
const comprador = ref({ nombre: '', correo: '' })

const total = computed(() => {
  return evento.value ? (evento.value.precio * form.value.cantidad).toFixed(2) : 0
})

// Referencia del intento de compra: se conserva entre reintentos para que
// Openpay rechace un cobro repetido, y se renueva al cambiar la cantidad
// porque entonces el importe ya es otro.
const referencia = ref(nuevaReferencia())
watch(() => form.value.cantidad, () => { referencia.value = nuevaReferencia() })

const cargarEvento = async () => {
  const res = await api.get(`/eventos/${route.params.idEvento}`)
  evento.value = res.data
}

const pagar = async () => {
  error.value = ''
  mensaje.value = ''

  if (!haySesion && (!comprador.value.nombre || !comprador.value.correo)) {
    error.value = 'Completa tu nombre y correo electrónico para asociar tu boleto.'
    return
  }

  loading.value = true
  try {
    await pagarConTarjeta({
      tarjeta: {
        numero: form.value.numero,
        nombre: form.value.nombre,
        mes:    form.value.mes,
        anio:   form.value.anio,
        cvv:    form.value.cvv,
      },
      referencia: referencia.value,
      idEvento: parseInt(route.params.idEvento),
      cantidad: Number(form.value.cantidad),
      nombre:   comprador.value.nombre,
      correo:   comprador.value.correo,
    })
    if (haySesion) {
      mensaje.value = '¡Pago exitoso! Tus boletos han sido reservados.'
      setTimeout(() => router.push({ name: 'mis-boletos' }), 2500)
    } else {
      mensaje.value = '¡Pago exitoso! Crea una cuenta con este mismo correo para consultar tus boletos cuando quieras.'
      setTimeout(() => router.push({ name: 'crear-cuenta' }), 3500)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(cargarEvento)
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

.nav {
  height: 60px;
  background: rgba(6,9,15,.96);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--line3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:0 32px;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
}
.nav-logo {
  font-size:var(--t-lg);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -.03em;
}

.checkout-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:80px 24px 32px;
}

.checkout-card {
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 20px;
  padding:32px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap:16px;
}

.checkout-header { display: flex; flex-direction: column; gap:4px; }

.checkout-tag {
  font-family: var(--fm);
  font-size:var(--t-2xs);
  color: var(--teal);
  letter-spacing: .12em;
  text-transform: uppercase;
}

.checkout-title {
  font-size:var(--t-xl);
  font-weight: 700;
  color: var(--white);
  letter-spacing: -.03em;
}

.checkout-price {
  font-size:var(--t-sm);
  color: var(--w3);
}
.checkout-price span { color: var(--w4); }

.alert-success {
  background: var(--teal-g);
  border: 1px solid var(--teal-b);
  color: var(--teal);
  padding:12px 16px;
  border-radius: 10px;
  font-size:var(--t-sm);
}
.alert-link {
  display: block;
  margin-top: 6px;
  color: var(--teal);
  font-weight: 700;
  text-decoration: underline;
}
.alert-error {
  background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.3);
  color: #f87171;
  padding:12px 16px;
  border-radius: 10px;
  font-size:var(--t-sm);
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
}
.field { display: flex; flex-direction: column; gap:4px; }
.field.full { grid-column: span 2; }

.field-label {
  font-size:var(--t-xs);
  font-weight: 500;
  color: var(--w3);
  letter-spacing: .03em;
}
.field-input {
  background: var(--bg3);
  border: 1px solid var(--line2);
  border-radius: 10px;
  padding:12px 12px;
  font-family: var(--f);
  font-size:var(--t-sm);
  color: var(--white);
  outline: none;
  transition: border-color .15s;
}
.field-input:focus { border-color: var(--teal-b); }
.field-input::placeholder { color: var(--w4); }

.checkout-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg3);
  border: 1px solid var(--line2);
  border-radius: 10px;
  padding:12px 16px;
}
.total-label { font-size:var(--t-sm); color: var(--w3); }
.total-amount { font-size:var(--t-xl); font-weight: 800; color: var(--white); letter-spacing: -.03em; }

.btn-primary {
  background: var(--teal);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  padding:12px;
  font-family: var(--f);
  font-size:var(--t-md);
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
  width: 100%;
}
.btn-primary:hover { background: var(--teal2); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }

.btn-ghost-sm {
  background: var(--w5);
  color: var(--w3);
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding:8px 16px;
  font-family: var(--f);
  font-size:var(--t-sm);
  cursor: pointer;
  text-decoration: none;
  transition: all .15s;
}
.btn-ghost-sm:hover { border-color: var(--teal-b); color: var(--white); }

.secure-note {
  text-align: center;
  font-size:var(--t-xs);
  color: var(--w4);
}

@media (max-width: 480px) {
  .nav { padding:0 16px; }
  .checkout-card { padding:24px 16px; border-radius: 16px; }
  .checkout-title { font-size:var(--t-xl); }
  .fields { grid-template-columns: 1fr; }
  .field.full { grid-column: span 1; }
}
</style>