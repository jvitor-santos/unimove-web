import { Footer } from "@/components/footer";
import { GuestMembersTable } from "@/components/guest-members/guest-members-table";
import { Header } from "@/components/header";
import { MembersTable } from "@/components/members/members-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Group() {
  return (
    <div className="flex flex-col h-dvh">
      <Header />

      <main className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full h-full">
          <ScrollArea className="h-full p-4">
            <Tabs defaultValue="members" className="w-full h-auto">
              <TabsList className="w-full h-auto bg-transparent p-0">
                <TabsTrigger value="members">Membros</TabsTrigger>
                <TabsTrigger value="invitations">Convites</TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="w-full h-auto">
                <MembersTable />
              </TabsContent>

              <TabsContent value="invitations">
                <GuestMembersTable />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>


      </main>

      <Footer />
    </div>
  );
}
