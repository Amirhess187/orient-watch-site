import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CraftSection from "./components/CraftSection";
import WatchSection from "./components/WatchSection";
import SideIndexRail from "./components/SideIndexRail";
import OutroSection from "./components/OutroSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { watches } from "./data/watches";
import { useSmoothScroll } from "./lib/smoothScroll";

function App() {
  useSmoothScroll();
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      <Loader ready={heroReady} />
      <Header />
      <SideIndexRail />
      <main>
        <Hero onReady={() => setHeroReady(true)} />
        <CraftSection />
        {watches.map((watch, i) => (
          <WatchSection key={watch.id} watch={watch} reverse={i % 2 === 1} />
        ))}
        <OutroSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
