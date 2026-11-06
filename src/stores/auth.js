import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { signInAnonymously } from 'firebase/auth'
import { auth, firebaseConfigured } from '../firebase/config.js'
import { firebaseErrorMessage } from '../utils/firebaseError.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null); const loading = ref(true); const error = ref('')
  const uid = computed(() => user.value?.uid || null)
  let readyPromise
  function initialize() {
    if (readyPromise) return readyPromise
    readyPromise = (async () => {
      if (!firebaseConfigured) { loading.value = false; error.value = 'إعدادات Firebase ناقصة'; return null }
      try {
        await auth.authStateReady()
        user.value = auth.currentUser || (await signInAnonymously(auth)).user
        error.value = ''
        return user.value
      } catch (cause) {
        error.value = firebaseErrorMessage('anonymous-auth', cause, 'معرفناش نوصّل باللعبة. جرّب تاني.')
        return null
      } finally { loading.value = false }
    })()
    return readyPromise
  }
  return { user, uid, loading, error, initialize }
})
