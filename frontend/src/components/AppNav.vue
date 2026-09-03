<template>
  <nav class="nav" :class="{ scrolled }">
    <router-link to="/" class="nav-logo">
      <img src="/FMDSlogo.png" alt="FMDS" style="height:32px" />
    </router-link>

    <div class="nav-m">
      <div class="ni">
        <button class="nbn" :class="{ active: ['eventos','agenda','speakers'].includes(route.name) }">
          Congresos
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dd">
          <div class="dl">Eventos 2026</div>
          <router-link to="/eventos" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
            <div><div class="da-t">Todos los eventos</div><div class="da-s">Congresos, simposios y encuentros</div></div>
          </router-link>
          <div class="dsep"></div>
          <div class="dl">Programa</div>
          <router-link to="/agenda" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div>
            <div><div class="da-t">Agenda del congreso</div><div class="da-s">Horarios, sesiones y talleres</div></div>
          </router-link>
          <router-link to="/speakers" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div><div class="da-t">Speakers</div><div class="da-s">Ponentes internacionales</div></div>
          </router-link>
        </div>
      </div>

      <div class="ni">
        <button class="nbn" :class="{ active: ['cursos','galeria'].includes(route.name) }">
          Conocimiento
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dd">
          <router-link to="/cursos" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
            <div><div class="da-t">Cursos de actualización</div><div class="da-s">Formación técnica en línea</div></div>
          </router-link>
          <div class="dsep"></div>
          <router-link to="/galeria" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            <div><div class="da-t">Galería</div><div class="da-s">Memorias del congreso</div></div>
          </router-link>
        </div>
      </div>

      <div class="ni">
        <button class="nbn">
          Comunidad
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dd">
          <router-link to="/speakers" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
            <div><div class="da-t">Nuestros speakers</div><div class="da-s">Conoce a los ponentes</div></div>
          </router-link>
          <router-link :to="{ name: 'nosotros', query: { asunto: 'Propuesta de ponencia' }, hash: '#contacto' }" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div><div class="da-t">Ser ponente</div><div class="da-s">Envía tu propuesta</div></div>
          </router-link>
          <div class="dsep"></div>
          <router-link to="/nosotros" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/></svg></div>
            <div><div class="da-t">Red nacional</div><div class="da-s">Comunidad abierta a todo México</div></div>
          </router-link>
        </div>
      </div>

      <div class="ni">
        <button class="nbn">
          Nosotros
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="dd">
          <router-link to="/nosotros" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div><div class="da-t">Misión y valores</div><div class="da-s">Por qué existe FMDS</div></div>
          </router-link>
          <router-link :to="{ name: 'nosotros', query: { asunto: 'Alianzas y patrocinios' }, hash: '#contacto' }" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
            <div><div class="da-t">Alianzas</div><div class="da-s">Colabora con la federación</div></div>
          </router-link>
          <router-link :to="{ name: 'nosotros', hash: '#contacto' }" class="da">
            <div class="da-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <div><div class="da-t">Contacto</div><div class="da-s">contacto@fmds.mx</div></div>
          </router-link>
        </div>
      </div>

      <router-link to="/registro" class="nbn" :class="{ active: route.name === 'registro' }">Registro y pago</router-link>
    </div>

    <div class="nav-e">
      <template v-if="!token">
        <router-link to="/login" class="ng">Iniciar sesión</router-link>
        <router-link to="/crear-cuenta" class="nf">Crear cuenta →</router-link>
      </template>
      <template v-else>
        <span class="nav-user">{{ nombre }}</span>
        <router-link to="/mis-boletos" class="ng">Mis boletos</router-link>
        <button @click="logout" class="ng">Cerrar sesión</button>
      </template>
    </div>

    <button class="nav-burger" @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen" :aria-label="mobileOpen ? 'Cerrar menú' : 'Abrir menú'">
      <svg v-if="!mobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </nav>

  <!-- Capa oscura: tocar fuera del panel lo cierra, que es lo que uno intenta
       por instinto antes de buscar la equis. -->
  <div class="nav-velo" v-if="mobileOpen" @click="mobileOpen = false"></div>

  <div class="nav-mobile" v-if="mobileOpen">
    <div class="nm-grupo">
      <div class="nm-lbl">El congreso</div>
      <router-link to="/eventos" class="nm-i" @click="mobileOpen = false">Congresos</router-link>
      <router-link to="/agenda" class="nm-i" @click="mobileOpen = false">Agenda</router-link>
      <router-link to="/speakers" class="nm-i" @click="mobileOpen = false">Ponentes</router-link>
    </div>

    <div class="nm-grupo">
      <div class="nm-lbl">Conocimiento</div>
      <router-link to="/cursos" class="nm-i" @click="mobileOpen = false">Cursos</router-link>
      <router-link to="/galeria" class="nm-i" @click="mobileOpen = false">Galería</router-link>
      <router-link to="/nosotros" class="nm-i" @click="mobileOpen = false">Nosotros</router-link>
    </div>

    <div class="nm-pie">
      <router-link to="/registro" class="nm-cta" @click="mobileOpen = false">Comprar boleto ⟶</router-link>
      <template v-if="!token">
        <router-link to="/login" class="nm-sec" @click="mobileOpen = false">Iniciar sesión</router-link>
        <router-link to="/crear-cuenta" class="nm-sec" @click="mobileOpen = false">Crear cuenta</router-link>
      </template>
      <template v-else>
        <router-link to="/mis-boletos" class="nm-sec" @click="mobileOpen = false">Mis boletos</router-link>
        <button class="nm-sec" @click="logout">Cerrar sesión</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)
