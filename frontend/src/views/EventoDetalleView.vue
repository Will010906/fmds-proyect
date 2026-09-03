<template>
  <div class="page">

    <AppNav />

    <div v-if="cargando" class="ev-estado">Cargando el evento…</div>

    <div v-else-if="!evento" class="ev-estado">
      <div class="ev-estado-t">No encontramos este evento</div>
      <p class="ev-estado-s">Puede que haya sido retirado o que la dirección no sea correcta.</p>
      <router-link to="/eventos" class="ev-btn">Ver todos los eventos ⟶</router-link>
    </div>

    <template v-else>
      <!-- ENCABEZADO -->
      <div class="ev-hero">
        <router-link to="/eventos" class="ev-back">← Todos los eventos</router-link>

        <div class="ev-chips">
          <span class="ev-chip t">{{ evento.modalidad || 'Presencial' }}</span>
          <span class="ev-chip" :class="agotado ? 'r' : 'n'">
            {{ agotado ? 'Boletos agotados' : evento.stockBoletos + ' lugares disponibles' }}
          </span>
        </div>

        <h1 class="ev-ttl">{{ evento.titulo }}</h1>

        <div class="ev-meta">
          <div class="ev-mi">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{{ formatFecha(evento.fecha) }}</span>
          </div>
          <div class="ev-mi" v-if="evento.hora">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{{ formatHora(evento.hora) }} hrs</span>
          </div>
          <div class="ev-mi" v-if="evento.sede || evento.ciudad">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{{ [evento.sede, evento.ciudad].filter(Boolean).join(' · ') }}</span>
          </div>
        </div>
      </div>

      <div class="ev-body">
        <!-- COLUMNA PRINCIPAL -->
        <div class="ev-main">
          <section class="ev-sec" v-if="evento.descripcion">
            <h2 class="ev-h2">Sobre el evento</h2>
            <p class="ev-desc">{{ evento.descripcion }}</p>
          </section>

          <!-- AGENDA -->
          <section class="ev-sec" v-if="sesiones.length">
            <div class="ev-h2-row">
              <h2 class="ev-h2">Programa</h2>
              <router-link to="/agenda" class="ev-link">Agenda completa →</router-link>
            </div>
            <div class="ev-tabs" v-if="dias.length > 1">
              <button
                v-for="d in dias"
                :key="d"
                class="ev-tab"
                :class="{ active: diaActivo === d }"
                @click="diaActivo = d"
              >Día {{ d }}</button>
            </div>
            <div class="ev-ses">
              <div class="ev-se" v-for="s in sesionesDelDia" :key="s.idSesion">
                <div class="ev-se-h">{{ formatHora(s.hora) }}</div>
                <div>
                  <div class="ev-se-n">{{ s.nombre }}</div>
                  <div class="ev-se-p">{{ s.speakerNombre || s.ponente }}</div>
                </div>
                <span class="ev-se-b">{{ s.tipo }}</span>
              </div>
            </div>
          </section>

          <!-- PONENTES -->
          <section class="ev-sec" v-if="ponentesDelEvento.length">
            <div class="ev-h2-row">
              <h2 class="ev-h2">Ponentes</h2>
              <router-link to="/speakers" class="ev-link">Ver todos →</router-link>
            </div>
            <div class="ev-spk">
              <div class="ev-sp" v-for="s in ponentesDelEvento.slice(0, 6)" :key="s.idSpeaker">
                <img v-if="s.fotoUrl" :src="s.fotoUrl" :alt="s.nombre" class="ev-sp-foto" />
                <div v-else class="ev-sp-ini" :style="estiloAvatar(s.nombre)">{{ iniciales(s.nombre) }}</div>
                <div>
                  <div class="ev-sp-n">{{ s.nombre }}</div>
                  <div class="ev-sp-r">{{ s.rol }}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- TARJETA DE COMPRA -->
        <aside class="ev-side">
          <div class="ev-card">
            <div class="ev-card-lbl">Acceso al evento</div>
            <div class="ev-precio">${{ Math.round(evento.precio) }} <small>MXN</small></div>

            <div class="ev-cd" v-if="!countdown.terminado">
              <div class="ev-cd-lbl">Comienza en</div>
              <div class="ev-cd-row">
                <div class="ev-cd-b"><b>{{ countdown.dias }}</b><span>días</span></div>
                <div class="ev-cd-b"><b>{{ pad(countdown.horas) }}</b><span>hrs</span></div>
                <div class="ev-cd-b"><b>{{ pad(countdown.mins) }}</b><span>min</span></div>
              </div>
            </div>
            <div class="ev-cd-fin" v-else>Este evento ya se realizó</div>

            <router-link
              v-if="!agotado && !countdown.terminado"
              :to="{ name: 'checkout', params: { idEvento: evento.idEvento } }"
              class="ev-buy"
            >Comprar boleto ⟶</router-link>
            <div v-else class="ev-buy dis">{{ agotado ? 'Boletos agotados' : 'Ventas cerradas' }}</div>

            <div class="ev-incl">
              <div class="ev-in"><span>✓</span> Acceso a todas las sesiones</div>
              <div class="ev-in"><span>✓</span> Constancia de participación</div>
            </div>

            <p class="ev-seg">Pago seguro con Openpay. Puedes comprar sin crear una cuenta.</p>
          </div>
        </aside>
      </div>

      <!-- Barra de compra fija en móvil. La tarjeta lateral queda muy arriba
           en cuanto se empieza a leer el programa, y con esto el precio y el
           botón siguen a mano en todo momento. -->
      <div class="ev-barra">
        <div class="ev-barra-p">
          <span class="ev-barra-lbl">Acceso al evento</span>
          <span class="ev-barra-n">${{ Math.round(evento.precio) }} <small>MXN</small></span>
        </div>
        <router-link
          v-if="!agotado && !countdown.terminado"
          :to="{ name: 'checkout', params: { idEvento: evento.idEvento } }"
          class="ev-barra-btn"
        >Comprar</router-link>
        <span v-else class="ev-barra-btn dis">{{ agotado ? 'Agotado' : 'Cerrado' }}</span>
      </div>
    </template>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { inicialesDe as iniciales, estiloAvatar } from '../utils/avatar'

