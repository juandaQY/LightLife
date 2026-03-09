// Utility functions

export function formatDate(date) {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
