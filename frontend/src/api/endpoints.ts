export const API_ENDPOINTS = {
  auth: {
    providerExchange: '/auth/provider/exchange',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  users: {
    me: '/users/me',
    deleteMe: '/users/me',
  },
  deeds: {
    list: '/deeds',
    update: (id: string) => `/deeds/${id}`,
    detail: (id: string) => `/deeds/${id}`,
  },
  goals: {
    list: '/goals',
    upsert: '/goals',
    history: '/goals/history',
  },
  stats: {
    summary: '/stats/summary',
  },
  activities: {
    calendar: '/activities/calendar',
    streak: '/activities/streak',
  },
  reminders: {
    settings: '/reminders/settings',
    pushKey: '/reminders/push-key',
    subscriptions: '/reminders/subscriptions',
    test: '/reminders/test',
  },
  cultivation: {
    randomQuote: '/cultivation/quotes/random',
    randomAct: '/cultivation/acts/random',
    randomActsList: '/cultivation/acts/random-list',
  },
  journal: {
    list: '/journal',
    create: '/journal',
    entries: '/journal/entries',
    entryDetail: (id: string) => `/journal/entries/${id}`,
  },
  seed: '/seed',
} as const
