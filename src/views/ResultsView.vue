<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Crown, Sparkles } from 'lucide-vue-next'
import { useRoomStore } from '../stores/room.js'
import { useAuthStore } from '../stores/auth.js'
import { loadAllResults, startNextRound } from '../services/game.js'
import CharacterAvatar from '../components/common/CharacterAvatar.vue'
import { audioManager } from '../audio/manager.js'
import { syncRoomRoute } from '../utils/roomRoute.js'
const route=useRoute(),router=useRouter(),auth=useAuthStore(),roomStore=useRoomStore(),busy=ref(false),error=ref(''),results=ref([]),code=computed(()=>String(route.params.code).toUpperCase()),totals=computed(()=>results.value.reduce((all,result)=>{for(const [uid,categories] of Object.entries(result.scores||{}))all[uid]=(all[uid]||0)+Object.values(categories).reduce((sum,value)=>sum+Number(value||0),0);return all},{})),sorted=computed(()=>roomStore.players.map(player=>({...player,totalScore:totals.value[player.uid]||0})).sort((a,b)=>b.totalScore-a.totalScore)),hasNext=computed(()=>(roomStore.room?.roundNumber||0)<(roomStore.room?.totalRounds||0));let releaseRoom,loadedRound=0
onMounted(async()=>{await auth.initialize();releaseRoom=roomStore.subscribe(code.value)});onBeforeUnmount(()=>releaseRoom?.())
watch(()=>roomStore.room,async room=>{syncRoomRoute(router,route.path,room,code.value);if(room?.status!=='results')return;const event=`results:${code.value}:${room.currentRoundId}`;audioManager.playOnce(hasNext.value?'results':'winner',event);if(room.roundNumber!==loadedRound){loadedRound=room.roundNumber;try{results.value=await loadAllResults(code.value,room.roundNumber)}catch(e){error.value=e.message}}},{deep:true})
async function next(){busy.value=true;error.value='';try{await startNextRound(code.value)}catch(e){error.value=e.message}finally{busy.value=false}}
</script>
<template><div class="page-wrap results-page"><section class="page-heading"><span class="sticker"><Sparkles/> النتيجة ظهرت</span><h1>إيه الحرفنة دي!</h1><p>لسه المنافسة مولعة والجولة الجاية هتفرق.</p></section><div class="leaderboard"><article v-for="(player,index) in sorted" :key="player.uid" :class="{winner:index===0}"><b class="rank">{{ index+1 }}</b><CharacterAvatar :id="player.avatar" :size="52"/><strong>{{ player.nickname }} <Crown v-if="index===0"/></strong><b>{{ player.totalScore }} نقطة</b></article></div><p v-if="error" class="error-message">{{error}}</p><button v-if="roomStore.isHost&&hasNext" class="btn btn-primary btn-lg" :disabled="busy" @click="next">{{busy?'بنجهز...':'ابدأ الجولة الجاية'}}</button><p v-else-if="hasNext">استنى الأدمن يبدأ الجولة الجاية.</p><RouterLink v-else :to="`/room/${code}`" class="btn btn-primary btn-lg">اللعبة خلصت</RouterLink></div></template>
