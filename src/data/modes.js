export const MODES = {
  all: {
    label: 'All Games',
    subtitle: 'Pick every game each week',
    description: '16 matchups per week, full exposure. Max games, max glory.',
    filter: () => true,
  },
  primetime: {
    label: 'Primetime Only',
    subtitle: 'TNF · SNF · MNF',
    description: 'Thursday Night, Sunday Night, and Monday Night Football only. The spotlight games.',
    filter: g => g.type === 'primetime',
  },
  divisional: {
    label: 'Division Rivals',
    subtitle: 'Rivalry matchups only',
    description: 'Predict divisional rivalry games — where every game matters for the standings.',
    filter: g => g.type === 'divisional' || g.type === 'primetime',
  },
  afc: {
    label: 'AFC Conference',
    subtitle: 'AFC games only',
    description: 'Track and predict all AFC matchups through the 2026 season.',
    filter: (g, teams) => {
      const T = teams
      return T[g.away]?.conf === 'AFC' || T[g.home]?.conf === 'AFC'
    },
  },
  nfc: {
    label: 'NFC Conference',
    subtitle: 'NFC games only',
    description: 'Track and predict all NFC matchups through the 2026 season.',
    filter: (g, teams) => {
      const T = teams
      return T[g.away]?.conf === 'NFC' || T[g.home]?.conf === 'NFC'
    },
  },
}
