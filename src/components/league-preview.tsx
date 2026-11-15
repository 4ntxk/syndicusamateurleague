"use client";

import Link from "next/link";
import { ArrowRight, Gamepad2, Trophy } from "lucide-react";
import { useLocale } from "../i18n/use-locale";

export default function LeaguePreview() {
  const locale = useLocale();
  const isEnglish = locale === "en";

  return (
    <section className="border-y border-[#8b5cf6]/20 bg-[#120b20] px-4 py-14 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.24em] text-[#a78bfa] uppercase">
              {isEnglish ? "Now active" : "Teraz aktywne"}
            </p>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              {isEnglish ? "SAL League Season 1" : "SAL League Sezon 1"}
            </h2>
            <p className="mt-2 max-w-2xl text-white/65">
              {isEnglish
                ? "Weekly FC27 divisions and a competitive League of Legends 1v1 circuit."
                : "Cotygodniowe dywizje FC27 oraz rywalizacja League of Legends 1v1."}
            </p>
          </div>
          <Link
            href={`/${locale}/leagues`}
            className="inline-flex items-center gap-2 font-semibold text-[#c4b5fd] transition hover:text-white"
          >
            {isEnglish ? "Open league hub" : "Otwórz centrum ligowe"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/10 to-transparent p-6">
            <Trophy className="mb-5 h-8 w-8 text-amber-300" />
            <h3 className="text-xl font-bold text-white">FC27 Season 1</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {isEnglish
                ? "13 players · Platinum, Gold and Silver · four calibration weeks."
                : "13 zawodników · Platinum, Gold i Silver · cztery tygodnie kalibracyjne."}
            </p>
          </article>
          <article className="rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 to-transparent p-6">
            <Gamepad2 className="mb-5 h-8 w-8 text-violet-300" />
            <h3 className="text-xl font-bold text-white">LoL 1v1</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {isEnglish
                ? "Howling Abyss · double elimination · First Blood, turret or 100 CS."
                : "Howling Abyss · double elimination · First Blood, wieża lub 100 CS."}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
