<script setup>
import { computed } from 'vue'
import ProgressRing from './ProgressRing.vue'
const props = defineProps({ coreCommitments: { type: Array, required: true }, contributions: { type: Array, required: true }, carryForward: { type: Number, default: 0 } })
const corePct = computed(() => { const t = props.coreCommitments.length; return t ? Math.round(props.coreCommitments.filter(c => c.status === 'on-track').length / t * 100) : 0 })
const contribPts = computed(() => props.contributions.reduce((s, c) => s + c.points, 0))
const total = computed(() => contribPts.value + props.carryForward)
const scorePct = computed(() => Math.min(Math.round(total.value / 400 * 100), 100))
const status = computed(() => total.value >= 200 ? { label: 'Excellent', cls: 'tag-success' } : total.value >= 100 ? { label: 'On Track', cls: 'tag-caution' } : { label: 'Needs Attention', cls: 'tag-danger' })
</script>

<template>
  <div class="card p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-txt-heading">Monthly Progress</h3>
      <span class="tag" :class="status.cls">{{ status.label }}</span>
    </div>
    <div class="flex flex-col items-center gap-4">
      <ProgressRing :percentage="scorePct" :size="120" :strokeWidth="8" color="#03439a" bgColor="#e5e7eb" label="of goal"/>
      <div class="w-full space-y-2">
        <div class="flex items-center justify-between py-2 px-3 rounded-container bg-surface-gray text-sm">
          <span class="text-txt-subtitle">Contribution Points</span>
          <span class="font-bold text-txt-heading">{{ contribPts }}</span>
        </div>
        <div class="flex items-center justify-between py-2 px-3 rounded-container bg-surface-gray text-sm">
          <span class="text-txt-subtitle">Carry-Forward</span>
          <span class="font-bold text-txt-heading">{{ carryForward }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5 px-3 rounded-container bg-surface-info border border-blue-200/50 text-sm">
          <span class="font-semibold text-txt-info">Total Score</span>
          <span class="text-base font-bold text-txt-info">{{ total }}</span>
        </div>
        <div class="flex items-center justify-between py-2 px-3 rounded-container bg-surface-gray text-sm">
          <span class="text-txt-subtitle">Core Commitments</span>
          <span class="font-bold" :class="corePct === 100 ? 'text-txt-success' : 'text-txt-error'">{{ corePct }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
