import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// v-reveal: la sección aparece con una transición suave al entrar al viewport
app.directive('reveal', {
  mounted(el) {
    if (!('IntersectionObserver' in window)) return
    el.classList.add('reveal')
    const observer = new IntersectionObserver((entradas) => {
      if (entradas.some(e => e.isIntersecting)) {
        el.classList.add('reveal-visible')
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(el)
  },
})

// v-carrusel: quita el desvanecido del borde derecho cuando ya no queda nada
// por desplazar. Sin esto la tira siempre se vería cortada, incluso al final,
// y daría a entender que hay más contenido cuando ya no lo hay.
app.directive('carrusel', {
  mounted(el) {
    const revisar = () => {
      const restante = el.scrollWidth - el.clientWidth - el.scrollLeft
      el.classList.toggle('fin', restante <= 4)
    }
    revisar()
    el.addEventListener('scroll', revisar, { passive: true })
    // El contenido llega de la API después del montaje, así que hay que
    // recalcular cuando cambia el tamaño del contenedor o de sus hijos.
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(revisar)
      ro.observe(el)
      el._roCarrusel = ro
    }
    el._revisarCarrusel = revisar
  },
  updated(el) {
    el._revisarCarrusel?.()
  },
  unmounted(el) {
    el._roCarrusel?.disconnect()
    if (el._revisarCarrusel) el.removeEventListener('scroll', el._revisarCarrusel)
  },
})

app.use(router)

app.mount('#app')
