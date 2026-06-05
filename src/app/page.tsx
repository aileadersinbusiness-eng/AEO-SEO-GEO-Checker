import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PlatformCoverage from "@/components/PlatformCoverage";
import Analyzer from "@/components/Analyzer";
import Footer from "@/components/Footer";
import PencilDrawing from "@/components/PencilDrawing";

export default function Home() {
  return (
    <main className="relative min-h-screen animated-bg overflow-x-hidden">
      <div className="grid-pattern fixed inset-0 pointer-events-none" />
      <PencilDrawing />
      <Navbar />
      <Hero />
      <HowItWorks />
      <PlatformCoverage />
      <Analyzer />
      <Footer />
    </main>
  );
}
