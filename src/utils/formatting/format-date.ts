import { Timestamp } from 'firebase/firestore'

type TFormatFirestoreDate = {
  type: 'short' | 'long'
  timestamp?: Timestamp | null
}

export function formatDate({
  type,
  timestamp,
}: TFormatFirestoreDate): string | null {
  if (!type || !timestamp) return null

  const date = timestamp.toDate()

  if (type === 'short') {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (type === 'long') {
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return null
}
