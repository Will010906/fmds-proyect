<template>
  <div class="page">

    <AppNav />

    <!-- HERO -->
<div class="hero">
  <div class="h-l">
    <div class="h-tag">
      <div class="h-tag-d"></div>
      <span class="h-tag-t">Federación Mexicana de Desarrolladores de Software</span>
    </div>
    <div class="h-titles">
      <span class="hh1">El ecosistema</span>
      <span class="hh2">científico del software</span>
      <span class="hh3">en México</span>
    </div>
    <p class="h-desc">Divulgación académica <b>neutral y sin conflictos,</b> congresos internacionales y cursos de actualización para la comunidad tecnológica de todo el país.</p>
    <div class="h-ctas">
      <router-link to="/eventos" class="btn-p">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#06090F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Ver congresos 2026
      </router-link>
      <router-link to="/agenda" class="btn-s">Ver el programa</router-link>
    </div>
    <div class="h-nums">
      <div class="hn"><div class="hn-v"><AnimatedNumber :value="eventos.length" /></div><div class="hn-l">Eventos</div></div>
      <div class="hn"><div class="hn-v"><AnimatedNumber :value="speakers.length" /></div><div class="hn-l">Ponentes</div></div>
      <div class="hn"><div class="hn-v"><AnimatedNumber :value="totalSesiones" /></div><div class="hn-l">Sesiones</div></div>
      <div class="hn"><div class="hn-v"><AnimatedNumber :value="totalCursos" /></div><div class="hn-l">Cursos</div></div>
    </div>
  </div>

  <div class="h-r">
    <div class="tp-h">
      <div class="tp-e">Próximo evento</div>
      <div class="tp-n">{{ proximoEvento ? proximoEvento.titulo : 'Sin eventos programados' }}</div>
      <div class="tp-w" v-if="proximoEvento">{{ formatFecha(proximoEvento.fecha) }}</div>
    </div>

    <div class="cd-strip" v-if="proximoEvento">
      <template v-if="!countdown.terminado">
        <div class="cd-lbl">El evento arranca en</div>
        <div class="cd-row">
          <div class="cd-box"><div class="cd-v">{{ pad(countdown.dias) }}</div><div class="cd-k">Días</div></div>
          <div class="cd-box"><div class="cd-v">{{ pad(countdown.horas) }}</div><div class="cd-k">Hrs</div></div>
          <div class="cd-box"><div class="cd-v">{{ pad(countdown.mins) }}</div><div class="cd-k">Min</div></div>
          <div class="cd-box"><div class="cd-v">{{ pad(countdown.segs) }}</div><div class="cd-k">Seg</div></div>
        </div>
      </template>
      <div v-else class="cd-done">Este evento ya concluyó</div>
    </div>

    <div class="tp-b">
      <div class="t-box" v-if="proximoEvento">
        <div class="tr"><span class="tr-n">Acceso general</span><span class="tr-p hi">${{ Math.round(proximoEvento.precio) }} MXN</span></div>
        <div class="tr"><span class="tr-n">Ponente aceptado</span><span class="tr-p gr">Sin costo</span></div>
        <div class="tr"><span class="tr-n">Modalidad</span><span class="tr-p">{{ proximoEvento.modalidad || 'Presencial' }}</span></div>
      </div>
      <div class="tp-al" v-if="stockProximo !== null && stockProximo > 0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span><strong>{{ stockProximo }} lugares</strong> disponibles</span>
      </div>
      <router-link to="/eventos" class="tp-buy">Comprar boletos →</router-link>
      <router-link to="/agenda" class="tp-gh">Ver programa completo</router-link>
    </div>
    <div class="tp-f">
      <div class="tfc"><div class="tfc-l">Inicio</div><div class="tfc-v">{{ proximoEvento ? fechaCorta(proximoEvento.fecha) : '—' }}</div></div>
      <div class="tfc"><div class="tfc-l">Sede</div><div class="tfc-v" style="font-size:var(--t-sm)">{{ proximoEvento?.sede || 'Por confirmar' }}</div></div>
    </div>
  </div>
</div>

    <!-- TICKER -->
    <div class="ticker" aria-hidden="true">
      <div class="ti">
        <template v-for="n in 2" :key="n">
          <span>Divulgación científica neutral</span><span>·</span>
          <span>Congresos internacionales</span><span>·</span>
          <span>Cursos de actualización</span><span>·</span>
          <span>Comité académico independiente</span><span>·</span>
          <span>Comunidad tecnológica de México</span><span>·</span>
        </template>
      </div>
    </div>

<!-- FEATURE STRIP -->
<div class="fstrip" v-carrusel>
  <div class="fsc" @click="$router.push('/eventos')">
    <div class="fsc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
    <div class="fsc-n">Congresos</div><div class="fsc-s">{{ eventos.length }} {{ eventos.length === 1 ? 'evento' : 'eventos' }}</div>
  </div>
  <div class="fsc" @click="$router.push('/speakers')">
    <div class="fsc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
    <div class="fsc-n">Speakers</div><div class="fsc-s">{{ speakers.length }} {{ speakers.length === 1 ? 'ponente' : 'ponentes' }}</div>
  </div>
  <div class="fsc" @click="$router.push('/agenda')">
    <div class="fsc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></div>
    <div class="fsc-n">Agenda</div><div class="fsc-s">{{ totalSesiones }} {{ totalSesiones === 1 ? 'sesión' : 'sesiones' }}</div>
  </div>
  <div class="fsc" @click="$router.push('/cursos')">
    <div class="fsc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
    <div class="fsc-n">Cursos</div><div class="fsc-s">{{ totalCursos }} en línea</div>
  </div>
  <div class="fsc" @click="$router.push('/galeria')">
    <div class="fsc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
    <div class="fsc-n">Galería</div><div class="fsc-s">Memorias</div>
  </div>
  <div class="fsc" @click="$router.push('/eventos')">
    <div class="fsc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
    <div class="fsc-n">Registros</div><div class="fsc-s">{{ precioMin ? 'Desde $' + precioMin : 'Ver planes' }}</div>
  </div>
</div>

   <!-- EVENTOS BENTO -->
