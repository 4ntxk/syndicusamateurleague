import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import fixturesData from "../../../../data/fc27-season-1-week-1-public.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resultSchema = z.object({
  fixtureId: z.string().min(1),
  division: z.enum(["Platinum", "Gold", "Silver"]),
  homeUsername: z.string().min(1),
  awayUsername: z.string().min(1),
  homeGoals: z.number().int().min(0).max(99),
  awayGoals: z.number().int().min(0).max(99),
});

function authorized(request: NextRequest) {
  const secret = process.env.FC27_RESULTS_SYNC_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !supplied) return false;

  const expectedBytes = Buffer.from(secret);
  const suppliedBytes = Buffer.from(supplied);
  return (
    expectedBytes.length === suppliedBytes.length &&
    timingSafeEqual(expectedBytes, suppliedBytes)
  );
}

export async function GET() {
  try {
    const results = await db.fC27Result.findMany({
      orderBy: { confirmedAt: "asc" },
    });
    return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Results are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = resultSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid result payload." }, { status: 400 });
  }

  const result = parsed.data;
  const fixture = fixturesData.fixtures.find(
    (entry) => entry.id === result.fixtureId,
  );
  if (
    !fixture ||
    fixture.division !== result.division ||
    fixture.homeDiscordUsername !== result.homeUsername ||
    fixture.awayDiscordUsername !== result.awayUsername
  ) {
    return NextResponse.json({ error: "Fixture does not match the season schedule." }, { status: 400 });
  }

  try {
    const saved = await db.fC27Result.upsert({
      where: { fixtureId: result.fixtureId },
      create: result,
      update: result,
    });
    return NextResponse.json({ ok: true, fixtureId: saved.fixtureId });
  } catch {
    return NextResponse.json({ error: "Could not save the result." }, { status: 503 });
  }
}
