import { getSettings } from "@/lib/cms";
import FooterClient from "@/components/layout/Footer";

export default async function FooterServer() {
  const settings = await getSettings();
  return <FooterClient settings={settings} />;
}
