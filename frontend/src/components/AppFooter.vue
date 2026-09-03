<template>
  <footer class="footer">
    <div class="ft-main">
      <div class="ft-brand">
        <img src="/FMDSlogo.png" alt="FMDS" style="height:48px;margin-bottom:14px;" />
        <p class="ft-tag">Federación Mexicana de Desarrolladores de Software.</p>
      </div>
      <div class="ft-col">
        <div class="ft-lbl">El evento</div>
        <div class="ft-lnks">
          <router-link to="/eventos">Congresos 2026</router-link>
          <router-link to="/agenda">Agenda completa</router-link>
          <router-link to="/speakers">Speakers</router-link>
        </div>
      </div>
      <div class="ft-col">
        <div class="ft-lbl">Conocimiento</div>
        <div class="ft-lnks">
          <router-link to="/cursos">Cursos en línea</router-link>
          <router-link to="/galeria">Galería</router-link>
          <router-link :to="{ name: 'nosotros', query: { asunto: 'Propuesta de ponencia' }, hash: '#contacto' }">Ser ponente</router-link>
        </div>
      </div>
      <div class="ft-col">
        <div class="ft-lbl">Federación</div>
        <div class="ft-lnks">
          <router-link to="/nosotros">Quiénes somos</router-link>
          <router-link :to="{ name: 'nosotros', hash: '#contacto' }">Contacto</router-link>
        </div>
      </div>
      <div class="ft-col">
        <div class="ft-lbl">Tu cuenta</div>
        <div class="ft-lnks">
          <router-link to="/registro">Registro y pago</router-link>
          <router-link to="/crear-cuenta">Crear cuenta</router-link>
          <router-link to="/mis-boletos">Mis boletos</router-link>
        </div>
      </div>
      <div class="ft-col">
        <div class="ft-lbl">Contacto</div>
        <div class="ft-ct-col">
          <div class="ft-ct">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            contacto@fmds.mx
          </div>
          <div class="ft-ct">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Morelia, Michoacán · México
          </div>
          <div class="ft-ct">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Lun-Vie · 9:00–18:00 hrs
          </div>
        </div>
      </div>
    </div>

    <div class="ft-bot">
      <span class="ft-copy">© 2026 FMDS · Federación Mexicana de Desarrolladores de Software · Todos los derechos reservados</span>
      <div class="ft-legal">
        <a>Privacidad</a>
        <a>Términos</a>
        <a>Cookies</a>
      </div>
      <div class="ft-badge"><div class="ft-bd"></div><span class="ft-bs">fmds.mx</span></div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background:var(--bg2);border-top:1px solid var(--line3); }
.ft-main { display:grid;grid-template-columns:180px repeat(4, 1fr) 1.3fr;gap:32px;padding:48px 48px 32px;border-bottom:1px solid var(--line3); }
.ft-brand { display:flex;flex-direction:column; }
.ft-tag { font-size:var(--t-sm);color:var(--w4);font-weight:300;line-height:1.8;max-width:180px; }
.ft-col { display:flex;flex-direction:column;gap:16px; }
.ft-lbl { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4); }
.ft-lnks { display:flex;flex-direction:column;gap:8px; }
.ft-lnks a { font-size:var(--t-sm);color:var(--w3);text-decoration:none;font-weight:300;transition:color .15s;cursor:pointer; }
.ft-lnks a:hover { color:var(--teal); }
.ft-ct-col { display:flex;flex-direction:column;gap:12px; }
.ft-ct { display:flex;align-items:flex-start;gap:8px;font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.55; }
.ft-ct svg { width:13px;height:13px;fill:none;stroke:var(--teal);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;margin-top:2px; }

.ft-bot { display:flex;justify-content:space-between;align-items:center;padding:16px 48px; }
.ft-copy { font-size:var(--t-xs);color:var(--w4); }
.ft-legal { display:flex;gap:16px; }
.ft-legal a { font-size:var(--t-xs);color:var(--w4);text-decoration:none;cursor:pointer;transition:color .15s; }
.ft-legal a:hover { color:var(--teal); }
.ft-badge { display:flex;align-items:center;gap:4px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px; }
.ft-bd { width:5px;height:5px;border-radius:50%;background:var(--teal); }
.ft-bs { font-family:var(--fm);font-size:var(--t-2xs);color:var(--teal);letter-spacing:.06em; }

@media (max-width: 968px) {
  .ft-main { grid-template-columns:1fr 1fr;gap:32px;padding:32px 24px 32px; }
  .ft-bot { flex-direction:column;gap:12px;padding:16px 24px;text-align:center; }
}
@media (max-width: 520px) {
  /* Compacto: la marca ocupa el ancho y las columnas quedan en 2x2 */
  .ft-main { gap:24px 16px;padding:32px 16px 24px; }
  .ft-brand { grid-column:1 / -1;flex-direction:row;align-items:center;gap:12px; }
  .ft-brand img { margin-bottom:0 !important;height:36px !important; }
  .ft-tag { max-width:none; }
  .ft-col { gap:8px; }
  .ft-lnks { gap:8px; }
  .ft-lnks a { font-size:var(--t-sm); }
  .ft-bot { padding:12px 16px;gap:8px; }
}
</style>
