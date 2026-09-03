<template>
  <div class="page">

    <AppNav />

    <!-- HERO -->
    <div class="mb-hero">
      <div class="pill"><div class="pill-d"></div><span class="pill-t">Tu cuenta · Compras</span></div>
      <h1 class="mb-title"><strong>Mis</strong> <em>boletos</em></h1>
      <p class="mb-sub">Aquí aparecen todas tus compras. Presenta tu folio en el acceso del evento.</p>
    </div>

    <div class="mb-wrap">

      <div v-if="cargando" class="mb-empty">Cargando tus boletos…</div>

      <div v-else-if="compras.length === 0" class="mb-empty">
        <div class="mb-empty-t">Aún no tienes boletos</div>
        <p class="mb-empty-s">Cuando compres tu acceso a un evento, aparecerá aquí con su folio.</p>
        <router-link to="/registro" class="mb-btn">Ver planes y precios ⟶</router-link>
      </div>

      <div v-else class="mb-list">
        <div v-for="compra in compras" :key="compra.idTransaccion" class="ticket">

          <div class="tk-main">
            <div class="tk-top">
              <span class="tk-estado">● Pagado</span>
              <span class="tk-fecha">Comprado el {{ formatFecha(compra.fechaPago) }}</span>
            </div>

            <div v-for="(detalle, i) in compra.detalles" :key="i" class="tk-evento">
              <div class="tk-nombre">{{ detalle.titulo }}</div>
              <div class="tk-meta">
                <span>{{ formatFechaEvento(detalle.fechaEvento) }}</span>
                <span class="tk-dot">·</span>
                <span>{{ detalle.cantidad }} {{ detalle.cantidad === 1 ? 'boleto' : 'boletos' }}</span>
              </div>
            </div>
          </div>

          <div class="tk-stub">
            <div class="tk-stub-l">Folio</div>
            <div class="tk-folio">{{ compra.idTransaccion }}</div>
            <div class="tk-monto">${{ Number(compra.montoTotal).toLocaleString('en-US') }} MXN</div>
          </div>

        </div>
      </div>

    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'

const compras = ref([])
const cargando = ref(true)

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Las fechas de evento llegan como medianoche UTC: se formatean en UTC
// para que no se recorran un día al convertir a hora local
const formatFechaEvento = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

onMounted(async () => {
  try {
    const res = await api.get('/transacciones/mias')
    compras.value = res.data
  } catch {
    compras.value = []
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

.mb-hero { background:linear-gradient(160deg,var(--bg),var(--bg3));border-bottom:1px solid var(--line3);padding:var(--sec-y) var(--sec-x); }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:20px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,212,180,.4)}50%{box-shadow:0 0 0 6px rgba(45,212,180,0)} }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.mb-title { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.05em;line-height:1;margin-bottom:16px; }
.mb-title strong { color:var(--white); }
.mb-title em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.mb-sub { font-size:var(--t-md);color:var(--w3);font-weight:300; }

.mb-wrap { max-width:760px;margin:0 auto;padding:var(--sec-y) var(--sec-x); }

.mb-empty { text-align:center;color:var(--w4);padding:48px 0; }
.mb-empty-t { font-size:var(--t-xl);font-weight:700;color:var(--white);margin-bottom:8px; }
.mb-empty-s { font-size:var(--t-sm);color:var(--w3);font-weight:300;margin-bottom:24px; }
.mb-btn { background:var(--teal);color:var(--bg);border:none;border-radius:10px;padding:12px 32px;font-family:var(--f);font-size:var(--t-sm);font-weight:700;cursor:pointer;transition:background .15s;text-decoration:none;display:inline-block; }
.mb-btn:hover { background:var(--teal2); }

.mb-list { display:flex;flex-direction:column;gap:16px; }

.ticket { background:var(--card);border:1px solid var(--line3);border-radius:16px;display:grid;grid-template-columns:1fr 200px;overflow:hidden;transition:border-color .15s; }
.ticket:hover { border-color:var(--teal-b); }

.tk-main { padding:24px 24px; }
.tk-top { display:flex;align-items:center;gap:12px;margin-bottom:14px; }
.tk-estado { font-family:var(--fm);font-size:var(--t-2xs);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--teal);background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 8px; }
.tk-fecha { font-size:var(--t-xs);color:var(--w4); }

.tk-evento { margin-top:6px; }
.tk-nombre { font-size:var(--t-lg);font-weight:700;color:var(--white);letter-spacing:-.02em;margin-bottom:4px; }
.tk-meta { font-size:var(--t-sm);color:var(--w3);font-weight:300;display:flex;gap:8px;align-items:center; }
.tk-dot { color:var(--w4); }

.tk-stub { border-left:1px dashed var(--line2);padding:24px 24px;display:flex;flex-direction:column;justify-content:center;gap:4px;background:var(--bg3); }
.tk-stub-l { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4); }
.tk-folio { font-family:var(--fm);font-size:var(--t-sm);font-weight:600;color:var(--teal);word-break:break-all; }
.tk-monto { font-size:var(--t-md);font-weight:800;color:var(--white);margin-top:6px; }

@media (max-width: 700px) {
  .mb-hero { padding:var(--sec-y) var(--sec-x); }
  .mb-title { font-size:var(--t-4xl); }
  .mb-wrap { padding:var(--sec-y) var(--sec-x); }

  .ticket { grid-template-columns:1fr; }
  .tk-stub { border-left:none;border-top:1px dashed var(--line2);flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap; }
  .tk-monto { margin-top:0; }
}
</style>