<div v-reveal class="sec sup-glow sup-edge" style="background:var(--bg)">
  <div class="s-hd">
    <div>
      <div class="pill"><div class="pill-d"></div><span class="pill-t">Agenda académica</span></div>
      <div class="s-ttl"><strong>Próximos</strong> <em>eventos</em></div>
    </div>
    <router-link to="/eventos" class="s-all">Ver todos →</router-link>
  </div>
  <div v-if="eventos.length === 0" class="bento-empty">Aún no hay eventos publicados. ¡Vuelve pronto!</div>
  <div v-else class="bento">

    <!-- Card principal ancha: primer evento real -->
    <div class="bc bc-wide">
      <div class="bc-chip">{{ fechaCorta(eventos[0].fecha) }} · {{ anio(eventos[0].fecha) }}</div>
      <div class="bc-nm">{{ eventos[0].titulo }}</div>
      <div class="bc-tags">
        <span class="bt t" v-if="eventos[0].stockBoletos > 0">Inscripción abierta</span>
        <span class="bt n" v-if="eventos[0].stockBoletos > 0">{{ eventos[0].stockBoletos }} cupos</span>
        <span class="bt n" v-else>Agotado</span>
      </div>
      <div class="bc-ft">
        <div class="bc-pr">${{ eventos[0].precio }} <small>MXN</small></div>
        <router-link :to="{ name: 'evento', params: { id: eventos[0].idEvento } }" class="bc-btn">Ver evento</router-link>
      </div>
    </div>

    <!-- Resto de eventos reales -->
    <div class="bc" v-for="evento in eventos.slice(1, 3)" :key="evento.idEvento">
      <div class="bc-chip">{{ fechaCorta(evento.fecha) }} · {{ anio(evento.fecha) }}</div>
      <div class="bc-nm">{{ evento.titulo }}</div>
      <div class="bc-tags">
        <span class="bt t" v-if="evento.stockBoletos > 0">Inscripción abierta</span>
        <span class="bt n" v-if="evento.stockBoletos > 0">{{ evento.stockBoletos }} cupos</span>
        <span class="bt n" v-else>Agotado</span>
      </div>
      <div class="bc-ft">
        <div class="bc-pr">${{ evento.precio }} <small>MXN</small></div>
        <router-link :to="{ name: 'evento', params: { id: evento.idEvento } }" class="bc-btn">Ver evento</router-link>
      </div>
    </div>

  </div>
</div>


    <!-- STATS -->
    <div v-reveal class="stats-h">
      <div class="sh"><div class="sh-n"><AnimatedNumber :value="eventos.length" /></div><div class="sh-l">Eventos programados</div></div>
      <div class="sh"><div class="sh-n"><AnimatedNumber :value="speakers.length" /></div><div class="sh-l">Ponentes</div></div>
      <div class="sh"><div class="sh-n"><AnimatedNumber :value="totalSesiones" /></div><div class="sh-l">Sesiones en agenda</div></div>
      <div class="sh"><div class="sh-n"><AnimatedNumber :value="totalCursos" /></div><div class="sh-l">Cursos en línea</div></div>
    </div>

    <!-- POR QUÉ ASISTIR -->
    <div v-reveal class="sec pq sup-grid sup-edge">
      <div class="s-hd">
        <div>
          <div class="pill"><div class="pill-d"></div><span class="pill-t">La experiencia</span></div>
          <div class="s-ttl"><strong>¿Por qué</strong> <em>asistir?</em></div>
        </div>
      </div>
      <div class="pq-g">
        <div class="pq-c">
          <div class="pq-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
          <div class="pq-t">Aprende de los mejores</div>
          <p class="pq-s">Conferencias magistrales y talleres prácticos con investigadores y líderes de la industria del software en México.</p>
        </div>
        <div class="pq-c">
          <div class="pq-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div class="pq-t">Haz networking real</div>
          <p class="pq-s">Conecta con estudiantes, docentes, desarrolladores y empresas de software en un mismo lugar.</p>
        </div>
        <div class="pq-c">
          <div class="pq-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
          <div class="pq-t">Impulsa tu carrera</div>
          <p class="pq-s">Convocatoria abierta para presentar tu propia ponencia ante la comunidad y el comité académico.</p>
        </div>
        <div class="pq-c">
          <div class="pq-ic"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
          <div class="pq-t">Vive la experiencia</div>
          <p class="pq-s">Feria de proyectos estudiantiles y actividades de comunidad a lo largo de los tres días del congreso.</p>
        </div>
      </div>
      <div class="pq-quien">
        <span class="pq-q-l">¿Quiénes asisten?</span>
        <div class="pq-chips">
          <span class="pq-chip">Estudiantes</span>
          <span class="pq-chip">Docentes e investigadores</span>
          <span class="pq-chip">Desarrolladores</span>
          <span class="pq-chip">Emprendedores</span>
          <span class="pq-chip">Empresas de software</span>
          <span class="pq-chip">Egresados</span>
          <span class="pq-chip">Entusiastas tech</span>
        </div>
      </div>
    </div>

    <!-- MISIÓN -->
    <div v-reveal class="ms-grid">
      <div class="ms-l">
        <div class="ms-over">Nuestra misión</div>
        <div class="ms-q">El software mexicano merece una <span>voz independiente</span> de calidad internacional.</div>
        <p class="ms-body">FMDS nace para llenar el vacío de una comunidad académica neutral: sin patrocinios que comprometan la objetividad, sin barreras de acceso y con estándares de rigor internacional.</p>
      </div>
      <div class="ms-r">
        <div class="ms-rlbl">Lo que nos define</div>
        <div class="val">
          <div class="vn">01</div>
          <div class="vi"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg></div>
          <div><div class="vttl">Neutralidad académica</div><div class="vdesc">Sin afiliaciones comerciales, revisión independiente.</div></div>
        </div>
        <div class="val">
          <div class="vn">02</div>
          <div class="vi"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
          <div><div class="vttl">Accesibilidad nacional</div><div class="vdesc">Precios justos para estudiantes en cualquier estado.</div></div>
        </div>
        <div class="val">
          <div class="vn">03</div>
          <div class="vi"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/></svg></div>
          <div><div class="vttl">Rigor internacional</div><div class="vdesc">Ponencias evaluadas por un comité académico antes de programarse.</div></div>
        </div>
        <div class="val">
          <div class="vn">04</div>
          <div class="vi"><svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
          <div><div class="vttl">Tecnología propia</div><div class="vdesc">Plataforma autoadministrable construida en México.</div></div>
        </div>
      </div>
    </div>

