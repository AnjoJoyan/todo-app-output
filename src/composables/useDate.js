export function useDate() {
  function pad(n) {
    return String(n).padStart(2, '0')
  }

  function formatDisplayDate(d) {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    return `${pad(day)}-${pad(m)}-${y}`
  }

  function formatDateTime(d, t) {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    const [hh, mm] = (t || '00:00').split(':')
    const h = parseInt(hh)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${pad(day)}-${pad(m)}-${y} ${pad(h12)}:${mm} ${ampm}`
  }

  function todayStr() {
    return new Date().toISOString().split('T')[0]
  }

  function badgeClass(status) {
    if (status === 'Completed') return 'badge-completed'
    if (status === 'Due Today') return 'badge-due'
    return 'badge-pending'
  }

  return { formatDisplayDate, formatDateTime, todayStr, badgeClass }
}