const route = useRoute()
const evento = ref(null)
const sesiones = ref([])
const speakers = ref([])
const cargando = ref(true)
const diaActivo = ref(1)

const agotado = computed(() => Number(evento.value?.stockBoletos) === 0)
const dias = computed(() => [...new Set(sesiones.value.map(s => s.dia))].sort((a, b) => a - b))
const sesionesDelDia = computed(() => sesiones.value.filter(s => s.dia === diaActivo.value))

// Ponentes de esta edición: los que tienen alguna sesión en su programa.
// Mientras no haya ninguna sesión ligada a un ponente del catálogo se muestran
// todos, para no dejar la sección vacía durante la captura.
const ponentesDelEvento = computed(() => {
  const ids = new Set(sesiones.value.map(s => s.idSpeaker).filter(Boolean))
  if (ids.size === 0) return speakers.value
  return speakers.value.filter(s => ids.has(s.idSpeaker))
})

const pad = (n) => String(n).padStart(2, '0')

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}
const formatHora = (hora) => {
  if (!hora) return ''
  const [h, m] = String(hora).split(':')
  return `${parseInt(h)}:${m}`
}

// Cuenta regresiva hasta la fecha del evento
const countdown = ref({ dias: 0, horas: 0, mins: 0, terminado: false })
let timer = null
const actualizarCountdown = () => {
  if (!evento.value) return
  const diff = new Date(evento.value.fecha).getTime() - Date.now()
  if (diff <= 0) {
    countdown.value = { dias: 0, horas: 0, mins: 0, terminado: true }
    return
  }
  countdown.value = {
    dias:  Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    terminado: false,
  }
}
watch(evento, (nuevo) => {
  if (timer) clearInterval(timer)
  if (nuevo) {
    actualizarCountdown()
    timer = setInterval(actualizarCountdown, 30000)
  }
})
onUnmounted(() => { if (timer) clearInterval(timer) })

const cargar = async () => {
  cargando.value = true
  try {
    const res = await api.get(`/eventos/${route.params.id}`)
    evento.value = res.data
  } catch {
    evento.value = null
  } finally {
    cargando.value = false
  }
  // El programa es el de este evento, no el de todos. Si falla, la página
  // sigue siendo útil con la información de compra.
  try {
    const [ses, spk] = await Promise.all([
      api.get('/sesiones', { params: { idEvento: route.params.id } }),
      api.get('/speakers'),
    ])
    sesiones.value = ses.data
    speakers.value = spk.data
    if (dias.value.length) diaActivo.value = dias.value[0]
  } catch {
    sesiones.value = []
    speakers.value = []
  }
}

onMounted(cargar)
watch(() => route.params.id, cargar)
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

