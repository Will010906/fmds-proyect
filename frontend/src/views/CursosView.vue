<template>
  <div class="page">

    <AppNav />

    <!-- HERO -->
    <div class="ph">
      <div class="pill"><div class="pill-d"></div><span class="pill-t">Formación profesional</span></div>
      <h1 class="ph-ttl">Cursos <em>especializados</em></h1>
      <p class="ph-sub">{{ cursos.length }} {{ cursos.length === 1 ? 'curso técnico' : 'cursos técnicos' }} con instructores expertos. 100% en línea, accesibles desde cualquier estado de México.</p>
    </div>

    <!-- GRID -->
    <div class="sec">
      <div v-if="cursos.length === 0" class="cur-empty">Aún no hay cursos disponibles.</div>
      <div v-else class="cur-g">
        <div class="cc" v-for="(curso, i) in cursos" :key="curso.idCurso">
          <div class="cc-top" :style="{ background: FONDOS[i % FONDOS.length] }">
            <div class="cc-ic" v-html="ICONOS[i % ICONOS.length]"></div>
            <div class="cc-badge" :class="curso.badge === 'Popular' ? 'p' : 'n'" v-if="curso.badge">{{ curso.badge }}</div>
            <div class="cc-nm">{{ curso.nombre }}</div>
            <div class="cc-meta">{{ curso.horas }} hrs · {{ curso.nivel }} · En línea</div>
          </div>
          <div class="cc-body">
            <p class="cc-desc">{{ curso.descripcion }}</p>
            <div class="cc-ft">
              <div class="cc-pr">${{ Math.round(curso.precio) }} MXN <span class="cc-pr-n">valor individual</span></div>
              <router-link to="/registro" class="cc-btn">Inscribirme</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="cur-nota">
        <div class="cur-nota-t">¿Cómo me inscribo?</div>
        <p class="cur-nota-s">El acceso a los cursos se adquiere junto con tu registro al congreso. Al hacer clic en "Inscribirme" verás los planes disponibles — todos incluyen el acceso a los cursos en línea de esta edición.</p>
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

const cursos = ref([])

// Decoración visual asignada por posición (la información viene de la BD)
const FONDOS = [
  'linear-gradient(135deg,var(--bg3),var(--card2))',
  'linear-gradient(135deg,var(--bg2),var(--bg4))',
  'linear-gradient(135deg,var(--card),var(--card2))',
  'linear-gradient(135deg,var(--bg3),#0D1F30)',
  'linear-gradient(135deg,#0C1420,#0D1F30)',
  'linear-gradient(135deg,var(--bg2),#0A1320)',
]
const ICONOS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
]

const cargarCursos = async () => {
  const res = await api.get('/cursos')
  cursos.value = res.data
}

onMounted(cargarCursos)
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

/* PAGE HEADER */
.ph { background:var(--bg2);border-bottom:1px solid var(--line3);padding:var(--sec-y) var(--sec-x);position:relative;overflow:hidden; }
.ph::before { content:'';position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(45,212,180,.04) 0%,transparent 70%);top:-200px;right:-80px;pointer-events:none; }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:16px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal); }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.ph-ttl { font-family:var(--f);font-size:var(--t-4xl);font-weight:800;color:var(--white);letter-spacing:-.05em;line-height:.93;margin-bottom:16px;margin-top:14px; }
.ph-ttl em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.ph-sub { font-size:var(--t-md);font-weight:300;color:var(--w3);line-height:1.82;max-width:520px; }

/* GRID */
.sec { padding:var(--sec-y) var(--sec-x); }
.cur-empty { text-align:center;color:var(--w4);padding:48px 0; }
.cur-g { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }
.cc { background:var(--card);border:1px solid var(--line3);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .18s; }
.cc:hover { border-color:var(--teal-b);transform:translateY(-2px); }
.cc-top { background:linear-gradient(135deg,var(--bg3),var(--card2));padding:24px 24px;position:relative; }
.cc-ic { width:44px;height:44px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:16px; }
.cc-ic svg, .cc-ic :deep(svg) { width:20px;height:20px;fill:none;stroke:var(--teal);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round; }
.cc-badge { position:absolute;top:14px;right:14px;font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.07em;text-transform:uppercase;padding:4px 8px;border-radius:100px; }
.cc-badge.n { background:var(--teal-g);color:var(--teal);border:1px solid var(--teal-b); }
.cc-badge.p { background:var(--gold-g, rgba(245,166,35,.08));color:var(--gold, #F5A623);border:1px solid var(--gold-b, rgba(245,166,35,.18)); }
.cc-nm { font-size:var(--t-md);font-weight:700;color:var(--white);letter-spacing:-.02em;margin-bottom:4px; }
.cc-meta { font-size:var(--t-xs);color:var(--w3);font-weight:300; }
.cc-body { padding:16px 24px; }
.cc-desc { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.75;margin-bottom:16px; }
.cc-ft { display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid var(--line3); }
.cc-pr { font-family:var(--f);font-size:var(--t-lg);font-weight:800;color:var(--teal);letter-spacing:-.03em; }
.cc-pr-n { display:block;font-size:var(--t-2xs);font-weight:400;color:var(--w4);letter-spacing:.04em;text-transform:uppercase; }

.cur-nota { max-width:680px;margin:48px auto 0;background:var(--card);border:1px solid var(--line3);border-left:3px solid var(--teal);border-radius:12px;padding:16px 24px; }
.cur-nota-t { font-size:var(--t-sm);font-weight:700;color:var(--white);margin-bottom:6px; }
.cur-nota-s { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.7; }
.cc-btn { font-size:var(--t-xs);font-weight:600;padding:8px 16px;border-radius:7px;border:1px solid var(--teal-b);cursor:pointer;font-family:var(--f);background:var(--teal-g);color:var(--teal);transition:all .15s;text-decoration:none; }
.cc-btn:hover { background:var(--teal-s); }

/* RESPONSIVE */
@media (max-width: 968px) {
  .ph { padding:var(--sec-y) var(--sec-x); }
  .ph-ttl { font-size:var(--t-3xl); }
  .sec { padding:var(--sec-y) var(--sec-x); }
  .cur-g { grid-template-columns:repeat(2,1fr); }
}
@media (max-width: 640px) {
  .cur-g { grid-template-columns:1fr; }
}
</style>
