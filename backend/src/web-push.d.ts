declare module 'web-push' {
  type PushSubscription = {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }

  type PushOptions = {
    TTL?: number
    urgency?: 'very-low' | 'low' | 'normal' | 'high'
  }

  export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void
  export function sendNotification(
    subscription: PushSubscription,
    payload?: string,
    options?: PushOptions,
  ): Promise<void>
}
