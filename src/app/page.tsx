import { Footer } from "@/components/footer";
import { GroupsTable } from "@/components/groups/groups-table";
import { Header } from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function Groups() {
  return (
    <div className="flex flex-col h-dvh">
      <Header />

      <main className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full h-full">
          <ScrollArea className="h-full p-4">
            <GroupsTable />
          </ScrollArea>
        </div>
      </main>

      <Footer />
    </div>
  );
}