.ev-estado { max-width:520px;margin:0 auto;padding:80px 24px;text-align:center;color:var(--w3);font-size:var(--t-md); }
.ev-estado-t { font-size:var(--t-xl);font-weight:800;color:var(--white);margin-bottom:10px; }
.ev-estado-s { font-size:var(--t-sm);color:var(--w3);font-weight:300;margin-bottom:26px; }
.ev-btn { background:var(--teal);color:var(--bg);border-radius:10px;padding:12px 24px;font-size:var(--t-sm);font-weight:700;text-decoration:none;display:inline-block; }

/* HERO */
.ev-hero { background:linear-gradient(160deg,var(--bg3),var(--bg));border-bottom:1px solid var(--line3);padding:var(--sec-y) var(--sec-x); }
.ev-back { font-size:var(--t-sm);color:var(--w3);text-decoration:none;font-weight:300;transition:color .15s; }
.ev-back:hover { color:var(--teal); }
.ev-chips { display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 16px; }
.ev-chip { font-size:var(--t-2xs);font-weight:600;padding:4px 12px;border-radius:100px; }
.ev-chip.t { background:var(--teal-g);color:var(--teal);border:1px solid var(--teal-b); }
.ev-chip.n { background:var(--w5);color:var(--w2);border:1px solid var(--line2); }
.ev-chip.r { background:rgba(239,68,68,.1);color:#f87171;border:1px solid rgba(239,68,68,.3); }
.ev-ttl { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.05em;line-height:1.05;color:var(--white);margin-bottom:22px;max-width:820px; }
.ev-meta { display:flex;gap:24px;flex-wrap:wrap; }
.ev-mi { display:flex;align-items:center;gap:8px;font-size:var(--t-sm);color:var(--w2);font-weight:300; }
.ev-mi svg { width:14px;height:14px;fill:none;stroke:var(--teal);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0; }
.ev-mi span::first-letter { text-transform:uppercase; }

/* CUERPO */
.ev-body { display:grid;grid-template-columns:1fr 340px;gap:32px;max-width:1200px;margin:0 auto;padding:48px 48px 80px;align-items:start; }
.ev-main { display:flex;flex-direction:column;gap:32px;min-width:0; }
.ev-sec { display:flex;flex-direction:column;gap:16px; }
.ev-h2 { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.03em; }
.ev-h2-row { display:flex;justify-content:space-between;align-items:baseline;gap:16px; }
.ev-link { font-size:var(--t-sm);color:var(--teal);text-decoration:none;font-weight:500;white-space:nowrap; }
.ev-link:hover { text-decoration:underline; }
.ev-desc { font-size:var(--t-md);color:var(--w2);font-weight:300;line-height:1.9;white-space:pre-line; }

/* AGENDA */
.ev-tabs { display:flex;gap:4px;flex-wrap:wrap; }
.ev-tab { background:var(--w5);border:1px solid var(--line2);border-radius:100px;padding:4px 16px;font-family:var(--f);font-size:var(--t-sm);font-weight:500;color:var(--w3);cursor:pointer;transition:all .15s; }
.ev-tab.active { background:var(--teal-g);border-color:var(--teal-b);color:var(--teal); }
.ev-ses { border:1px solid var(--line3);border-radius:14px;overflow:hidden; }
.ev-se { display:grid;grid-template-columns:64px 1fr auto;gap:16px;align-items:center;padding:16px 16px;border-bottom:1px solid var(--line3); }
.ev-se:last-child { border-bottom:none; }
.ev-se-h { font-family:var(--f);font-size:var(--t-md);font-weight:800;color:var(--teal);letter-spacing:-.02em; }
.ev-se-n { font-size:var(--t-sm);font-weight:600;color:var(--white);line-height:1.4; }
.ev-se-p { font-size:var(--t-xs);color:var(--w4);font-weight:300;margin-top:3px; }
.ev-se-b { font-family:var(--fm);font-size:var(--t-2xs);letter-spacing:.08em;text-transform:uppercase;color:var(--w4);white-space:nowrap; }

/* PONENTES */
.ev-spk { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.ev-sp { display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--line3);border-radius:12px;padding:12px 16px; }
.ev-sp-foto { width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0; }
.ev-sp-ini { width:42px;height:42px;border-radius:50%;background:var(--teal-g);border:1px solid var(--teal-b);display:flex;align-items:center;justify-content:center;font-size:var(--t-sm);font-weight:800;color:var(--teal);flex-shrink:0; }
.ev-sp-n { font-size:var(--t-sm);font-weight:700;color:var(--white); }
.ev-sp-r { font-size:var(--t-xs);color:var(--w4);font-weight:300;margin-top:2px;line-height:1.4; }

/* TARJETA DE COMPRA */
.ev-side { position:sticky;top:80px; }
.ev-card { background:var(--card);border:1px solid var(--line2);border-radius:16px;padding:24px 24px; }
.ev-card-lbl { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);margin-bottom:8px; }
.ev-precio { font-size:var(--t-3xl);font-weight:800;color:var(--white);letter-spacing:-.04em;line-height:1; }
.ev-precio small { font-size:var(--t-sm);font-weight:400;color:var(--w4);letter-spacing:0; }

