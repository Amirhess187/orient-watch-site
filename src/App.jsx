import { useCallback, useState } from "react";
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
  const [heroProgress, setHeroProgress] = useState(0);
  const [craftProgress, setCraftProgress] = useState(0);
  const handleHeroProgress = useCallback((p) => setHeroProgress(p), []);
  const handleCraftProgress = useCallback((p) => setCraftProgress(p), []);
  // Gate on whichever sequence is further behind — the loader shouldn't
  // hide while either one still has frames a fast scroll could outrun.
  const loadProgress = Math.min(heroProgress, craftProgress);

  return (
    <>
      <Loader progress={loadProgress} />
      <Header />
      <SideIndexRail />
      <main>
        <Hero onProgress={handleHeroProgress} />
        <CraftSection onProgress={handleCraftProgress} />
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