<!-- SPEAKERS -->
<div v-reveal class="sec sup-glow sup-glow-r sup-edge" style="background:var(--bg)">
  <div class="s-hd">
    <div>
      <div class="pill"><div class="pill-d"></div><span class="pill-t">Ponentes 2026</span></div>
      <div class="s-ttl">Speakers <em>magistrales</em></div>
    </div>
    <router-link to="/speakers" class="s-all">Ver todos →</router-link>
  </div>
  <div v-if="speakers.length === 0" class="spk-empty">Aún no hay speakers registrados.</div>
  <div v-else class="spk-mag" v-carrusel>
    <div class="sm" v-for="(s, i) in otrosSpeakers.slice(0,2)" :key="s.idSpeaker" @click="$router.push('/speakers')">
      <img v-if="s.fotoUrl" :src="s.fotoUrl" :alt="s.nombre" class="sm-foto" />
      <div v-else class="sm-av" :style="estiloAvatar(s.nombre)">{{ iniciales(s.nombre) }}</div>
      <div>
        <div class="sm-tag">{{ s.area }}</div>
        <div class="sm-nm">{{ s.nombre }}</div>
        <div class="sm-rl">{{ s.rol }}</div>
        <div class="sm-tp">{{ s.tema }}</div>
      </div>
    </div>
    <div class="sm-feat" v-if="speakerFeatured" @click="$router.push('/speakers')">
      <img v-if="speakerFeatured.fotoUrl" :src="speakerFeatured.fotoUrl" :alt="speakerFeatured.nombre" class="sm-fav-foto" />
      <div v-else class="sm-fav" :style="estiloAvatar(speakerFeatured.nombre)">{{ iniciales(speakerFeatured.nombre) }}</div>
      <div>
        <div class="sm-ftag">Keynote principal</div>
        <div class="sm-fnm">{{ speakerFeatured.nombre }}</div>
        <div class="sm-frl">{{ speakerFeatured.rol }}</div>
        <div class="sm-fq" v-if="speakerFeatured.frase">"{{ speakerFeatured.frase }}"</div>
      </div>
    </div>
    <div class="sm" v-for="(s, i) in otrosSpeakers.slice(2,4)" :key="s.idSpeaker" @click="$router.push('/speakers')">
      <img v-if="s.fotoUrl" :src="s.fotoUrl" :alt="s.nombre" class="sm-foto" />
      <div v-else class="sm-av" :style="estiloAvatar(s.nombre)">{{ iniciales(s.nombre) }}</div>
      <div>
        <div class="sm-tag">{{ s.area }}</div>
        <div class="sm-nm">{{ s.nombre }}</div>
        <div class="sm-rl">{{ s.rol }}</div>
        <div class="sm-tp">{{ s.tema }}</div>
      </div>
    </div>
  </div>
</div>

<!-- FAQ -->
<div v-reveal class="sec sup-glow sup-edge" style="background:var(--bg)">
  <div class="s-hd" style="margin-bottom:40px">
    <div>
      <div class="pill"><div class="pill-d"></div><span class="pill-t">FAQ</span></div>
      <div class="s-ttl"><strong>Todo lo que necesitas</strong> <em>saber</em></div>
    </div>
  </div>
  <div class="faq-g">
    <div
      class="faq-i"
      v-for="(faq, i) in faqs"
      :key="i"
      :class="{ open: faqAbierta === i }"
      @click="faqAbierta = faqAbierta === i ? -1 : i"
    >
      <div class="faq-top">
        <div class="faq-n">{{ String(i + 1).padStart(2, '0') }}</div>
        <div class="faq-q">{{ faq.q }}</div>
        <svg class="faq-ch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="faq-a" v-show="faqAbierta === i">{{ faq.a }}</div>
    </div>
  </div>
</div>

<!-- CTA FINAL -->
<div v-reveal class="cierre" v-if="proximoEvento">
  <div class="pill" style="margin:0 auto 20px"><div class="pill-d"></div><span class="pill-t">Última llamada</span></div>
  <div class="cierre-ttl"><strong>Asegura tu lugar en</strong><br><em>{{ proximoEvento.titulo }}</em></div>
  <div class="cierre-cd" v-if="!countdown.terminado">
    <div class="ccd-box"><div class="ccd-v">{{ pad(countdown.dias) }}</div><div class="ccd-k">Días</div></div>
    <div class="ccd-sep">:</div>
    <div class="ccd-box"><div class="ccd-v">{{ pad(countdown.horas) }}</div><div class="ccd-k">Horas</div></div>
    <div class="ccd-sep">:</div>
    <div class="ccd-box"><div class="ccd-v">{{ pad(countdown.mins) }}</div><div class="ccd-k">Min</div></div>
    <div class="ccd-sep">:</div>
    <div class="ccd-box"><div class="ccd-v">{{ pad(countdown.segs) }}</div><div class="ccd-k">Seg</div></div>
  </div>
  <div class="cierre-stock" v-if="stockProximo !== null">
    <template v-if="stockProximo > 0">
      <span class="cs-dot"></span> Quedan <strong>{{ stockProximo }} boletos</strong> disponibles
    </template>
    <template v-else>Boletos agotados para este evento</template>
  </div>
  <div class="cierre-ctas">
    <router-link to="/registro" class="cierre-btn" v-if="stockProximo === null || stockProximo > 0">Comprar mi boleto ⟶</router-link>
    <router-link to="/agenda" class="cierre-gh">Ver la agenda</router-link>
  </div>
</div>

