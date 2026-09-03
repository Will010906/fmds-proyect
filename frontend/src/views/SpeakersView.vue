<template>
  <div class="page">

    <AppNav />

    <!-- ENCABEZADO -->
    <header class="sp-top">
      <div class="sp-top-in">
        <div class="pill"><div class="pill-d"></div><span class="pill-t">Ponentes {{ anioEvento }}</span></div>
        <h1 class="sp-title"><strong>Quién</strong> <em>presenta</em></h1>
        <p class="sp-sub">
          Investigadores y profesionales que comparten su trabajo con la comunidad
          de desarrollo de software de México.
        </p>

        <!-- Filtros por área: el dato ya viene del catálogo -->
        <div class="sp-filtros" v-carrusel v-if="areas.length > 1">
          <button
            v-for="a in areas"
            :key="a"
            class="sp-f"
            :class="{ activo: areaActiva === a }"
            @click="areaActiva = a"
          >
            {{ a }}
            <span class="sp-f-n">{{ conteoDe(a) }}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="sp-wrap">
      <div v-if="speakers.length === 0" class="sp-vacio">
        Aún no hay ponentes confirmados. Vuelve pronto.
      </div>

      <template v-else>
        <!-- ── DESTACADO: solo cuando no hay filtro activo ── -->
        <article class="destacado" v-if="featured && areaActiva === TODAS">
          <div class="dst-retrato">
            <img v-if="featured.fotoUrl" :src="featured.fotoUrl" :alt="featured.nombre" class="dst-foto" />
            <div v-else class="dst-ini" :style="estiloAvatar(featured.nombre)">{{ iniciales(featured.nombre) }}</div>
          </div>

          <div class="dst-texto">
            <div class="dst-tag">Keynote principal</div>
            <h2 class="dst-nm">{{ featured.nombre }}</h2>
            <div class="dst-rol">{{ featured.rol }}</div>

            <blockquote class="dst-cita" v-if="featured.frase">{{ featured.frase }}</blockquote>

            <div class="dst-ses" v-if="sesionesDe(featured.idSpeaker).length">
              <router-link
                v-for="s in sesionesDe(featured.idSpeaker)"
                :key="s.idSesion"
                to="/agenda"
                class="dst-ses-i"
              >
                <span class="dst-ses-h">Día {{ s.dia }} · {{ formatHora(s.hora) }}</span>
                <span class="dst-ses-n">{{ s.nombre }}</span>
                <span class="dst-ses-v">Ver en la agenda →</span>
              </router-link>
            </div>
          </div>
        </article>

        <!-- ── REJILLA ── -->
        <div class="sp-grid">
          <article
            class="tarjeta"
            v-for="s in visibles"
            :key="s.idSpeaker"
          >
            <div class="tj-cab">
              <img v-if="s.fotoUrl" :src="s.fotoUrl" :alt="s.nombre" class="tj-foto" />
              <div v-else class="tj-ini" :style="estiloAvatar(s.nombre)">{{ iniciales(s.nombre) }}</div>
              <span class="tj-area" v-if="s.area">{{ s.area }}</span>
            </div>

            <h3 class="tj-nm">{{ s.nombre }}</h3>
            <div class="tj-rol">{{ s.rol }}</div>

            <!-- Si tiene sesiones en la agenda se muestran esas, que son el dato
                 verificable; el tema suelto queda como respaldo. -->
            <router-link
              v-if="sesionesDe(s.idSpeaker).length"
              to="/agenda"
              class="tj-ses"
            >
              <span class="tj-ses-l">
                Día {{ sesionesDe(s.idSpeaker)[0].dia }} · {{ formatHora(sesionesDe(s.idSpeaker)[0].hora) }}
              </span>
              <span class="tj-ses-n">{{ sesionesDe(s.idSpeaker)[0].nombre }}</span>
              <span class="tj-ses-mas" v-if="sesionesDe(s.idSpeaker).length > 1">
                +{{ sesionesDe(s.idSpeaker).length - 1 }} sesión{{ sesionesDe(s.idSpeaker).length > 2 ? 'es' : '' }} más
              </span>
            </router-link>
            <div v-else class="tj-tema">{{ s.tema }}</div>
          </article>
        </div>

        <div v-if="visibles.length === 0" class="sp-vacio">
          No hay ponentes en esta área todavía.
        </div>
      </template>

      <!-- CIERRE -->
      <section class="sp-cierre">
        <h2 class="cr-t">¿Quieres presentar tu trabajo?</h2>
        <p class="cr-s">
          El comité académico recibe propuestas de docentes, estudiantes y profesionales.
          Cuéntanos de qué trata y te respondemos.
        </p>
        <router-link
          :to="{ name: 'nosotros', query: { asunto: 'Propuesta de ponencia' }, hash: '#contacto' }"
          class="cr-btn"
        >Enviar mi propuesta ⟶</router-link>
      </section>
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

const TODAS = 'Todas'

