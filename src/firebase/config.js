import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean)
export const firebaseApp = firebaseConfigured ? initializeApp(firebaseConfig) : null
export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const db = firebaseApp ? getFirestore(firebaseApp) : null

if (firebaseApp && import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true' && !globalThis.__harfanaEmulators) {
  const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1'
  const authPort = Number(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || 9099)
  const firestorePort = Number(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT || 8085)
  connectAuthEmulator(auth, `http://${emulatorHost}:${authPort}`, { disableWarnings: true })
  connectFirestoreEmulator(db, emulatorHost, firestorePort)
  console.info('[Firebase:emulators]', { projectId: firebaseConfig.projectId, host: emulatorHost, authPort, firestorePort })
  globalThis.__harfanaEmulators = true
}
