<template>
  <span ref="el">{{ prefix }}{{ formateado }}{{ suffix }}</span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  value:    { type: Number, required: true },
  prefix:   { type: String, default: '' },
  suffix:   { type: String, default: '' },
  duration: { type: Number, default: 1400 },
})

const el = ref(null)
const actual = ref(0)
const formateado = computed(() => Math.round(actual.value).toLocaleString('en-US'))

let raf = null
let observer = null
let visible = false // true una vez que el contador entró al viewport

const animar = () => {
  if (raf) cancelAnimationFrame(raf)
  const desde = actual.value
  const hasta = props.value
  // En una pestaña en segundo plano el navegador congela requestAnimationFrame:
  // se muestra la cifra final directamente en lugar de dejarla en cero.
  if (document.hidden) {
    actual.value = hasta
    return
  }
  const inicio = performance.now()
  const paso = (ahora) => {
    const p = Math.min((ahora - inicio) / props.duration, 1)
    actual.value = desde + (hasta - desde) * (1 - Math.pow(1 - p, 3))
    if (p < 1) raf = requestAnimationFrame(paso)
  }
  raf = requestAnimationFrame(paso)
}

// Los valores que vienen de la API llegan después del montaje: si el contador
// ya se animó (con el valor inicial), se vuelve a animar hacia la cifra real.
watch(() => props.value, () => {
  if (visible) animar()
})

onMounted(() => {
  // Sin IntersectionObserver, o con la pestaña en segundo plano (donde el
  // navegador no entrega las notificaciones del observador), se muestra la
  // cifra sin animar para que nunca se quede en cero.
  if (!('IntersectionObserver' in window) || document.hidden) {
    visible = true
    actual.value = props.value
    return
  }
  observer = new IntersectionObserver((entradas) => {
    if (entradas.some(e => e.isIntersecting)) {
      visible = true
      animar()
      observer.disconnect()
    }
  }, { threshold: 0.4 })
  observer.observe(el.value)
})

onUnmounted(() => {
  observer?.disconnect()
  if (raf) cancelAnimationFrame(raf)
})
</script>