const speakers = ref([])
const sesiones = ref([])
const eventos = ref([])
const areaActiva = ref(TODAS)

const featured = computed(() => speakers.value.find(s => s.featured))

// Áreas reales del catálogo. Si nadie tiene área asignada, el filtro no aparece.
const areas = computed(() => {
  const set = [...new Set(speakers.value.map(s => s.area).filter(Boolean))].sort()
  return set.length ? [TODAS, ...set] : []
})
const conteoDe = (area) =>
  area === TODAS ? speakers.value.length : speakers.value.filter(s => s.area === area).length

// Con el filtro en "Todas" el destacado ya se muestra arriba, así que se saca
// de la rejilla para no repetirlo. Al filtrar por área sí entra, porque
// entonces la ficha destacada no se dibuja.
const visibles = computed(() => {
  if (areaActiva.value === TODAS) return speakers.value.filter(s => !s.featured)
  return speakers.value.filter(s => s.area === areaActiva.value)
})

// El año sale del próximo evento en vez de estar escrito a mano.
const anioEvento = computed(() => {
  const ahora = Date.now()
  const proximo = eventos.value.find(e => new Date(e.fecha).getTime() >= ahora) || eventos.value[0]
  return proximo ? new Date(proximo.fecha).getUTCFullYear() : new Date().getFullYear()
})

// Sesiones que imparte cada ponente, indexadas por su id. Así la ficha muestra
// lo que esa persona realmente presenta y no un tema sin respaldo en la agenda.
const sesionesPorSpeaker = computed(() => {
  const mapa = new Map()
  for (const s of sesiones.value) {
    if (!s.idSpeaker) continue
    if (!mapa.has(s.idSpeaker)) mapa.set(s.idSpeaker, [])
    mapa.get(s.idSpeaker).push(s)
  }
  return mapa
})
const sesionesDe = (idSpeaker) => sesionesPorSpeaker.value.get(idSpeaker) || []

const formatHora = (hora) => {
  const [h, m] = String(hora).split(':')
  return `${parseInt(h)}:${m}`
}

const cargar = async () => {
  const [spk, ses, evs] = await Promise.all([
    api.get('/speakers'),
    api.get('/sesiones'),
    api.get('/eventos'),
  ])
  speakers.value = spk.data
  sesiones.value = ses.data
  eventos.value = evs.data
}

onMounted(cargar)
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

/* ── ENCABEZADO ────────────────────────────────────────────────────────── */
.sp-top { border-bottom:1px solid var(--line3);background:linear-gradient(160deg,var(--bg),var(--bg3)); }
.sp-top-in { max-width:1140px;margin:0 auto;padding:var(--sec-y) var(--sec-x); }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:16px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,212,180,.4)}50%{box-shadow:0 0 0 6px rgba(45,212,180,0)} }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.sp-title { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.045em;line-height:1.05;margin-bottom:12px; }
.sp-title strong { color:var(--white); }
.sp-title em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.sp-sub { font-size:var(--t-md);color:var(--w3);font-weight:300;line-height:1.7; }

/* Filtros por área */
.sp-filtros { display:flex;gap:8px;flex-wrap:wrap;margin-top:24px; }
.sp-f { display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 16px;border-radius:100px;background:var(--w5);border:1px solid var(--line2);color:var(--w2);font-family:var(--f);font-size:var(--t-sm);font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap; }
.sp-f:hover { border-color:var(--teal-b);color:var(--white); }
.sp-f.activo { background:var(--teal-g);border-color:var(--teal);color:var(--teal); }
.sp-f-n { font-family:var(--fm);font-size:var(--t-2xs);color:var(--w4); }
.sp-f.activo .sp-f-n { color:var(--teal); }

.sp-wrap { max-width:1140px;margin:0 auto;padding:var(--sec-y) var(--sec-x) calc(var(--sec-y) + var(--s5)); }
.sp-vacio { text-align:center;color:var(--w4);padding:64px 0;font-size:var(--t-md); }

