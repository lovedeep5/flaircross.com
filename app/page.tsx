import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Automation } from "@/components/sections/Automation";
import { Portfolio } from "@/components/sections/Portfolio";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <Automation />
      <Portfolio />
      <TechStack />
      <Testimonials />
      <About />
      <Contact />
    </main>
  );
}
