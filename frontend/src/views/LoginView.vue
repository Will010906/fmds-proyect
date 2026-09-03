<template>
  <div class="auth-bg">
    <div class="auth-card">

      <div class="auth-brand">
        <span class="auth-logo">FMDS</span>
        <span class="auth-tag">Panel de acceso</span>
      </div>

      <div v-if="sesionExpirada" class="auth-aviso">Tu sesión expiró. Vuelve a iniciar sesión para continuar.</div>
      <div v-if="error" class="auth-error">{{ error }}</div>

      <div class="auth-fields">
        <div class="field">
          <label class="field-label">Correo electrónico</label>
          <input v-model="correo" type="email" placeholder="admin@fmds.mx" class="field-input" />
        </div>
        <div class="field">
          <label class="field-label">Contraseña</label>
          <input v-model="contrasenia" type="password" placeholder="••••••••" class="field-input" />
        </div>
      </div>

      <button @click="handleLogin" :disabled="loading" class="btn-primary">
        {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
      </button>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <router-link :to="{ name: 'crear-cuenta', query: $route.query }" class="auth-link">Regístrate</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router     = useRouter()
const route      = useRoute()
const correo     = ref('')
const contrasenia = ref('')
const error      = ref('')
const loading    = ref(false)
const sesionExpirada = route.query.expirada === '1'

const handleLogin = async () => {
  error.value   = ''
  loading.value = true
  try {
    const res = await api.post('/auth/login', {
      correo: correo.value,
      contrasenia: contrasenia.value,
    })
    localStorage.setItem('token',  res.data.token)
    localStorage.setItem('rol',    res.data.usuario.rol)
    localStorage.setItem('nombre', res.data.usuario.nombre)
    localStorage.setItem('correo', res.data.usuario.correo)

    if (route.query.redirect) {
      router.push(route.query.redirect)
    } else if (res.data.usuario.rol === 'Administrador') {
      router.push({ name: 'admin' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding:24px;
}

.auth-card {
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 20px;
  padding:48px 32px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap:24px;
}

.auth-brand {
  display: flex;
  flex-direction: column;
  gap:4px;
}

.auth-logo {
  font-family: var(--f);
  font-size:var(--t-2xl);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -.04em;
}

.auth-tag {
  font-family: var(--fm);
  font-size:var(--t-xs);
  color: var(--teal);
  letter-spacing: .1em;
  text-transform: uppercase;
}

.auth-error {
  background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.3);
  color: #f87171;
  padding:12px 16px;
  border-radius: 10px;
  font-size:var(--t-sm);
}

.auth-aviso {
  background: var(--teal-g);
  border: 1px solid var(--teal-b);
  color: var(--teal);
  padding:12px 16px;
  border-radius: 10px;
  font-size:var(--t-sm);
}

.auth-fields {
  display: flex;
  flex-direction: column;
  gap:16px;
}

.field { display: flex; flex-direction: column; gap:4px; }

.field-label {
  font-size:var(--t-sm);
  font-weight: 500;
  color: var(--w3);
  letter-spacing: .02em;
}

.field-input {
  background: var(--bg3);
  border: 1px solid var(--line2);
  border-radius: 10px;
  padding:12px 16px;
  font-family: var(--f);
  font-size:var(--t-md);
  color: var(--white);
  outline: none;
  transition: border-color .15s;
  width: 100%;
}

.field-input:focus { border-color: var(--teal-b); }
.field-input::placeholder { color: var(--w4); }

.btn-primary {
  background: var(--teal);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  padding:12px;
  font-family: var(--f);
  font-size:var(--t-md);
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
  width: 100%;
}

.btn-primary:hover { background: var(--teal2); }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }

.auth-footer {
  text-align: center;
  font-size:var(--t-sm);
  color: var(--w3);
}

.auth-link {
  color: var(--teal);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .auth-card { padding:32px 24px; border-radius: 16px; }
  .auth-logo { font-size:var(--t-2xl); }
}
</style>