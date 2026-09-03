<template>
  <div class="page">

    <AppNav />

    <!-- ENCABEZADO: qué se está comprando, siempre a la vista -->
    <header class="rg-top">
      <div class="rg-top-in">
        <div>
          <div class="pill"><div class="pill-d"></div><span class="pill-t">Registro y pago seguro</span></div>
          <h1 class="rg-title">Asegura tu lugar</h1>
          <p class="rg-sub" v-if="eventoActual">
            {{ eventoActual.titulo }} · {{ formatFecha(eventoActual.fecha) }}
            <span v-if="eventoActual.sede"> · {{ eventoActual.sede }}</span>
          </p>
          <p class="rg-sub" v-else>No hay eventos disponibles por el momento.</p>
        </div>

        <!-- Pasos: indican dónde estás y cuánto falta -->
        <nav class="pasos" aria-label="Progreso del registro">
          <button
            v-for="(p, i) in PASOS"
            :key="p.n"
            class="paso"
            :class="{ activo: paso === p.n, hecho: paso > p.n }"
            :disabled="p.n > paso"
            @click="paso = p.n"
          >
            <span class="paso-n">
              <svg v-if="paso > p.n" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <template v-else>{{ p.n }}</template>
            </span>
            <span class="paso-t">{{ p.titulo }}</span>
          </button>
        </nav>
      </div>
    </header>

    <div class="rg-body">
      <!-- ══ COLUMNA PRINCIPAL ══ -->
      <div class="rg-main">

        <!-- ── PASO 1: elegir el acceso ── -->
        <section v-show="paso === 1" class="bloque">
          <h2 class="bloque-t">¿Cómo quieres asistir?</h2>

          <div class="opciones">
            <button
              v-for="plan in planesIndividuales"
              :key="plan.i"
              class="opcion"
              :class="{ sel: planActivo === plan.i }"
              @click="planActivo = plan.i"
            >
              <span class="op-radio"></span>
              <span class="op-cuerpo">
                <span class="op-fila">
                  <span class="op-nm">{{ plan.nombre }}</span>
                  <span class="op-precio" :class="{ libre: plan.precio === 'Gratis' }">
                    {{ plan.precio === 'Gratis' ? 'Sin costo' : '$' + plan.precio }}
                    <small v-if="plan.precio !== 'Gratis'">MXN</small>
                  </span>
                </span>
                <span class="op-desc">{{ plan.desc }}</span>
                <span class="op-tags">
                  <span v-for="f in plan.feats.slice(0, 3)" :key="f" class="op-tag">{{ f }}</span>
                </span>
              </span>
            </button>
          </div>

          <!-- Paquetes: solo si la federación cargó alguno -->
          <template v-if="planesPaquete.length">
            <h2 class="bloque-t sep">¿Vienen en equipo?</h2>
            <p class="bloque-s">Varios accesos en una sola compra, más baratos que por separado.</p>
            <div class="opciones">
              <button
                v-for="(plan, k) in planesPaquete"
                :key="plan.i"
                class="opcion paq"
                :class="{ sel: planActivo === plan.i }"
                @click="planActivo = plan.i"
              >
                <span class="op-radio"></span>
                <span class="op-cuerpo">
                  <span class="op-fila">
                    <span class="op-nm">
                      {{ plan.nombre }}
                      <span class="op-chip" v-if="plan.badge">{{ plan.badge }}</span>
                    </span>
                    <span class="op-precio">
                      <s class="op-lista">${{ listaDe(paquetes[k]).toLocaleString('es-MX') }}</s>
                      ${{ Number(plan.precio).toLocaleString('es-MX') }} <small>MXN</small>
                    </span>
                  </span>
                  <span class="op-desc">
                    {{ paquetes[k].cantidadBoletos }} accesos ·
                    ≈ ${{ porPersonaDe(paquetes[k]).toLocaleString('es-MX') }} por persona
                  </span>
                  <span class="op-tags">
                    <span class="op-tag ahorro">Ahorras ${{ ahorroDe(paquetes[k]).toLocaleString('es-MX') }}</span>
                  </span>
                </span>
              </button>
            </div>
          </template>
        </section>

        <!-- ── PASO 2: datos de quien asiste ── -->
        <section v-show="paso === 2" class="bloque">
          <h2 class="bloque-t">¿Quién asiste?</h2>
          <p class="bloque-s">Usaremos tu correo para asociarte el boleto y su folio.</p>

          <div class="campos">
            <div class="campo">
              <label class="campo-l">Nombre(s) <span class="req">*</span></label>
              <input v-model="form.nombre" type="text" placeholder="Andrés" class="campo-i" />
            </div>
            <div class="campo">
              <label class="campo-l">Apellidos</label>
              <input v-model="form.apellidos" type="text" placeholder="López García" class="campo-i" />
            </div>
            <div class="campo full">
              <label class="campo-l">Correo electrónico <span class="req">*</span></label>
              <input v-model="form.correo" type="email" placeholder="correo@ejemplo.com" class="campo-i" />
            </div>
            <div class="campo">
              <label class="campo-l">Teléfono</label>
              <input v-model="form.telefono" type="tel" placeholder="+52 (443) 000-0000" class="campo-i" />
            </div>
            <div class="campo">
              <label class="campo-l">Institución</label>
              <input v-model="form.institucion" type="text" placeholder="UTM, UNAM, TEC…" class="campo-i" />
            </div>
            <div class="campo full">
              <label class="campo-l">Estado</label>
              <input v-model="form.estado" type="text" placeholder="Michoacán" class="campo-i" />
            </div>
          </div>
        </section>

        <!-- ── PASO 3: pago ── -->
        <section v-show="paso === 3" class="bloque">
          <h2 class="bloque-t">Datos de tu tarjeta</h2>
          <p class="bloque-s">
            Los datos viajan cifrados directamente a Openpay. Nuestro servidor nunca ve tu número de tarjeta.
          </p>

          <div class="campos">
            <div class="campo full">
              <label class="campo-l">Número de tarjeta</label>
              <input v-model="pago.numero" type="text" inputmode="numeric" autocomplete="cc-number"
                     placeholder="1234 5678 9012 3456" class="campo-i" />
            </div>
            <div class="campo">
              <label class="campo-l">Expiración</label>
              <input v-model="pago.expiracion" type="text" inputmode="numeric" autocomplete="cc-exp"
                     placeholder="MM / AA" class="campo-i" />
            </div>
            <div class="campo">
              <label class="campo-l">CVV</label>
              <input v-model="pago.cvv" type="text" inputmode="numeric" autocomplete="cc-csc"
                     placeholder="123" class="campo-i" />
            </div>
            <div class="campo full">
              <label class="campo-l">Nombre en la tarjeta</label>
              <input v-model="pago.nombre" type="text" autocomplete="cc-name"
                     placeholder="Como aparece en la tarjeta" class="campo-i" />
            </div>
          </div>

          <div class="sellos">
            <span class="sello">🔒 Cifrado con Openpay</span>
            <span class="sello">Visa</span>
            <span class="sello">MasterCard</span>
            <span class="sello">American Express</span>
          </div>
        </section>

        <!-- Mensaje de error del paso actual -->
        <p v-if="error" class="rg-error">{{ error }}</p>

        <!-- Navegación entre pasos -->
        <div class="navegacion">
          <button v-if="paso > 1" class="btn-atras" @click="retroceder">← Atrás</button>
          <button
            class="btn-seguir"
            :disabled="!eventoActual || procesando"
            @click="avanzar"
          >{{ textoBotón }}</button>
        </div>
      </div>

      <!-- ══ RESUMEN: acompaña los tres pasos ══ -->
      <aside class="rg-lado">
        <div class="resumen">
          <div class="res-t">Tu registro</div>

          <div class="res-ev" v-if="eventoActual">
            <div class="res-ev-nm">{{ eventoActual.titulo }}</div>
            <div class="res-ev-dt">{{ formatFecha(eventoActual.fecha) }}</div>
          </div>

          <div class="res-plan">
            <div class="res-plan-nm">{{ planSel.nombre }}</div>
            <div class="res-plan-d">{{ planSel.sumDesc }}</div>
          </div>

          <div class="res-lineas">
            <div class="res-l">
              <span>Subtotal</span>
              <span>{{ planSel.precio === 'Gratis' ? 'Sin costo' : '$' + planSel.precio + ' MXN' }}</span>
            </div>
            <div class="res-l"><span>Cargo por servicio</span><span>$0 MXN</span></div>
            <div class="res-l total">
              <span>Total</span>
              <span :class="{ libre: planSel.precio === 'Gratis' }">
                {{ planSel.precio === 'Gratis' ? 'Sin costo' : '$' + planSel.precio + ' MXN' }}
              </span>
            </div>
          </div>

          <div class="res-incl">
            <div class="res-incl-t">Incluye</div>
            <div class="res-incl-i" v-for="f in planSel.feats" :key="f">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </div>
          </div>

          <p class="res-nota">Puedes comprar sin crear una cuenta. El folio te aparece al instante.</p>
        </div>
      </aside>
    </div>

    <!-- Barra de acción fija en móvil: el resumen queda muy abajo -->
    <div class="rg-barra">
      <div class="rg-barra-p">
        <span class="rg-barra-l">Total</span>
        <span class="rg-barra-n">{{ planSel.precio === 'Gratis' ? 'Sin costo' : '$' + planSel.precio }}</span>
      </div>
      <button class="rg-barra-b" :disabled="!eventoActual || procesando" @click="avanzar">{{ textoBotón }}</button>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import api from '../services/api'
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import { pagarConTarjeta, nuevaReferencia } from '../services/pago'

