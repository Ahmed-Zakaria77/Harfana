export const CHARACTER_IDS = Array.from({ length: 10 }, (_, index) => `character-${String(index + 1).padStart(2, '0')}`)
const LEGACY = { 'فلفل':'character-01','لوزة':'character-02','زغلول':'character-03','بندق':'character-04','سمسم':'character-06','توتة':'character-10' }
export function normalizeCharacterId(value) { return CHARACTER_IDS.includes(value) ? value : LEGACY[value] || 'character-01' }
