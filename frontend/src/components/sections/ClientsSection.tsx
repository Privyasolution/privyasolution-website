import { getClients } from "@/lib/cms";
import ClientsSlider from "./ClientsSlider";

// Server component — fetches clients and passes to the client-side slider
export default async function ClientsSection() {
  const clients = await getClients();
  return <ClientsSlider clients={clients} />;
}
