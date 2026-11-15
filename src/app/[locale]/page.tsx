"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Gamepad2, Trophy } from "lucide-react";
import Footer from "../../components/footer";
import Sidebar from "../../components/sidebar";

const competitions = [
  {
    name: "FC27",
    detail: "Weekly divisions, fixtures and promotion races.",
    icon: Trophy,
    accent: "border-violet-400/35 bg-violet-400/[0.045] text-violet-200",
  },
  {
    name: "League of Legends",
    detail: "A competitive 1v1 format on Howling Abyss.",
    icon: Gamepad2,
    accent: "border-white/20 bg-white/[0.025] text-white/70",
  },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <div className="flex min-h-screen bg-[#09070e] text-white">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="min-w-0 flex-1">
        <section className="relative flex min-h-[82vh] items-center overflow-hidden border-b border-white/15 px-6 py-20 md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_55%,rgba(40,21,211,0.14)_55%,transparent_75%)]" />
          <div className="relative mx-auto w-full max-w-6xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-violet-300 uppercase">
              <span className="h-px w-10 bg-violet-400" />
              Syndicus Amateur League
            </p>
            <h1 className="max-w-5xl text-6xl leading-[0.9] font-black tracking-[-0.06em] uppercase md:text-8xl lg:text-9xl">
              Play to
              <span className="block text-[#a83acd]">climb.</span>
            </h1>
            <p className="mt-8 max-w-xl border-l-2 border-[#2815d3] pl-5 text-base leading-7 text-white/60 md:text-lg">
              Two games. One community. Track your fixtures, results and place
              in the league.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/en/leagues"
                className="inline-flex items-center gap-3 bg-[#2815d3] px-6 py-4 text-sm font-black tracking-wide text-white uppercase transition hover:bg-[#a83acd]"
              >
                Explore the leagues <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://discord.gg/xAzn6DzuVP"
                className="border border-white/20 px-6 py-4 text-sm font-bold tracking-wide text-white/75 uppercase transition hover:border-white/50 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                Join our Discord
              </a>
            </div>
            <div className="mt-16 grid max-w-4xl gap-px border border-white/15 bg-white/15 sm:grid-cols-2">
              {competitions.map(({ name, detail, icon: Icon, accent }) => (
                <Link
                  key={name}
                  href="/en/leagues"
                  className={`group relative min-h-40 border-l-2 p-6 transition-colors hover:bg-white/[0.06] ${accent}`}
                >
                  <div className="mb-7 flex items-center justify-between">
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-bold tracking-widest text-white/35">01 / 02</span>
                  </div>
                  <h2 className="text-xl font-black tracking-wide text-white uppercase">{name}</h2>
                  <p className="mt-1 text-sm text-white/55">{detail}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