const router = useRouter()

const PASOS = [
  { n: 1, titulo: 'Acceso' },
  { n: 2, titulo: 'Tus datos' },
  { n: 3, titulo: 'Pago' },
]

const paso = ref(1)
const planActivo = ref(0)
const eventoActual = ref(null)
const paquetes = ref([])
const error = ref('')
const procesando = ref(false)

const form = ref({ nombre: '', apellidos: '', correo: '', telefono: '', institucion: '', estado: '' })
const pago = ref({ numero: '', expiracion: '', cvv: '', nombre: '' })

// timeZone:'UTC' evita que la fecha del evento se muestre un día antes en México
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  })
}

// Se registra al evento más próximo que todavía no ocurre. Si ya pasaron todos,
// se toma el primero de la lista para no dejar la página sin contexto.
const cargarEvento = async () => {
  const res = await api.get('/eventos')
  const ahora = Date.now()
  const futuros = res.data.filter((e) => new Date(e.fecha).getTime() >= ahora)
  eventoActual.value = futuros[0] || res.data[0] || null
}

// Paquetes activos del evento. Si la federación no ha cargado ninguno, el
// arreglo queda vacío y la sección de paquetes simplemente no se muestra.
const cargarPaquetes = async () => {
  if (!eventoActual.value) return
  try {
    const res = await api.get('/paquetes', { params: { idEvento: eventoActual.value.idEvento } })
    paquetes.value = res.data
  } catch {
    paquetes.value = []
  }
}

