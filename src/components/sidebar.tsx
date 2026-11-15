"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLocale } from "../i18n/use-locale";
import { getTranslations } from "../i18n/translations";

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = getTranslations(locale);

  const navItems = [
    { id: "home", label: t.nav.home, href: `/${locale}` },
    { id: "leagues", label: t.nav.leagues, href: `/${locale}/leagues` },
    {
      id: "registration",
      label: t.nav.registration,
      href: `/${locale}/registration`,
    },
    {
      id: "tournaments",
      label: t.nav.tournaments,
      href: `/${locale}/tournaments`,
    },
    { id: "rankings", label: t.nav.rankings, href: `/${locale}/rankings` },
    { id: "gallery", label: t.nav.gallery, href: `/${locale}/gallery` },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground fixed top-4 left-4 z-50 rounded-lg p-2 md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`text-sidebar-foreground border-primary/40 fixed top-0 left-0 z-40 h-screen w-64 transform border-r bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a] transition-transform duration-300 md:sticky ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col p-6 pt-16 md:pt-6">
          <div className="mb-12">
            <h1 className="bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-2xl font-bold text-transparent">
              SAL
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.href) {
                    router.push(item.href);
                  }
                  setIsOpen(false);
                }}
                className={`w-full cursor-pointer rounded-lg px-4 py-3 text-left transition-colors ${
                  activeNav === item.id
                    ? "bg-[#7c3aed] font-semibold text-white"
                    : "text-sidebar-foreground hover:bg-[#7c3aed]/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-primary/30 border-t pt-4">
            <p className="text-sidebar-foreground/50 text-xs">
              c 2025 Syndicus Amateur League, Inc.
            </p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
