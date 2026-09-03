<template>
  <div class="page">

    <AppNav />

    <div class="nf-wrap">
      <div class="nf-code">404</div>
      <h1 class="nf-title"><strong>Página</strong> <em>no encontrada</em></h1>
      <p class="nf-sub">La dirección que buscas no existe o fue movida. Revisa la URL o vuelve al inicio.</p>
      <div class="nf-actions">
        <router-link to="/" class="nf-btn">Volver al inicio ⟶</router-link>
        <router-link to="/eventos" class="nf-ghost">Ver eventos</router-link>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

.nf-wrap { max-width:640px;margin:0 auto;padding:var(--sec-y) var(--sec-x) calc(var(--sec-y) + var(--s5));text-align:center; }
.nf-code { font-family:var(--fm);font-size:var(--t-md);font-weight:600;color:var(--teal);letter-spacing:.3em;margin-bottom:20px; }
.nf-title { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.05em;line-height:1.05;margin-bottom:18px; }
.nf-title strong { color:var(--white); }
.nf-title em { font-family:var(--fs);font-style:italic;font-weight:400;color:var(--teal); }
.nf-sub { font-size:var(--t-md);color:var(--w3);font-weight:300;margin-bottom:36px; }

.nf-actions { display:flex;gap:12px;justify-content:center;flex-wrap:wrap; }
.nf-btn { background:var(--teal);color:var(--bg);border:none;border-radius:10px;padding:12px 32px;font-family:var(--f);font-size:var(--t-sm);font-weight:700;cursor:pointer;transition:background .15s;text-decoration:none;display:inline-block; }
.nf-btn:hover { background:var(--teal2); }
.nf-ghost { background:var(--w5);border:1px solid var(--line2);color:var(--w2);border-radius:10px;padding:12px 24px;font-family:var(--f);font-size:var(--t-sm);font-weight:500;cursor:pointer;transition:all .15s;text-decoration:none;display:inline-block; }
.nf-ghost:hover { border-color:var(--teal-b);color:var(--white); }

@media (max-width: 600px) {
  .nf-wrap { padding:var(--sec-y) var(--sec-x) calc(var(--sec-y) + var(--s5)); }
  .nf-title { font-size:var(--t-4xl); }
}
</style>
