'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Check, X, Loader2 } from 'lucide-react'

import { useGetUser } from '@/http/user/get-user'
import { useGetGroup } from '@/http/groups/get-group'
import { useGetGroupUsersDetails } from '@/http/groups/get-users-groups-details'
import { useUpdateGroupUser } from '@/http/groups/update-group-user'
import { Button } from '@/components/ui/button'

function getNextFiveWorkingDays() {
  const days = []
  let current = new Date()
  
  while (days.length < 5) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
      days.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }
  return days
}

function getDayOfWeekAbbr(date: Date): string {
  const map = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  return map[date.getDay()]
}

function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDateToDDMMM(date: Date): string {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const d = String(date.getDate()).padStart(2, '0')
  const m = months[date.getMonth()]
  return `${d}/${m}`
}

function getDayOfWeekName(date: Date): string {
  const names = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return names[date.getDay()]
}

export function WeeklySeatsDashboard() {
  const params = useParams()
  const groupId = typeof params.groupId === 'string' ? params.groupId : params.groupId?.[0]

  const { data: currentUser } = useGetUser()
  const { data: group } = useGetGroup()
  const { data: membersDetails } = useGetGroupUsersDetails()
  const { mutateAsync: updateGroupUser, isPending: isUpdating } = useUpdateGroupUser()

  const capacity = group?.capacity ?? 15
  const isDriver = group?.drivers?.includes(currentUser?.id) ?? false
  const isOwner = group?.ownerId === currentUser?.id
  const isPassenger = !isDriver && !isOwner

  const nextFiveDays = React.useMemo(() => getNextFiveWorkingDays(), [])

  // State to track loading for specific days to display micro-interactions nicely
  const [loadingDay, setLoadingDay] = React.useState<string | null>(null)

  const myMemberDetail = membersDetails?.find((m: any) => m.id === currentUser?.id)
  const myExceptions = myMemberDetail?.exceptions ?? {}
  const myWeeklyRoutine = myMemberDetail?.weeklyRoutine ?? []

  const handleTogglePresence = async (dateStr: string, amIGoing: boolean) => {
    if (!groupId || !currentUser?.id) return

    setLoadingDay(dateStr)

    const newStatus = amIGoing ? 'absent' : 'present'
    const updatedExceptions = {
      ...myExceptions,
      [dateStr]: newStatus,
    }

    try {
      await updateGroupUser({
        uid: currentUser.id,
        groupId,
        data: {
          exceptions: updatedExceptions,
        },
      })
      toast.success('Presença atualizada com sucesso!')
    } catch (err) {
      toast.error('Erro ao atualizar presença.')
    } finally {
      setLoadingDay(null)
    }
  }

  return (
    <div className="w-full flex flex-col gap-3 rounded-[4px] border border-muted p-4 bg-muted/5 mb-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-foreground flex items-center gap-2">
          🎯 Disponibilidade de Vagas na Semana
        </h2>
        <p className="text-xs text-muted-foreground">
          {isPassenger 
            ? 'Veja as vagas da van e clique no card correspondente para alternar sua presença em dias específicos (exceções à sua rotina padrão).'
            : 'Controle de ocupação semanal da van de acordo com as rotinas fixas e exceções declaradas pelos passageiros.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-2">
        {nextFiveDays.map((day) => {
          const dateStr = formatDateToYYYYMMDD(day)
          const dayAbbr = getDayOfWeekAbbr(day)
          const dayName = getDayOfWeekName(day)
          const formattedDate = formatDateToDDMMM(day)

          // Calculate passengers going
          const passengersGoing = membersDetails?.filter((member: any) => {
            const isMemberDriver = group?.drivers?.includes(member.id) ?? false
            const isMemberOwner = group?.ownerId === member.id
            if (isMemberDriver || isMemberOwner) return false

            const exceptions = member.exceptions ?? {}
            const weeklyRoutine = member.weeklyRoutine ?? []

            const exceptionStatus = exceptions[dateStr]
            if (exceptionStatus === 'present') return true
            if (exceptionStatus === 'absent') return false

            return weeklyRoutine.includes(dayAbbr)
          }) ?? []

          const goingCount = passengersGoing.length
          const availableSeats = Math.max(0, capacity - goingCount)

          // Calculate current passenger state for this day
          const isMyDefaultGoing = myWeeklyRoutine.includes(dayAbbr)
          const myExceptionStatus = myExceptions[dateStr]
          const amIGoing = myExceptionStatus === 'present' || (myExceptionStatus !== 'absent' && isMyDefaultGoing)

          let statusBg = 'bg-green-500/10 text-green-500 border-green-500/20'
          if (availableSeats === 0) {
            statusBg = 'bg-red-500/10 text-red-500 border-red-500/20'
          } else if (availableSeats < 5) {
            statusBg = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
          }

          const isLoading = isUpdating && loadingDay === dateStr

          return (
            <div 
              key={dateStr}
              className="flex flex-col justify-between p-3 rounded-[2px] border border-muted bg-muted/10"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground">{dayName}</span>
                <span className="text-sm font-bold">{formattedDate}</span>
                
                <div className={`mt-2 py-1 px-2 text-center rounded-[2px] border text-xs font-medium ${statusBg}`}>
                  {availableSeats} {availableSeats === 1 ? 'vaga' : 'vagas'}
                </div>
              </div>

              {isPassenger && (
                <div className="mt-3 flex items-center gap-1.5 w-full">
                  <Button
                    onClick={() => !amIGoing && handleTogglePresence(dateStr, amIGoing)}
                    disabled={isLoading}
                    variant={amIGoing ? 'default' : 'outline'}
                    size="sm"
                    className={`flex-1 text-xs h-8 px-0 transition-all ${
                      amIGoing 
                        ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' 
                        : 'text-muted-foreground border-muted hover:bg-muted/10'
                    }`}
                  >
                    {isLoading && !amIGoing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Vou'
                    )}
                  </Button>
                  <Button
                    onClick={() => amIGoing && handleTogglePresence(dateStr, amIGoing)}
                    disabled={isLoading}
                    variant={!amIGoing ? 'default' : 'outline'}
                    size="sm"
                    className={`flex-1 text-xs h-8 px-0 transition-all ${
                      !amIGoing 
                        ? 'bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600/20' 
                        : 'text-muted-foreground border-muted hover:bg-muted/10'
                    }`}
                  >
                    {isLoading && amIGoing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Não vou'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
