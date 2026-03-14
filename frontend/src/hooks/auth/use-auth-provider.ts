import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import { useCallback } from 'react'

import { exchangeProviderToken } from '@/api/auth'
import { firebaseAuth } from '@/lib/firebase'
import { authActions } from '@/stores/auth.store'

const googleProvider = new GoogleAuthProvider()

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'string' && error.trim()) {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim()
  ) {
    return error.message
  }

  return fallback
}

const completeBackendSession = async () => {
  const currentUser = firebaseAuth.currentUser
  if (!currentUser) {
    throw new Error('No Firebase user session')
  }

  const idToken = await currentUser.getIdToken(true)
  const response = await exchangeProviderToken({
    provider: 'firebase',
    idToken,
  })

  if (!response.success || !response.data) {
    throw new Error(
      getApiErrorMessage(response.error as unknown, 'Failed to create backend session'),
    )
  }

  authActions.login(response.data)
}

export const useAuthProvider = () => {
  const loginWithEmailPassword = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
    await completeBackendSession()
  }, [])

  const registerWithEmailPassword = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)

      if (displayName?.trim()) {
        await updateProfile(credential.user, { displayName: displayName.trim() })
      }

      try {
        await completeBackendSession()
      } catch (error) {
        // Roll back the Firebase account so the same email can be used to retry
        try {
          await credential.user.delete()
        } catch {}
        throw error
      }
    },
    [],
  )

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(firebaseAuth, googleProvider)
    await completeBackendSession()
  }, [])

  const sendResetPasswordLink = useCallback(async (email: string) => {
    await sendPasswordResetEmail(firebaseAuth, email)
  }, [])

  const updateDisplayNameOnly = useCallback(async (displayName: string) => {
    const currentUser = firebaseAuth.currentUser
    if (!currentUser) {
      throw new Error('No Firebase user session')
    }

    await updateProfile(currentUser, { displayName })
    await currentUser.getIdToken(true)
  }, [])

  const changePasswordWithCurrent = useCallback(
    async (currentPassword: string, nextPassword: string) => {
      const currentUser = firebaseAuth.currentUser
      if (!currentUser || !currentUser.email) {
        throw new Error('No Firebase password account')
      }

      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, nextPassword)
    },
    [],
  )

  const logoutProvider = useCallback(async () => {
    await signOut(firebaseAuth)
  }, [])

  return {
    loginWithEmailPassword,
    registerWithEmailPassword,
    loginWithGoogle,
    sendResetPasswordLink,
    updateDisplayNameOnly,
    changePasswordWithCurrent,
    logoutProvider,
  }
}