onMounted(async () => {
  await cargarEvento()
  await cargarPaquetes()
})

// Ahorro de un paquete frente a comprar esos boletos por separado. Los dos
// números salen de la base de datos, así que no puede quedar desfasado.
const ahorroDe = (paquete) => {
  const porSeparado = Number(paquete.precioEvento) * paquete.cantidadBoletos
  return Math.round(porSeparado - Number(paquete.precio))
}
const listaDe = (paquete) => Math.round(Number(paquete.precioEvento) * paquete.cantidadBoletos)
const porPersonaDe = (paquete) => Math.round(Number(paquete.precio) / paquete.cantidadBoletos)

// El precio sale del evento: es el mismo que se le cobra a la tarjeta.
const precioEvento = computed(() => {
  if (!eventoActual.value) return null
  return Math.round(Number(eventoActual.value.precio))
})

// Solo hay dos formas reales de entrar: comprando el boleto o presentando una
// ponencia aprobada. El acceso de ponente no se cobra aquí, se solicita.
const planes = computed(() => [
  {
    precio: precioEvento.value === null ? '—' : String(precioEvento.value),
    nombre: 'Acceso General',
    desc: 'Para estudiantes, profesionales, docentes e investigadores.',
    sumDesc: 'Un acceso al congreso',
    feats: ['Todas las sesiones del programa', 'Talleres del congreso', 'Constancia de participación', 'Boleto con folio en "Mis boletos"'],
  },
  {
    precio: 'Gratis',
    nombre: 'Acceso Ponente',
    desc: 'Para quienes presenten una ponencia aprobada por el comité académico.',
    sumDesc: 'Requiere aprobación del comité',
    feats: ['Acceso completo al evento', 'Espacio de presentación propio', 'Constancia de ponente'],
  },
  // Los paquetes cargados por la federación se suman como opciones más. Al
  // llevar idPaquete, el cobro se resuelve por paquete y no por boleto suelto.
  ...paquetes.value.map((p) => ({
    idPaquete: p.idPaquete,
    badge: p.destacado ? 'Más elegido' : null,
    precio: String(Math.round(Number(p.precio))),
    nombre: p.nombre,
    desc: p.descripcion || `Incluye ${p.cantidadBoletos} accesos al congreso en una sola compra.`,
    sumDesc: `${p.cantidadBoletos} accesos al congreso`,
    feats: [
      `${p.cantidadBoletos} accesos al congreso`,
      `Ahorras $${ahorroDe(p)} frente a comprarlos por separado`,
      'Constancia de participación para cada asistente',
      'Boleto con folio en "Mis boletos"',
    ],
  })),
])