<!-- BOLETÍN -->
<div v-reveal class="boletin">
  <div class="bol-l">
    <div class="bol-tag">Boletín académico</div>
    <div class="bol-ttl"><strong>Mantente</strong><br><em>al frente</em></div>
  </div>
  <div class="bol-r">
    <p class="bol-desc">Convocatorias, programa y precios anticipados de cada congreso. Directo en tu correo, sin spam.</p>
    <div class="bol-form" v-if="!suscrito">
      <input v-model="bolCorreo" type="email" placeholder="tucorreo@ejemplo.com" class="bol-in" @keyup.enter="suscribir" />
      <button class="bol-btn" @click="suscribir" :disabled="suscribiendo">{{ suscribiendo ? 'Enviando...' : 'Suscribirse →' }}</button>
    </div>
    <div v-else class="bol-ok">✓ ¡Listo! Te llegarán las novedades de FMDS a tu correo.</div>
    <p v-if="bolError" class="bol-err">{{ bolError }}</p>
  </div>
</div>

<!-- FOOTER -->
<AppFooter />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from '../services/api'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'
import { inicialesDe as iniciales, estiloAvatar } from '../utils/avatar'

const eventos = ref([])
const proximoEvento = ref(null)
const speakers = ref([])

// Conteos reales para la tira de accesos rápidos
const totalSesiones = ref(0)
const totalCursos = ref(0)

const countdown = ref({ dias: 0, horas: 0, mins: 0, segs: 0, terminado: false })
const pad = (n) => String(n).padStart(2, '0')
// Las fechas de evento vienen como día completo en UTC. Sin timeZone:'UTC' el
// navegador las convierte a hora local y en México se muestran un día antes.
const fechaCorta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', timeZone: 'UTC' }).toUpperCase()
}
const anio = (fecha) => new Date(fecha).getUTCFullYear()

let countdownTimer = null
const actualizarCountdown = () => {
  if (!proximoEvento.value) return
  const diff = new Date(proximoEvento.value.fecha).getTime() - Date.now()
  if (diff <= 0) {
    countdown.value = { dias: 0, horas: 0, mins: 0, segs: 0, terminado: true }
    return
  }
  countdown.value = {
    dias:  Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    segs:  Math.floor((diff % 60000) / 1000),
    terminado: false,
  }
}

watch(proximoEvento, (nuevo) => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (nuevo) {
    actualizarCountdown()
    countdownTimer = setInterval(actualizarCountdown, 1000)
  }
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const speakerFeatured = computed(() => speakers.value.find(s => s.featured))
const otrosSpeakers = computed(() => speakers.value.filter(s => !s.featured))

// Stock real del próximo evento para la urgencia del CTA final
const stockProximo = computed(() => {
  const stock = proximoEvento.value?.stockBoletos
  return stock === undefined || stock === null ? null : Number(stock)
})

// Precio de acceso más bajo entre los eventos, para "Desde $X"
const precioMin = computed(() => {
  const precios = eventos.value.map(e => Number(e.precio)).filter(p => p > 0)
  return precios.length ? Math.min(...precios).toLocaleString('en-US') : null
})

const cargarSpeakers = async () => {
  const res = await api.get('/speakers')
  speakers.value = res.data
}

// Conteos de agenda y cursos para la tira (no necesitamos el detalle, solo el total)
const cargarConteos = async () => {
  try {
    const [ses, cur] = await Promise.all([api.get('/sesiones'), api.get('/cursos')])
    totalSesiones.value = ses.data.length
    totalCursos.value = cur.data.length
  } catch {
    // si algo falla, los contadores quedan en 0 y el texto lo refleja sin romper la página
  }
}

onMounted(() => {
  cargarEventos()
  cargarSpeakers()
  cargarConteos()
})

const cargarEventos = async () => {
  const res = await api.get('/eventos')
  eventos.value = res.data
  const ahora = Date.now()
  const futuros = res.data.filter(e => new Date(e.fecha).getTime() >= ahora)
  proximoEvento.value = futuros[0] || res.data[0] || null
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
  })
}

// ── FAQ (acordeón: solo la respuesta activa se muestra) ──
const faqAbierta = ref(0)
const faqs = [
  { q: '¿Cómo compro mi boleto?', a: 'Selecciona el evento y paga en línea con tarjeta. Tu boleto queda registrado al instante con su folio en la sección "Mis boletos".' },
  { q: '¿Puedo presentar una ponencia?', a: 'Sí. Docentes, estudiantes y profesionales pueden enviar su propuesta desde el formulario de contacto; el comité académico la revisa y te contacta.' },
  { q: '¿Qué incluye el boleto?', a: 'El acceso a todas las sesiones del programa y a los talleres del congreso, además de tu constancia de participación.' },
  { q: '¿Cómo me registro como ponente?', a: 'Envía tu propuesta desde el formulario de contacto. El comité académico la revisa y te contacta al correo que dejes.' },
  { q: '¿Dónde veo el programa?', a: 'La agenda completa está publicada en la sección Agenda, organizada por día y con el ponente de cada sesión.' },
]

// ── BOLETÍN ──
const bolCorreo = ref('')
const bolError = ref('')
const suscrito = ref(false)
const suscribiendo = ref(false)

const suscribir = async () => {
  bolError.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bolCorreo.value)) {
    bolError.value = 'Ingresa un correo válido'
    return
  }
  suscribiendo.value = true
  try {
    await api.post('/suscriptores', { correo: bolCorreo.value })
    suscrito.value = true
  } catch (err) {
    bolError.value = err.response?.data?.error || 'Error al suscribirte, intenta de nuevo'
  } finally {
    suscribiendo.value = false
  }
}

const scrollBoletin = () => {
  document.querySelector('.boletin')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); padding-top: 60px; }

.bc-loc { display:flex;align-items:center;gap:4px;font-size:var(--t-xs);color:var(--w4);margin-bottom:12px; }

/* HERO */
.hero { display:grid;grid-template-columns:1fr 380px;min-height:calc(100vh - 60px);background:var(--bg);border-bottom:1px solid var(--line3);position:relative;overflow:hidden; }
/* Retícula técnica de fondo: da textura a la primera pantalla, que antes era
   un plano de color liso. Se desvanece hacia abajo y a los lados. */
