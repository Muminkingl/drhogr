import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import TimelineSection from "./components/TimelineSection";
import InstitutionalSection from "./components/InstitutionalSection";
import MediaSection from "./components/MediaSection";
import Footer, { MembershipsSection } from "./components/MembershipsAndFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <TimelineSection />
        <InstitutionalSection />
        <MediaSection />
        <MembershipsSection />
      </main>
      <Footer />
    </>
  );
}