// Las opciones individuales y los paquetes se listan por separado, pero
// comparten el mismo índice de selección para que el resumen y el cobro
// funcionen igual con cualquiera.
const planesIndividuales = computed(() =>
  planes.value.map((p, i) => ({ ...p, i })).filter((p) => !p.idPaquete)
)
const planesPaquete = computed(() =>
  planes.value.map((p, i) => ({ ...p, i })).filter((p) => p.idPaquete)
)
const planSel = computed(() => planes.value[planActivo.value] || planes.value[0])

// El acceso de ponente no se paga: se solicita. Por eso su botón no dice
// "continuar" sino que lleva directo al formulario de propuesta.
const esPonente = computed(() => planSel.value?.precio === 'Gratis')

const textoBotón = computed(() => {
  if (paso.value === 1) return esPonente.value ? 'Enviar mi propuesta →' : 'Continuar →'
  if (paso.value === 2) return 'Ir al pago →'
  return procesando.value ? 'Procesando…' : 'Confirmar y pagar'
})

// Cambiar de opción a mitad del flujo puede invalidar el paso en el que estás
// (por ejemplo, elegir ponente estando en el pago), así que se vuelve al inicio.
// Referencia del intento de compra: la misma en todos los reintentos, para que
// Openpay pueda rechazar un cobro repetido. Se renueva al cambiar de opción,
// porque a partir de ahí se está comprando otra cosa.
const referencia = ref(nuevaReferencia())

watch(planActivo, () => {
  error.value = ''
  referencia.value = nuevaReferencia()
  if (paso.value > 1) paso.value = 1
})

const retroceder = () => {
  error.value = ''
  paso.value = Math.max(1, paso.value - 1)
}

const avanzar = async () => {
  error.value = ''

  if (!eventoActual.value) {
    error.value = 'No hay ningún evento disponible para registrarte en este momento.'
    return
  }

  // Paso 1 → el ponente sale del flujo de compra hacia el formulario
  if (paso.value === 1) {
    if (esPonente.value) {
      router.push({ name: 'nosotros', query: { asunto: 'Propuesta de ponencia' }, hash: '#contacto' })
      return
    }
    paso.value = 2
    return
  }

  // Paso 2 → sin sesión iniciada se compra como invitado: nombre y correo
  if (paso.value === 2) {
    if (!form.value.nombre.trim()) {
      error.value = 'Necesitamos tu nombre para asociarte el boleto.'
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.correo)) {
      error.value = 'Ingresa un correo válido: ahí queda registrado tu folio.'
      return
    }
    paso.value = 3
    return
  }

  // Paso 3 → cobro
  if (!pago.value.numero.trim() || !pago.value.expiracion.trim() || !pago.value.cvv.trim()) {
    error.value = 'Completa los datos de tu tarjeta.'
    return
  }

  // La expiración se captura como "MM / AA"; el servicio la espera separada
  const [mes, anio] = pago.value.expiracion.split('/').map((p) => p?.trim())

  procesando.value = true
  try {
    const plan = planSel.value
    await pagarConTarjeta({
      tarjeta: { numero: pago.value.numero, nombre: pago.value.nombre, mes, anio, cvv: pago.value.cvv },
      referencia: referencia.value,
      idEvento:  plan.idPaquete ? undefined : eventoActual.value.idEvento,
      cantidad:  plan.idPaquete ? undefined : 1,
      idPaquete: plan.idPaquete,
      nombre: `${form.value.nombre} ${form.value.apellidos}`.trim(),
      correo: form.value.correo,
    })

    if (localStorage.getItem('token')) {
      router.push({ name: 'mis-boletos' })
    } else {
      router.push({ name: 'crear-cuenta' })
    }
  } catch (err) {
    error.value = err.message
  } finally {
    procesando.value = false
  }
}
</script>

