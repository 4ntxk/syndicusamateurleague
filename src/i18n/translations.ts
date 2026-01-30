import { defaultLocale, isLocale, type Locale } from './config'

const translations = {
  pl: {
    nav: {
      home: 'Home',
      registration: 'Rejestracja',
      tournaments: 'Turnieje',
      gallery: 'Galeria',
    },
    languageSwitch: {
      label: 'Język',
      pl: 'PL',
      en: 'ENG',
    },
    hero: {
      title: 'Rywalizuj na najwyższym poziomie',
      subtitle: 'Dołącz do naszej platformy. Bierz udział w turniejach e-sportowych offline i online.',
      cta: 'Rejestracja',
    },
    schedule: {
      title: '2026 Harmonogram turniejowy',
      subtitle: 'Zaznacz w kalendarzu SALowe wydarzenia e-sportowe',
      open: 'Rejestracja otwarta',
      soon: 'Rejestracja wkrótce',
      cardAriaPrefix: 'Przejdź do rejestracji',
    },
    carousel: {
      title: 'Galeria',
      subtitle: 'Więcej zdjęć na podstronie Galeria',
      prev: 'Poprzedni slajd',
      next: 'Następny slajd',
      goTo: 'Przejdź do slajdu',
    },
    sponsors: {
      title: 'Sponsorzy',
      subtitle: 'Wspierają nas od pierwszego dnia',
      ariaPrefix: 'Otwórz stronę sponsora',
    },
    registration: {
      title: 'Harmonogram 2026',
      subtitle: 'Zapisz się na wybrany turniej',
      heading: 'Zapisz się na wybrany turniej',
      description:
        'Wybierz poniżej turniej i zarejestruj się za pomocą formularza Google, aby zapewnić sobie miejsce.',
      registrationLabel: 'Rejestracja',
      startLabel: 'Start turnieju',
      button: 'Rejestracja',
      buttonUnavailable: 'Rejestracja niedostępna',
    },
    tournaments: {
      title: 'Turnieje 2026',
      subtitle: 'Wszystko o nadchodzących wydarzeniach',
      activeTitle: 'Aktywne turnieje',
      activeSubtitle: 'Lista turniejów z otwartą rejestracją lub trwających.',
      empty: 'Aktualnie brak aktywnych turniejów. Wróć później po nowe informacje.',
      registrationLabel: 'Rejestracja',
      startLabel: 'Start turnieju',
      statusLabel: 'Status',
      statusOpen: 'Rejestracja otwarta',
      statusOngoing: 'Turniej trwa',
      cardAriaPrefix: 'Przejdź do turnieju',
    },
    tournamentDetail: {
      titleFallback: 'Turniej',
      subtitle: 'Szczegóły aktywnego turnieju',
      back: 'Wróć do listy turniejów',
      notFound: 'Nie znaleźliśmy takiego turnieju. Wróć do listy i wybierz inny.',
      info: {
        title: 'Harmonogram turnieju',
        registration: {
          title: 'Rejestracja',
          bullets: [
            'Otwarta od 10.01 do 29.01',
            'Gracze rejestrują się przez formularz Google, który można znaleźć w zakładce Rejestracja w karcie odpowiedniego turnieju',
          ],
        },
        qualifiers: {
          title: 'Faza eliminacyjna (1. tydzień, 31.01 - 7.02)',
          bullets: [
            'Sześć grup po 4 graczy',
            'System każdy z każdym',
            '1 miejsce w grupie awansuje bezpośrednio do Fazy II. 2 miejsca grają baraże.',
            'Zawodnicy sami dogadują się kiedy grają poszczególne mecze, najlepiej na discordzie SAL. Najważniejsze, aby rozegrać swoje mecze grupowe do 7.02',
          ],
        },
        announcements: {
          title: 'Przed startem turnieju ogłaszana jest:',
          bullets: [
            'liczba graczy',
            'liczba miejsc awansujących',
            'data zakończenia fazy grupowej (data, do której zawodnicy muszą rozegrać swoje mecze grupowe)',
          ],
        },
        playoffs: {
          title: 'Faza pucharowa',
          bullets: ['Double Elimination', 'Drabinka 8 graczy'],
        },
      },
      tabs: {
        info: 'Informacje',
        players: 'Lista graczy',
        groups: 'Grupy',
        playoffs: 'Playoffy',
      },
      groups: {
        standingsTitle: 'Tabela',
        standingsColumns: {
          player: 'Zawodnik',
          win: 'W',
          loss: 'L',
          points: 'Punkty',
        },
        matchesScheduledTitle: 'Mecze do rozegrania',
        matchesPlayedTitle: 'Mecze rozegrane',
        matchesEmpty: 'Brak meczów do rozegrania.',
        matchesPlayedEmpty: 'Brak meczów rozegranych.',
        noticeLines: [
          '1 miejsce w grupie awansuje bezpośrednio do Fazy II.',
          '2 miejsca grają baraże.',
        ],
      },
      labels: {
        registration: 'Rejestracja',
        info: 'Informacje',
        start: 'Start turnieju',
        status: 'Status',
      },
      infoHintPrefix: 'Szczegółowe informacje na',
      infoHintLink: 'discordzie',
      statusOpen: 'Rejestracja otwarta',
      statusOngoing: 'Turniej trwa',
      registrationHint: 'Przejdź do zakładki Rejestracja, aby zapisać się na turniej.',
      playersEmpty: 'Lista graczy pojawi się po zamknięciu rejestracji.',
      groupsEmpty: 'Grupy będą widoczne po zakończeniu rejestracji.',
      playoffsEmpty: 'Drabinka playoffów będzie dostępna po zakończeniu fazy grupowej.',
    },
    gallery: {
      title: 'Galeria',
      subtitle: 'Odkryj momenty z naszych turniejów i wydarzeń',
      wipTitle: 'Wkrótce',
      wipText:
        'Nasza galeria jest obecnie w trakcie tworzenia. W międzyczasie zapraszamy do obejrzenia zdjęć z turniejów i najważniejszych wydarzeń na Google Drive.',
      button: 'Zobacz Google Drive',
    },
    footer: {
      description: 'Syndicus Amateur League. E-sportowe wydarzenia na wyciągnięcie ręki',
      rights: 'c 2025 Syndicus Amateur League. Wszelkie prawa zastrzeżone.',
    },
    about: {
      title: 'O nas',
      body: 'To prosta strona Next.js App Router - bez autoryzacji, bazy danych i tRPC.',
      back: 'Powrót do Home',
    },
  },
  en: {
    nav: {
      home: 'Home',
      registration: 'Registration',
      tournaments: 'Tournaments',
      gallery: 'Gallery',
    },
    languageSwitch: {
      label: 'Language',
      pl: 'PL',
      en: 'ENG',
    },
    hero: {
      title: 'Compete at the highest level',
      subtitle: 'Join our platform. Take part in online and offline e-sports tournaments.',
      cta: 'Registration',
    },
    schedule: {
      title: '2026 Tournament Schedule',
      subtitle: 'Mark SAL e-sports events in your calendar',
      open: 'Registration open',
      soon: 'Registration soon',
      cardAriaPrefix: 'Go to registration',
    },
    carousel: {
      title: 'Gallery',
      subtitle: 'More photos on the Gallery page',
      prev: 'Previous slide',
      next: 'Next slide',
      goTo: 'Go to slide',
    },
    sponsors: {
      title: 'Sponsors',
      subtitle: 'Supporting us from day one',
      ariaPrefix: 'Open sponsor page',
    },
    registration: {
      title: 'Schedule 2026',
      subtitle: 'Register for a tournament',
      heading: 'Register for a tournament',
      description:
        'Choose a tournament below and register via Google Forms to secure your spot.',
      registrationLabel: 'Registration',
      startLabel: 'Tournament start',
      button: 'Registration',
      buttonUnavailable: 'Registration unavailable',
    },
    tournaments: {
      title: 'Tournaments 2026',
      subtitle: 'Everything about upcoming events',
      activeTitle: 'Active tournaments',
      activeSubtitle: 'Tournaments with open registration or currently ongoing.',
      empty: 'No active tournaments right now. Check back later for updates.',
      registrationLabel: 'Registration',
      startLabel: 'Tournament start',
      statusLabel: 'Status',
      statusOpen: 'Registration open',
      statusOngoing: 'Ongoing',
      cardAriaPrefix: 'Go to tournament',
    },
    tournamentDetail: {
      titleFallback: 'Tournament',
      subtitle: 'Active tournament details',
      back: 'Back to tournament list',
      notFound: 'We could not find that tournament. Go back to the list and pick another.',
      info: {
        title: 'Tournament schedule',
        registration: {
          title: 'Registration',
          bullets: [
            'Open from 10.01 to 29.01',
            'Players register via a Google Form available in the Registration tab in the card for the given tournament',
          ],
        },
        qualifiers: {
          title: 'Qualifiers (week 1, 31.01 - 7.02)',
          bullets: [
            'Six groups of 4 players',
            'Round-robin format',
            '1st place advances directly to Phase II. 2nd places play playoffs.',
            'Players arrange match times themselves, preferably on the SAL Discord. The key is to complete group matches by 7.02',
          ],
        },
        announcements: {
          title: 'Before the tournament starts we announce:',
          bullets: [
            'number of players',
            'number of qualifying spots',
            'group stage end date (deadline for players to complete their group matches)',
          ],
        },
        playoffs: {
          title: 'Playoffs',
          bullets: ['Double elimination', '8-player bracket'],
        },
      },
      tabs: {
        info: 'Info',
        players: 'Player list',
        groups: 'Groups',
        playoffs: 'Playoffs',
      },
      groups: {
        standingsTitle: 'Standings',
        standingsColumns: {
          player: 'Player',
          win: 'W',
          loss: 'L',
          points: 'Points',
        },
        matchesScheduledTitle: 'Matches to play',
        matchesPlayedTitle: 'Played matches',
        matchesEmpty: 'No matches to play.',
        matchesPlayedEmpty: 'No matches played yet.',
        noticeLines: [
          '1st place in the group advances directly to Phase II.',
          '2nd places play playoffs.',
        ],
      },
      labels: {
        registration: 'Registration',
        info: 'Information',
        start: 'Tournament start',
        status: 'Status',
      },
      infoHintPrefix: 'Detailed information on',
      infoHintLink: 'Discord',
      statusOpen: 'Registration open',
      statusOngoing: 'Ongoing',
      registrationHint: 'Go to the Registration tab to sign up for this tournament.',
      playersEmpty: 'The player list will appear after registration closes.',
      groupsEmpty: 'Groups will be visible after registration closes.',
      playoffsEmpty: 'Playoff bracket will be available after the group stage ends.',
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Discover moments from our tournaments and events',
      wipTitle: 'Coming soon',
      wipText:
        'Our gallery is currently being built. In the meantime, view photos from tournaments and key events on Google Drive.',
      button: 'View Google Drive',
    },
    footer: {
      description: 'Syndicus Amateur League. E-sports events within reach',
      rights: 'c 2025 Syndicus Amateur League. All rights reserved.',
    },
    about: {
      title: 'About',
      body: 'A simple Next.js App Router site - no auth, no database, no tRPC.',
      back: 'Back to Home',
    },
  },
}

export type Translations = typeof translations.pl

export function getTranslations(locale: string | undefined): Translations {
  if (isLocale(locale)) {
    return translations[locale]
  }

  return translations[defaultLocale]
}
