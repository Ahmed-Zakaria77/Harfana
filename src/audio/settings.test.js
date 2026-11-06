import { describe,expect,it } from 'vitest'
import { AUDIO_DEFAULTS,loadAudioSettings,persistAudioSettings } from './settings.js'
const storage=()=>{const data=new Map();return{getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)}}
describe('audio settings',()=>{it('uses safe defaults',()=>expect(loadAudioSettings(storage())).toEqual(AUDIO_DEFAULTS));it('persists mute, toggles, and clamped volume',()=>{const target=storage();persistAudioSettings({muted:true,effectsEnabled:false,timerEnabled:true,volume:2},target);expect(loadAudioSettings(target)).toEqual({muted:true,effectsEnabled:false,timerEnabled:true,volume:1})})})
