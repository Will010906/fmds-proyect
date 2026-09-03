<template>
  <div class="page">

    <nav class="nav">
      <span class="nav-logo">FMDS <span class="nav-badge">Admin</span></span>
      <div class="nav-end">
        <span class="nav-user">{{ nombre }}</span>
        <button @click="logout" class="btn-ghost-sm">Cerrar sesión</button>
      </div>
    </nav>

    <div class="admin-wrap">

      <!-- Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab" :class="{ active: tab === 'eventos' }" @click="cambiarTab('eventos')">Eventos</button>
        <button class="admin-tab" :class="{ active: tab === 'articulos' }" @click="cambiarTab('articulos')">Artículos</button>
        <button class="admin-tab" :class="{ active: tab === 'speakers' }" @click="cambiarTab('speakers')">Speakers</button>
        <button class="admin-tab" :class="{ active: tab === 'agenda' }" @click="cambiarTab('agenda')">Agenda</button>
        <button class="admin-tab" :class="{ active: tab === 'cursos' }" @click="cambiarTab('cursos')">Cursos</button>
        <button class="admin-tab" :class="{ active: tab === 'paquetes' }" @click="cambiarTab('paquetes')">Paquetes</button>
        <button class="admin-tab" :class="{ active: tab === 'ventas' }" @click="cambiarTab('ventas')">Ventas</button>
        <button class="admin-tab" :class="{ active: tab === 'usuarios' }" @click="cambiarTab('usuarios')">Usuarios</button>
        <button class="admin-tab" :class="{ active: tab === 'boletin' }" @click="cambiarTab('boletin')">Boletín</button>
        <button class="admin-tab" :class="{ active: tab === 'mensajes' }" @click="cambiarTab('mensajes')">
          Mensajes<span v-if="mensajes.length" class="tab-count">{{ mensajes.length }}</span>
        </button>
      </div>

      <!-- ═══ EVENTOS ═══ -->
      <template v-if="tab === 'eventos'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Gestión de Eventos</h1>
            <p class="admin-sub">{{ eventos.length }} evento{{ eventos.length !== 1 ? 's' : '' }} registrado{{ eventos.length !== 1 ? 's' : '' }}</p>
          </div>
          <button @click="toggleFormulario" class="btn-primary">
            {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Evento' }}
          </button>
        </div>

        <div v-if="mostrarFormulario" class="form-card">
          <h3 class="form-title">{{ editandoId ? 'Editar Evento' : 'Nuevo Evento' }}</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label">Título</label>
              <input v-model="formEvento.titulo" type="text" placeholder="Nombre del evento" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Fecha</label>
              <input v-model="formEvento.fecha" type="date" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Precio (MXN)</label>
              <input v-model="formEvento.precio" type="number" placeholder="350" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Stock de Boletos</label>
              <input v-model="formEvento.stockBoletos" type="number" placeholder="200" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Hora de inicio</label>
              <input v-model="formEvento.hora" type="time" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Modalidad</label>
              <select v-model="formEvento.modalidad" class="field-input">
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">Sede</label>
              <input v-model="formEvento.sede" type="text" placeholder="Centro de Convenciones" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Ciudad</label>
              <input v-model="formEvento.ciudad" type="text" placeholder="Morelia, Michoacán" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Descripción</label>
              <textarea v-model="formEvento.descripcion" rows="4" placeholder="De qué trata el evento, a quién está dirigido y qué incluye el acceso." class="field-input"></textarea>
            </div>
          </div>
          <button @click="guardarEvento" class="btn-primary">{{ editandoId ? 'Guardar cambios' : 'Guardar Evento' }}</button>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:640px">
            <thead>
              <tr><th>Título</th><th>Fecha</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="eventos.length === 0"><td colspan="5" class="empty">No hay eventos registrados</td></tr>
              <tr v-for="evento in eventos" :key="evento.idEvento">
                <td class="td-title">{{ evento.titulo }}</td>
                <td class="td-muted">{{ formatFecha(evento.fecha) }}</td>
                <td class="td-teal">${{ evento.precio }}</td>
                <td><span class="stock-badge">{{ evento.stockBoletos }}</span></td>
                <td class="td-actions">
                  <button @click="editarEvento(evento)" class="btn-edit">Editar</button>
                  <button @click="eliminarEvento(evento.idEvento)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ ARTÍCULOS ═══ -->
      <template v-if="tab === 'articulos'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Gestión de Artículos</h1>
            <p class="admin-sub">{{ articulos.length }} artículo{{ articulos.length !== 1 ? 's' : '' }} publicado{{ articulos.length !== 1 ? 's' : '' }}</p>
          </div>
          <button @click="toggleFormulario" class="btn-primary">
            {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Artículo' }}
          </button>
        </div>

        <div v-if="mostrarFormulario" class="form-card">
          <h3 class="form-title">{{ editandoId ? 'Editar Artículo' : 'Nuevo Artículo' }}</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label">Título</label>
              <input v-model="formArticulo.titulo" type="text" placeholder="Título del artículo" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Cuerpo</label>
              <textarea v-model="formArticulo.cuerpo" rows="4" placeholder="Contenido del artículo" class="field-input"></textarea>
            </div>
            <div class="field">
              <label class="field-label">Autor</label>
              <input v-model="formArticulo.autor" type="text" placeholder="Dr. Ramírez · UTM" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Categoría</label>
              <input v-model="formArticulo.categoria" type="text" placeholder="Arquitectura" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Fecha de publicación</label>
              <input v-model="formArticulo.fechaPublicacion" type="date" class="field-input" />
            </div>
          </div>
          <button @click="guardarArticulo" class="btn-primary">{{ editandoId ? 'Guardar cambios' : 'Guardar Artículo' }}</button>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:640px">
            <thead>
              <tr><th>Título</th><th>Categoría</th><th>Autor</th><th>Fecha</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="articulos.length === 0"><td colspan="5" class="empty">No hay artículos registrados</td></tr>
              <tr v-for="articulo in articulos" :key="articulo.idArticulo">
                <td class="td-title">{{ articulo.titulo }}</td>
                <td class="td-teal">{{ articulo.categoria }}</td>
                <td class="td-muted">{{ articulo.autor }}</td>
                <td class="td-muted">{{ formatFecha(articulo.fechaPublicacion) }}</td>
                <td class="td-actions">
                  <button @click="editarArticulo(articulo)" class="btn-edit">Editar</button>
                  <button @click="eliminarArticulo(articulo.idArticulo)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ SPEAKERS ═══ -->
      <template v-if="tab === 'speakers'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Gestión de Speakers</h1>
            <p class="admin-sub">{{ speakers.length }} speaker{{ speakers.length !== 1 ? 's' : '' }} registrado{{ speakers.length !== 1 ? 's' : '' }}</p>
          </div>
          <button @click="toggleFormulario" class="btn-primary">
            {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Speaker' }}
          </button>
        </div>

        <div v-if="mostrarFormulario" class="form-card">
          <h3 class="form-title">{{ editandoId ? 'Editar Speaker' : 'Nuevo Speaker' }}</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label">Nombre</label>
              <input v-model="formSpeaker.nombre" type="text" placeholder="Dra. Ana López" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Rol</label>
              <input v-model="formSpeaker.rol" type="text" placeholder="Security Lead · TEC Monterrey" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Área</label>
              <input v-model="formSpeaker.area" type="text" placeholder="Security" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Tema de su ponencia</label>
              <input v-model="formSpeaker.tema" type="text" placeholder="Ciberseguridad en APIs REST modernas" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Foto (URL, opcional — si se deja vacío se muestran las iniciales)</label>
              <input v-model="formSpeaker.fotoUrl" type="url" placeholder="https://ejemplo.com/foto.jpg" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Frase destacada (opcional, solo si es speaker principal)</label>
              <textarea v-model="formSpeaker.frase" rows="2" placeholder="Cita textual del speaker" class="field-input"></textarea>
            </div>
            <div class="field full field-check">
              <label class="field-check-label">
                <input v-model="formSpeaker.featured" type="checkbox" />
                Mostrar como speaker principal (keynote destacado)
              </label>
            </div>
          </div>
          <button @click="guardarSpeaker" class="btn-primary">{{ editandoId ? 'Guardar cambios' : 'Guardar Speaker' }}</button>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:680px">
            <thead>
              <tr><th>Foto</th><th>Nombre</th><th>Área</th><th>Rol</th><th>Destacado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="speakers.length === 0"><td colspan="6" class="empty">No hay speakers registrados</td></tr>
              <tr v-for="speaker in speakers" :key="speaker.idSpeaker">
                <td>
                  <img v-if="speaker.fotoUrl" :src="speaker.fotoUrl" :alt="speaker.nombre" class="sp-thumb" />
                  <span v-else class="sp-thumb-ini">{{ iniciales(speaker.nombre) }}</span>
                </td>
                <td class="td-title">{{ speaker.nombre }}</td>
                <td class="td-teal">{{ speaker.area }}</td>
                <td class="td-muted">{{ speaker.rol }}</td>
                <td><span v-if="speaker.featured" class="stock-badge featured">Sí</span><span v-else class="td-muted">—</span></td>
                <td class="td-actions">
                  <button @click="editarSpeaker(speaker)" class="btn-edit">Editar</button>
                  <button @click="eliminarSpeaker(speaker.idSpeaker)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ AGENDA ═══ -->
      <template v-if="tab === 'agenda'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Agenda del Congreso</h1>
            <p class="admin-sub">{{ sesiones.length }} {{ sesiones.length === 1 ? 'sesión programada' : 'sesiones programadas' }}</p>
          </div>
          <button @click="toggleFormulario" class="btn-primary">
            {{ mostrarFormulario ? '✕ Cancelar' : '+ Nueva Sesión' }}
          </button>
        </div>

        <div v-if="mostrarFormulario" class="form-card">
          <h3 class="form-title">{{ editandoId ? 'Editar Sesión' : 'Nueva Sesión' }}</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label">Evento al que pertenece</label>
              <select v-model="formSesion.idEvento" class="field-input">
                <option value="">Sin asignar — aparece en todos los eventos</option>
                <option v-for="e in eventos" :key="e.idEvento" :value="e.idEvento">
                  {{ e.titulo }} · {{ formatFecha(e.fecha) }}{{ eventoYaPaso(e) ? ' (ya se celebró)' : '' }}
                </option>
              </select>
            </div>
            <div class="field full">
              <label class="field-label">Nombre de la sesión</label>
              <input v-model="formSesion.nombre" type="text" placeholder="Seguridad en APIs REST: del JWT al Zero Trust" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Día (1, 2, 3...)</label>
              <input v-model="formSesion.dia" type="number" min="1" placeholder="1" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Hora</label>
              <input v-model="formSesion.hora" type="time" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Duración</label>
              <input v-model="formSesion.duracion" type="text" placeholder="90 min" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Tipo</label>
              <input v-model="formSesion.tipo" type="text" placeholder="Conferencia magistral" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Categoría</label>
              <select v-model="formSesion.badge" class="field-input">
                <option>Keynote</option>
                <option>Workshop</option>
                <option>Panel</option>
                <option>Social</option>
              </select>
            </div>
            <div class="field full">
              <label class="field-label">Ponente registrado</label>
              <select v-model="formSesion.idSpeaker" class="field-input">
                <option value="">No es un ponente del catálogo (panel, comité, actividad abierta…)</option>
                <option v-for="s in speakers" :key="s.idSpeaker" :value="s.idSpeaker">
                  {{ s.nombre }} — {{ s.rol }}
                </option>
              </select>
            </div>
            <div class="field full" v-if="!formSesion.idSpeaker">
              <label class="field-label">¿Quién la imparte?</label>
              <input v-model="formSesion.ponente" type="text" placeholder="Panel con 4 ponentes internacionales" class="field-input" />
            </div>
          </div>
          <p v-if="formSesion.idSpeaker" class="admin-sub" style="margin-bottom:14px">
            En la agenda aparecerá como <strong>{{ nombreSpeaker(formSesion.idSpeaker) }}</strong>, igual que en la página de ponentes.
          </p>
          <button @click="guardarSesion" class="btn-primary">{{ editandoId ? 'Guardar cambios' : 'Guardar Sesión' }}</button>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:680px">
            <thead>
              <tr><th>Día</th><th>Hora</th><th>Sesión</th><th>Evento</th><th>Ponente</th><th>Categoría</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="sesiones.length === 0"><td colspan="7" class="empty">No hay sesiones registradas</td></tr>
              <tr v-for="sesion in sesiones" :key="sesion.idSesion">
                <td class="td-teal">Día {{ sesion.dia }}</td>
                <td class="td-muted">{{ String(sesion.hora).slice(0, 5) }} · {{ sesion.duracion }}</td>
                <td class="td-title">{{ sesion.nombre }}</td>
                <td>
                  <span v-if="sesion.tituloEvento" class="td-muted">{{ sesion.tituloEvento }}</span>
                  <span v-else class="stock-badge" title="Aparece en el programa de todos los eventos">Sin asignar</span>
                </td>
                <td>
                  <span v-if="sesion.speakerNombre" class="td-teal">{{ sesion.speakerNombre }}</span>
                  <span v-else class="td-muted">{{ sesion.ponente }}</span>
                </td>
                <td><span class="stock-badge">{{ sesion.badge }}</span></td>
                <td class="td-actions">
                  <button @click="editarSesion(sesion)" class="btn-edit">Editar</button>
                  <button @click="eliminarSesion(sesion.idSesion)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ CURSOS ═══ -->
      <template v-if="tab === 'cursos'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Gestión de Cursos</h1>
            <p class="admin-sub">{{ cursos.length }} curso{{ cursos.length !== 1 ? 's' : '' }} en el catálogo</p>
          </div>
          <button @click="toggleFormulario" class="btn-primary">
            {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Curso' }}
          </button>
        </div>

        <div v-if="mostrarFormulario" class="form-card">
          <h3 class="form-title">{{ editandoId ? 'Editar Curso' : 'Nuevo Curso' }}</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label">Nombre del curso</label>
              <input v-model="formCurso.nombre" type="text" placeholder="Node.js y Express para APIs" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Descripción</label>
              <textarea v-model="formCurso.descripcion" rows="3" placeholder="Qué aprenderá el alumno en este curso" class="field-input"></textarea>
            </div>
            <div class="field">
              <label class="field-label">Horas</label>
              <input v-model="formCurso.horas" type="number" min="1" placeholder="24" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Nivel</label>
              <input v-model="formCurso.nivel" type="text" placeholder="Intermedio" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Precio (MXN)</label>
              <input v-model="formCurso.precio" type="number" min="0" placeholder="450" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Etiqueta (opcional)</label>
              <select v-model="formCurso.badge" class="field-input">
                <option value="">Sin etiqueta</option>
                <option>Nuevo</option>
                <option>Popular</option>
              </select>
            </div>
          </div>
          <button @click="guardarCurso" class="btn-primary">{{ editandoId ? 'Guardar cambios' : 'Guardar Curso' }}</button>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:680px">
            <thead>
              <tr><th>Curso</th><th>Horas</th><th>Nivel</th><th>Precio</th><th>Etiqueta</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="cursos.length === 0"><td colspan="6" class="empty">No hay cursos registrados</td></tr>
              <tr v-for="curso in cursos" :key="curso.idCurso">
                <td class="td-title">{{ curso.nombre }}</td>
                <td class="td-muted">{{ curso.horas }} hrs</td>
                <td class="td-muted">{{ curso.nivel }}</td>
                <td class="td-teal">${{ Math.round(curso.precio) }}</td>
                <td><span v-if="curso.badge" class="stock-badge featured">{{ curso.badge }}</span><span v-else class="td-muted">—</span></td>
                <td class="td-actions">
                  <button @click="editarCurso(curso)" class="btn-edit">Editar</button>
                  <button @click="eliminarCurso(curso.idCurso)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ PAQUETES ═══ -->
      <template v-if="tab === 'paquetes'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Gestión de Paquetes</h1>
            <p class="admin-sub">{{ paquetes.length }} paquete{{ paquetes.length !== 1 ? 's' : '' }} · el ahorro se calcula solo contra el precio del evento</p>
          </div>
          <button @click="toggleFormulario" class="btn-primary">
            {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Paquete' }}
          </button>
        </div>

        <div v-if="mostrarFormulario" class="form-card">
          <h3 class="form-title">{{ editandoId ? 'Editar Paquete' : 'Nuevo Paquete' }}</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label">Evento</label>
              <select v-model="formPaquete.idEvento" class="field-input">
                <option value="">Selecciona un evento</option>
                <option v-for="e in eventos" :key="e.idEvento" :value="e.idEvento">
                  {{ e.titulo }} — ${{ Math.round(e.precio) }} por boleto{{ eventoYaPaso(e) ? ' (ya se celebró)' : '' }}
                </option>
              </select>
            </div>
            <div class="field full">
              <label class="field-label">Nombre del paquete</label>
              <input v-model="formPaquete.nombre" type="text" placeholder="Paquete Dúo" class="field-input" />
            </div>
            <div class="field full">
              <label class="field-label">Descripción (opcional)</label>
              <textarea v-model="formPaquete.descripcion" rows="2" placeholder="Ideal para venir acompañado" class="field-input"></textarea>
            </div>
            <div class="field">
              <label class="field-label">Boletos incluidos</label>
              <input v-model="formPaquete.cantidadBoletos" type="number" min="2" placeholder="2" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Precio total del paquete (MXN)</label>
              <input v-model="formPaquete.precio" type="number" min="1" placeholder="600" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Destacado</label>
              <select v-model="formPaquete.destacado" class="field-input">
                <option :value="false">No</option>
                <option :value="true">Sí — mostrar "Más elegido"</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">Visible en la página</label>
              <select v-model="formPaquete.activo" class="field-input">
                <option :value="true">Sí</option>
                <option :value="false">No — ocultar sin borrar</option>
              </select>
            </div>
          </div>
          <p v-if="vistaPreviaPaquete" class="admin-sub" style="margin-bottom:14px">
            {{ vistaPreviaPaquete }}
          </p>
          <p v-if="avisoEventoPasado" class="admin-sub" style="color:#F59E0B;margin-bottom:14px">
            ⚠ {{ avisoEventoPasado }}
          </p>
          <p v-if="errorPaquete" class="admin-sub" style="color:#F87171;margin-bottom:14px">{{ errorPaquete }}</p>
          <button @click="guardarPaquete" class="btn-primary">{{ editandoId ? 'Guardar cambios' : 'Guardar Paquete' }}</button>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:760px">
            <thead>
              <tr><th>Paquete</th><th>Evento</th><th>Boletos</th><th>Por separado</th><th>Precio</th><th>Ahorro</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="paquetes.length === 0"><td colspan="8" class="empty">No hay paquetes registrados</td></tr>
              <tr v-for="p in paquetes" :key="p.idPaquete">
                <td class="td-title">{{ p.nombre }}</td>
                <td class="td-muted">{{ p.tituloEvento }}</td>
                <td class="td-muted">{{ p.cantidadBoletos }}</td>
                <td class="td-muted">${{ listaPaquete(p) }}</td>
                <td class="td-teal">${{ Math.round(p.precio) }}</td>
                <td class="td-teal">${{ ahorroPaquete(p) }}</td>
                <td>
                  <span v-if="!p.activo" class="stock-badge">Oculto</span>
                  <span v-else-if="paqueteDeEventoPasado(p)" class="stock-badge" title="Su evento ya se celebró, así que no se muestra en la página de registro">No se muestra</span>
                  <span v-else-if="p.destacado" class="stock-badge featured">Destacado</span>
                  <span v-else class="td-muted">Visible</span>
                </td>
                <td class="td-actions">
                  <button @click="editarPaquete(p)" class="btn-edit">Editar</button>
                  <button @click="eliminarPaquete(p.idPaquete)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ BOLETÍN ═══ -->
      <template v-if="tab === 'boletin'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Suscriptores del Boletín</h1>
            <p class="admin-sub">{{ suscriptores.length }} correo{{ suscriptores.length !== 1 ? 's' : '' }} suscrito{{ suscriptores.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:480px">
            <thead>
              <tr><th>Correo</th><th>Fecha de suscripción</th></tr>
            </thead>
            <tbody>
              <tr v-if="suscriptores.length === 0"><td colspan="2" class="empty">Aún no hay suscriptores</td></tr>
              <tr v-for="s in suscriptores" :key="s.idSuscriptor">
                <td class="td-title">{{ s.correo }}</td>
                <td class="td-muted">{{ formatFecha(s.creadoEn) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ MENSAJES ═══ -->
      <template v-if="tab === 'mensajes'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Mensajes recibidos</h1>
            <p class="admin-sub">{{ mensajes.length }} mensaje{{ mensajes.length !== 1 ? 's' : '' }} del formulario de contacto</p>
          </div>
        </div>

        <div v-if="mensajes.length === 0" class="table-card">
          <table class="table"><tbody><tr><td class="empty">Aún no has recibido mensajes</td></tr></tbody></table>
        </div>

        <div v-else class="msg-list">
          <div class="msg" v-for="m in mensajes" :key="m.idMensaje">
            <div class="msg-top">
              <span class="msg-asunto">{{ m.asunto }}</span>
              <span class="msg-fecha">{{ formatFecha(m.creadoEn) }}</span>
              <button @click="eliminarMensaje(m.idMensaje)" class="btn-danger">Eliminar</button>
            </div>
            <div class="msg-de">{{ m.nombre }} · <a :href="'mailto:' + m.correo" class="msg-mail">{{ m.correo }}</a></div>
            <p class="msg-cuerpo">{{ m.mensaje }}</p>
          </div>
        </div>
      </template>

      <!-- ═══ VENTAS ═══ -->
      <template v-if="tab === 'ventas'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Ventas</h1>
            <p class="admin-sub">{{ ventas.length }} transacci{{ ventas.length === 1 ? 'ón' : 'ones' }} · Total ${{ totalVentas }} MXN</p>
          </div>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:680px">
            <thead>
              <tr><th>ID transacción</th><th>Cliente</th><th>Correo</th><th>Monto</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              <tr v-if="ventas.length === 0"><td colspan="5" class="empty">Aún no hay ventas registradas</td></tr>
              <tr v-for="venta in ventas" :key="venta.idTransaccion">
                <td class="td-muted" style="font-family:var(--fm);font-size:var(--t-xs)">{{ venta.idTransaccion }}</td>
                <td class="td-title">{{ venta.usuario }}</td>
                <td class="td-muted">{{ venta.correo }}</td>
                <td class="td-teal">${{ venta.montoTotal }}</td>
                <td class="td-muted">{{ formatFecha(venta.fechaPago) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ═══ USUARIOS ═══ -->
      <template v-if="tab === 'usuarios'">
        <div class="admin-header">
          <div>
            <h1 class="admin-title">Usuarios</h1>
            <p class="admin-sub">{{ usuarios.length }} usuario{{ usuarios.length !== 1 ? 's' : '' }} registrado{{ usuarios.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <div class="table-card">
          <table class="table" style="min-width:640px">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              <tr v-if="usuarios.length === 0"><td colspan="4" class="empty">No hay usuarios registrados</td></tr>
              <tr v-for="u in usuarios" :key="u.idUsuario">
                <td class="td-title">{{ u.nombre }} <span v-if="u.esInvitado" class="stock-badge invitado">Invitado</span></td>
                <td class="td-muted">{{ u.correo }}</td>
                <td>
                  <select :value="u.rol" @change="cambiarRolUsuario(u, $event.target.value)" class="rol-select">
                    <option>Usuario General</option>
                    <option>Administrador</option>
                  </select>
                </td>
                <td class="td-actions">
                  <button @click="eliminarUsuario(u.idUsuario)" class="btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const nombre = localStorage.getItem('nombre')

const tab = ref('eventos')
const mostrarFormulario = ref(false)
const editandoId = ref(null)

const eventos = ref([])
const articulos = ref([])
const speakers = ref([])
const sesiones = ref([])
const cursos = ref([])
const ventas = ref([])
const usuarios = ref([])
const suscriptores = ref([])
const mensajes = ref([])
const paquetes = ref([])

const totalVentas = computed(() =>
  ventas.value.reduce((suma, v) => suma + Number(v.montoTotal), 0).toLocaleString('en-US')
)

const TITULOS = ['dr.', 'dra.', 'mtro.', 'mtra.', 'ing.', 'lic.']
const iniciales = (nombreCompleto) => {
  const partes = nombreCompleto.split(' ').filter(p => !TITULOS.includes(p.toLowerCase()))
  return partes.slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

const formEvento = ref({ titulo: '', fecha: '', precio: '', stockBoletos: '', hora: '', modalidad: 'Presencial', sede: '', ciudad: '', descripcion: '' })
const formArticulo = ref({ titulo: '', cuerpo: '', autor: '', categoria: '', fechaPublicacion: '' })
const formSpeaker = ref({ nombre: '', rol: '', area: '', tema: '', frase: '', featured: false, fotoUrl: '' })
const formSesion = ref({ idEvento: '', idSpeaker: '', dia: 1, hora: '', duracion: '', tipo: '', nombre: '', ponente: '', badge: 'Keynote' })
const formCurso = ref({ nombre: '', descripcion: '', horas: '', nivel: '', precio: '', badge: '' })
const formPaquete = ref({ idEvento: '', nombre: '', descripcion: '', cantidadBoletos: '', precio: '', destacado: false, activo: true })
const errorPaquete = ref('')

const cambiarTab = (nuevoTab) => {
  errorPaquete.value = ''
  tab.value = nuevoTab
  mostrarFormulario.value = false
  editandoId.value = null
}

const toggleFormulario = () => {
  mostrarFormulario.value = !mostrarFormulario.value
  if (!mostrarFormulario.value) editandoId.value = null
  else if (editandoId.value === null) resetFormularioActivo()
}

const resetFormularioActivo = () => {
  formEvento.value = { titulo: '', fecha: '', precio: '', stockBoletos: '', hora: '', modalidad: 'Presencial', sede: '', ciudad: '', descripcion: '' }
  formArticulo.value = { titulo: '', cuerpo: '', autor: '', categoria: '', fechaPublicacion: '' }
  formSpeaker.value = { nombre: '', rol: '', area: '', tema: '', frase: '', featured: false, fotoUrl: '' }
  formSesion.value = { idEvento: '', idSpeaker: '', dia: 1, hora: '', duracion: '', tipo: '', nombre: '', ponente: '', badge: 'Keynote' }
  formCurso.value = { nombre: '', descripcion: '', horas: '', nivel: '', precio: '', badge: '' }
  formPaquete.value = { idEvento: '', nombre: '', descripcion: '', cantidadBoletos: '', precio: '', destacado: false, activo: true }
  errorPaquete.value = ''
}

// timeZone:'UTC' evita que la fecha del evento se muestre un día antes en México
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

// ── EVENTOS ──
const cargarEventos = async () => {
  const res = await api.get('/eventos')
  eventos.value = res.data
}
const guardarEvento = async () => {
  if (editandoId.value) {
    await api.put(`/eventos/${editandoId.value}`, formEvento.value)
  } else {
    await api.post('/eventos', formEvento.value)
  }
  formEvento.value = { titulo: '', fecha: '', precio: '', stockBoletos: '', hora: '', modalidad: 'Presencial', sede: '', ciudad: '', descripcion: '' }
  mostrarFormulario.value = false
  editandoId.value = null
  cargarEventos()
}
const editarEvento = (evento) => {
  editandoId.value = evento.idEvento
  formEvento.value = {
    titulo: evento.titulo,
    fecha: new Date(evento.fecha).toISOString().slice(0, 10),
    precio: evento.precio,
    stockBoletos: evento.stockBoletos,
    // La hora llega como "HH:MM:SS"; el input type=time espera "HH:MM"
    hora: evento.hora ? String(evento.hora).slice(0, 5) : '',
    modalidad: evento.modalidad || 'Presencial',
    sede: evento.sede || '',
    ciudad: evento.ciudad || '',
    descripcion: evento.descripcion || '',
  }
  mostrarFormulario.value = true
}
const eliminarEvento = async (id) => {
  if (!confirm('¿Eliminar este evento?')) return
  await api.delete(`/eventos/${id}`)
  cargarEventos()
}

// ── ARTÍCULOS ──
const cargarArticulos = async () => {
  const res = await api.get('/articulos')
  articulos.value = res.data
}
const guardarArticulo = async () => {
  if (editandoId.value) {
    await api.put(`/articulos/${editandoId.value}`, formArticulo.value)
  } else {
    await api.post('/articulos', formArticulo.value)
  }
  formArticulo.value = { titulo: '', cuerpo: '', autor: '', categoria: '', fechaPublicacion: '' }
  mostrarFormulario.value = false
  editandoId.value = null
  cargarArticulos()
}
const editarArticulo = (articulo) => {
  editandoId.value = articulo.idArticulo
  formArticulo.value = {
    titulo: articulo.titulo,
    cuerpo: articulo.cuerpo,
    autor: articulo.autor,
    categoria: articulo.categoria,
    fechaPublicacion: new Date(articulo.fechaPublicacion).toISOString().slice(0, 10),
  }
  mostrarFormulario.value = true
}
const eliminarArticulo = async (id) => {
  if (!confirm('¿Eliminar este artículo?')) return
  await api.delete(`/articulos/${id}`)
  cargarArticulos()
}

// ── SPEAKERS ──
const cargarSpeakers = async () => {
  const res = await api.get('/speakers')
  speakers.value = res.data
}
const guardarSpeaker = async () => {
  if (editandoId.value) {
    await api.put(`/speakers/${editandoId.value}`, formSpeaker.value)
  } else {
    await api.post('/speakers', formSpeaker.value)
  }
  resetFormularioActivo()
  mostrarFormulario.value = false
  editandoId.value = null
  cargarSpeakers()
}
const editarSpeaker = (speaker) => {
  editandoId.value = speaker.idSpeaker
  formSpeaker.value = {
    nombre: speaker.nombre,
    rol: speaker.rol,
    area: speaker.area,
    tema: speaker.tema,
    frase: speaker.frase || '',
    featured: !!speaker.featured,
    fotoUrl: speaker.fotoUrl || '',
  }
  mostrarFormulario.value = true
}
const eliminarSpeaker = async (id) => {
  if (!confirm('¿Eliminar este speaker?')) return
  await api.delete(`/speakers/${id}`)
  cargarSpeakers()
}

// ── AGENDA ──
const cargarSesiones = async () => {
  const res = await api.get('/sesiones')
  sesiones.value = res.data
}
const guardarSesion = async () => {
  if (editandoId.value) {
    await api.put(`/sesiones/${editandoId.value}`, formSesion.value)
  } else {
    await api.post('/sesiones', formSesion.value)
  }
  resetFormularioActivo()
  mostrarFormulario.value = false
  editandoId.value = null
  cargarSesiones()
}
const editarSesion = (sesion) => {
  editandoId.value = sesion.idSesion
  formSesion.value = {
    idEvento: sesion.idEvento || '',
    idSpeaker: sesion.idSpeaker || '',
    dia: sesion.dia,
    hora: String(sesion.hora).slice(0, 5),
    duracion: sesion.duracion,
    tipo: sesion.tipo,
    nombre: sesion.nombre,
    ponente: sesion.ponente,
    badge: sesion.badge,
  }
  mostrarFormulario.value = true
}

// Nombre del ponente elegido, para confirmar en el formulario cómo se verá
// la sesión en la agenda antes de guardarla.
const nombreSpeaker = (id) => speakers.value.find((s) => s.idSpeaker === Number(id))?.nombre || ''
const eliminarSesion = async (id) => {
  if (!confirm('¿Eliminar esta sesión de la agenda?')) return
  await api.delete(`/sesiones/${id}`)
  cargarSesiones()
}

// ── CURSOS ──
const cargarCursos = async () => {
  const res = await api.get('/cursos')
  cursos.value = res.data
}
const guardarCurso = async () => {
  if (editandoId.value) {
    await api.put(`/cursos/${editandoId.value}`, formCurso.value)
  } else {
    await api.post('/cursos', formCurso.value)
  }
  resetFormularioActivo()
  mostrarFormulario.value = false
  editandoId.value = null
  cargarCursos()
}
const editarCurso = (curso) => {
  editandoId.value = curso.idCurso
  formCurso.value = {
    nombre: curso.nombre,
    descripcion: curso.descripcion,
    horas: curso.horas,
    nivel: curso.nivel,
    precio: Math.round(curso.precio),
    badge: curso.badge || '',
  }
  mostrarFormulario.value = true
}
const eliminarCurso = async (id) => {
  if (!confirm('¿Eliminar este curso?')) return
  await api.delete(`/cursos/${id}`)
  cargarCursos()
}

// ── PAQUETES ──
// El ahorro y el precio de lista se calculan a partir del precio del evento
// que devuelve la API; no se guardan en la tabla para que no queden desfasados.
const listaPaquete = (p) => Math.round(Number(p.precioEvento) * p.cantidadBoletos)
const ahorroPaquete = (p) => Math.round(listaPaquete(p) - Number(p.precio))

// La página de registro solo muestra los paquetes del próximo evento pendiente.
// Un paquete colgado de un evento ya celebrado nunca se ve, así que conviene
// avisarlo aquí en vez de dejar que desaparezca en silencio.
const eventoYaPaso = (evento) => new Date(evento.fecha).getTime() < Date.now()
const paqueteDeEventoPasado = (p) => {
  const evento = eventos.value.find((e) => e.idEvento === p.idEvento)
  return evento ? eventoYaPaso(evento) : false
}

const avisoEventoPasado = computed(() => {
  const evento = eventos.value.find((e) => e.idEvento === Number(formPaquete.value.idEvento))
  if (!evento || !eventoYaPaso(evento)) return ''
  return `"${evento.titulo}" ya se celebró, así que este paquete no aparecerá en la página de registro.`
})

// Vista previa mientras se llena el formulario, para que quien administre vea
// el ahorro antes de guardar y note si puso un precio sin descuento.
const vistaPreviaPaquete = computed(() => {
  const evento = eventos.value.find((e) => e.idEvento === Number(formPaquete.value.idEvento))
  const cantidad = Number(formPaquete.value.cantidadBoletos)
  const precio = Number(formPaquete.value.precio)
  if (!evento || !cantidad || !precio) return ''

  const lista = Math.round(Number(evento.precio) * cantidad)
  const ahorro = lista - Math.round(precio)
  if (ahorro <= 0) {
    return `Por separado esos ${cantidad} boletos cuestan $${lista}. Con este precio el paquete no ofrece ahorro.`
  }
  return `Por separado: $${lista} · Con el paquete: $${Math.round(precio)} · Ahorro: $${ahorro} (≈ $${Math.round(precio / cantidad)} por persona)`
})

const cargarPaquetes = async () => {
  try {
    const res = await api.get('/paquetes')
    paquetes.value = res.data
  } catch (err) {
    paquetes.value = []
  }
}
const guardarPaquete = async () => {
  errorPaquete.value = ''
  try {
    if (editandoId.value) {
      await api.put(`/paquetes/${editandoId.value}`, formPaquete.value)
    } else {
      await api.post('/paquetes', formPaquete.value)
    }
    mostrarFormulario.value = false
    editandoId.value = null
    resetFormularioActivo()
    cargarPaquetes()
  } catch (err) {
    // El servidor valida que el paquete cueste menos que comprar por separado
    errorPaquete.value = err.response?.data?.error || 'No se pudo guardar el paquete'
  }
}
const editarPaquete = (p) => {
  editandoId.value = p.idPaquete
  formPaquete.value = {
    idEvento: p.idEvento,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    cantidadBoletos: p.cantidadBoletos,
    precio: Math.round(Number(p.precio)),
    destacado: !!p.destacado,
    activo: !!p.activo,
  }
  errorPaquete.value = ''
  mostrarFormulario.value = true
}
const eliminarPaquete = async (id) => {
  if (!confirm('¿Eliminar este paquete?')) return
  await api.delete(`/paquetes/${id}`)
  cargarPaquetes()
}

// ── BOLETÍN ──
const cargarSuscriptores = async () => {
  try {
    const res = await api.get('/suscriptores')
    suscriptores.value = res.data
  } catch (err) {
    suscriptores.value = []
  }
}

// ── MENSAJES DE CONTACTO ──
const cargarMensajes = async () => {
  try {
    const res = await api.get('/mensajes')
    mensajes.value = res.data
  } catch (err) {
    mensajes.value = []
  }
}
const eliminarMensaje = async (id) => {
  if (!confirm('¿Eliminar este mensaje?')) return
  await api.delete(`/mensajes/${id}`)
  cargarMensajes()
}

// ── VENTAS ──
const cargarVentas = async () => {
  try {
    const res = await api.get('/transacciones')
    ventas.value = res.data
  } catch (err) {
    ventas.value = []
  }
}

// ── USUARIOS ──
const cargarUsuarios = async () => {
  try {
    const res = await api.get('/usuarios')
    usuarios.value = res.data
  } catch (err) {
    usuarios.value = []
  }
}
const cambiarRolUsuario = async (usuario, nuevoRol) => {
  try {
    await api.put(`/usuarios/${usuario.idUsuario}`, { rol: nuevoRol })
    usuario.rol = nuevoRol
  } catch (err) {
    alert(err.response?.data?.error || 'Error al cambiar el rol')
    cargarUsuarios()
  }
}
const eliminarUsuario = async (id) => {
  if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
  try {
    await api.delete(`/usuarios/${id}`)
    cargarUsuarios()
  } catch (err) {
    alert(err.response?.data?.error || 'Error al eliminar usuario')
  }
}

const logout = () => {
  localStorage.clear()
  router.push({ name: 'login' })
}

onMounted(() => {
  cargarEventos()
  cargarArticulos()
  cargarSpeakers()
  cargarSesiones()
  cargarCursos()
  cargarVentas()
  cargarUsuarios()
  cargarSuscriptores()
  cargarMensajes()
  cargarPaquetes()
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

.nav {
  height: 60px;
  background: rgba(6,9,15,.96);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--line3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:0 32px;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
}
.nav-logo {
  font-size:var(--t-lg);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -.03em;
  display: flex;
  align-items: center;
  gap:8px;
}
.nav-badge {
  font-family: var(--fm);
  font-size:var(--t-2xs);
  font-weight: 500;
  color: var(--teal);
  background: var(--teal-g);
  border: 1px solid var(--teal-b);
  padding:4px 8px;
  border-radius: 100px;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.nav-end { display: flex; align-items: center; gap:12px; }
.nav-user { font-size:var(--t-sm); color: var(--w3); }

.admin-wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding:80px 32px 64px;
  display: flex;
  flex-direction: column;
  gap:24px;
}

.admin-tabs { display: flex; gap:4px; border-bottom: 1px solid var(--line3); }
.admin-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding:8px 16px;
  font-family: var(--f);
  font-size:var(--t-sm);
  font-weight: 500;
  color: var(--w4);
  cursor: pointer;
  transition: all .15s;
}
.admin-tab:hover { color: var(--w2); }
.admin-tab.active { color: var(--teal); border-bottom-color: var(--teal); }

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.admin-title {
  font-size:var(--t-2xl);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -.04em;
}
.admin-sub { font-size:var(--t-sm); color: var(--w4); margin-top: 4px; }

.form-card {
  background: var(--card);
  border: 1px solid var(--teal-b);
  border-radius: 16px;
  padding:24px;
  display: flex;
  flex-direction: column;
  gap:16px;
}
.form-title {
  font-size:var(--t-md);
  font-weight: 700;
  color: var(--white);
  letter-spacing: -.02em;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
}
.field { display: flex; flex-direction: column; gap:4px; }
.field.full { grid-column: span 2; }
.field-label { font-size:var(--t-xs); font-weight: 500; color: var(--w3); }
.field-input {
  background: var(--bg3);
  border: 1px solid var(--line2);
  border-radius: 10px;
  padding:12px 12px;
  font-family: var(--f);
  font-size:var(--t-sm);
  color: var(--white);
  outline: none;
  transition: border-color .15s;
  resize: vertical;
}
.field-input:focus { border-color: var(--teal-b); }
.field-input::placeholder { color: var(--w4); }
.field-check { flex-direction: row; align-items: center; }
.field-check-label { display: flex; align-items: center; gap:8px; font-size:var(--t-sm); color: var(--w2); cursor: pointer; }

.table-card {
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 16px;
  overflow-x: auto;
}
.table { width: 100%; border-collapse: collapse; }
.table thead tr {
  background: var(--bg3);
  border-bottom: 1px solid var(--line2);
}
.table th {
  text-align: left;
  padding:12px 16px;
  font-size:var(--t-xs);
  font-weight: 600;
  color: var(--w4);
  letter-spacing: .05em;
  text-transform: uppercase;
}
.table tbody tr { border-bottom: 1px solid var(--line3); transition: background .1s; }
.table tbody tr:last-child { border-bottom: none; }
.table tbody tr:hover { background: var(--bg3); }
.table td { padding:12px 16px; font-size:var(--t-sm); }

.td-title { font-weight: 600; color: var(--white); }
.td-muted { color: var(--w3); }
.td-teal { color: var(--teal); font-weight: 700; font-family: var(--fm); }
.td-actions { display: flex; gap:12px; align-items: center; }

.stock-badge {
  background: var(--bg3);
  border: 1px solid var(--line2);
  color: var(--w2);
  padding:4px 8px;
  border-radius: 100px;
  font-size:var(--t-sm);
  font-family: var(--fm);
}
.stock-badge.featured { background: var(--teal-g); border-color: var(--teal-b); color: var(--teal); }
.stock-badge.invitado { font-size:var(--t-2xs); padding:0px 8px; color: var(--w3); margin-left: 6px; }

.sp-thumb { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid var(--teal-b); display: block; }
.sp-thumb-ini {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--teal-g); border: 1px solid var(--teal-b);
  color: var(--teal); font-size:var(--t-xs); font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.rol-select {
  background: var(--bg3);
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding:8px 8px;
  font-family: var(--f);
  font-size:var(--t-sm);
  color: var(--white);
  cursor: pointer;
  outline: none;
}
.rol-select:focus { border-color: var(--teal-b); }

.empty { text-align: center; color: var(--w4); padding:48px; }

/* MENSAJES DE CONTACTO */
.tab-count { display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;padding:0 4px;margin-left:7px;border-radius:100px;background:var(--teal);color:var(--bg);font-size:var(--t-2xs);font-weight:800; }
.msg-list { display:flex;flex-direction:column;gap:12px; }
.msg { background:var(--card);border:1px solid var(--line3);border-radius:14px;padding:16px 24px;transition:border-color .15s; }
.msg:hover { border-color:var(--teal-b); }
.msg-top { display:flex;align-items:center;gap:12px;margin-bottom:8px;flex-wrap:wrap; }
.msg-asunto { font-family:var(--fm);font-size:var(--t-2xs);font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--teal);background:var(--teal-g);border:1px solid var(--teal-b);border-radius:100px;padding:4px 12px; }
.msg-fecha { font-size:var(--t-xs);color:var(--w4);margin-right:auto; }
.msg-de { font-size:var(--t-sm);color:var(--w2);margin-bottom:10px; }
.msg-mail { color:var(--teal);text-decoration:none; }
.msg-mail:hover { text-decoration:underline; }
.msg-cuerpo { font-size:var(--t-sm);color:var(--w3);font-weight:300;line-height:1.75;white-space:pre-line; }

/* BUTTONS */
.btn-primary {
  background: var(--teal);
  color: var(--bg);
  border: none;
  border-radius: 9px;
  padding:8px 16px;
  font-family: var(--f);
  font-size:var(--t-sm);
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
  white-space: nowrap;
}
.btn-primary:hover { background: var(--teal2); }

.btn-ghost-sm {
  background: var(--w5);
  color: var(--w3);
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding:8px 12px;
  font-family: var(--f);
  font-size:var(--t-sm);
  cursor: pointer;
  transition: all .15s;
}
.btn-ghost-sm:hover { border-color: var(--teal-b); color: var(--white); }

.btn-edit {
  background: none;
  border: none;
  color: var(--w3);
  font-size:var(--t-sm);
  cursor: pointer;
  transition: color .15s;
  font-family: var(--f);
  padding:4px 0;
}
.btn-edit:hover { color: var(--teal); }

.btn-danger {
  background: none;
  border: none;
  color: rgba(239,68,68,.7);
  font-size:var(--t-sm);
  cursor: pointer;
  transition: color .15s;
  font-family: var(--f);
  padding:4px 0;
}
.btn-danger:hover { color: #f87171; }

@media (max-width: 640px) {
  .nav { padding:0 16px; }
  .admin-wrap { padding:80px 16px 48px; gap:16px; }
  .admin-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .admin-tab { white-space: nowrap; }
  .admin-header { flex-direction: column; align-items: flex-start; gap:12px; }
  .admin-header .btn-primary { width: 100%; }
  .form-card { padding:16px; }
  .form-grid { grid-template-columns: 1fr; }
  .field.full { grid-column: span 1; }
}
</style>
