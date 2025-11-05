import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { app } from './firebase'

export const auth = getAuth(app)

const persistencePromise = setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to enable auth persistence', err)
})

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export async function signInWithGoogle() {
  await persistencePromise
  await signInWithPopup(auth, provider)
}

export async function signOutUser() {
  await signOut(auth)
}


