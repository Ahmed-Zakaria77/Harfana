export const AUDIO_DEFAULTS = { muted:false, effectsEnabled:true, timerEnabled:true, volume:0.6 }

export function loadAudioSettings(storage = globalThis.localStorage) {
  try {
    const legacy = JSON.parse(storage?.getItem('harfana:settings') || '{}')
    const saved = JSON.parse(storage?.getItem('harfana:audio') || '{}')
    return {
      muted: saved.muted ?? (legacy.sound === false),
      effectsEnabled: saved.effectsEnabled ?? true,
      timerEnabled: saved.timerEnabled ?? true,
      volume: Math.min(1, Math.max(0, Number(saved.volume ?? 0.6))),
    }
  } catch { return { ...AUDIO_DEFAULTS } }
}

export function persistAudioSettings(settings, storage = globalThis.localStorage) {
  storage?.setItem('harfana:audio', JSON.stringify({ muted:Boolean(settings.muted), effectsEnabled:Boolean(settings.effectsEnabled), timerEnabled:Boolean(settings.timerEnabled), volume:Math.min(1,Math.max(0,Number(settings.volume))) }))
}
