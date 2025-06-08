export function formatInitials(displayName?: string | null) {
  if (!displayName) return ''

  const parts = displayName.trim().split(' ')

  const firstInitial = parts[0].charAt(0).toUpperCase()
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : ''

  return `${firstInitial}${lastInitial}`
}
