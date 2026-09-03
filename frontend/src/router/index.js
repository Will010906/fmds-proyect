import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/crear-cuenta',
      name: 'crear-cuenta',
      component: () => import('../views/CrearCuentaView.vue'),
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: () => import('../views/EventosView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, role: 'Administrador' },
    },
    {
      path: '/evento/:id',
      name: 'evento',
      component: () => import('../views/EventoDetalleView.vue'),
    },
    {
      path: '/checkout/:idEvento',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
    },
    {
  path: '/agenda',
  name: 'agenda',
  component: () => import('../views/AgendaView.vue'),
},
{
  path: '/registro',
  name: 'registro',
  component: () => import('../views/RegistroView.vue'),
},
{
  path: '/speakers',
  name: 'speakers',
  component: () => import('../views/SpeakersView.vue'),
},
{
  path: '/cursos',
  name: 'cursos',
  component: () => import('../views/CursosView.vue'),
},
{
  path: '/galeria',
  name: 'galeria',
  component: () => import('../views/GaleriaView.vue'),
},
{
  path: '/nosotros',
  name: 'nosotros',
  component: () => import('../views/NosotrosView.vue'),
},
{
  path: '/mis-boletos',
  name: 'mis-boletos',
  component: () => import('../views/MisBoletosView.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
},
  ],
  // Al navegar con ancla (#contacto) se baja a esa sección; en el resto de
  // los casos la página nueva empieza desde arriba.
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 70 }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})



// Guard de navegación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const rol = localStorage.getItem('rol')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.role && rol !== to.meta.role) {
    return next({ name: 'home' })
  }

  next()
})

export default router