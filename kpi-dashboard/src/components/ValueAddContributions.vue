<script setup>
import { ref } from 'vue'
import { contributionOptions, formatDate } from '../data/dummyData'
const props = defineProps({ contributions: { type: Array, required: true } })
const emit = defineEmits(['add-contribution'])
const selectedContribution = ref('')
function addContribution() {
  if (!selectedContribution.value) return
  const opt = contributionOptions.find(o => o.label === selectedContribution.value)
  if (!opt) return
  emit('add-contribution', { id: Date.now(), type: opt.label, points: opt.points, date: new Date().toISOString().split('T')[0] })
  selectedContribution.value = ''
}
</script>

<template>
  <div class="card p-5">
    <h3 class="text-sm font-bold text-txt-heading mb-4">Value-Add Contributions</h3>
    <div class="flex gap-2 mb-4">
      <select v-model="selectedContribution" class="select-field flex-1">
        <option value="" disabled>Select a contribution…</option>
        <option v-for="o in contributionOptions" :key="o.label" :value="o.label">{{ o.label }} — {{ o.points }} pts</option>
      </select>
      <button @click="addContribution" class="btn-primary shrink-0" :disabled="!selectedContribution" :class="{ 'opacity-40': !selectedContribution }">+ Log</button>
    </div>
    <div v-if="contributions.length" class="space-y-1.5">
      <div v-for="c in contributions" :key="c.id" class="flex items-center justify-between p-2.5 rounded-container bg-surface-gray border border-line/50 text-sm">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="c.points >= 100 ? 'bg-red-400' : c.points >= 50 ? 'bg-blue-400' : 'bg-yellow-400'"></div>
          <div class="min-w-0">
            <p class="text-sm text-txt-body truncate">{{ c.type }}</p>
            <p class="text-[11px] text-txt-disabled">{{ formatDate(c.date) }}</p>
          </div>
        </div>
        <span class="tag tag-info text-[10px] shrink-0">+{{ c.points }}</span>
      </div>
    </div>
    <p v-else class="text-center py-6 text-sm text-txt-disabled">No contributions logged yet</p>
  </div>
</template>
