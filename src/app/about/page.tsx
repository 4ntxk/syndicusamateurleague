import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-6 text-4xl font-bold">About</h1>
        <p className="mb-8 text-lg text-white/90">
          This is a simple multi‑page Next.js App Router site — no auth, no DB, no tRPC.
        </p>
        <Link
          href="/"
          className="rounded-full bg-white/10 px-6 py-3 font-semibold hover:bg-white/20"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

