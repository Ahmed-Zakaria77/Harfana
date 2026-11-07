import { collection, doc, getDoc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { reportFirebaseError } from '../utils/firebaseError.js'
import { normalizeCharacterId } from '../utils/characters.js'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const normalizeRoomCode = (value = '') => value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
export function createRoomCode() { return Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('') }

export async function createRoom({ uid, nickname, avatar, name, rounds, duration, categories, letterMode, instantStopEnabled=true }) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = createRoomCode(); const roomRef = doc(db, 'rooms', code); const playerRef = doc(roomRef, 'players', uid)
    try {
      await runTransaction(db, async tx => {
        if ((await tx.get(roomRef)).exists()) throw new Error('CODE_COLLISION')
        const now = serverTimestamp()
        tx.set(roomRef, { code, name, hostUid: uid, status: 'lobby', gameId: 'g1', gameNumber: 1, playerCount: 1, readyCount: 1, playerUids: [uid], maxPlayers: 10, totalRounds: Number(rounds), roundNumber: 0, durationSeconds: Number(duration), categories, letterMode, instantStopEnabled:Boolean(instantStopEnabled), usedLetters: [], currentRoundId: null, createdAt: now, updatedAt: now })
        tx.set(playerRef, { uid, nickname, avatar:normalizeCharacterId(avatar), ready: true, connected: true, joinedAt: now, lastSeenAt: now })
      })
      return code
    } catch (error) {
      if (error.message === 'CODE_COLLISION') continue
      reportFirebaseError(`create-room-attempt-${attempt + 1}`, error)
      throw error
    }
  }
  throw new Error('معرفناش نعمل كود للقعدة. جرّب تاني.')
}

export async function joinRoom({ code, uid, nickname, avatar }) {
  const normalized = normalizeRoomCode(code); const roomRef = doc(db, 'rooms', normalized); const playerRef = doc(roomRef, 'players', uid)
  try { await runTransaction(db, async tx => {
    const [roomSnap, playerSnap] = await Promise.all([tx.get(roomRef), tx.get(playerRef)])
    if (!roomSnap.exists()) throw new Error('ROOM_NOT_FOUND')
    const room = roomSnap.data()
    if (playerSnap.exists()) { tx.update(playerRef, { connected: true, lastSeenAt: serverTimestamp(), nickname, avatar:normalizeCharacterId(avatar) }); return }
    if (room.status !== 'lobby') throw new Error('GAME_STARTED')
    if (room.playerCount >= room.maxPlayers) throw new Error('ROOM_FULL')
    tx.update(roomRef, { playerCount: room.playerCount + 1, playerUids: [...room.playerUids, uid], updatedAt: serverTimestamp() })
    tx.set(playerRef, { uid, nickname, avatar:normalizeCharacterId(avatar), ready: false, connected: true, joinedAt: serverTimestamp(), lastSeenAt: serverTimestamp() })
  }) } catch (error) { reportFirebaseError('join-room', error); throw error }
  return normalized
}

export const getRoom = code => getDoc(doc(db, 'rooms', normalizeRoomCode(code)))
export const watchRoom = (code, callback, onError) => onSnapshot(doc(db, 'rooms', normalizeRoomCode(code)), snap => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null), onError)
export const watchPlayers = (code, callback, onError) => onSnapshot(collection(db, 'rooms', normalizeRoomCode(code), 'players'), snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError)
export async function setReady(code, uid, ready) {
  const roomRef=doc(db,'rooms',normalizeRoomCode(code)),playerRef=doc(roomRef,'players',uid)
  return runTransaction(db,async tx=>{const [roomSnap,playerSnap]=await Promise.all([tx.get(roomRef),tx.get(playerRef)]);if(!roomSnap.exists()||!playerSnap.exists())throw new Error('ROOM_NOT_FOUND');const current=Boolean(playerSnap.data().ready);if(current===Boolean(ready))return;tx.update(roomRef,{readyCount:(roomSnap.data().readyCount||0)+(ready?1:-1),updatedAt:serverTimestamp()});tx.update(playerRef,{ready:Boolean(ready),lastSeenAt:serverTimestamp()})})
}
export const updateRoomSettings = (code, settings) => updateDoc(doc(db, 'rooms', normalizeRoomCode(code)), { ...settings, updatedAt: serverTimestamp() })