.hero::after {
  content:'';position:absolute;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
  background-size:72px 72px;
  mask-image:radial-gradient(ellipse 75% 65% at 30% 20%, #000 10%, transparent 75%);
  -webkit-mask-image:radial-gradient(ellipse 75% 65% at 30% 20%, #000 10%, transparent 75%);
}
/* Dos focos de luz que dan profundidad y guían la mirada hacia el titular */
.hero::before {
  content:'';position:absolute;inset:0;pointer-events:none;z-index:1;
  background:
    radial-gradient(ellipse 55% 60% at 70% -8%, rgba(45,212,180,.10) 0%, transparent 62%),
    radial-gradient(ellipse 45% 50% at 8% 88%, rgba(45,212,180,.055) 0%, transparent 60%);
}

.h-l { padding:64px 48px 48px;display:flex;flex-direction:column;justify-content:center;gap:24px;z-index:2; }

.h-tag { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px 4px 8px;width:fit-content; }
.h-tag-d { width:6px;height:6px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,212,180,.4)}50%{box-shadow:0 0 0 6px rgba(45,212,180,0)} }
.h-tag-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }

.h-titles { display:flex;flex-direction:column; }
/* El titular gana peso y la línea en cursiva recibe un leve resplandor para
   que sea el punto focal de la primera pantalla. */
.hh1 { font-family:var(--f);font-size:var(--t-5xl);font-weight:800;color:var(--white);line-height:.9;letter-spacing:-.055em; }
.hh2 { font-family:var(--fs);font-style:italic;font-size:var(--t-5xl);color:var(--teal);line-height:1.02;text-shadow:0 0 42px rgba(45,212,180,.28); }
.hh3 { font-family:var(--f);font-size:var(--t-5xl);font-weight:800;color:var(--white);line-height:.9;letter-spacing:-.055em; }

/* Descripción con mejor contraste y una guía vertical que la ancla al titular */
.h-desc { font-size:14.5px;font-weight:300;color:var(--w2);line-height:1.85;max-width:470px;padding-left:16px;border-left:2px solid var(--teal-b); }
.h-desc b { font-weight:700;color:var(--white); }

.h-ctas { display:flex;gap:8px; }
.btn-p { background:var(--teal);color:var(--bg);border:none;padding:12px 24px;border-radius:8px;font-family:var(--f);font-size:var(--t-sm);font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .15s;text-decoration:none; }
.btn-p:hover { background:var(--teal2); }
.btn-s { background:var(--w5);color:var(--w2);border:1px solid var(--line2);padding:12px 16px;border-radius:8px;font-family:var(--f);font-size:var(--t-sm);cursor:pointer;transition:all .15s;text-decoration:none;display:inline-flex;align-items:center; }
.btn-s:hover { border-color:var(--teal-b);color:var(--white); }

.h-nums { display:flex;gap:0;border-top:1px solid var(--line3);padding-top:28px; }
.hn { flex:1;padding-right:22px;margin-right:22px;border-right:1px solid var(--line3); }
.hn:last-child { border:none;margin:0;padding:0; }
.hn-v { font-family:var(--f);font-size:var(--t-3xl);font-weight:800;color:var(--teal);letter-spacing:-.04em;line-height:1; }
.hn-v sup { font-size:var(--t-sm);color:var(--teal); }
.hn-l { font-size:var(--t-xs);color:var(--w4);margin-top:5px; }

/* PANEL DERECHO */
.h-r { background:linear-gradient(160deg,var(--bg3),var(--bg2));border-left:1px solid var(--line3);display:flex;flex-direction:column;z-index:2; }
.tp-h { padding:32px 24px 24px;border-bottom:1px solid var(--line3); }
.tp-e { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--w4);margin-bottom:16px;display:flex;align-items:center;gap:8px; }
.tp-e::after { content:'';flex:1;height:1px;background:var(--line3); }
.tp-n { font-family:var(--fs);font-style:italic;font-size:var(--t-xl);color:var(--white);line-height:1.38;margin-bottom:8px; }
.tp-w { font-size:var(--t-xs);color:var(--w4); }

/* COUNTDOWN */
.cd-strip { padding:16px 24px;border-bottom:1px solid var(--line3); }
.cd-lbl { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);margin-bottom:12px; }
.cd-row { display:grid;grid-template-columns:repeat(4,1fr);gap:8px; }
.cd-box { background:rgba(0,0,0,.25);border:1px solid var(--teal-b);border-radius:8px;padding:8px 4px;text-align:center; }
.cd-v { font-family:var(--f);font-size:var(--t-xl);font-weight:800;color:var(--teal);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums; }
.cd-k { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--w4);margin-top:5px; }
.cd-done { font-size:var(--t-sm);color:var(--w4); }

.tp-b { padding:24px 24px;flex:1;display:flex;flex-direction:column;gap:12px; }
.t-box { background:rgba(0,0,0,.25);border:1px solid var(--line3);border-radius:9px;overflow:hidden; }
.tr { display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line3); }
.tr:last-child { border-bottom:none; }
.tr-n { font-size:var(--t-sm);color:var(--w3); }
.tr-p { font-family:var(--f);font-size:var(--t-lg);font-weight:700;color:var(--white);letter-spacing:-.02em; }
.tr-p.hi { color:var(--teal); }
.tr-p.gr { font-size:var(--t-sm);color:var(--w4);font-weight:400; }

.tp-al { background:var(--teal-g);border:1px solid var(--teal-b);border-radius:8px;padding:12px 12px;font-size:var(--t-sm);color:var(--w3);display:flex;gap:8px;align-items:center; }
.tp-al strong { color:var(--teal); }

.tp-buy { background:var(--teal);color:var(--bg);border:none;padding:12px;border-radius:8px;font-family:var(--f);font-size:var(--t-md);font-weight:700;cursor:pointer;transition:background .15s;text-align:center;text-decoration:none;display:block; }
.tp-buy:hover { background:var(--teal2); }

.tp-gh { background:none;border:none;color:var(--w4);font-size:var(--t-sm);font-family:var(--f);cursor:pointer;padding:4px;transition:color .15s;text-align:center;text-decoration:none;display:block; }
.tp-gh:hover { color:var(--w2); }

.tp-f { padding:16px 24px;border-top:1px solid var(--line3);display:grid;grid-template-columns:1fr 1fr;gap:8px; }
.tfc { background:rgba(0,0,0,.2);border:1px solid var(--line3);border-radius:7px;padding:12px 12px; }
.tfc-l { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--w4);margin-bottom:4px; }
.tfc-v { font-family:var(--f);font-size:var(--t-md);font-weight:700;color:var(--white); }

