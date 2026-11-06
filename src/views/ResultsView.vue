<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Crown, Sparkles } from 'lucide-vue-next'
import { useRoomStore } from '../stores/room.js'
import { startNextRound } from '../services/game.js'
import CharacterAvatar from '../components/common/CharacterAvatar.vue'
import { audioManager } from '../audio/manager.js'
const route=useRoute(),router=useRouter(),roomStore=useRoomStore(),busy=ref(false),error=ref(''),code=computed(()=>String(route.params.code).toUpperCase()),sorted=computed(()=>[...roomStore.players].sort((a,b)=>(b.totalScore||0)-(a.totalScore||0))),hasNext=computed(()=>(roomStore.room?.roundNumber||0)<(roomStore.room?.totalRounds||0))
onMounted(()=>roomStore.subscribe(code.value));onBeforeUnmount(()=>roomStore.cleanup())
watch(()=>roomStore.room?.status,status=>{if(status!=='results')return;const event=`results:${code.value}:${roomStore.room.currentRoundId}`;audioManager.playOnce(hasNext.value?'results':'winner',event)})
async function next(){busy.value=true;try{const {roundId}=await startNextRound(code.value);router.push(`/room/${code.value}/round/${roundId}`)}catch(e){error.value=e.message}finally{busy.value=false}}
</script>
<template><div class="page-wrap results-page"><section class="page-heading"><span class="sticker"><Sparkles/> النتيجة ظهرت</span><h1>إيه الحرفنة دي!</h1><p>لسه المنافسة مولعة والجولة الجاية هتفرق.</p></section><div class="leaderboard"><article v-for="(player,index) in sorted" :key="player.uid" :class="{winner:index===0}"><b class="rank">{{ index+1 }}</b><CharacterAvatar :id="player.avatar" :size="52"/><strong>{{ player.nickname }} <Crown v-if="index===0"/></strong><b>{{ player.totalScore||0 }} نقطة</b></article></div><p v-if="error" class="error-message">{{error}}</p><button v-if="roomStore.isHost&&hasNext" class="btn btn-primary btn-lg" :disabled="busy" @click="next">{{busy?'بنجهز...':'ابدأ الجولة الجاية'}}</button><p v-else-if="hasNext">استنى الأدمن يبدأ الجولة الجاية.</p><RouterLink v-else :to="`/room/${code}`" class="btn btn-primary btn-lg">اللعبة خلصت</RouterLink></div></template>
