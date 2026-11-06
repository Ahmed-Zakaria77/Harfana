<script setup>
import { computed, ref } from 'vue'
import { ArrowRight, KeyRound, LogIn } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import AvatarPicker from '../components/common/AvatarPicker.vue'
import { useAuthStore } from '../stores/auth.js'
import { usePlayerStore } from '../stores/player.js'
import { joinRoom } from '../services/rooms.js'
const route = useRoute(),router=useRouter(),auth=useAuthStore(),playerStore=usePlayerStore(); const nickname = ref(playerStore.nickname); const avatar = ref(playerStore.avatar); const code = ref(String(route.params.code || '').toUpperCase());const busy=ref(false),error=ref('')
const valid = computed(() => nickname.value.trim().length >= 2 && /^[A-Z0-9]{6}$/.test(code.value))
function normalizeCode(){ code.value = code.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6) }
const messages={ROOM_NOT_FOUND:'مش لاقيين القعدة دي. راجع الكود.',GAME_STARTED:'اللعبة بدأت ومش بتقبل لاعيبة جداد.',ROOM_FULL:'القعدة كملت ١٠ لاعيبة.'}
async function submit(){busy.value=true;error.value='';try{await auth.initialize();if(!auth.uid)throw new Error(auth.error||'إعدادات Firebase ناقصة');playerStore.nickname=nickname.value.trim();playerStore.avatar=avatar.value;const joined=await joinRoom({code:code.value,uid:auth.uid,nickname:playerStore.nickname,avatar:avatar.value});playerStore.roomCode=joined;router.push(`/room/${joined}`)}catch(e){error.value=messages[e.message]||e.message}finally{busy.value=false}}
</script>
<template><div class="page-wrap join-page"><RouterLink to="/" class="back-link"><ArrowRight/> الرئيسية</RouterLink><section class="join-card">
  <div class="join-illustration"><KeyRound/><span>مستنيينك!</span></div><div class="page-heading"><span class="sticker">يلا بينا</span><h1>ادخل القعدة</h1><p>هات الكود من صاحب القعدة، واختار اسمك وشكلك.</p></div>
  <form @submit.prevent="submit"><label>كود القعدة<input v-model="code" class="code-input" inputmode="text" maxlength="6" placeholder="KRS732" dir="ltr" @input="normalizeCode"/><small>٦ حروف أو أرقام بالإنجليزي</small></label><label>اسمك في القعدة<input v-model="nickname" maxlength="20" placeholder="اكتب اسمك هنا"/></label><AvatarPicker v-model="avatar"/><p v-if="error" class="error-message">{{ error }}</p><button type="submit" class="btn btn-primary btn-lg btn-full" :disabled="!valid||busy"><LogIn/>{{ busy?'بندخّلك...':'ادخل القعدة' }}</button><p class="form-note">هترجع لنفس القعدة تلقائي لو عملت تحديث للصفحة.</p></form>
  </section></div></template>
