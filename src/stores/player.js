import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { normalizeCharacterId } from '../utils/characters.js'

const saved = JSON.parse(localStorage.getItem('harfana:player') || '{}')
export const usePlayerStore = defineStore('player', () => {
  const nickname = ref(saved.nickname || '')
  const avatar = ref(normalizeCharacterId(saved.avatar))
  const roomCode = ref(saved.roomCode || '')
  watch([nickname, avatar, roomCode], () => localStorage.setItem('harfana:player', JSON.stringify({ nickname: nickname.value, avatar: avatar.value, roomCode: roomCode.value })))
  return { nickname, avatar, roomCode }
})
