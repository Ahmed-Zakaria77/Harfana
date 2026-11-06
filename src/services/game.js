import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '../firebase/config.js'
import { normalizeRoomCode } from './rooms.js'

export async function startRound(roomCode, letter) { return (await httpsCallable(functions, 'startRound')({ roomCode: normalizeRoomCode(roomCode), letter })).data }
export async function lockRound(roomCode, roundId) { return (await httpsCallable(functions, 'lockRound')({ roomCode: normalizeRoomCode(roomCode), roundId })).data }
export async function stopRoundNow(roomCode, roundId, answers) { return (await httpsCallable(functions, 'stopRound')({ roomCode: normalizeRoomCode(roomCode), roundId, answers })).data }
export async function finalizeRound(roomCode, roundId, decisions) { return (await httpsCallable(functions, 'finalizeRound')({ roomCode: normalizeRoomCode(roomCode), roundId, decisions })).data }
export async function startNextRound(roomCode) { return (await httpsCallable(functions, 'startNextRound')({ roomCode: normalizeRoomCode(roomCode) })).data }
export function watchRound(roomCode, roundId, callback, onError) { return onSnapshot(doc(db, 'rooms', normalizeRoomCode(roomCode), 'rounds', roundId), snap => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null), onError) }
export function watchAnswers(roomCode, roundId, callback, onError) { return onSnapshot(collection(db, 'rooms', normalizeRoomCode(roomCode), 'rounds', roundId, 'answers'), snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError) }
export function watchMyAnswer(roomCode, roundId, uid, callback, onError) { return onSnapshot(doc(db, 'rooms', normalizeRoomCode(roomCode), 'rounds', roundId, 'answers', uid), snap => callback(snap.exists()?snap.data():null), onError) }
export async function saveAnswers(roomCode, roundId, uid, answers) { return setDoc(doc(db, 'rooms', normalizeRoomCode(roomCode), 'rounds', roundId, 'answers', uid), { uid, values: answers, updatedAt: serverTimestamp() }, { merge: true }) }
