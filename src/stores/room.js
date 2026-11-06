import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { watchPlayers, watchRoom } from '../services/rooms.js'
import { useAuthStore } from './auth.js'

export const useRoomStore = defineStore('room', () => {
  const room = ref(null); const players = ref([]); const loading = ref(false); const error = ref(''); let stops = []
  const authStore = useAuthStore(); const isHost = computed(() => room.value?.hostUid === authStore.uid)
  function subscribe(code) { cleanup(); loading.value = true; stops = [watchRoom(code, value => { room.value = value; loading.value = false }, cause => { error.value = cause.message; loading.value = false }), watchPlayers(code, value => { players.value = value }, cause => { error.value = cause.message })] }
  function cleanup(){ stops.forEach(stop => stop()); stops=[] }
  return { room, players, loading, error, isHost, subscribe, cleanup }
})