/* ── DESTACADO ─────────────────────────────────────────────────────────── */
.destacado { display:grid;grid-template-columns:220px 1fr;gap:40px;align-items:center;background:var(--card);border:1px solid var(--teal-b);border-radius:20px;padding:40px;margin-bottom:32px;position:relative;overflow:hidden; }
/* Halo detrás del retrato: da profundidad sin recargar */
.destacado::before { content:'';position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(45,212,180,.09) 0%,transparent 70%);top:-140px;left:-80px;pointer-events:none; }
.dst-retrato { position:relative;display:flex;align-items:center;justify-content:center; }
.dst-foto, .dst-ini { width:200px;height:200px;border-radius:50%;flex-shrink:0; }
.dst-foto { object-fit:cover;border:2px solid var(--teal-b); }
.dst-ini { display:flex;align-items:center;justify-content:center;font-family:var(--f);font-size:var(--t-4xl);font-weight:800;border-width:2px;border-style:solid; }
.dst-texto { min-width:0; }
.dst-tag { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);margin-bottom:10px; }
.dst-nm { font-size:var(--t-3xl);font-weight:800;color:var(--white);letter-spacing:-.035em;line-height:1.1;margin-bottom:6px; }
.dst-rol { font-size:var(--t-md);color:var(--w3);font-weight:300;margin-bottom:20px; }
.dst-cita { font-family:var(--fs);font-style:italic;font-size:var(--t-lg);color:var(--w2);line-height:1.65;border-left:2px solid var(--teal);padding-left:20px;margin-bottom:24px; }
.dst-cita::before { content:'“'; }
.dst-cita::after { content:'”'; }
.dst-ses { display:flex;flex-direction:column;gap:8px; }
.dst-ses-i { display:grid;gap:2px;text-decoration:none;background:var(--bg3);border:1px solid var(--line2);border-radius:12px;padding:14px 18px;transition:all .15s; }
.dst-ses-i:hover { border-color:var(--teal-b);background:var(--teal-g); }
.dst-ses-h { font-family:var(--fm);font-size:var(--t-2xs);color:var(--teal);letter-spacing:.08em;text-transform:uppercase; }
.dst-ses-n { font-size:var(--t-md);color:var(--white);font-weight:600;line-height:1.4; }
.dst-ses-v { font-size:var(--t-xs);color:var(--w4);margin-top:2px; }

/* ── REJILLA ───────────────────────────────────────────────────────────── */
.sp-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px; }
.tarjeta { display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line2);border-radius:16px;padding:28px 24px;transition:border-color .18s,transform .18s; }
.tarjeta:hover { border-color:var(--teal-b);transform:translateY(-2px); }

/* Retrato arriba, con el área al lado: se lee de un vistazo quién es y de qué */
.tj-cab { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px; }
.tj-foto, .tj-ini { width:72px;height:72px;border-radius:50%;flex-shrink:0; }
.tj-foto { object-fit:cover;border:2px solid var(--teal-b); }
.tj-ini { display:flex;align-items:center;justify-content:center;font-family:var(--f);font-size:var(--t-xl);font-weight:800;border-width:2px;border-style:solid; }
.tj-area { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--teal);background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:5px 12px;white-space:nowrap; }

.tj-nm { font-size:var(--t-lg);font-weight:700;color:var(--white);letter-spacing:-.02em;line-height:1.25;margin-bottom:4px; }
.tj-rol { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.5;margin-bottom:18px; }

.tj-ses { display:grid;gap:3px;margin-top:auto;text-decoration:none;background:var(--bg3);border:1px solid var(--line3);border-radius:12px;padding:14px 16px;transition:all .15s; }
.tj-ses:hover { border-color:var(--teal-b);background:var(--teal-g); }
.tj-ses-l { font-family:var(--fm);font-size:var(--t-2xs);color:var(--teal);letter-spacing:.08em;text-transform:uppercase; }
.tj-ses-n { font-size:var(--t-sm);color:var(--white);font-weight:600;line-height:1.45; }
.tj-ses-mas { font-size:var(--t-xs);color:var(--w4);margin-top:2px; }
.tj-tema { margin-top:auto;font-size:var(--t-sm);color:var(--teal);font-weight:600;line-height:1.5;padding-top:16px;border-top:1px solid var(--line3); }

/* ── CIERRE ────────────────────────────────────────────────────────────── */
.sp-cierre { margin-top:48px;text-align:center;background:var(--bg3);border:1px solid var(--line3);border-radius:20px;padding:48px 32px; }
.cr-t { font-size:var(--t-2xl);font-weight:800;color:var(--white);letter-spacing:-.03em;margin-bottom:10px; }
.cr-s { font-size:var(--t-md);color:var(--w3);font-weight:300;line-height:1.7;max-width:520px;margin:0 auto 24px; }
.cr-btn { display:inline-flex;align-items:center;min-height:52px;padding:0 32px;border-radius:12px;background:var(--teal);color:var(--bg);font-family:var(--f);font-size:var(--t-md);font-weight:700;text-decoration:none;transition:background .15s; }
.cr-btn:hover { background:var(--teal2); }

/* ── RESPONSIVE ────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  /* Los filtros se deslizan de lado si son muchos, en vez de apilarse */
  .sp-filtros { flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding-bottom:4px; }
  .sp-filtros::-webkit-scrollbar { display:none; }
  /* Altura cómoda para el pulgar en pantalla táctil */
  .sp-f { min-height:44px; }

  .destacado { grid-template-columns:1fr;gap:24px;padding:28px 20px;text-align:center; }
  .dst-cita { text-align:left; }
  .dst-ses-i { text-align:left; }
  .dst-foto, .dst-ini { width:140px;height:140px;margin:0 auto; }
  .dst-ini { font-size:var(--t-3xl); }
}

@media (max-width: 560px) {
  .sp-grid { grid-template-columns:1fr; }
  .tarjeta { padding:20px; }
  .sp-cierre { padding:32px 20px; }
}
</style>
