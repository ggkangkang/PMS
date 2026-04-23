<script setup>
const props = defineProps({ percentage: { type: Number, default: 0 }, size: { type: Number, default: 100 }, strokeWidth: { type: Number, default: 8 }, color: { type: String, default: '#03439a' }, bgColor: { type: String, default: '#e5e7eb' }, label: { type: String, default: '' } })
const radius = (props.size - props.strokeWidth) / 2
const circumference = 2 * Math.PI * radius
const offset = circumference - (props.percentage / 100) * circumference
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="transform -rotate-90">
      <circle :cx="size/2" :cy="size/2" :r="radius" :stroke="bgColor" :stroke-width="strokeWidth" fill="none" stroke-linecap="round"/>
      <circle :cx="size/2" :cy="size/2" :r="radius" :stroke="color" :stroke-width="strokeWidth" fill="none" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="offset" class="transition-all duration-700 ease-out"/>
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-xl font-bold text-txt-heading">{{ percentage }}<span class="text-xs text-txt-disabled">%</span></span>
      <span v-if="label" class="text-[10px] text-txt-subtitle mt-0.5">{{ label }}</span>
    </div>
  </div>
</template>
