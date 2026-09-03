// ============================================================================
// Avatares de respaldo para personas sin fotografía
// ----------------------------------------------------------------------------
// Mientras la federación no cuenta con fotos de los ponentes, cada persona se
// representa con sus iniciales sobre un color propio. El color se deriva del
// nombre, así que siempre es el mismo para la misma persona (no cambia entre
// recargas) y dos ponentes contiguos rara vez se ven iguales.
// ============================================================================

// Títulos académicos que no aportan iniciales útiles.
const TITULOS = ['dr.', 'dra.', 'mtro.', 'mtra.', 'ing.', 'lic.', 'c.', 'm.c.']

// Paleta de acentos compatible con la identidad de la marca.
const PALETA = [
  '45,212,180',   // teal (color institucional)
  '96,165,250',   // azul
  '167,139,250',  // violeta
  '52,211,153',   // verde
  '245,158,11',   // ámbar
  '244,114,182',  // rosa
  '34,211,238',   // cian
]

// Iniciales del nombre, ignorando el título académico.
export function inicialesDe(nombre = '') {
  const partes = String(nombre)
    .split(' ')
    .filter((p) => p && !TITULOS.includes(p.toLowerCase()))
  return partes.slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

// Índice estable a partir del nombre: misma persona, mismo color siempre.
// Se usa un hash tipo djb2 en vez de sumar los códigos: la suma simple hace que
// nombres de largo parecido caigan en el mismo color, y varios ponentes seguidos
// terminaban del mismo tono.
function indiceDe(nombre = '') {
  let hash = 5381
  for (const c of String(nombre)) {
    hash = ((hash << 5) + hash + c.codePointAt(0)) | 0
  }
  return Math.abs(hash) % PALETA.length
}

// Estilos en línea para el avatar: degradado suave, borde y texto del color.
export function estiloAvatar(nombre) {
  const rgb = PALETA[indiceDe(nombre)]
  return {
    background: `linear-gradient(140deg, rgba(${rgb},.20), rgba(${rgb},.05))`,
    border: `1px solid rgba(${rgb},.38)`,
    color: `rgb(${rgb})`,
  }
}
