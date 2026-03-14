export {}

declare global {
  interface Env {
    FIREBASE_PROJECT_ID: string
    JWT_SECRET: string
    DB: D1Database
    VAPID_PUBLIC_KEY: string
    VAPID_PRIVATE_KEY: string
    VAPID_SUBJECT: string
  }
}
