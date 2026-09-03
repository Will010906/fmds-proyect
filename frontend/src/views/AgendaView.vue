<template>
  <div class="page">

    <AppNav />

    <!-- HERO -->
    <div class="ag-hero">
      <div class="pill"><div class="pill-d"></div><span class="pill-t">Programa oficial</span></div>
      <h1 class="ag-title"><strong>Agenda</strong> <em>del congreso</em></h1>
      <p class="ag-sub">{{ resumen }}</p>

      <!-- Selector de evento: solo tiene sentido si hay más de uno programado -->
      <div class="ag-evs" v-carrusel v-if="eventos.length > 1">
        <button
          v-for="e in eventos"
          :key="e.idEvento"
          class="ag-ev"
          :class="{ active: eventoActivo === e.idEvento }"
          @click="cambiarEvento(e.idEvento)"
        >
          {{ e.titulo }}
          <span class="ag-ev-f">{{ fechaCorta(e.fecha) }}</span>
        </button>
      </div>
    </div>

    <!-- TABS -->
    <div class="ag-wrap">
      <div v-if="sesiones.length === 0" class="ag-empty">Aún no hay sesiones registradas en la agenda.</div>
      <template v-else>
        <div class="ag-tabs">
          <button
            v-for="dia in diasDisponibles"
            :key="dia"
            class="ag-tab"
            :class="{ active: diaActivo === dia }"
            @click="diaActivo = dia"
          >
            Día {{ dia }}
          </button>
        </div>

        <!-- SESIONES -->
        <div class="ag-list">
          <div
            v-for="sesion in sesionesDelDia"
            :key="sesion.idSesion"
            class="ag-item"
          >
            <div class="ag-time">
              <div class="ag-hr">{{ formatHora(sesion.hora) }}</div>
              <div class="ag-dur">{{ sesion.duracion }}</div>
            </div>
            <div class="ag-sep"></div>
            <div class="ag-info">
              <div class="ag-tipo">
                <span class="ag-dot" :style="{ background: colorBadge(sesion.badge) }"></span>
                {{ sesion.tipo }}
              </div>
              <div class="ag-nm">{{ sesion.nombre }}</div>

              <!-- Si la sesión está ligada a un ponente del catálogo se muestra
                   su ficha, para que agenda y página de ponentes coincidan. -->
              <router-link v-if="sesion.speakerNombre" to="/speakers" class="ag-pon">
                <img v-if="sesion.speakerFoto" :src="sesion.speakerFoto" :alt="sesion.speakerNombre" class="ag-pon-foto" />
                <span v-else class="ag-pon-av" :style="estiloAvatar(sesion.speakerNombre)">{{ iniciales(sesion.speakerNombre) }}</span>
                <span class="ag-pon-txt">
                  <span class="ag-pon-nm">{{ sesion.speakerNombre }}</span>
                  <span class="ag-pon-rl" v-if="sesion.speakerRol">{{ sesion.speakerRol }}</span>
                </span>
              </router-link>
              <div v-else class="ag-by">{{ sesion.ponente }}</div>
            </div>
            <div class="ag-badge" :style="{ borderColor: colorBadge(sesion.badge), color: colorBadge(sesion.badge) }">
              {{ sesion.badge }}
            </div>
          </div>
        </div>
      </template>

      <!-- CTA -->
      <div class="ag-cta">
        <router-link to="/eventos" class="ag-btn">Reservar mi lugar ⟶</router-link>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { inicialesDe as iniciales, estiloAvatar } from '../utils/avatar'

const sesiones = ref([])
const eventos = ref([])
const eventoActivo = ref(null)
const diaActivo = ref(1)

const COLORES = { Keynote: '#2DD4B4', Workshop: '#F59E0B', Panel: '#6B7280', Social: '#6B7280' }
const colorBadge = (badge) => COLORES[badge] || '#6B7280'

const formatHora = (hora) => {
  const [h, m] = String(hora).split(':')
  return `${parseInt(h)}:${m}`
}

const diasDisponibles = computed(() =>
  [...new Set(sesiones.value.map(s => s.dia))].sort((a, b) => a - b)
)
const sesionesDelDia = computed(() =>
  sesiones.value.filter(s => s.dia === diaActivo.value)
)

// Resumen del encabezado calculado desde la agenda real, para que nunca
// prometa más sesiones o talleres de los que están efectivamente cargados.
const resumen = computed(() => {
  if (sesiones.value.length === 0) return 'El programa se publicará conforme se confirmen las sesiones.'
  const dias = diasDisponibles.value.length
  const total = sesiones.value.length
  const talleres = sesiones.value.filter(s => /workshop|taller/i.test(s.tipo || '')).length
  const partes = [
    `${dias} ${dias === 1 ? 'día' : 'días'}`,
    `${total} ${total === 1 ? 'sesión' : 'sesiones'}`,
  ]
  if (talleres > 0) partes.push(`${talleres} ${talleres === 1 ? 'taller práctico' : 'talleres prácticos'}`)
  return partes.join(' · ')
})

const fechaCorta = (fecha) =>
  new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', timeZone: 'UTC' })

// El programa se pide por evento: cada congreso tiene el suyo.
const cargarSesiones = async () => {
  const res = await api.get('/sesiones', {
    params: eventoActivo.value ? { idEvento: eventoActivo.value } : {},
  })
  sesiones.value = res.data
  if (res.data.length) diaActivo.value = diasDisponibles.value[0]
}

const cambiarEvento = async (idEvento) => {
  eventoActivo.value = idEvento
  await cargarSesiones()
}

