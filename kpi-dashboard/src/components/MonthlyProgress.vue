<script setup>
import { computed } from 'vue'
import ProgressRing from './ProgressRing.vue'

const props = defineProps({
  coreCommitments: { type: Array, required: true },
  contributions: { type: Array, required: true },
  carryForward: { type: Number, default: 0 },
})

const coreCompletionPct = computed(() => {
  const total = props.coreCommitments.length
  if (!total) return 0
  const onTrack = props.coreCommitments.filter(c => c.status === 'on-track').length
  return Math.round((onTrack / total) * 100)
})

const contributionPoints = computed(() =>
  props.contributions.reduce((sum, c) => sum + c.points, 0)
)

const totalScore = computed(() => contributionPoints.value + props.carryForward)

const scoreColor = computed(() => {
  if (totalScore.value >= 200) return '#27a78e'
  if (totalScore.value >= 100) return '#f59e0b'
  return '#f75e3b'
})

const scoreStatus = computed(() => {
  if (totalScore.value >= 200) return { label: 'Excellent', class: 'tag-success' }
  if (totalScore.value >= 100) return { label: 'On Track', class: 'tag-caution' }
  return { label: 'Needs Attention', class: 'tag-danger' }
})

const maxScore = 400 // visual cap for progress ring
const scorePercent = computed(() => Math.min(Math.round((totalScore.value / maxScore) * 100), 100))
</script>

<template>
  <div class="card p-6">
    <div class="flex items-center gap-2 mb-5">
      <div class="w-8 h-8 bg-caution-50 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="#d97706">
          <path d="M232,128A104,104,0,0,1,128,232c-49.93,0-91.61-34.68-102.4-83.12a8,8,0,0,1,15.68-3.26A88.07,88.07,0,1,0,128,40a87.25,87.25,0,0,0-45.33,12.59l21.67,21.67a8,8,0,0,1-5.66,13.66H32a8,8,0,0,1-8-8V13.24A8,8,0,0,1,37.66,7.58l22.59,22.59A104,104,0,0,1,232,128Z"/>
        </svg>
      </div>
      <h3 class="text-base font-semibold text-sand-800 font-body">Monthly Progress</h3>
      <span class="tag ml-auto" :class="scoreStatus.class">{{ scoreStatus.label }}</span>
    </div>

    <div class="flex flex-col items-center gap-5">
      <!-- Progress Ring -->
      <ProgressRing
        :percentage="scorePercent"
        :size="140"
        :strokeWidth="10"
        :color="scoreColor"
        bgColor="#e6e2da"
        label="of goal"
      />

      <!-- Score Breakdown -->
      <div class="w-full space-y-3">
        <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-sand-50 border border-sand-100">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-ocean-400"></div>
            <span class="text-sm text-sand-600">Contribution Points</span>
          </div>
          <span class="text-sm font-bold text-sand-800">{{ contributionPoints }}</span>
        </div>

        <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-sand-50 border border-sand-100">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-caution-400"></div>
            <span class="text-sm text-sand-600">Carry-Forward</span>
          </div>
          <span class="text-sm font-bold text-sand-800">{{ carryForward }}</span>
        </div>

        <div class="flex items-center justify-between py-3 px-4 rounded-xl bg-ocean-50 border border-ocean-200">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="#1a8774">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
            </svg>
            <span class="text-sm font-semibold text-ocean-700">Total Score</span>
          </div>
          <span class="text-lg font-bold text-ocean-700">{{ totalScore }}</span>
        </div>

        <div class="flex items-center justify-between py-2.5 px-4 rounded-xl bg-sand-50 border border-sand-100">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full" :class="coreCompletionPct === 100 ? 'bg-emerge-400' : 'bg-danger-400'"></div>
            <span class="text-sm text-sand-600">Core Commitments</span>
          </div>
          <span class="text-sm font-bold" :class="coreCompletionPct === 100 ? 'text-emerge-600' : 'text-danger-500'">{{ coreCompletionPct }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
