<script setup>
import { ref } from 'vue'
import { contributionOptions, formatDate } from '../data/dummyData'

const props = defineProps({
  contributions: { type: Array, required: true },
})
const emit = defineEmits(['add-contribution'])

const selectedContribution = ref('')

function addContribution() {
  if (!selectedContribution.value) return
  const option = contributionOptions.find(o => o.label === selectedContribution.value)
  if (!option) return

  emit('add-contribution', {
    id: Date.now(),
    type: option.label,
    points: option.points,
    date: new Date().toISOString().split('T')[0],
  })
  selectedContribution.value = ''
}

function getPointsBadgeClass(points) {
  if (points >= 100) return 'bg-coral-50 text-coral-600 border-coral-200'
  if (points >= 50) return 'bg-ocean-50 text-ocean-600 border-ocean-200'
  if (points >= 10) return 'bg-caution-50 text-caution-600 border-caution-200'
  return 'bg-sand-100 text-sand-600 border-sand-200'
}
</script>

<template>
  <div class="card p-6">
    <div class="flex items-center gap-2 mb-5">
      <div class="w-8 h-8 bg-coral-50 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="#e4421d">
          <path d="M232,128A104,104,0,1,0,128,232,104.13,104.13,0,0,0,232,128Zm-192,0a88,88,0,1,1,88,88A88.1,88.1,0,0,1,40,128Zm120-8H136V88a8,8,0,0,0-16,0v32H88a8,8,0,0,0,0,16h32v32a8,8,0,0,0,16,0V136h24a8,8,0,0,0,0-16Z"/>
        </svg>
      </div>
      <h3 class="text-base font-semibold text-sand-800 font-body">Value-Add Contributions</h3>
    </div>

    <!-- Add Contribution -->
    <div class="flex gap-3 mb-5">
      <div class="flex-1">
        <select v-model="selectedContribution" class="select-field text-sm">
          <option value="" disabled>Select a contribution…</option>
          <option v-for="opt in contributionOptions" :key="opt.label" :value="opt.label">
            {{ opt.label }} — {{ opt.points }} pts
          </option>
        </select>
      </div>
      <button
        @click="addContribution"
        class="btn-primary shrink-0"
        :disabled="!selectedContribution"
        :class="{ 'opacity-50 cursor-not-allowed': !selectedContribution }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
        </svg>
        Log
      </button>
    </div>

    <!-- Contributions List -->
    <div v-if="contributions.length" class="space-y-2">
      <div
        v-for="(c, i) in contributions"
        :key="c.id"
        class="flex items-center justify-between p-3 rounded-xl bg-sand-50/80 border border-sand-100 hover:bg-sand-100/60 transition-colors duration-200 animate-slide-up"
        :style="{ animationDelay: i * 50 + 'ms' }"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-2 h-2 rounded-full shrink-0" :class="c.points >= 100 ? 'bg-coral-400' : c.points >= 50 ? 'bg-ocean-400' : 'bg-caution-400'"></div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-sand-800 truncate">{{ c.type }}</p>
            <p class="text-[11px] text-sand-400">{{ formatDate(c.date) }}</p>
          </div>
        </div>
        <span class="tag border shrink-0 ml-3" :class="getPointsBadgeClass(c.points)">
          +{{ c.points }} pts
        </span>
      </div>
    </div>

    <div v-else class="text-center py-8 text-sand-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor" class="mx-auto mb-2 opacity-40">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"/>
      </svg>
      <p class="text-sm">No contributions logged yet</p>
      <p class="text-xs mt-1">Select and log your value-add activities above</p>
    </div>
  </div>
</template>