/* TICKER */
.ticker { background:var(--teal);overflow:hidden;padding:8px 0; }
.ti { display:inline-flex;white-space:nowrap;animation:roll 24s linear infinite; }
.ti span { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--bg);letter-spacing:.16em;text-transform:uppercase;padding:0 16px;opacity:.85; }
@keyframes roll { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }

/* FEATURE STRIP */
/* Reparto flexible en vez de un número fijo de columnas: la tira tenía siete
   y al quitar una tarjeta quedaba una columna vacía a la derecha. Con flex
   las que haya se reparten el ancho completo, sean seis o nueve. */
.fstrip { background:var(--bg3);border-top:1px solid var(--line3);border-bottom:1px solid var(--line3);display:flex; }
.fsc { flex:1 1 0;min-width:0;padding:24px 16px;border-right:1px solid var(--line3);display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:background .15s;position:relative;overflow:hidden; }
/* La última no lleva línea: si no, se dibuja pegada al borde de la pantalla */
.fsc:last-child { border-right:none; }
.fsc:last-child { border-right:none; }
.fsc::after { content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--teal);transform:scaleX(0);transition:transform .2s; }
.fsc:hover::after { transform:scaleX(1); }
.fsc:hover { background:var(--card); }
.fsc-ic { width:34px;height:34px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:9px;display:flex;align-items:center;justify-content:center; }
.fsc-ic svg { width:15px;height:15px;fill:none;stroke:var(--teal);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round; }
.fsc-n { font-size:var(--t-sm);font-weight:700;color:var(--white); }
.fsc-s { font-family:var(--fm);font-size:var(--t-xs);color:var(--w3); }

/* BENTO */
.sec { padding:var(--sec-y) var(--sec-x); }
.s-hd { display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px; }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:16px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal); }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.s-ttl { font-family:var(--f);font-size:var(--t-3xl);font-weight:800;color:var(--white);letter-spacing:-.05em;line-height:.95;margin-bottom:12px; }
.s-ttl em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.s-all { font-size:var(--t-xs);font-weight:600;color:var(--w3);background:var(--w5);border:1px solid var(--line2);padding:8px 12px;border-radius:7px;cursor:pointer;font-family:var(--f);transition:all .15s;text-decoration:none; }
.s-all:hover { border-color:var(--teal-b);color:var(--teal); }
.bento { display:grid;grid-template-columns:1fr 300px;grid-template-rows:auto auto;gap:16px; }
.bento-empty { text-align:center;color:var(--w4);padding:48px 0;font-size:var(--t-md); }
.bc { background:var(--card);border:1px solid var(--line3);border-radius:14px;padding:32px 24px;cursor:pointer;transition:all .18s; }
.bc:hover { border-color:var(--teal-b);transform:translateY(-2px); }
/* El evento más próximo ocupa la columna ancha; los demás caen en la angosta */
.bc-wide { grid-column:1;background:var(--bg4);border-color:var(--teal-b); }
.bc-chip { display:inline-block;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.07em;text-transform:uppercase;margin-bottom:14px; }
.bc-nm { font-family:var(--fs);font-style:italic;font-size:var(--t-lg);color:var(--white);line-height:1.38;margin-bottom:12px; }
.bc-tags { display:flex;gap:4px;flex-wrap:wrap;margin-bottom:18px; }
.bt { font-size:var(--t-xs);font-weight:500;padding:4px 12px;border-radius:100px; }
.bt.t { background:var(--teal-g);color:var(--teal);border:1px solid var(--teal-b); }
.bt.n { background:var(--w5);color:var(--w3);border:1px solid var(--line2); }
.bc-ft { display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--line3); }
.bc-pr { font-family:var(--f);font-size:var(--t-lg);font-weight:800;color:var(--teal);letter-spacing:-.03em; }
.bc-pr small { font-size:var(--t-2xs);font-weight:400;color:var(--w4); }
.bc-btn { font-size:var(--t-xs);font-weight:600;padding:12px 16px;border-radius:7px;border:1px solid var(--teal-b);cursor:pointer;font-family:var(--f);background:var(--teal-g);color:var(--teal);transition:all .15s;text-decoration:none;display:inline-block;text-align:center; }
.bc-btn:hover { background:var(--teal-s); }

/* STATS */
.stats-h { background:var(--bg3);border-top:1px solid var(--line3);border-bottom:1px solid var(--line3);display:grid;grid-template-columns:repeat(4,1fr); }
.sh { padding:32px 24px;border-right:1px solid var(--line3);position:relative;overflow:hidden; }
.sh:last-child { border-right:none; }
.sh::before { content:'';position:absolute;top:0;left:0;width:2px;height:100%;background:var(--teal);opacity:0;transition:opacity .15s; }
.sh:hover::before { opacity:1; }
.sh-n { font-family:var(--f);font-size:var(--t-2xl);font-weight:800;color:var(--teal);letter-spacing:-.05em;line-height:1;margin-bottom:7px; }
.sh-l { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--w4); }

