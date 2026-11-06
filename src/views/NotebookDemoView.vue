<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Grid3X3, Smartphone, Wifi } from 'lucide-vue-next'
import CharacterAvatar from '../components/common/CharacterAvatar.vue'
const categories = ['ولد','بنت','جماد','حيوان','بلاد','فيلم']
const answers = ref(Object.fromEntries(categories.map(c => [c, ''])))
const mode = ref('table'); const active = ref(0)
const filled = computed(() => Object.values(answers.value).filter(Boolean).length)
</script>
<template><div class="game-demo">
  <header class="game-header"><RouterLink to="/" class="back-link light"><ArrowRight/> خروج</RouterLink><div class="round-label"><small>الجولة</small><b>٣ <i>/ ٥</i></b></div><div class="timer"><Clock3/><b>٠١:٢٢</b></div><div class="connection"><Wifi/> متصل</div></header>
  <section class="round-hero"><div><span>حرف الجولة</span><b>م</b></div><p>اكتب أسرع ما عندك.. بس خليك حرفنجي!</p><div class="progress-ring">{{ filled }}<small>/ {{ categories.length }}</small></div></section>
  <main class="notebook-wrap">
    <div class="notebook-toolbar"><div><b>كشكولك يا محمود</b><span>بيتحفظ تلقائي</span></div><div class="view-switch"><button :class="{ active: mode === 'table' }" @click="mode='table'"><Grid3X3/> الجدول</button><button :class="{ active: mode === 'focus' }" @click="mode='focus'"><Smartphone/> سؤال سؤال</button></div><RouterLink to="/review" class="review-demo-link">عاين التصحيح ←</RouterLink></div>
    <section class="notebook" :class="{ 'focus-mode': mode === 'focus' }">
      <div class="spiral" aria-hidden="true"><i v-for="n in 11" :key="n"></i></div>
      <div v-if="mode === 'table'" class="table-scroll"><table><thead><tr><th class="player-head">اللاعب</th><th v-for="(c,i) in categories" :key="c" :class="`color-${i%4}`">{{ c }}</th><th class="total-head">المجموع</th></tr></thead><tbody><tr><th><CharacterAvatar id="character-01" :size="36"/>إنت</th><td v-for="c in categories" :key="c"><input v-model="answers[c]" :aria-label="`إجابة ${c}`" :placeholder="`اكتب ${c}...`" /></td><td class="total-cell">—</td></tr><tr class="hidden-row"><th><CharacterAvatar id="character-02" :size="36"/>سارة</th><td :colspan="categories.length">الإجابات مخفية لحد ما الوقت يخلص</td><td>—</td></tr></tbody></table></div>
      <div v-else class="focus-answer"><span class="category-number">{{ active + 1 }} / {{ categories.length }}</span><p>حرف <b>م</b></p><h2>{{ categories[active] }}</h2><input v-model="answers[categories[active]]" autofocus :placeholder="`اكتب ${categories[active]} بحرف م`"/><div class="focus-nav"><button :disabled="active===0" @click="active--"><ChevronRight/> اللي فات</button><div><i v-for="(_,i) in categories" :key="i" :class="{ done: answers[categories[i]], current: active===i }"></i></div><button :disabled="active===categories.length-1" @click="active++">اللي بعده <ChevronLeft/></button></div></div>
      <div class="paper-note">متقلقش، إجاباتك محفوظة ✨</div>
    </section>
  </main>
</div></template>
