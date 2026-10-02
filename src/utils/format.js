// ============================================================================
//  GestiPerso — Formatting helpers (fr-FR)
//  ---------------------------------------------------------------------------
//  Presentation only: nothing here mutates data or calls the API.
// ============================================================================

const LOCALE = 'fr-FR'

/** Placeholder used everywhere a value is missing. */
export const EMPTY = '—'

/** `null | undefined | '' | NaN` → false. */
export const hasValue = (value) => value !== null && value !== undefined && value !== ''

/** Smallest possible way to print a value in a table cell. */
export const valueOr = (value, fallback = EMPTY) => (hasValue(value) ? value : fallback)

const toDate = (value) => {
  if (!hasValue(value)) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** 12/03/1985 — used in tables and definition lists. */
export const formatDate = (value, fallback = EMPTY) => {
  const date = toDate(value)
  return date ? date.toLocaleDateString(LOCALE) : fallback
}

/** 12/03/1985 14:30 — used by notifications and audit trails. */
export const formatDateTime = (value, fallback = EMPTY) => {
  const date = toDate(value)
  if (!date) return fallback
  return `${date.toLocaleDateString(LOCALE)} ${date.toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

/** « il y a 3 jours » style label, with a plain date fallback beyond 30 days. */
export const formatRelative = (value, fallback = EMPTY) => {
  const date = toDate(value)
  if (!date) return fallback
  const seconds = Math.round((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "à l'instant"
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'hier'
  if (days <= 30) return `il y a ${days} jours`
  return formatDate(date, fallback)
}

/** Converts a `Date` to the `yyyy-MM-dd` expected by `<input type="date">`. */
export const toDateInputValue = (value) => {
  const date = toDate(value)
  if (!date) return ''
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Full name from an `InfoIdent` block, tolerating missing parts. */
export const fullName = (ident, fallback = EMPTY) => {
  if (!ident) return fallback
  const name = [ident.prenom, ident.nom].filter(hasValue).join(' ').trim()
  return name || fallback
}

/** Up to two initials, uppercase — used by avatars. */
export const initials = (source, fallback = '?') => {
  if (!source) return fallback
  const text = typeof source === 'string' ? source : fullName(source, '')
  const parts = `${text}`.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  const first = parts[0].charAt(0)
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : parts[0].charAt(1) || ''
  return `${first}${second}`.toUpperCase() || fallback
}

/** Age in years, `null` when the birth date is unusable. */
export const ageFrom = (birthDate) => {
  const date = toDate(birthDate)
  if (!date) return null
  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age -= 1
  return age
}

/** Ordered label/value list, dropping empty entries — feeds `.gp-dl`. */
export const definitionList = (rows) => rows.filter((row) => hasValue(row.value))

/** Number with thin spaces, e.g. 1 250. */
export const formatNumber = (value, fallback = EMPTY) => {
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString(LOCALE) : fallback
}
