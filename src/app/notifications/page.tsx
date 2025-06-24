'use client'

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUser } from "@/http/user/get-user";
import { useGetInvitations } from '@/http/user/get-invitations'
import { NotificationsCard } from "./notifications-card";
import { Bell } from "lucide-react";

export default function Notifications() {
  const { data } = useGetUser()
  const { data: invitations } = useGetInvitations({ email: data?.email })

  return (
    <div className="flex flex-col h-dvh">
      <Header />

      <main className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full h-full">
          <ScrollArea className="h-full p-4">
            {invitations && invitations.length > 0 ? (
              <>
                {invitations.map(invitation => (
                  <NotificationsCard key={invitation.id} data={invitation} />
                ))}
              </>
            ) : (
              <div className="w-full h-auto p-4 border flex gap-2 justify-center flex-col items-center">
                <Bell />
                <p className="text-center">
                  Nenhuma notificação <br /> encontrada.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </main>

      <Footer />
    </div>
  );
}