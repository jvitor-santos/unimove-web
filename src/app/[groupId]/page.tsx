import { Footer } from "@/components/footer";
import { GroupTable } from "@/components/group/groups-table";
import { Header } from "@/components/header";

export default function Group() {
  return (
    <div className="flex size-full min-h-dvh flex-col">
      <div className="flex size-full flex-1 flex-col items-center min-h-full">
        <Header />
        
        <main className="flex size-full flex-1 flex-col gap-4 p-4 max-w-2xl">
          <GroupTable />
        </main>

        <Footer />
      </div>
    </div>
  );
}
