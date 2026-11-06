<script setup>
import { ref } from 'vue'
import { Volume2, VolumeX, Settings, X } from 'lucide-vue-next'
import { useSettingsStore } from './stores/settings.js'
import { audioManager } from './audio/manager.js'
const settings = useSettingsStore()
const showSettings = ref(false)
audioManager.configure(()=>({muted:settings.muted,effectsEnabled:settings.effectsEnabled,timerEnabled:settings.timerEnabled,volume:settings.volume}))
function handleUiAudio(event){const target=event.target.closest?.('button,a');if(!target||target.dataset.audio==='none')return;audioManager.play(target.dataset.audio||'click')}
function toggleMute(){settings.muted=!settings.muted;if(!settings.muted)audioManager.play('select',{force:true})}
function previewSound(){audioManager.play('roundStart',{force:true})}
</script>

<template>
  <div class="app-shell" :class="{ 'reduce-motion': settings.reducedMotion }" @click.capture="handleUiAudio">
    <header class="topbar">
      <RouterLink to="/" class="mini-brand" aria-label="حرفنة — الصفحة الرئيسية"><img src="/logo.png" alt="حرفنة" /></RouterLink>
      <div class="top-actions">
        <button class="icon-btn" data-audio="none" :aria-label="settings.muted ? 'شغّل الصوت' : 'اقفل الصوت'" @click="toggleMute"><VolumeX v-if="settings.muted"/><Volume2 v-else/></button>
        <button class="icon-btn" aria-label="الإعدادات" @click="showSettings = true"><Settings/></button>
      </div>
    </header>
    <main><RouterView @open-settings="showSettings = true" /></main>
    <footer>اتعملت بحب ولمّة حلوة 💜</footer>
    <Transition name="fade">
      <div v-if="showSettings" class="modal-backdrop" @click.self="showSettings = false">
        <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <button class="close-btn" aria-label="اقفل" @click="showSettings = false"><X/></button>
          <span class="sticker">ظبّطها على مزاجك</span><h2 id="settings-title">الإعدادات</h2>
          <label class="toggle-row"><span><b>كتم الصوت</b><small>اقفل كل أصوات اللعبة</small></span><input v-model="settings.muted" type="checkbox" role="switch" /></label>
          <label class="toggle-row"><span><b>المؤثرات</b><small>الأزرار والجولات والنتايج</small></span><input v-model="settings.effectsEnabled" type="checkbox" role="switch" /></label>
          <label class="toggle-row"><span><b>صوت العد التنازلي</b><small>تنبيهات آخر وقت الجولة</small></span><input v-model="settings.timerEnabled" type="checkbox" role="switch" /></label>
          <label class="volume-row"><span><b>مستوى الصوت</b><small>{{Math.round(settings.volume*100)}}٪</small></span><input v-model.number="settings.volume" type="range" min="0" max="1" step="0.05" /></label>
          <label class="toggle-row"><span><b>حركة أقل</b><small>قلّل الأنيميشن في اللعبة</small></span><input v-model="settings.reducedMotion" type="checkbox" role="switch" /></label>
          <button class="btn btn-soft btn-full audio-preview" data-audio="none" :disabled="settings.muted" @click="previewSound"><Volume2/> جرّب الصوت</button>
          <button class="btn btn-primary btn-full" @click="showSettings = false">تمام يا معلم</button>
        </section>
      </div>
    </Transition>
  </div>
</template>
