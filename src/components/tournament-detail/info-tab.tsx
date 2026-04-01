'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

type TournamentInfoSection = {
  title: string
  bullets: string[]
}

type TournamentSummary = {
  registration: string
  start: string
  status: string
  accessLabel?: string
  accessValue?: string
  accessUrl?: string
  infoHintPrefix: string
  infoHintLink: string
  regulationsLabel: string
  regulationsCta: string
}

type TournamentInfoTabProps = {
  summaryTitle: string
  registrationButtonLabel: string
  guardianConsentButtonLabel: string
  showRegistrationButton: boolean
  showGuardianConsentButton: boolean
  registrationUrl: string
  guardianConsentUrl: string
  regulationsUrl: string
  discordUrl: string
  summaryLabels: {
    registration: string
    start: string
    status: string
    info: string
  }
  summary: TournamentSummary
  sections: TournamentInfoSection[]
}

export function TournamentInfoTab({
  summaryTitle,
  registrationButtonLabel,
  guardianConsentButtonLabel,
  showRegistrationButton,
  showGuardianConsentButton,
  registrationUrl,
  guardianConsentUrl,
  regulationsUrl,
  discordUrl,
  summaryLabels,
  summary,
  sections,
}: TournamentInfoTabProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_30px_rgba(168,58,205,0.08)]">
        <div className="mb-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d6adff]">
            Tournament Brief
          </p>
          <h3 className="text-xl font-black text-foreground">
            {summaryTitle}
          </h3>
        </div>

        <div className="mb-5 h-px bg-gradient-to-r from-[#a83acd]/60 via-white/10 to-transparent" />

        {showRegistrationButton ? (
          <div className="mb-5 flex flex-wrap gap-3">
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#2815d3] hover:bg-[#a83acd] text-white cursor-pointer">
                {registrationButtonLabel}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            {showGuardianConsentButton ? (
              <a
                href={guardianConsentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white cursor-pointer">
                  {guardianConsentButtonLabel}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            ) : null}
          </div>
        ) : showGuardianConsentButton ? (
          <div className="mb-5">
            <a
              href={guardianConsentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white cursor-pointer">
                {guardianConsentButtonLabel}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-foreground/60">{summaryLabels.registration}</p>
            <p className="font-semibold text-foreground">{summary.registration}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-foreground/60">{summaryLabels.start}</p>
            <p className="font-semibold text-[#a83acd]">{summary.start}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-foreground/60">{summaryLabels.status}</p>
            <p className="font-semibold text-foreground">{summary.status}</p>
          </div>
          {summary.accessLabel && summary.accessValue ? (
            <div>
              <p className="mb-1 text-sm text-foreground/60">{summary.accessLabel}</p>
              {summary.accessUrl ? (
                <a
                  href={summary.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-300 underline underline-offset-4 transition-colors hover:text-amber-200"
                >
                  {summary.accessValue}
                </a>
              ) : (
                <p className="font-semibold text-amber-300">{summary.accessValue}</p>
              )}
            </div>
          ) : null}
          <div>
            <p className="mb-1 text-sm text-foreground/60">{summaryLabels.info}</p>
            <p className="text-foreground/80">
              {summary.infoHintPrefix}{' '}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 underline underline-offset-4 transition-colors hover:text-[#a83acd]"
              >
                {summary.infoHintLink}
              </a>
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-foreground/60">{summary.regulationsLabel}</p>
            <a
              href={regulationsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-semibold text-[#d6adff] underline underline-offset-4 transition-colors hover:text-white"
            >
              {summary.regulationsCta}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <div
            key={`${section.title}-${index}`}
            className="rounded-lg border border-[#2815d3]/40 bg-[#140b24] p-5 shadow-[0_0_30px_rgba(168,58,205,0.15)]"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-[#a83acd]/40 bg-[#2815d3]/20 px-2 text-xs font-black text-[#d6adff]">
                {index + 1}
              </span>
              <div>
                <h4 className="text-lg font-black text-foreground">
                  {section.title}
                </h4>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              {section.bullets.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
