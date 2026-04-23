<script setup>
const props = defineProps({
  percentage: { type: Number, default: 0 },
  size: { type: Number, default: 120 },
  strokeWidth: { type: Number, default: 8 },
  color: { type: String, default: '#27a78e' },
  bgColor: { type: String, default: '#e6e2da' },
  label: { type: String, default: '' },
})

const radius = (props.size - props.strokeWidth) / 2
const circumference = 2 * Math.PI * radius
const offset = circumference - (props.percentage / 100) * circumference
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="transform -rotate-90">
      <!-- Background circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
      />
      <!-- Progress circle -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        class="transition-all duration-1000 ease-out"
        :style="{ '--progress-offset': offset }"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-2xl font-bold text-sand-900 font-body">{{ percentage }}<span class="text-sm text-sand-400">%</span></span>
      <span v-if="label" class="text-[10px] text-sand-400 mt-0.5">{{ label }}</span>
    </div>
  </div>
</template>
