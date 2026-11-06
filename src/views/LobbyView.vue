<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, Copy, Crown, Play, Users } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth.js'
import { useRoomStore } from '../stores/room.js'
import { usePlayerStore } from '../stores/player.js'
import { setReady } from '../services/rooms.js'
import { startRound } from '../services/game.js'
import { syncRoomRoute } from '../utils/roomRoute.js'
import CharacterAvatar from '../components/common/CharacterAvatar.vue'
import { audioManager } from '../audio/manager.js'

const route=useRoute(), router=useRouter(), auth=useAuthStore(), roomStore=useRoomStore(), playerStore=usePlayerStore()
const busy=ref(false), error=ref(''),copied=ref(false); const code=computed(()=>String(route.params.code).toUpperCase());let knownPlayers=null,releaseRoom
const me=computed(()=>roomStore.players.find(p=>p.uid===auth.uid)); const canStart=computed(()=>roomStore.isHost&&roomStore.players.length>=2&&roomStore.players.filter(p=>p.uid!==auth.uid).every(p=>p.ready))
onMounted(async()=>{ await auth.initialize(); playerStore.roomCode=code.value; releaseRoom=roomStore.subscribe(code.value) })
onBeforeUnmount(()=>releaseRoom?.())
watch(()=>roomStore.players,players=>{const ids=new Set(players.map(player=>player.uid));if(knownPlayers){for(const uid of ids)if(!knownPlayers.has(uid))audioManager.playOnce('join',`join:${code.value}:${uid}`)}knownPlayers=ids},{deep:true})
watch(()=>roomStore.room,room=>{if(room?.status==='playing')audioManager.playOnce('roundStart',`round-start:${code.value}:${room.currentRoundId}`);syncRoomRoute(router,route.path,room,code.value)},{deep:true})
async function toggleReady(){ if(me.value) await setReady(code.value,auth.uid,!me.value.ready) }
async function copyInvite(){let success=false;try{if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(code.value);success=true}catch{}}if(!success){const input=document.createElement('textarea');input.value=code.value;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();success=document.execCommand('copy');input.remove()}if(!success)throw new Error('COPY_FAILED');copied.value=true;error.value=''}catch{error.value='معرفناش ننسخ الكود. حدده وانسخه يدويًا.'}}
async function begin(){ busy.value=true;error.value='';try{let letter;if(roomStore.room.letterMode==='host'){letter=window.prompt('اختار حرف الجولة بالعربي');if(!letter)return}await startRound(code.value,letter?.trim())}catch(e){error.value=e.message}finally{busy.value=false} }
</script>
<template><div class="page-wrap lobby-page"><div v-if="!roomStore.room" class="loading-card">بنجهّز القعدة...</div><template v-else>
  <section class="lobby-hero"><span class="sticker">مستنيين الشلة</span><h1>{{ roomStore.room.name }}</h1><div class="room-code"><small>{{copied?'اتنسخ الكود ✓':'كود القعدة'}}</small><b dir="ltr">{{ code }}</b><button aria-label="انسخ كود القعدة" @click="copyInvite"><Copy/></button></div></section>
  <div class="lobby-grid"><section class="form-card"><div class="section-title"><span><Users/></span><div><h2>الحرفنجية</h2><p>{{ roomStore.players.length }} من {{ roomStore.room.maxPlayers }}</p></div></div><div class="player-list"><article v-for="player in roomStore.players" :key="player.uid"><CharacterAvatar :id="player.avatar" :size="48"/><div><b>{{ player.nickname }}</b><small v-if="player.uid===roomStore.room.hostUid"><Crown/> الأدمن</small></div><i :class="{ready:player.ready||player.uid===roomStore.room.hostUid}">{{ player.ready||player.uid===roomStore.room.hostUid?'جاهز':'بيجهّز' }}</i></article></div></section>
  <aside class="form-card settings-summary"><h2>نظام القعدة</h2><dl><div><dt>الجولات</dt><dd>{{ roomStore.room.totalRounds }}</dd></div><div><dt>وقت الجولة</dt><dd>{{ roomStore.room.durationSeconds }} ثانية</dd></div><div><dt>حرفنة!</dt><dd>{{ roomStore.room.instantStopEnabled===false?'مقفولة':'شغالة' }}</dd></div><div><dt>التصنيفات</dt><dd>{{ roomStore.room.categories.join('، ') }}</dd></div></dl><p v-if="!roomStore.isHost">الأدمن وحده يقدر يغيّر النظام ويبدأ.</p></aside></div>
  <p v-if="error" class="error-message">{{ error }}</p><div class="lobby-action"><button v-if="!roomStore.isHost" class="btn btn-yellow btn-lg" @click="toggleReady"><Check/>{{ me?.ready?'مش جاهز':'أنا جاهز' }}</button><button v-else class="btn btn-primary btn-lg" :disabled="!canStart||busy" @click="begin"><Play/>{{ busy?'بنبدأ...':'ابدأ اللعبة' }}</button><small v-if="roomStore.isHost&&!canStart">لازم لاعبين على الأقل وكلهم يكونوا جاهزين</small></div>
  </template></div></template>
