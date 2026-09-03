<template>
  <div class="page">

    <AppNav />

    <!-- HERO -->
    <div class="ph">
      <div class="pill"><div class="pill-d"></div><span class="pill-t">Memoria del congreso</span></div>
      <h1 class="ph-ttl">Galería <em>FMDS</em></h1>
      <p class="ph-sub">Aquí publicaremos las fotografías, ponencias y memorias de cada edición del congreso.</p>
    </div>

    <div class="sec">
      <!-- ESTADO: aún sin ediciones celebradas -->
      <div class="gal-soon">
        <div class="gs-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div class="gs-ttl">La primera edición está por venir</div>
        <p class="gs-txt">
          La Federación Mexicana de Desarrolladores de Software es una organización de reciente creación.
          En cuanto se celebre nuestro primer congreso, esta sección reunirá la galería fotográfica
          y las memorias de las ponencias.
        </p>

        <!-- Próximo evento real -->
        <div class="gs-ev" v-if="proximoEvento">
          <div class="gs-ev-l">
            <div class="gs-ev-tag">Próximo evento</div>
            <div class="gs-ev-nm">{{ proximoEvento.titulo }}</div>
            <div class="gs-ev-dt">{{ formatFecha(proximoEvento.fecha) }}</div>
          </div>
          <router-link :to="{ name: 'evento', params: { id: proximoEvento.idEvento } }" class="gs-btn">
            Ver el evento ⟶
          </router-link>
        </div>

        <p class="gs-nota">¿Quieres estar cuando ocurra? Sé parte de la primera edición.</p>
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

const proximoEvento = ref(null)

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

onMounted(async () => {
  try {
    const res = await api.get('/eventos')
    const ahora = Date.now()
    const futuros = res.data.filter(e => new Date(e.fecha).getTime() >= ahora)
    proximoEvento.value = futuros[0] || res.data[0] || null
  } catch {
    proximoEvento.value = null
  }
})
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

/* PAGE HEADER */
.ph { background:var(--bg2);border-bottom:1px solid var(--line3);padding:var(--sec-y) var(--sec-x);position:relative;overflow:hidden; }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:20px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,212,180,.4)}50%{box-shadow:0 0 0 6px rgba(45,212,180,0)} }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.ph-ttl { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.05em;line-height:1;margin-bottom:16px;color:var(--white); }
.ph-ttl em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.ph-sub { font-size:var(--t-md);color:var(--w3);font-weight:300;max-width:560px;line-height:1.7; }

.sec { padding:var(--sec-y) var(--sec-x); }

/* ESTADO PRÓXIMAMENTE */
.gal-soon { max-width:640px;margin:0 auto;text-align:center;background:var(--card);border:1px solid var(--line3);border-radius:18px;padding:48px 48px; }
.gs-ic { width:56px;height:56px;margin:0 auto 24px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:14px;display:flex;align-items:center;justify-content:center; }
.gs-ic svg { width:26px;height:26px; }
.gs-ttl { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.03em;margin-bottom:14px; }
.gs-txt { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.85; }

.gs-ev { display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;background:var(--bg3);border:1px solid var(--line2);border-radius:14px;padding:16px 24px;margin-top:32px; }
.gs-ev-tag { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);margin-bottom:6px; }
.gs-ev-nm { font-size:var(--t-md);font-weight:700;color:var(--white);letter-spacing:-.02em; }
.gs-ev-dt { font-size:var(--t-sm);color:var(--teal);font-weight:300;margin-top:3px; }
.gs-btn { background:var(--teal);color:var(--bg);border:none;border-radius:10px;padding:12px 24px;font-family:var(--f);font-size:var(--t-sm);font-weight:700;cursor:pointer;transition:background .15s;text-decoration:none;white-space:nowrap;flex-shrink:0; }
.gs-btn:hover { background:var(--teal2); }

.gs-nota { font-size:var(--t-sm);color:var(--w4);font-weight:300;margin-top:22px; }

@media (max-width: 700px) {
  .ph { padding:var(--sec-y) var(--sec-x); }
  .ph-ttl { font-size:var(--t-4xl); }
  .sec { padding:var(--sec-y) var(--sec-x); }
  .gal-soon { padding:32px 24px; }
  .gs-ttl { font-size:var(--t-xl); }
  .gs-ev { flex-direction:column;align-items:stretch;text-align:center;gap:16px; }
  .gs-btn { text-align:center; }
}
</style>
