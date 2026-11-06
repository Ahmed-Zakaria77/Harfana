<script setup>
import CharacterAvatar from './CharacterAvatar.vue'
import { CHARACTER_IDS, normalizeCharacterId } from '../../utils/characters.js'
defineProps({ modelValue:{type:String,default:'character-01'}, size:{type:[Number,String],default:62} });defineEmits(['update:modelValue'])
</script>
<template><fieldset class="avatar-field"><legend>اختار شخصيتك</legend><div class="avatar-list character-list"><button v-for="(id,index) in CHARACTER_IDS" :key="id" type="button" data-audio="select" class="avatar-choice character-choice" :class="{selected:normalizeCharacterId(modelValue)===id}" :aria-label="`اختار الشخصية رقم ${index+1}`" @click="$emit('update:modelValue',id)"><CharacterAvatar :id="id" :size="size"/></button></div></fieldset></template>
