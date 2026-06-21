import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CapabilityLedger, { Service } from "@/components/CapabilityLedger";
import Work, { Project } from "@/components/Work";
import ContactSection from "@/components/ContactSection";
import ChatWidget from "@/components/ChatWidget";
import { getPublicSupabase } from "@/lib/supabase";

export const revalidate = 0;

async function getData() {
  const supabase = getPublicSupabase();
  const [servicesRes, projectsRes] = await Promise.all([
    supabase.from("services").select("*").order("sort_order", { ascending: true }),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
  ]);
  return {
    services: (servicesRes.data || []) as Service[],
    projects: (projectsRes.data || []) as Project[],
  };
}

export default async function Home() {
  const { services, projects } = await getData();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <CapabilityLedger services={services} />
        <Work projects={projects} />
        <ContactSection />
      </main>
      <footer className="bg-ink text-stone/70 text-sm py-8 text-center font-mono-label">
        © {new Date().getFullYear()} Your Name — built, analyzed, written, and wired up by hand.
      </footer>
      <ChatWidget />
    </>
  );
}