/* MISIÓN */
.ms-grid { display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line3); }
.ms-l { background:var(--bg2);padding:80px 48px;position:relative;overflow:hidden; }
.ms-l::after { content:'';position:absolute;top:0;right:0;width:1px;height:100%;background:linear-gradient(to bottom,transparent,var(--teal-b),transparent); }
.ms-r { background:var(--card);padding:80px 48px; }
.ms-over { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--w4);margin-bottom:20px; }
.ms-q { font-family:var(--fs);font-style:italic;font-size:var(--t-2xl);color:var(--white);line-height:1.42;margin-bottom:24px; }
.ms-q span { color:var(--teal); }
.ms-body { font-size:var(--t-sm);font-weight:300;color:var(--w3);line-height:1.9; }
.ms-rlbl { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--w4);margin-bottom:26px; }
.val { display:flex;gap:12px;padding:16px 0;border-bottom:1px solid var(--line3);align-items:center; }
.val:last-child { border-bottom:none;padding-bottom:0; }
.val:first-of-type { padding-top:0; }
.vn { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--w4);min-width:18px; }
.vi { width:30px;height:30px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.vi svg { width:13px;height:13px;fill:none;stroke:var(--teal);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round; }
.vttl { font-size:var(--t-sm);font-weight:700;color:var(--white);margin-bottom:3px; }
.vdesc { font-size:var(--t-sm);color:var(--w3);font-weight:300; }

/* SPEAKERS */
.spk-empty { text-align:center;color:var(--w4);padding:48px 0; }
.sm-foto { width:50px;height:50px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid var(--teal-b); }
.sm-fav-foto { width:68px;height:68px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--teal-b); }
.spk-mag { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.sm { background:var(--card);border:1px solid var(--line3);border-radius:14px;padding:24px 24px;display:flex;gap:16px;align-items:flex-start;cursor:pointer;transition:all .18s; }
.sm:hover { border-color:var(--teal-b);transform:translateY(-2px); }
/* El color de cada avatar se calcula a partir del nombre (ver utils/avatar.js) */
.sm-av { width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--f);font-size:var(--t-md);font-weight:800;flex-shrink:0;letter-spacing:.02em; }
.sm-tag { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--teal);margin-bottom:6px; }
.sm-nm { font-size:var(--t-md);font-weight:700;color:var(--white);letter-spacing:-.02em;margin-bottom:4px; }
.sm-rl { font-size:var(--t-sm);color:var(--w3);font-weight:300;margin-bottom:10px; }
.sm-tp { font-size:var(--t-sm);color:var(--w3);line-height:1.65;border-top:1px solid var(--line3);padding-top:10px; }
.sm-feat { grid-column:span 2;background:var(--bg3);border:1px solid var(--teal-b);border-radius:14px;padding:32px 24px;display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center; }
.sm-fav { width:68px;height:68px;border-radius:50%;background:var(--teal-g);border:2px solid var(--teal-b);display:flex;align-items:center;justify-content:center;font-size:var(--t-xl);font-weight:800;color:var(--teal); }
.sm-ftag { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:8px; }
.sm-fnm { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.03em;margin-bottom:5px; }
.sm-frl { font-size:var(--t-sm);color:var(--w3);font-weight:300;margin-bottom:14px; }
.sm-fq { font-family:var(--fs);font-style:italic;font-size:var(--t-md);color:var(--w3);line-height:1.65; }

/* ARTÍCULOS */

/* GALERÍA */
/* FAQ */
.faq-g { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
.faq-i { background:var(--card);border:1px solid var(--line3);border-radius:14px;padding:24px 24px;display:flex;flex-direction:column;gap:0;transition:border-color .15s;cursor:pointer; }
.faq-i.open { border-color:var(--teal-b); }
.faq-top { display:flex;align-items:center;gap:12px; }
.faq-ch { width:14px;height:14px;color:var(--w4);margin-left:auto;flex-shrink:0;transition:transform .2s; }
.faq-i.open .faq-ch { transform:rotate(180deg);color:var(--teal); }
.faq-i.open .faq-a { margin-top:12px; }
.faq-i:hover { border-color:var(--teal-b); }
.faq-n { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em; }
.faq-q { font-size:var(--t-md);font-weight:700;color:var(--white);letter-spacing:-.02em; }
.faq-a { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.7; }

/* BOLETÍN */
.boletin { background:var(--bg2);border-top:1px solid var(--line3);padding:64px 48px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center; }
.bol-tag { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--w4);margin-bottom:16px; }
.bol-ttl { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.04em;line-height:1; }
.bol-ttl strong { color:var(--white); }
.bol-ttl em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal);display:block; }
.bol-desc { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.8;margin-bottom:20px; }
.bol-form { display:flex;gap:8px; }
.bol-in { flex:1;background:var(--card);border:1px solid var(--line2);border-radius:10px;padding:12px 16px;font-family:var(--f);font-size:var(--t-sm);color:var(--white);outline:none;transition:border-color .15s; }
.bol-in:focus { border-color:var(--teal-b); }
.bol-in::placeholder { color:var(--w4); }
.bol-btn { background:var(--teal);color:var(--bg);border:none;border-radius:10px;padding:12px 24px;font-family:var(--f);font-size:var(--t-sm);font-weight:700;cursor:pointer;transition:background .15s;white-space:nowrap; }
.bol-btn:hover { background:var(--teal2); }
.bol-btn:disabled { opacity:.6;cursor:not-allowed; }
.bol-ok { background:var(--teal-g);border:1px solid var(--teal-b);border-radius:10px;padding:12px 16px;font-size:var(--t-sm);color:var(--teal);font-weight:600; }
.bol-err { font-size:var(--t-sm);color:#f87171;margin-top:8px; }

/* POR QUÉ ASISTIR */
.pq { background:var(--bg2);border-top:1px solid var(--line3); }
.pq-g { display:grid;grid-template-columns:repeat(4,1fr);gap:12px; }
.pq-c { background:var(--card);border:1px solid var(--line3);border-radius:14px;padding:24px 24px;transition:border-color .15s; }
.pq-c:hover { border-color:var(--teal-b); }
.pq-ic { width:38px;height:38px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:16px; }
.pq-ic svg { width:17px;height:17px; }
.pq-t { font-size:var(--t-md);font-weight:700;color:var(--white);letter-spacing:-.02em;margin-bottom:8px; }
.pq-s { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.7; }
.pq-quien { display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:28px;padding-top:24px;border-top:1px solid var(--line3); }
.pq-q-l { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);white-space:nowrap; }
.pq-chips { display:flex;gap:8px;flex-wrap:wrap; }
.pq-chip { font-size:var(--t-xs);font-weight:500;color:var(--w2);background:var(--w5);border:1px solid var(--line2);border-radius:100px;padding:4px 12px;transition:all .15s; }
.pq-chip:hover { border-color:var(--teal-b);color:var(--teal); }

