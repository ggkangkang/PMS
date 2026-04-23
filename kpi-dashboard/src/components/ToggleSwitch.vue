<script setup>
const props = defineProps({ modelValue: { type: String, default: 'on-track' } })
const emit = defineEmits(['update:modelValue'])
function toggle() { emit('update:modelValue', props.modelValue === 'on-track' ? 'missed' : 'on-track') }
</script>

<template>
  <button @click="toggle" class="relative inline-flex items-center h-7 rounded-full px-0.5 transition-all duration-200 focus:outline-none" :class="modelValue === 'on-track' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'" style="width: 120px;">
    <div class="absolute h-5 rounded-full transition-all duration-200 shadow-sm" :class="modelValue === 'on-track' ? 'bg-green-600 left-0.5' : 'bg-red-500 left-[60px]'" style="width: 56px;"></div>
    <div class="relative z-10 flex w-full">
      <span class="flex-1 text-[10px] font-bold text-center" :class="modelValue === 'on-track' ? 'text-white' : 'text-green-700'">On Track</span>
      <span class="flex-1 text-[10px] font-bold text-center" :class="modelValue === 'missed' ? 'text-white' : 'text-red-600'">Missed</span>
    </div>
  </button>
</template>
