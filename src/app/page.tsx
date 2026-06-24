import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar, { Stat } from "@/components/StatsBar";
import AboutSection, { Settings } from "@/components/AboutSection";
import CapabilityLedger, { Service } from "@/components/CapabilityLedger";
import Work, { Project } from "@/components/Work";
import ProcessSection, { ProcessStep } from "@/components/ProcessSection";
import Testimonials, { Testimonial } from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import ChatWidget from "@/components/ChatWidget";
import { getPublicSupabase } from "@/lib/supabase";

export const revalidate = 0;

const DEFAULT_SETTINGS: Settings = {
  full_name: "Your Name",
  tagline: "Web Development, Data Analysis & Content Writing",
  about_text: "Add your own story from the admin panel.",
  availability_status: "Available now",
  response_time: "Usually within a day",
  hours_per_week: "20+ hrs/week",
};

async function getData() {
  const supabase = getPublicSupabase();
  const [servicesRes, projectsRes, settingsRes, statsRes, testimonialsRes, processRes] =
    await Promise.all([
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("stats").select("*").order("sort_order", { ascending: true }),
      supabase.from("testimonials").select("*").order("sort_order", { ascending: true }),
      supabase.from("process_steps").select("*").order("sort_order", { ascending: true }),
    ]);
  return {
    services: (servicesRes.data || []) as Service[],
    projects: (projectsRes.data || []) as Project[],
    settings: (settingsRes.data as Settings | null) || DEFAULT_SETTINGS,
    stats: (statsRes.data || []) as Stat[],
    testimonials: (testimonialsRes.data || []) as Testimonial[],
    process: (processRes.data || []) as ProcessStep[],
  };
}

export default async function Home() {
  const { services, projects, settings, stats, testimonials, process } = await getData();

  return (
    <>
      <Nav fullName={settings.full_name} />
      <main className="flex-1">
        <Hero settings={settings} />
        <StatsBar stats={stats} />
        <CapabilityLedger services={services} />
        <AboutSection settings={settings} />
        <Work projects={projects} />
        <ProcessSection steps={process} />
        <Testimonials items={testimonials} />
        <ContactSection email={settings.email} phone={settings.phone} />
      </main>
      <footer className="bg-ink text-stone/70 text-sm py-8 text-center font-mono-label">
        © {new Date().getFullYear()} {settings.full_name} — built, analyzed, written, and wired up by hand.
      </footer>
      <ChatWidget />
    </>
  );
}
