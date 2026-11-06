import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadAudioSettings, persistAudioSettings } from '../audio/settings.js'

const audio=loadAudioSettings()
const legacy=JSON.parse(localStorage.getItem('harfana:settings')||'{}')
export const useSettingsStore=defineStore('settings',()=>{
  const muted=ref(audio.muted),effectsEnabled=ref(audio.effectsEnabled),timerEnabled=ref(audio.timerEnabled),volume=ref(audio.volume),reducedMotion=ref(legacy.reducedMotion??false)
  watch([muted,effectsEnabled,timerEnabled,volume],()=>persistAudioSettings({muted:muted.value,effectsEnabled:effectsEnabled.value,timerEnabled:timerEnabled.value,volume:volume.value}))
  watch(reducedMotion,value=>localStorage.setItem('harfana:settings',JSON.stringify({sound:!muted.value,reducedMotion:value})))
  return{muted,effectsEnabled,timerEnabled,volume,reducedMotion}
})
