import type { Tournament } from '../data/tournaments'

export function isSeasonOneTournament(tournament: Tournament) {
  return tournament.title.startsWith('S1 ')
}

export function getGuardianConsentUrl(locale: string | undefined) {
  return locale === 'en'
    ? '/legal-guardian-consent-sals1.pdf'
    : '/zgoda-opekuna-prawnego-sals1.pdf'
}
