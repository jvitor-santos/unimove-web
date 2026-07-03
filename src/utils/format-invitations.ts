import { BusFront, LucideIcon, User } from "lucide-react"

export const formatStatusInvitations: Record<string, {title: string, color: string}> = {
  'pending': {
    title: 'Pendente',
    color: 'text-yellow-400'
  },
  'accepted': {
    title: 'Aceita',
    color: 'text-green-400'
  },
  'rejected': {
    title: 'Recusada',
    color: 'text-red-400'
  }
}

export const formatRolesInvitations: Record<string, {title: string, icon: LucideIcon}> = {
  'passenger': {
    title: 'Passageiro',
    icon: User,
  },
  'driver': {
    title: 'Motorista',
     icon: BusFront,
  },
}