import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const

for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing Firebase configuration: ${key}`)
  }
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(app)
