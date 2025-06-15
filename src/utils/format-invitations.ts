import { BusFront, LucideIcon, User } from "lucide-react"

export const formatStatusInvitations: Record<string, {title: string, color: string}> = {
  'pending': {
    title: 'Pendente',
    color: 'text-red-400'
  },
  'accepted': {
    title: 'Aceita',
    color: ''
  },
  'rejected': {
    title: 'Recusada',
    color: ''
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