.ev-cd { margin:24px 0 16px;padding:12px 0;border-top:1px solid var(--line3);border-bottom:1px solid var(--line3); }
.ev-cd-lbl { font-family:var(--fm);font-size:var(--t-2xs);letter-spacing:.12em;text-transform:uppercase;color:var(--w4);margin-bottom:10px; }
.ev-cd-row { display:flex;gap:8px; }
.ev-cd-b { display:flex;flex-direction:column;gap:0px;flex:1; }
.ev-cd-b b { font-size:var(--t-xl);font-weight:800;color:var(--teal);letter-spacing:-.03em;font-variant-numeric:tabular-nums; }
.ev-cd-b span { font-size:var(--t-2xs);color:var(--w4);text-transform:uppercase;letter-spacing:.06em; }
.ev-cd-fin { margin:24px 0 16px;padding:12px 0;border-top:1px solid var(--line3);border-bottom:1px solid var(--line3);font-size:var(--t-sm);color:var(--w4); }

.ev-buy { display:block;text-align:center;background:var(--teal);color:var(--bg);border-radius:10px;padding:12px;font-size:var(--t-md);font-weight:700;text-decoration:none;transition:background .15s; }
.ev-buy:hover { background:var(--teal2); }
.ev-buy.dis { background:var(--w5);color:var(--w4);border:1px solid var(--line2);cursor:not-allowed; }

.ev-incl { display:flex;flex-direction:column;gap:8px;margin-top:20px; }
.ev-in { display:flex;gap:8px;font-size:var(--t-sm);color:var(--w2);font-weight:300;line-height:1.5; }
.ev-in span { color:var(--teal);font-weight:800;flex-shrink:0; }
.ev-seg { font-size:var(--t-xs);color:var(--w4);font-weight:300;line-height:1.6;margin-top:18px;padding-top:16px;border-top:1px solid var(--line3); }

/* La barra fija solo existe en móvil */
.ev-barra { display:none; }

@media (max-width: 960px) {
  .ev-body { grid-template-columns:1fr;padding:32px 16px 64px;gap:32px; }
  .ev-side { position:static;order:-1; }
  .ev-hero { padding:var(--sec-y) var(--sec-x); }
  .ev-ttl { font-size:var(--t-3xl); }
  .ev-meta { gap:12px;flex-direction:column; }
  .ev-spk { grid-template-columns:1fr; }
  .ev-se { grid-template-columns:56px 1fr;gap:12px; }
  .ev-se-b { grid-column:2;justify-self:start; }

  /* Barra de compra siempre visible */
  .ev-barra {
    display:flex;align-items:center;justify-content:space-between;gap:16px;
    position:fixed;left:0;right:0;bottom:0;z-index:900;
    background:rgba(10,17,25,.97);backdrop-filter:blur(20px);
    border-top:1px solid var(--teal-b);
    padding:12px 16px calc(12px + env(safe-area-inset-bottom));
    box-shadow:0 -12px 32px rgba(0,0,0,.45);
  }
  .ev-barra-p { display:flex;flex-direction:column;gap:2px;line-height:1.1; }
  .ev-barra-lbl { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--w4); }
  .ev-barra-n { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.03em; }
  .ev-barra-n small { font-size:var(--t-xs);font-weight:400;color:var(--w4); }
  .ev-barra-btn { display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 32px;border-radius:10px;background:var(--teal);color:var(--bg);font-family:var(--f);font-size:var(--t-md);font-weight:700;text-decoration:none;white-space:nowrap; }
  .ev-barra-btn.dis { background:var(--w5);color:var(--w4);border:1px solid var(--line2); }

  /* Espacio para que la barra no tape el final del pie de página */
  .page { padding-bottom:84px; }
}
</style>
