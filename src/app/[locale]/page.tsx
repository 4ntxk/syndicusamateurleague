"use client";

import { useState } from "react";
import Sidebar from "../../components/sidebar";
import Hero from "../../components/hero";
import Schedule from "../../components/schedule";
import Carousel from "../../components/carousel";
import Sponsors from "../../components/sponsors";
import Footer from "../../components/footer";
import LeaguePreview from "../../components/league-preview";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1">
        <Hero />
        <LeaguePreview />
        <Schedule />
        <Carousel />
        <Sponsors />
        <Footer />
      </main>
    </div>
  );
}
