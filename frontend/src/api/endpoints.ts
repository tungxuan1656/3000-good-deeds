export const API_ENDPOINTS = {
  auth: {
    google: '/auth/google',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  users: {
    me: '/users/me',
  },
  deeds: {
    list: '/deeds',
    create: '/deeds',
    update: (id: string) => `/deeds/${id}`,
    delete: (id: string) => `/deeds/${id}`,
    detail: (id: string) => `/deeds/${id}`,
  },
  categories: {
    list: '/categories',
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