const scrolled = ref(false)
const token = localStorage.getItem('token')
const nombre = localStorage.getItem('nombre')

const onScroll = () => { scrolled.value = window.scrollY > 8 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
// Con el menú abierto se bloquea el desplazamiento de la página: si no, al
// deslizar sobre el menú se mueve el contenido de atrás y se pierde el sitio.
watch(mobileOpen, (abierto) => {
  document.body.style.overflow = abierto ? 'hidden' : ''
})

// Cerrar al cambiar de página cubre también la navegación con el botón atrás
// del navegador, que no pasa por los @click de los enlaces.
watch(() => route.fullPath, () => { mobileOpen.value = false })

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})

const logout = () => {
  localStorage.clear()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.nav { height:60px;background:rgba(6,9,15,.96);backdrop-filter:blur(24px);border-bottom:1px solid var(--line3);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:fixed;top:0;left:0;right:0;z-index:1000;transition:background .25s,box-shadow .25s,border-color .25s; }
.nav.scrolled { background:rgba(6,9,15,.99);border-bottom-color:var(--line2);box-shadow:0 10px 36px rgba(0,0,0,.45); }
.nav-logo { cursor:pointer;display:flex;align-items:center; }

.nav-m { display:flex;gap:0px;align-items:center; }
.ni { position:relative; }
.nbn { display:flex;align-items:center;gap:4px;font-family:var(--f);font-size:var(--t-sm);font-weight:400;color:var(--w3);background:none;border:none;cursor:pointer;padding:8px 12px;border-radius:7px;transition:all .15s;text-decoration:none; }
.nbn:hover, .nbn.active { color:var(--teal);background:var(--teal-g); }
.nbn svg { width:9px;height:9px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .15s; }
.ni:hover .nbn svg { transform:rotate(180deg); }

.dd { position:absolute;top:calc(100% + 6px);left:0;background:var(--card2);border:1px solid var(--line2);border-radius:12px;padding:4px;min-width:228px;opacity:0;visibility:hidden;transform:translateY(-8px);transition:all .15s;z-index:200;box-shadow:0 24px 64px rgba(0,0,0,.6); }
.ni:hover .dd { opacity:1;visibility:visible;transform:translateY(0); }
.dl { font-size:var(--t-2xs);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);padding:4px 8px 4px;margin-top:4px; }
.dl:first-child { margin-top:0; }
.da { display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;cursor:pointer;transition:background .12s;text-decoration:none; }
.da:hover { background:var(--teal-g); }
.da.noop { cursor:default; }
.da.noop:hover { background:none; }
.da-ic { width:26px;height:26px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.da-ic svg { width:12px;height:12px; }
.da-t { font-size:var(--t-sm);font-weight:600;color:var(--white); }
/* Texto corrido: el escalón mínimo se reserva para etiquetas en versales */
.da-s { font-size:var(--t-xs);color:var(--w3);font-weight:300;margin-top:2px;line-height:1.45; }
.dsep { height:1px;background:var(--line3);margin:4px 0; }

.nav-e { display:flex;gap:8px;align-items:center; }
.nav-user { font-size:var(--t-sm);color:var(--w3); }
.ng { font-family:var(--f);font-size:var(--t-sm);font-weight:500;border-radius:7px;padding:8px 12px;cursor:pointer;background:var(--w5);border:1px solid var(--line2);color:var(--w3);transition:all .15s;text-decoration:none; }
.ng:hover { border-color:var(--teal-b);color:var(--white); }
.nf { font-family:var(--f);font-size:var(--t-sm);font-weight:700;border-radius:7px;padding:8px 16px;cursor:pointer;background:var(--teal);border:none;color:var(--bg);transition:background .15s;text-decoration:none; }
.nf:hover { background:var(--teal2); }

/* 44x44 es el mínimo cómodo para tocar con el pulgar; a 28px el botón de menú
   se falla seguido, y en móvil es el control más importante de la barra. */
.nav-burger { display:none;background:none;border:none;color:var(--white);cursor:pointer;width:44px;height:44px;margin-right:-8px;align-items:center;justify-content:center;border-radius:8px; }
.nav-burger:active { background:var(--w5); }
.nav-mobile, .nav-velo { display:none; }

@media (max-width: 968px) {
  .nav { padding:0 16px; }
  .nav-m, .nav-e { display:none; }
  .nav-burger { display:flex; }
  /* Capa que atenúa la página detrás del menú */
  .nav-velo { display:block;position:fixed;inset:60px 0 0;background:rgba(6,9,15,.72);backdrop-filter:blur(3px);z-index:998;animation:velo .18s ease; }
  @keyframes velo { from { opacity:0 } to { opacity:1 } }

  .nav-mobile {
    display:flex;flex-direction:column;position:fixed;top:60px;left:0;right:0;
    background:var(--bg2);border-bottom:1px solid var(--line3);
    padding:8px 16px calc(16px + env(safe-area-inset-bottom));
    z-index:999;max-height:calc(100vh - 60px);overflow-y:auto;
    box-shadow:0 24px 48px rgba(0,0,0,.5);
    animation:menuBaja .2s cubic-bezier(.22,.61,.36,1);
  }
  @keyframes menuBaja { from { opacity:0;transform:translateY(-8px) } to { opacity:1;transform:none } }

  /* Los enlaces se agrupan por tema en vez de ir en una lista corrida de diez,
     que obliga a leerla entera para encontrar algo. */
  .nm-grupo { display:flex;flex-direction:column;padding:8px 0;border-bottom:1px solid var(--line3); }
  .nm-lbl { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);padding:8px 12px 4px; }
  /* 48px de alto: cómodo para el pulgar sin tener que apuntar */
  .nm-i { display:flex;align-items:center;min-height:48px;padding:0 12px;border-radius:10px;font-family:var(--f);font-size:var(--t-md);font-weight:500;color:var(--w2);text-decoration:none;transition:background .12s,color .12s; }
  .nm-i:active { background:var(--w5); }
  .nm-i.router-link-active { color:var(--teal);background:var(--teal-g); }

  .nm-pie { display:flex;flex-direction:column;gap:8px;padding-top:16px; }
  .nm-cta { display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:10px;background:var(--teal);color:var(--bg);font-family:var(--f);font-size:var(--t-md);font-weight:700;text-decoration:none; }
  .nm-sec { display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:10px;background:var(--w5);border:1px solid var(--line2);color:var(--w2);font-family:var(--f);font-size:var(--t-sm);font-weight:500;text-decoration:none;cursor:pointer; }
  .nm-sec:active { border-color:var(--teal-b);color:var(--white); }
}
</style>
