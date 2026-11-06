<script setup>
import { computed } from 'vue'
import { normalizeCharacterId } from '../../utils/characters.js'
const props=defineProps({ id:{type:String,default:'character-01'}, size:{type:[Number,String],default:56} })
const character=computed(()=>normalizeCharacterId(props.id)),number=computed(()=>Number(character.value.slice(-2)))
</script>
<template><svg class="character-avatar" :style="{width:`${size}px`,height:`${size}px`}" viewBox="0 0 80 80" role="img" :aria-label="`الشخصية رقم ${number}`">
  <circle cx="40" cy="40" r="37" :fill="['#FFF1B8','#EAE5FF','#FFD7DD','#D8F5EF','#FFF0BE','#E7DFFF','#D9F4FF','#FFE1C7','#DDF2D1','#FFE2ED'][number-1]"/>
  <g stroke="#252044" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
    <g v-if="number===1"><path d="M24 58L34 18l23 6-11 40z" fill="#FFD65A"/><path d="M34 18l8-10 15 16" fill="#FFE2C4"/><path d="M24 58l7 10 15-4" fill="#FF7F91"/><path d="M34 39l15 4"/><circle cx="35" cy="34" r="2" fill="#252044"/><circle cx="47" cy="37" r="2" fill="#252044"/><path d="M36 48q5 5 10 1" fill="none"/></g>
    <g v-else-if="number===2"><rect x="18" y="13" width="45" height="55" rx="8" fill="#7555E8"/><path d="M25 13v55M20 24h10M20 36h10M20 48h10" stroke="#FFD65A"/><path d="M31 22h25M31 29h25" stroke="#FFF8E9" opacity=".7"/><circle cx="35" cy="42" r="2" fill="#FFF"/><circle cx="49" cy="42" r="2" fill="#FFF"/><path d="M36 52q6 6 12 0" stroke="#FFF" fill="none"/></g>
    <g v-else-if="number===3"><path d="M17 48l20-30h22l7 34-17 16-27-5z" fill="#FF7F91"/><path d="M37 18l22 0 4 15H27z" fill="#6EDAC5"/><circle cx="35" cy="44" r="2" fill="#252044"/><circle cx="49" cy="44" r="2" fill="#252044"/><path d="M36 54q6 4 11-1" fill="none"/></g>
    <g v-else-if="number===4"><path d="M21 21h38l7 19-12 27H27L14 40z" fill="#3BC7AD"/><circle cx="40" cy="29" r="10" fill="#FFF8E9"/><circle cx="40" cy="29" r="4" fill="#7555E8"/><circle cx="31" cy="49" r="2" fill="#252044"/><circle cx="49" cy="49" r="2" fill="#252044"/><path d="M34 58q6 4 12 0" fill="none"/></g>
    <g v-else-if="number===5"><path d="M12 29l53-13 5 25-53 13z" fill="#FFD65A"/><path d="M23 26l3 9M34 23l3 8M45 20l3 9M56 18l3 8"/><circle cx="34" cy="42" r="2" fill="#252044"/><circle cx="48" cy="39" r="2" fill="#252044"/><path d="M37 49q6 3 11-2" fill="none"/></g>
    <g v-else-if="number===6"><path d="M21 27q3-15 19-15t19 15l6 35H15z" fill="#7555E8"/><path d="M29 27q1-8 11-8t11 8" fill="none"/><rect x="25" y="43" width="30" height="19" rx="7" fill="#FF7F91"/><circle cx="34" cy="38" r="2" fill="#FFF"/><circle cx="47" cy="38" r="2" fill="#FFF"/><path d="M35 48q5 4 10 0" stroke="#FFF" fill="none"/></g>
    <g v-else-if="number===7"><path d="M48 12l13 8-22 37-13-8z" fill="#FFD65A"/><path d="M26 49l13 8-9 13-16-10z" fill="#3BC7AD"/><path d="M48 12l6-7 7 15" fill="#FF7F91"/><circle cx="31" cy="46" r="2" fill="#252044"/><circle cx="42" cy="50" r="2" fill="#252044"/><path d="M31 57q4 4 9 1" fill="none"/></g>
    <g v-else-if="number===8"><path d="M49 14q18 6 8 21L38 60q-9 12-20 3t-1-21l20-24q7-8 14-2t1 13L34 52q-3 4-7 1t0-7l15-19" fill="none" stroke="#7555E8" stroke-width="7"/><circle cx="30" cy="34" r="2" fill="#252044" stroke="none"/><circle cx="42" cy="38" r="2" fill="#252044" stroke="none"/><path d="M31 44q5 5 10 1" fill="none"/></g>
    <g v-else-if="number===9"><path d="M25 10h31l-4 13 9 38-34 8-8-39z" fill="#3BC7AD"/><path d="M25 10h31l-4 13-30 7z" fill="#FF7F91"/><path d="M27 54l34-8"/><circle cx="33" cy="39" r="2" fill="#252044"/><circle cx="47" cy="36" r="2" fill="#252044"/><path d="M35 47q5 4 10 0" fill="none"/></g>
    <g v-else><path d="M13 23q14-9 27 2 13-11 27-2v43q-13-8-27 1-14-9-27-1z" fill="#FF7F91"/><path d="M40 25v42"/><path d="M19 30q10-5 17 1M44 31q8-6 17-1" stroke="#FFF8E9"/><circle cx="32" cy="44" r="2" fill="#252044"/><circle cx="49" cy="44" r="2" fill="#252044"/><path d="M35 54q6 5 12 0" fill="none"/></g>
  </g></svg></template>
