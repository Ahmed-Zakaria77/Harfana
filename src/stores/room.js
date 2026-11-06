import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { watchPlayers, watchRoom } from '../services/rooms.js'
import { useAuthStore } from './auth.js'

export const useRoomStore = defineStore('room', () => {
  const room = ref(null); const players = ref([]); const loading = ref(false); const error = ref(''); let stops = [], activeCode = ''; const leases = new Set()
  const authStore = useAuthStore(); const isHost = computed(() => room.value?.hostUid === authStore.uid)
  function stopListeners(){ stops.forEach(stop => stop()); stops=[];activeCode='' }
  function subscribe(code) {
    const normalized=String(code).toUpperCase(),lease=Symbol(normalized)
    if(activeCode&&activeCode!==normalized){leases.clear();stopListeners();room.value=null;players.value=[]}
    if(!stops.length){activeCode=normalized;loading.value=true;error.value='';stops=[watchRoom(normalized,value=>{room.value=value;loading.value=false},cause=>{error.value=cause.message;loading.value=false}),watchPlayers(normalized,value=>{players.value=value},cause=>{error.value=cause.message})]}
    leases.add(lease);let released=false
    return ()=>{if(released)return;released=true;leases.delete(lease);if(!leases.size)stopListeners()}
  }
  function cleanup(){leases.clear();stopListeners()}
  return { room, players, loading, error, isHost, subscribe, cleanup }
})
