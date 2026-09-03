<template>
  <div class="auth-bg">
    <div class="auth-card">

      <div class="auth-brand">
        <span class="auth-logo">FMDS</span>
        <span class="auth-tag">Crear cuenta</span>
      </div>

      <div v-if="error" class="auth-error">{{ error }}</div>

      <div class="auth-fields">
        <div class="field">
          <label class="field-label">Nombre completo</label>
          <input v-model="nombre" type="text" placeholder="Andrés López" class="field-input" />
        </div>
        <div class="field">
          <label class="field-label">Correo electrónico</label>
          <input v-model="correo" type="email" placeholder="tucorreo@ejemplo.com" class="field-input" />
        </div>
        <div class="field">
          <label class="field-label">Contraseña</label>
          <input v-model="contrasenia" type="password" placeholder="Mínimo 6 caracteres" class="field-input" />
        </div>
        <div class="field">
          <label class="field-label">Confirmar contraseña</label>
          <input v-model="confirmar" type="password" placeholder="••••••••" class="field-input" />
        </div>
      </div>

      <button @click="handleRegistro" :disabled="loading" class="btn-primary">
        {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
      </button>

      <p class="auth-footer">
        ¿Ya tienes cuenta?
        <router-link :to="{ name: 'login', query: $route.query }" class="auth-link">Inicia sesión</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router      = useRouter()
const route       = useRoute()
const nombre      = ref('')
const correo      = ref('')
const contrasenia = ref('')
const confirmar   = ref('')
const error       = ref('')
const loading     = ref(false)

const handleRegistro = async () => {
  error.value = ''

  if (!nombre.value || !correo.value || !contrasenia.value) {
    error.value = 'Completa todos los campos'
    return
  }
  if (contrasenia.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  if (contrasenia.value !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  try {
    const res = await api.post('/auth/registro', {
      nombre: nombre.value,
      correo: correo.value,
      contrasenia: contrasenia.value,
    })
    localStorage.setItem('token',  res.data.token)
    localStorage.setItem('rol',    res.data.usuario.rol)
    localStorage.setItem('nombre', res.data.usuario.nombre)
    localStorage.setItem('correo', res.data.usuario.correo)

    router.push(route.query.redirect || { name: 'home' })
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al crear la cuenta'
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