/* CTA FINAL */
.cierre { background:linear-gradient(160deg,var(--bg3),var(--bg));border-top:1px solid var(--line3);padding:64px 48px;text-align:center; }
.cierre-ttl { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.04em;line-height:1.15;margin-bottom:32px; }
.cierre-ttl strong { color:var(--white); }
.cierre-ttl em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.cierre-cd { display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:26px; }
.ccd-box { background:var(--card);border:1px solid var(--line2);border-radius:14px;padding:16px 24px;min-width:88px; }
.ccd-v { font-family:var(--f);font-size:var(--t-4xl);font-weight:800;color:var(--teal);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums; }
.ccd-k { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--w4);margin-top:8px; }
.ccd-sep { font-size:var(--t-2xl);font-weight:800;color:var(--w4); }
.cierre-stock { font-size:var(--t-sm);color:var(--w2);font-weight:300;margin-bottom:28px;display:flex;align-items:center;justify-content:center;gap:8px; }
.cierre-stock strong { color:var(--teal);font-weight:700; }
.cs-dot { width:7px;height:7px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
.cierre-ctas { display:flex;gap:12px;justify-content:center;flex-wrap:wrap; }
.cierre-btn { background:var(--teal);color:var(--bg);border:none;border-radius:10px;padding:16px 32px;font-family:var(--f);font-size:var(--t-md);font-weight:700;cursor:pointer;transition:background .15s;text-decoration:none;display:inline-block; }
.cierre-btn:hover { background:var(--teal2); }
.cierre-gh { background:var(--w5);border:1px solid var(--line2);color:var(--w2);border-radius:10px;padding:16px 32px;font-family:var(--f);font-size:var(--t-md);font-weight:500;cursor:pointer;transition:all .15s;text-decoration:none;display:inline-block; }
.cierre-gh:hover { border-color:var(--teal-b);color:var(--white); }

/* ============ RESPONSIVE ============ */
@media (max-width: 968px) {
  .hero { grid-template-columns:1fr;min-height:auto; }
  .h-l { padding:32px 24px 32px; }
  .hh1, .hh3 { font-size:var(--t-4xl); }
  .hh2 { font-size:var(--t-4xl); }
  .h-nums { flex-wrap:wrap;gap:16px; }
  .hn { flex:1 1 40%;padding-right:0;margin-right:0;border-right:none; }
  .h-r { border-left:none;border-top:1px solid var(--line3); }

  .fstrip { grid-template-columns:repeat(4,1fr); }
  .fsc:nth-child(4) { border-right:none; }

  .sec { padding:var(--sec-y) var(--sec-x); }
  .bento { grid-template-columns:1fr;grid-template-rows:auto; }
  .bc-wide { grid-column:1;grid-row:auto; }

  .stats-h { grid-template-columns:repeat(3,1fr); }
  .sh:nth-child(3) { border-right:none; }
  .sh { padding:24px 16px; }

  .ms-grid { grid-template-columns:1fr; }
  .ms-l, .ms-r { padding:48px 24px; }
  .ms-l::after { display:none; }

  .spk-mag { grid-template-columns:1fr; }
  .sm-feat { grid-column:span 1; }




  .faq-g { grid-template-columns:1fr; }

  .boletin { grid-template-columns:1fr;gap:24px;padding:48px 24px; }
  .bol-ttl { font-size:var(--t-3xl); }

}

@media (max-width: 600px) {
  /* Hero compacto: menos aire, stats en 2x2 */
  .h-tag-t { font-size:var(--t-2xs); }
  .h-l { padding:32px 16px 24px; }
  /* El titular es lo primero que se ve y a 26px se quedaba corto para lo que
     tiene que sostener. A 32px sigue cabiendo la línea más larga
     ("científico del software") sin partirse. */
  .hh1, .hh3 { font-size:var(--t-4xl); }
  .hh2 { font-size:var(--t-3xl); }
  .h-desc { font-size:var(--t-sm); }
  .h-ctas { flex-direction:column; }
  .h-ctas .btn-p, .h-ctas .btn-s { width:100%;justify-content:center; }

  /* Feature strip: carrusel horizontal deslizable */
  .fstrip { display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;scrollbar-width:none; }
  .fstrip::-webkit-scrollbar { display:none; }
  .fsc { flex:0 0 31%;min-width:112px;scroll-snap-align:start;border-right:1px solid var(--line3);padding:16px 8px; }

  .s-hd { flex-direction:column;align-items:flex-start;gap:12px; }
  .s-ttl { font-size:var(--t-2xl); }
  .sec { padding:var(--sec-y) var(--sec-x); }

  .stats-h { grid-template-columns:repeat(2,1fr); }
  .sh:nth-child(2n) { border-right:none; }
  .sh:nth-child(3) { border-right:1px solid var(--line3); }

  /* Speakers: carrusel horizontal, el keynote primero */
  .spk-mag { display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;scrollbar-width:none;gap:12px;padding-bottom:6px; }
  .spk-mag::-webkit-scrollbar { display:none; }
  .sm { flex:0 0 80%;scroll-snap-align:start;padding:16px 16px; }
  .sm-feat { flex:0 0 88%;scroll-snap-align:start;order:-1;grid-template-columns:1fr;gap:12px;padding:24px 16px; }




  /* Por qué asistir: una sola columna. En 2x2 cada tarjeta quedaba en 164px
     de ancho, y con icono, título y párrafo dentro el texto salía a tres o
     cuatro palabras por renglón, que se lee a tirones. En una columna el
     icono va al lado del texto y todo cabe holgado. */
  .pq-g { grid-template-columns:1fr;gap:10px; }
  .pq-c { display:grid;grid-template-columns:40px 1fr;grid-template-rows:auto auto;column-gap:16px;padding:20px; }
  .pq-ic { width:40px;height:40px;margin-bottom:0;grid-row:1 / span 2; }
  .pq-ic svg { width:18px;height:18px; }
  .pq-t { font-size:var(--t-md);align-self:center;margin-bottom:4px; }
  .pq-s { font-size:var(--t-sm);line-height:1.65; }

  .cierre { padding:48px 16px; }
  .cierre-ttl { font-size:var(--t-2xl); }
  .cierre-cd { gap:4px; }
  .ccd-box { padding:12px 8px;min-width:0;flex:1;max-width:82px; }
  .ccd-v { font-size:var(--t-xl); }
  .ccd-sep { display:none; }

  .boletin { padding:32px 16px; }
  .bol-ttl { font-size:var(--t-2xl); }
}
</style>