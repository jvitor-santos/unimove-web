export function formatFirstAndSecondNames(displayName?: string | null) {
  if (!displayName) return ''

  const parts = displayName.trim().split(' ')

  const firstName = parts[0]
  const secondName = parts.length > 1 ? parts[1] : ''

  return `${firstName} ${secondName}`
}