<style scoped>
.page { min-height:100vh;background:var(--bg);padding-top:60px; }

/* ── ENCABEZADO ────────────────────────────────────────────────────────── */
.rg-top { border-bottom:1px solid var(--line3);background:linear-gradient(160deg,var(--bg),var(--bg3)); }
.rg-top-in { max-width:1140px;margin:0 auto;padding:var(--sec-y) var(--sec-x);display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap; }
.pill { display:inline-flex;align-items:center;gap:8px;background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px;margin-bottom:16px; }
.pill-d { width:5px;height:5px;border-radius:50%;background:var(--teal);animation:pulse 2.5s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(45,212,180,.4)}50%{box-shadow:0 0 0 6px rgba(45,212,180,0)} }
.pill-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;color:var(--teal);letter-spacing:.1em;text-transform:uppercase; }
.rg-title { font-size:var(--t-4xl);font-weight:800;letter-spacing:-.045em;line-height:1.05;color:var(--white);margin-bottom:10px; }
.rg-sub { font-size:var(--t-md);color:var(--w3);font-weight:300; }

/* Indicador de pasos */
.pasos { display:flex;align-items:center;gap:8px; }
.paso { display:flex;align-items:center;gap:8px;background:none;border:none;padding:8px 12px;border-radius:100px;cursor:pointer;font-family:var(--f);transition:background .15s; }
.paso:disabled { cursor:default;opacity:.45; }
.paso:not(:disabled):hover { background:var(--w5); }
.paso-n { width:26px;height:26px;flex-shrink:0;border-radius:50%;border:1px solid var(--line2);display:flex;align-items:center;justify-content:center;font-family:var(--fm);font-size:var(--t-xs);font-weight:600;color:var(--w3);transition:all .18s; }
.paso-n svg { width:13px;height:13px;fill:none;stroke:var(--bg);stroke-width:3;stroke-linecap:round;stroke-linejoin:round; }
.paso-t { font-size:var(--t-sm);font-weight:500;color:var(--w3);white-space:nowrap; }
.paso.activo .paso-n { border-color:var(--teal);background:var(--teal-g);color:var(--teal); }
.paso.activo .paso-t { color:var(--white);font-weight:700; }
.paso.hecho .paso-n { border-color:var(--teal);background:var(--teal); }
.paso.hecho .paso-t { color:var(--teal); }

/* ── CUERPO ────────────────────────────────────────────────────────────── */
.rg-body { max-width:1140px;margin:0 auto;padding:var(--sec-y) var(--sec-x) calc(var(--sec-y) + var(--s5));display:grid;grid-template-columns:1fr 340px;gap:32px;align-items:start; }
.rg-main { min-width:0; }

.bloque-t { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.03em;margin-bottom:6px; }
.bloque-t.sep { margin-top:40px; }
.bloque-s { font-size:var(--t-sm);color:var(--w3);font-weight:300;margin-bottom:20px; }

/* ── Opciones de acceso ───────────────────────────────────────────────── */
.opciones { display:flex;flex-direction:column;gap:12px;margin-top:16px; }
.opcion { display:flex;gap:16px;text-align:left;width:100%;background:var(--card);border:1px solid var(--line2);border-radius:14px;padding:20px;cursor:pointer;font-family:var(--f);transition:border-color .16s,background .16s; }
.opcion:hover { border-color:var(--teal-b); }
.opcion.sel { border-color:var(--teal);background:var(--bg3); }

