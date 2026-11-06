<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, Check, Clock3, Dices, Hash, Pencil, Plus, Save, Sparkles, Users, Zap } from 'lucide-vue-next'
import AvatarPicker from '../components/common/AvatarPicker.vue'
import CharacterAvatar from '../components/common/CharacterAvatar.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { usePlayerStore } from '../stores/player.js'
import { createRoom } from '../services/rooms.js'
import { firebaseErrorMessage } from '../utils/firebaseError.js'
const defaults = ['ولد','بنت','جماد','حيوان','بلاد','ممثل','ممثلة','فيلم','مسلسل','مخرج','مطرب','مطربة','لاعب كورة']
const router=useRouter(),auth=useAuthStore(),playerStore=usePlayerStore()
const nickname = ref(playerStore.nickname)
const avatar = ref(playerStore.avatar)
const roomName = ref('قعدة الحرفنجية')
const rounds = ref(5); const duration = ref(90); const letterMode = ref('random')
const instantStopEnabled = ref(true)
const chosen = ref(['ولد','بنت','جماد','حيوان','بلاد'])
const custom = ref('')
const busy=ref(false), error=ref('')
const valid = computed(() => nickname.value.trim().length >= 2 && roomName.value.trim() && chosen.value.length >= 2 && chosen.value.length <= 10)
function toggle(c){if(chosen.value.includes(c)){chosen.value=chosen.value.filter(x=>x!==c);return}if(chosen.value.length>=10){error.value='الحد الأقصى ١٠ تصنيفات.';return}error.value='';chosen.value=[...chosen.value,c]}
function addCustom(){ const value = custom.value.trim().slice(0,40);if(chosen.value.length>=10){error.value='الحد الأقصى ١٠ تصنيفات.';return}if(value && !chosen.value.includes(value)){ chosen.value.push(value); custom.value = '';error.value='' } }
function savePreset(){ localStorage.setItem('harfana:preset', JSON.stringify(chosen.value)); window.alert('اتحفظت التصنيفات على الجهاز ✓') }
async function submit(){ busy.value=true;error.value='';try{const user=await auth.initialize();if(!user||!auth.uid)throw new Error(auth.error||'إعدادات Firebase ناقصة');playerStore.nickname=nickname.value.trim();playerStore.avatar=avatar.value;const code=await createRoom({uid:auth.uid,nickname:playerStore.nickname,avatar:avatar.value,name:roomName.value.trim(),rounds:rounds.value,duration:duration.value,categories:chosen.value,letterMode:letterMode.value,instantStopEnabled:instantStopEnabled.value});playerStore.roomCode=code;router.push(`/room/${code}`)}catch(e){error.value=e.message===auth.error?auth.error:firebaseErrorMessage('create-room-view',e,'معرفناش نعمل القعدة. جرّب تاني.')}finally{busy.value=false}}
</script>
<template><div class="create-page"><div class="page-wrap">
  <RouterLink to="/" class="back-link create-back"><ArrowRight/> الرئيسية</RouterLink>
  <header class="create-hero"><div class="create-hero-copy"><span class="create-kicker"><Sparkles/> إنت الأدمن النهارده</span><h1>جهّز <em>قعدتك</em><br>وخلي الحرفنة تبدأ!</h1><p>ظبّط اللعب على مزاج الشلة، وبعدها خد كود الدعوة ولمّ الحرفنجية.</p><div class="hero-mini-facts"><span><Users/> لحد ١٠ لاعيبة</span><span><Zap/> لعب لحظي</span></div></div><div class="create-hero-art"><i class="doodle-line"></i><i class="doodle-star">✦</i><div class="character-stage"><CharacterAvatar :id="avatar" :size="158"/><span>{{ nickname.trim() || 'اكتب اسمك' }}</span></div><div class="hero-pencil"><Pencil/></div></div></header>
  <form class="create-layout" @submit.prevent>
    <section class="create-panel identity-panel"><div class="game-section-head"><b>١</b><div><span>اختار بطلك</span><h2>مين داخل القعدة؟</h2></div></div><label class="game-input"><span>اسمك في القعدة</span><div><input v-model="nickname" maxlength="20" placeholder="مثلاً: أبو الأفكار"/><small>{{nickname.length}}/٢٠</small></div></label><AvatarPicker v-model="avatar" :size="72"/><p class="privacy-note">بياناتك محفوظة على جهازك عشان ترجع بسرعة.</p></section>
    <section class="create-panel config-panel"><div class="game-section-head coral"><b>٢</b><div><span>ظبّط التحدي</span><h2>نظام القعدة</h2></div></div><label class="game-input"><span>اسم القعدة</span><div><input v-model="roomName" maxlength="30"/><Hash/></div></label><div class="setting-pickers"><label><span><Hash/> الجولات</span><select v-model="rounds"><option v-for="n in [3,5,7,10]" :key="n" :value="n">{{n}} جولات</option></select></label><label><span><Clock3/> الوقت</span><select v-model="duration"><option v-for="n in [30,60,90,120,180]" :key="n" :value="n">{{n}} ثانية</option></select></label></div><fieldset class="letter-mode"><legend>مين يختار الحرف؟</legend><label><input v-model="letterMode" type="radio" value="random"/><span><Dices/><b>عشوائي</b><small>اللعبة تختار</small></span></label><label><input v-model="letterMode" type="radio" value="host"/><span><Pencil/><b>إنت تختار</b><small>قبل كل جولة</small></span></label></fieldset><label class="stop-setting premium-stop"><span><b><Zap/> زر حرفنة!</b><small>أول واحد يكمّل يقفل الجولة عند الكل</small></span><input v-model="instantStopEnabled" type="checkbox" role="switch"/></label></section>
    <section class="create-panel categories-panel"><div class="game-section-head mint"><b>٣</b><div><span>اختار الملعب</span><h2>هنكتب إيه؟</h2></div><strong>{{chosen.length}} مختار</strong></div><p class="category-help">اختار تصنيفين على الأقل، والمجموع بيتضاف لوحده في آخر الكشكول.</p><div class="category-cloud"><button v-for="(c,index) in defaults" :key="c" type="button" :class="{active:chosen.includes(c)}" :style="{'--chip-index':index}" @click="toggle(c)"><Check v-if="chosen.includes(c)"/>{{c}}</button></div><div class="custom-category"><div><Plus/><input v-model="custom" placeholder="تصنيف من دماغك..." @keyup.enter.prevent="addCustom"/></div><button type="button" class="btn btn-soft" @click="addCustom">إضافة</button><button type="button" class="save-preset" @click="savePreset"><Save/> احفظ كقالب</button></div></section>
    <p v-if="error" class="error-message create-error">{{error}}</p><div class="create-submit"><div class="submit-copy"><span v-if="!valid">كمّل اسمك واختار تصنيفين</span><span v-else><Check/> كله تمام.. القعدة جاهزة!</span><small>هتاخد كود مخصوص تبعته للشلة</small></div><button :disabled="!valid||busy" type="button" @click="submit"><span>{{busy?'بنعمل القعدة...':'اعمل القعدة'}}</span><ArrowRight v-if="!busy"/></button></div>
  </form>
</div></div></template>
