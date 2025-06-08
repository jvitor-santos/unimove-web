'use client'

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProfilePersonForm } from "./profile-person-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileBusinessForm } from "./profile-business-form";
import { useGetUser } from "@/http/user/get-user";

export default function Profile() {
  const { data } = useGetUser()

  return (
    <div className="flex flex-col h-dvh">
      <Header />

      <main className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full max-w-2xl h-full">
          <ScrollArea className="h-full p-4">
            {data?.accountType === "business" && (
              <ProfileBusinessForm />
            )}

            {data?.accountType === "personal" && (
              <ProfilePersonForm />
            )}
          </ScrollArea>
        </div>
      </main>

      <Footer />
    </div>
  );
}