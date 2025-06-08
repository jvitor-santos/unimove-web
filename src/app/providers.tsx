'use client'

import { QueryClientProvider } from '@tanstack/react-query'

import { UserProvider } from '@/contexts/user-context'
import { queryClient } from '@/lib/react-query'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  )
}
