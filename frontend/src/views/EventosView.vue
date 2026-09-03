<template>
  <div class="page">

    <AppNav />

    <!-- Hero -->
    <section class="hero">
      <div class="hero-tag">
        <span class="hero-dot"></span>
        <span class="hero-tag-text">Temporada 2026</span>
      </div>
      <h1 class="hero-title">
        <span class="hero-t1">Eventos</span>
        <span class="hero-t2">para developers</span>
      </h1>
      <p class="hero-desc">Conferencias, talleres y networking para la comunidad mexicana de desarrollo de software.</p>
    </section>

    <!-- Grid -->
    <section class="events-section">
      <div v-if="eventos.length === 0" class="empty">
        No hay eventos disponibles por el momento.
      </div>
      <div class="events-grid">
        <div
          v-for="evento in eventos"
          :key="evento.idEvento"
          class="event-card"
        >
          <div class="event-card-top">
            <span class="event-date">{{ formatFecha(evento.fecha) }}</span>
            <span class="event-stock">{{ evento.stockBoletos }} boletos</span>
          </div>
          <h3 class="event-title">{{ evento.titulo }}</h3>
          <div class="event-lugar" v-if="evento.sede || evento.ciudad">
            {{ [evento.sede, evento.ciudad].filter(Boolean).join(' · ') }}
          </div>
          <div class="event-card-bottom">
            <span class="event-price">${{ evento.precio }} <small>MXN</small></span>
            <button @click="verEvento(evento)" class="btn-primary-sm">Ver evento</button>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const eventos = ref([])

const cargarEventos = async () => {
  const res = await api.get('/eventos')
  eventos.value = res.data
}

// timeZone:'UTC' evita que la fecha del evento se muestre un día antes en México
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
  })
}

const verEvento = (evento) => {
  router.push({ name: 'evento', params: { id: evento.idEvento } })
}

onMounted(cargarEventos)
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

/* HERO */
.hero {
  padding:var(--sec-y) var(--sec-x);
  max-width: 800px;
  margin: 0 auto;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap:8px;
  background: var(--teal-g);
  border: 1px solid var(--teal-b);
  border-radius: 100px;
  padding:4px 12px 4px 8px;
  margin-bottom: 24px;
}
.hero-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--teal);
  animation: pulse 2.5s infinite;
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(45,212,180,.4); }
  50% { box-shadow: 0 0 0 6px rgba(45,212,180,0); }
}
.hero-tag-text {
  font-family: var(--fm);
  font-size:var(--t-2xs);
  font-weight: 500;
  color: var(--teal);
  letter-spacing: .1em;
  text-transform: uppercase;
}
.hero-title { margin-bottom: 16px; }
.hero-t1 {
  display: block;
  font-size:var(--t-4xl);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -.05em;
  line-height: .9;
}
.hero-t2 {
  display: block;
  font-family: var(--fs);
  font-style: italic;
  font-size:var(--t-4xl);
  color: var(--teal);
  line-height: 1.1;
}
.hero-desc {
  font-size:var(--t-md);
  font-weight: 300;
  color: var(--w3);
  line-height: 1.8;
  max-width: 500px;
}

/* EVENTS */
.events-section {
  max-width: 1100px;
  margin: 0 auto;
  padding:0 var(--sec-x) calc(var(--sec-y) + var(--s5));
}
.empty { text-align: center; color: var(--w4); padding:64px 0; }
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap:16px;
}
.event-card {
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 16px;
  padding:24px;
  display: flex;
  flex-direction: column;
  gap:16px;
  transition: border-color .15s, transform .15s;
}
.event-card:hover {
  border-color: var(--teal-b);
  transform: translateY(-2px);
}
.event-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.event-date {
  font-family: var(--fm);
  font-size:var(--t-2xs);
  color: var(--teal);
  background: var(--teal-g);
  border: 1px solid var(--teal-b);
  padding:4px 8px;
  border-radius: 100px;
  letter-spacing: .05em;
}
.event-stock { font-size:var(--t-xs); color: var(--w4); }
.event-lugar { font-size:var(--t-xs); color: var(--w4); font-weight: 300; margin-top: -8px; }
.event-title {
  font-size:var(--t-lg);
  font-weight: 700;
  color: var(--white);
  letter-spacing: -.02em;
  line-height: 1.3;
  flex: 1;
}
.event-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line3);
  padding-top: 16px;
}
.event-price {
  font-size:var(--t-xl);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -.04em;
}
.event-price small { font-size:var(--t-xs); color: var(--w4); font-weight: 400; }

/* BUTTONS */
.btn-primary-sm {
  background: var(--teal);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  padding:8px 16px;
  font-family: var(--f);
  font-size:var(--t-sm);
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.btn-primary-sm:hover { background: var(--teal2); }
.btn-disabled { opacity: .4; cursor: not-allowed; }

.btn-ghost-sm {
  background: var(--w5);
  color: var(--w3);
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding:8px 16px;
  font-family: var(--f);
  font-size:var(--t-sm);
  cursor: pointer;
  transition: all .15s;
}
.btn-ghost-sm:hover { border-color: var(--teal-b); color: var(--white); }

/* RESPONSIVE */
@media (max-width: 640px) {
  .hero-t2 { font-size:var(--t-3xl); }
  .events-grid { grid-template-columns: 1fr; }
}
</style>