onMounted(async () => {
  try {
    const res = await api.get('/eventos')
    eventos.value = res.data
    // Se abre en el próximo congreso pendiente, que es el que le interesa
    // a quien está consultando el programa.
    const ahora = Date.now()
    const proximo = res.data.find((e) => new Date(e.fecha).getTime() >= ahora) || res.data[0]
    eventoActivo.value = proximo ? proximo.idEvento : null
  } catch {
    eventos.value = []
  }
  await cargarSesiones()
})
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

.ag-hero { background:linear-gradient(160deg,var(--bg),var(--bg3));border-bottom:1px solid var(--line3);padding:var(--sec-y) var(--sec-x); }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:20px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,212,180,.4)}50%{box-shadow:0 0 0 6px rgba(45,212,180,0)} }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.ag-title { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.05em;line-height:1;margin-bottom:16px; }
.ag-title strong { color:var(--white); }
.ag-title em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.ag-sub { font-size:var(--t-md);color:var(--w3);font-weight:300; }

/* Selector de congreso */
.ag-evs { display:flex;gap:8px;flex-wrap:wrap;margin-top:24px; }
.ag-ev { display:flex;flex-direction:column;gap:4px;align-items:flex-start;background:var(--w5);border:1px solid var(--line2);border-radius:12px;padding:12px 16px;font-family:var(--f);font-size:var(--t-sm);font-weight:600;color:var(--w2);cursor:pointer;transition:all .15s;text-align:left; }
.ag-ev:hover { border-color:var(--teal-b);color:var(--white); }
.ag-ev.active { background:var(--teal-g);border-color:var(--teal);color:var(--teal); }
.ag-ev-f { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--w4);letter-spacing:.06em;text-transform:uppercase; }
.ag-ev.active .ag-ev-f { color:var(--teal); }

.ag-wrap { max-width:900px;margin:0 auto;padding:var(--sec-y) var(--sec-x); }
.ag-empty { text-align:center;color:var(--w4);padding:48px 0; }

.ag-tabs { display:flex;gap:0;border-bottom:1px solid var(--line3);margin-bottom:36px; }
.ag-tab { background:none;border:none;border-bottom:2px solid transparent;padding:12px 16px;font-family:var(--f);font-size:var(--t-sm);font-weight:500;color:var(--w4);cursor:pointer;transition:all .15s;margin-bottom:-1px; }
.ag-tab:hover { color:var(--white); }
.ag-tab.active { color:var(--teal);border-bottom-color:var(--teal); }

.ag-list { display:flex;flex-direction:column;gap:12px; }
.ag-item { background:var(--card);border:1px solid var(--line3);border-radius:14px;padding:24px 24px;display:grid;grid-template-columns:80px 1px 1fr auto;gap:24px;align-items:center;transition:border-color .15s; }
.ag-item:hover { border-color:var(--teal-b); }

.ag-time { display:flex;flex-direction:column;gap:4px; }
.ag-hr { font-family:var(--f);font-size:var(--t-xl);font-weight:800;color:var(--teal);letter-spacing:-.03em; }
.ag-dur { font-size:var(--t-xs);color:var(--w4); }

.ag-sep { width:1px;height:100%;background:var(--line3);align-self:stretch; }

.ag-info { display:flex;flex-direction:column;gap:4px; }
.ag-tipo { display:flex;align-items:center;gap:4px;font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--w4); }
.ag-dot { width:5px;height:5px;border-radius:50%; }
.ag-nm { font-size:var(--t-md);font-weight:700;color:var(--white);letter-spacing:-.02em; }
.ag-by { font-size:var(--t-sm);color:var(--w3);font-weight:300; }

/* Ponente del catálogo: se muestra con su avatar y enlaza a su ficha */
.ag-pon { display:inline-flex;align-items:center;gap:8px;text-decoration:none;margin-top:4px;padding:8px 16px 8px 8px;border-radius:100px;border:1px solid transparent;transition:all .15s; }
.ag-pon:hover { border-color:var(--teal-b);background:var(--teal-g); }
.ag-pon-foto, .ag-pon-av { width:28px;height:28px;border-radius:50%;flex-shrink:0; }
.ag-pon-foto { object-fit:cover;border:1px solid var(--teal-b); }
.ag-pon-av { display:flex;align-items:center;justify-content:center;font-family:var(--f);font-size:var(--t-2xs);font-weight:800; }
.ag-pon-txt { display:flex;flex-direction:column;line-height:1.25; }
.ag-pon-nm { font-size:var(--t-sm);font-weight:600;color:var(--white); }
.ag-pon-rl { font-size:var(--t-xs);color:var(--w3);font-weight:300; }

.ag-badge { font-size:var(--t-2xs);font-weight:600;padding:4px 12px;border-radius:100px;border:1px solid;background:transparent;white-space:nowrap; }

.ag-cta { text-align:center;margin-top:48px; }
.ag-btn { background:var(--teal);color:var(--bg);border:none;border-radius:10px;padding:16px 32px;font-family:var(--f);font-size:var(--t-md);font-weight:700;cursor:pointer;transition:background .15s;text-decoration:none;display:inline-block; }
.ag-btn:hover { background:var(--teal2); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .ag-hero { padding:var(--sec-y) var(--sec-x); }
  .ag-title { font-size:var(--t-4xl); }
  .ag-wrap { padding:var(--sec-y) var(--sec-x); }

  .ag-tabs { overflow-x:auto;-webkit-overflow-scrolling:touch; }
  .ag-tab { white-space:nowrap;padding:12px 12px; }

  .ag-item { grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:8px 16px;padding:16px; }
  .ag-time { flex-direction:row;align-items:baseline;gap:8px;grid-column:1; }
  .ag-sep { display:none; }
  .ag-info { grid-column:1 / -1; }
  .ag-badge { grid-row:1;grid-column:2; }
}
</style>