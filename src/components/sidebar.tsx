"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLocale } from "../i18n/use-locale";

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const navItems = [
    { id: "home", label: "Home", href: `/${locale}` },
    { id: "leagues", label: "Leagues", href: `/${locale}/leagues` },
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
        className={`text-sidebar-foreground fixed top-0 left-0 z-40 h-screen w-64 transform border-r border-white/10 bg-[#0d0a13] transition-transform duration-300 md:sticky ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col p-6 pt-16 md:pt-6">
          <div className="mb-12">
            <h1 className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
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
                    ? "bg-white/10 font-semibold text-white"
                    : "text-sidebar-foreground/65 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-primary/30 border-t pt-4">
            <p className="text-sidebar-foreground/50 text-xs">
              © {new Date().getFullYear()} Syndicus Amateur League
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
