<script setup>
import ToggleSwitch from './ToggleSwitch.vue'
const props = defineProps({ commitments: { type: Array, required: true } })
const emit = defineEmits(['update:commitments'])
function updateStatus(index, newStatus) {
  const updated = [...props.commitments]
  updated[index] = { ...updated[index], status: newStatus }
  emit('update:commitments', updated)
}
</script>

<template>
  <div class="card p-5">
    <h3 class="text-sm font-bold text-txt-heading mb-4">Core Commitments</h3>
    <div class="space-y-2">
      <div v-for="(c, i) in commitments" :key="c.id"
        class="flex items-center justify-between p-3 rounded-container border transition-colors"
        :class="c.status === 'on-track' ? 'bg-green-50/50 border-green-200/60' : 'bg-red-50/50 border-red-200/60'"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-2 h-2 rounded-full shrink-0" :class="c.status === 'on-track' ? 'bg-green-500' : 'bg-red-500'"></div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-txt-body">{{ c.label }}</p>
            <p class="text-xs text-txt-subtitle mt-0.5 truncate">{{ c.description }}</p>
          </div>
        </div>
        <ToggleSwitch :modelValue="c.status" @update:modelValue="updateStatus(i, $event)" />
      </div>
    </div>
  </div>
</template>
