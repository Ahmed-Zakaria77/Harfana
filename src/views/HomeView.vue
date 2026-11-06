<script setup>
import { ref } from 'vue'
import { Plus, LogIn, CircleHelp, Settings, ArrowLeft, Sparkles, Users, Timer } from 'lucide-vue-next'
import BrandMascot from '../components/common/BrandMascot.vue'
defineEmits(['open-settings'])
const showHow = ref(false)
</script>
<template>
  <div class="home-page page-wrap">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><Sparkles/> لعبة الكلمات اللي بتولّع القعدة</span>
        <h1 class="sr-only">حرفنة</h1><BrandMascot />
        <p class="slogan">حرف واحد.. <strong>وألف فكرة!</strong></p>
        <p class="hero-subtitle">لمّ صحابك، شغّل مخك، واكتب أسرع إجابة قبل الوقت ما يخلص.</p>
        <div class="hero-actions">
          <RouterLink to="/create" class="btn btn-primary btn-lg"><Plus/> اعمل قعدة <ArrowLeft/></RouterLink>
          <RouterLink to="/join" class="btn btn-yellow btn-lg"><LogIn/> ادخل قعدة</RouterLink>
        </div>
        <div class="secondary-actions">
          <button class="text-btn" @click="showHow = !showHow"><CircleHelp/> إزاي نلعب؟</button>
          <button class="text-btn" @click="$emit('open-settings')"><Settings/> الإعدادات</button>
        </div>
      </div>
      <aside class="preview-paper" aria-label="لمحة من اللعبة">
        <span class="paper-pin"></span><span class="scribble">جولة ٣</span>
        <div class="letter-bubble"><small>حرف الجولة</small><b>م</b></div>
        <div class="sample-answer"><span>ولد</span><b>محمود</b><i>+١٠</i></div>
        <div class="sample-answer"><span>بلاد</span><b>مصر</b><i>+٥</i></div>
        <div class="sample-answer"><span>حيوان</span><b>ماعز</b><i>+١٠</i></div>
        <div class="score-note">المجموع <b>٢٥</b></div>
      </aside>
    </section>
    <Transition name="slide"><section v-if="showHow" class="how-card">
      <h2>اللعبة في تلات حركات</h2><div class="steps">
        <article><span>١</span><Users/><h3>لمّ الشلة</h3><p>اعمل قعدة وابعت الكود لصحابك.</p></article>
        <article><span>٢</span><Timer/><h3>الحق الوقت</h3><p>اكتب كلمة بكل تصنيف تبدأ بالحرف.</p></article>
        <article><span>٣</span><Sparkles/><h3>اكسب بالنضافة</h3><p>الإجابة الفريدة بـ١٠ والمتكررة بـ٥.</p></article>
      </div><RouterLink to="/notebook" class="notebook-link">جرّب شكل الكشكول ←</RouterLink>
    </section></Transition>
  </div>
</template>
