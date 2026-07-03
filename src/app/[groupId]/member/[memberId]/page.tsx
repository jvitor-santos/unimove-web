import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddressForm } from "./address-form";

export default function Member() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col items-center min-h-0">
        <div className="w-full h-full">
          <ScrollArea className="h-full p-4">
            <AddressForm />
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  )
}