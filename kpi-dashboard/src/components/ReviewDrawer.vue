<script setup>
import { ref, computed } from 'vue'
import { getCoreCompletionPercent, getContributionPoints, getTotalPoints, formatDate } from '../data/dummyData'
import ProgressRing from './ProgressRing.vue'

const props = defineProps({ employee: { type: Object, required: true } })
const emit = defineEmits(['close'])
const isApproved = ref(false)
const corePct = computed(() => getCoreCompletionPercent(props.employee))
const contribPts = computed(() => getContributionPoints(props.employee))
const totalPts = computed(() => getTotalPoints(props.employee))
const scorePct = computed(() => Math.min(Math.round(totalPts.value / 400 * 100), 100))
function approve() { isApproved.value = true }
</script>

<template>
  <teleport to="body">
    <div class="fixed inset-0 z-50 flex items-stretch justify-end">
      <div class="absolute inset-0 bg-surface-dark/50 backdrop-blur-sm" @click="emit('close')"></div>
      <div class="relative z-10 w-full max-w-md bg-surface-white shadow-xl overflow-y-auto animate-slide-right">
        <div class="p-5 space-y-5">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-primary text-white text-sm font-bold flex items-center justify-center">{{ employee.initials }}</div>
              <div><h3 class="text-sm font-bold text-txt-heading">{{ employee.name }}</h3><p class="text-xs text-txt-disabled">{{ employee.role }} · {{ employee.id }}</p></div>
            </div>
            <button @click="emit('close')" class="btn-ghost p-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg></button>
          </div>
          <!-- Score -->
          <div class="flex items-center gap-5 p-4 rounded-card bg-surface-gray border border-line">
            <ProgressRing :percentage="scorePct" :size="80" :strokeWidth="6" color="#03439a" bgColor="#e5e7eb" />
            <div><p class="text-xl font-bold text-txt-heading">{{ totalPts }} <span class="text-xs text-txt-disabled font-normal">pts</span></p><p class="text-xs text-txt-subtitle">Total Score</p><span class="tag mt-1" :class="corePct === 100 ? 'tag-success' : 'tag-danger'">Core: {{ corePct }}%</span></div>
          </div>
          <!-- Commitments -->
          <div>
            <h4 class="text-[11px] font-semibold text-txt-disabled uppercase tracking-wider mb-2">Core Commitments</h4>
            <div class="space-y-1.5">
              <div v-for="c in employee.coreCommitments" :key="c.id" class="flex items-center justify-between p-2.5 rounded-container border" :class="c.status==='on-track'?'bg-green-50/50 border-green-200/60':'bg-red-50/50 border-red-200/60'">
                <div class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full" :class="c.status==='on-track'?'bg-green-500':'bg-red-500'"></div><span class="text-sm text-txt-body">{{ c.label }}</span></div>
                <span class="tag text-[10px]" :class="c.status==='on-track'?'tag-success':'tag-danger'">{{ c.status==='on-track'?'On Track':'Missed' }}</span>
              </div>
            </div>
          </div>
          <!-- Contributions -->
          <div>
            <h4 class="text-[11px] font-semibold text-txt-disabled uppercase tracking-wider mb-2">Contributions ({{ contribPts }} pts)</h4>
            <div v-if="employee.contributions.length" class="space-y-1.5">
              <div v-for="c in employee.contributions" :key="c.id" class="flex items-center justify-between p-2.5 rounded-container bg-surface-gray border border-line/50">
                <div><p class="text-sm text-txt-body">{{ c.type }}</p><p class="text-[11px] text-txt-disabled">{{ formatDate(c.date) }}</p></div>
                <span class="tag tag-info text-[10px]">+{{ c.points }}</span>
              </div>
            </div>
            <p v-else class="text-sm text-txt-disabled text-center py-3">No contributions</p>
          </div>
          <!-- Carry forward -->
          <div class="p-3 rounded-container bg-surface-warn border border-yellow-200/60 flex items-center justify-between">
            <span class="text-sm text-txt-warn font-medium">Carry-Forward</span>
            <span class="text-base font-bold text-txt-warn">{{ employee.carryForward }}</span>
          </div>
          <!-- Actions -->
          <div class="flex gap-2 pt-1">
            <button v-if="!isApproved" @click="approve" class="btn-primary flex-1">Approve</button>
            <div v-else class="flex-1 text-center py-2 bg-surface-success rounded-button border border-green-200"><p class="text-sm font-bold text-txt-success">✓ Approved</p></div>
            <button @click="emit('close')" class="btn-secondary flex-1">Close</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