/* Círculo de selección: comunica que es una elección única, no un botón más */
.op-radio { width:20px;height:20px;flex-shrink:0;margin-top:2px;border-radius:50%;border:2px solid var(--line2);transition:all .16s;position:relative; }
.opcion.sel .op-radio { border-color:var(--teal); }
.opcion.sel .op-radio::after { content:'';position:absolute;inset:3px;border-radius:50%;background:var(--teal); }

.op-cuerpo { display:flex;flex-direction:column;gap:8px;flex:1;min-width:0; }
.op-fila { display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap; }
.op-nm { font-size:var(--t-lg);font-weight:700;color:var(--white);letter-spacing:-.02em; }
.op-chip { display:inline-block;margin-left:8px;background:var(--teal);color:var(--bg);font-family:var(--fm);font-size:var(--t-2xs);font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:100px;vertical-align:middle; }
.op-precio { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.035em;white-space:nowrap; }
.op-precio small { font-size:var(--t-xs);font-weight:400;color:var(--w4); }
.op-precio.libre { color:var(--teal);font-size:var(--t-lg); }
.op-lista { font-size:var(--t-sm);font-weight:400;color:var(--w4);margin-right:8px; }
.op-desc { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.6; }
.op-tags { display:flex;flex-wrap:wrap;gap:6px; }
.op-tag { font-size:var(--t-xs);color:var(--w3);background:var(--w5);border:1px solid var(--line3);border-radius:100px;padding:4px 12px; }
.op-tag.ahorro { background:var(--teal-g);border-color:var(--teal-b);color:var(--teal);font-weight:600; }

/* ── Campos ───────────────────────────────────────────────────────────── */
.campos { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px; }
.campo { display:flex;flex-direction:column;gap:8px;min-width:0; }
.campo.full { grid-column:1 / -1; }
.campo-l { font-size:var(--t-xs);font-weight:500;color:var(--w3);letter-spacing:.04em;text-transform:uppercase; }
.req { color:var(--teal); }
.campo-i { background:var(--bg3);border:1px solid var(--line2);border-radius:10px;padding:14px;font-family:var(--f);font-size:var(--t-md);color:var(--white);outline:none;transition:border-color .15s,background .15s; }
.campo-i:focus { border-color:var(--teal);background:var(--bg2); }
.campo-i::placeholder { color:var(--w4); }

.sellos { display:flex;flex-wrap:wrap;gap:8px;margin-top:20px; }
.sello { font-size:var(--t-xs);color:var(--w3);background:var(--w5);border:1px solid var(--line3);border-radius:8px;padding:6px 12px; }

.rg-error { margin-top:20px;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);color:#F87171;border-radius:10px;padding:14px 16px;font-size:var(--t-sm); }

/* ── Navegación entre pasos ───────────────────────────────────────────── */
.navegacion { display:flex;gap:12px;margin-top:32px; }
.btn-atras { min-height:52px;padding:0 24px;border-radius:12px;background:var(--w5);border:1px solid var(--line2);color:var(--w2);font-family:var(--f);font-size:var(--t-md);font-weight:500;cursor:pointer;transition:all .15s; }
.btn-atras:hover { border-color:var(--teal-b);color:var(--white); }
.btn-seguir { flex:1;min-height:52px;padding:0 32px;border-radius:12px;background:var(--teal);border:none;color:var(--bg);font-family:var(--f);font-size:var(--t-md);font-weight:700;cursor:pointer;transition:background .15s; }
.btn-seguir:hover:not(:disabled) { background:var(--teal2); }
.btn-seguir:disabled { opacity:.45;cursor:not-allowed; }

