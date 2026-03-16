import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Automation } from "@/components/sections/Automation";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { BlogPreview } from "@/components/sections/BlogPreview";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <Automation />
      <TechStack />
      <BlogPreview />
      <Testimonials />
      <About />
      <Contact />
    </main>
  );
}
