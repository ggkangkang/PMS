<script setup>
const props = defineProps({
  modelValue: { type: String, default: 'on-track' },
})
const emit = defineEmits(['update:modelValue'])

function toggle() {
  emit('update:modelValue', props.modelValue === 'on-track' ? 'missed' : 'on-track')
}
</script>

<template>
  <button
    @click="toggle"
    class="relative inline-flex items-center h-8 rounded-full px-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="modelValue === 'on-track'
      ? 'bg-emerge-100 border border-emerge-300 focus:ring-emerge-200'
      : 'bg-danger-100 border border-danger-300 focus:ring-danger-200'"
    :style="{ width: '140px' }"
  >
    <!-- Sliding pill -->
    <div
      class="absolute h-6 rounded-full transition-all duration-300 shadow-sm"
      :class="modelValue === 'on-track'
        ? 'bg-emerge-500 left-1'
        : 'bg-danger-500 left-[72px]'"
      :style="{ width: '64px' }"
    ></div>

    <!-- Labels -->
    <div class="relative z-10 flex w-full">
      <span
        class="flex-1 text-[11px] font-bold text-center transition-colors duration-200"
        :class="modelValue === 'on-track' ? 'text-white' : 'text-emerge-600'"
      >
        On Track
      </span>
      <span
        class="flex-1 text-[11px] font-bold text-center transition-colors duration-200"
        :class="modelValue === 'missed' ? 'text-white' : 'text-danger-500'"
      >
        Missed
      </span>
    </div>
  </button>
</template>