/* ── Resumen lateral ──────────────────────────────────────────────────── */
.rg-lado { position:sticky;top:84px; }
.resumen { background:var(--card);border:1px solid var(--line2);border-radius:16px;padding:24px; }
.res-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);margin-bottom:16px; }
.res-ev { padding-bottom:16px;border-bottom:1px solid var(--line3);margin-bottom:16px; }
.res-ev-nm { font-size:var(--t-md);font-weight:700;color:var(--white);line-height:1.35;margin-bottom:4px; }
.res-ev-dt { font-size:var(--t-sm);color:var(--w3);font-weight:300; }
.res-plan { margin-bottom:16px; }
.res-plan-nm { font-size:var(--t-md);font-weight:600;color:var(--teal);margin-bottom:2px; }
.res-plan-d { font-size:var(--t-sm);color:var(--w3);font-weight:300; }
.res-lineas { border-top:1px solid var(--line3);padding-top:16px;display:flex;flex-direction:column;gap:10px; }
.res-l { display:flex;justify-content:space-between;font-size:var(--t-sm);color:var(--w3); }
.res-l.total { border-top:1px solid var(--line3);padding-top:12px;margin-top:4px;font-size:var(--t-lg);font-weight:800;color:var(--white); }
.res-l.total .libre { color:var(--teal); }
.res-incl { margin-top:20px;padding-top:16px;border-top:1px solid var(--line3);display:flex;flex-direction:column;gap:10px; }
.res-incl-t { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--w4);margin-bottom:2px; }
.res-incl-i { display:flex;align-items:flex-start;gap:8px;font-size:var(--t-sm);color:var(--w2);font-weight:300;line-height:1.5; }
.res-incl-i svg { width:14px;height:14px;flex-shrink:0;margin-top:3px;fill:none;stroke:var(--teal);stroke-width:3;stroke-linecap:round;stroke-linejoin:round; }
.res-nota { margin-top:20px;font-size:var(--t-xs);color:var(--w4);line-height:1.6; }

/* ── Barra fija en móvil ──────────────────────────────────────────────── */
.rg-barra { display:none; }

/* ── RESPONSIVE ───────────────────────────────────────────────────────── */
@media (max-width: 968px) {
  .rg-top-in { flex-direction:column;align-items:flex-start;gap:24px; }
  /* Los pasos se deslizan si no caben, en vez de apretujarse */
  .pasos { width:100%;overflow-x:auto;scrollbar-width:none; }
  .pasos::-webkit-scrollbar { display:none; }
  /* Altura cómoda para el pulgar: los pasos también se pueden tocar */
  .paso { padding:8px 10px;min-height:44px; }
  .paso-t { font-size:var(--t-xs); }

  .rg-body { grid-template-columns:1fr;gap:24px;padding-bottom:104px; }
  /* El resumen deja de ser columna y pasa a ser un bloque más, debajo */
  .rg-lado { position:static;order:2; }
  .resumen { padding:20px; }

  /* La navegación vive en la barra fija; aquí solo queda el "atrás" */
  .navegacion .btn-seguir { display:none; }
  .navegacion { margin-top:24px; }
  .btn-atras { flex:1; }

  .rg-barra {
    display:flex;align-items:center;justify-content:space-between;gap:16px;
    position:fixed;left:0;right:0;bottom:0;z-index:900;
    background:rgba(10,17,25,.97);backdrop-filter:blur(20px);
    border-top:1px solid var(--teal-b);
    padding:12px 16px calc(12px + env(safe-area-inset-bottom));
    box-shadow:0 -12px 32px rgba(0,0,0,.45);
  }
  .rg-barra-p { display:flex;flex-direction:column;gap:2px;line-height:1.1; }
  .rg-barra-l { font-family:var(--fm);font-size:var(--t-2xs);font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--w4); }
  .rg-barra-n { font-size:var(--t-xl);font-weight:800;color:var(--white);letter-spacing:-.03em; }
  .rg-barra-b { min-height:48px;padding:0 24px;border-radius:10px;background:var(--teal);border:none;color:var(--bg);font-family:var(--f);font-size:var(--t-md);font-weight:700;cursor:pointer;white-space:nowrap; }
  .rg-barra-b:disabled { opacity:.45; }
}

@media (max-width: 560px) {
  .campos { grid-template-columns:1fr; }
  .campo.full { grid-column:1; }
  .opcion { padding:16px;gap:12px; }
  .op-fila { flex-direction:column;gap:4px; }
}
</style>
