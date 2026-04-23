<script setup>
import { ref, computed } from 'vue'
import { getCoreCompletionPercent, getContributionPoints, getTotalPoints, formatDate } from '../data/dummyData'
import ProgressRing from './ProgressRing.vue'

const props = defineProps({
  employee: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const isApproved = ref(false)

const coreCompletionPct = computed(() => getCoreCompletionPercent(props.employee))
const contributionPoints = computed(() => getContributionPoints(props.employee))
const totalScore = computed(() => getTotalPoints(props.employee))

const scoreColor = computed(() => {
  if (totalScore.value >= 200) return '#27a78e'
  if (totalScore.value >= 100) return '#f59e0b'
  return '#f75e3b'
})

const maxScore = 400
const scorePercent = computed(() => Math.min(Math.round((totalScore.value / maxScore) * 100), 100))

function approve() {
  isApproved.value = true
}

function getCompletionClass(pct) {
  if (pct === 100) return 'tag-success'
  if (pct >= 67) return 'tag-caution'
  return 'tag-danger'
}
</script>

<template>
  <teleport to="body">
    <transition name="drawer">
      <div class="fixed inset-0 z-50 flex items-stretch justify-end">
        <!-- Backdrop -->
        <div class="drawer-backdrop absolute inset-0 bg-sand-900/40 backdrop-blur-sm" @click="emit('close')"></div>

        <!-- Panel -->
        <div class="drawer-panel relative z-10 w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
          <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div :class="[employee.avatarColor, 'w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-sm']">
                  {{ employee.initials }}
                </div>
                <div>
                  <h3 class="text-lg font-bold text-sand-900 font-body">{{ employee.name }}</h3>
                  <p class="text-sm text-sand-400">{{ employee.role }} · {{ employee.id }}</p>
                </div>
              </div>
              <button @click="emit('close')" class="btn-ghost p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                </svg>
              </button>
            </div>

            <!-- Score Summary -->
            <div class="flex items-center gap-6 p-5 rounded-2xl bg-gradient-to-r from-ocean-50 to-sand-50 border border-ocean-100">
              <ProgressRing
                :percentage="scorePercent"
                :size="90"
                :strokeWidth="7"
                :color="scoreColor"
                bgColor="#e6e2da"
              />
              <div class="space-y-1">
                <p class="text-2xl font-bold text-sand-900 font-body">{{ totalScore }} <span class="text-sm text-sand-400 font-normal">pts</span></p>
                <p class="text-sm text-sand-500">Total Score</p>
                <span class="tag" :class="getCompletionClass(coreCompletionPct)">Core: {{ coreCompletionPct }}%</span>
              </div>
            </div>

            <!-- Core Commitments Detail -->
            <div>
              <h4 class="text-sm font-semibold text-sand-700 mb-3 uppercase tracking-wider">Core Commitments</h4>
              <div class="space-y-2">
                <div
                  v-for="c in employee.coreCommitments"
                  :key="c.id"
                  class="flex items-center justify-between p-3 rounded-xl border"
                  :class="c.status === 'on-track' ? 'bg-emerge-50/40 border-emerge-200/60' : 'bg-danger-50/40 border-danger-200/60'"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :class="c.status === 'on-track' ? 'bg-emerge-500' : 'bg-danger-500'"></div>
                    <span class="text-sm text-sand-700">{{ c.label }}</span>
                  </div>
                  <span class="tag text-[10px]" :class="c.status === 'on-track' ? 'tag-success' : 'tag-danger'">
                    {{ c.status === 'on-track' ? 'On Track' : 'Missed' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contributions Detail -->
            <div>
              <h4 class="text-sm font-semibold text-sand-700 mb-3 uppercase tracking-wider">Contributions ({{ contributionPoints }} pts)</h4>
              <div v-if="employee.contributions.length" class="space-y-2">
                <div
                  v-for="c in employee.contributions"
                  :key="c.id"
                  class="flex items-center justify-between p-3 rounded-xl bg-sand-50 border border-sand-100"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-sand-700 truncate">{{ c.type }}</p>
                    <p class="text-[11px] text-sand-400">{{ formatDate(c.date) }}</p>
                  </div>
                  <span class="tag tag-info shrink-0 ml-3">+{{ c.points }} pts</span>
                </div>
              </div>
              <div v-else class="text-sm text-sand-400 text-center py-4">No contributions logged</div>
            </div>

            <!-- Carry Forward -->
            <div class="p-4 rounded-xl bg-caution-50 border border-caution-200/60">
              <div class="flex items-center justify-between">
                <span class="text-sm text-caution-700 font-medium">Carry-Forward Points</span>
                <span class="text-lg font-bold text-caution-700">{{ employee.carryForward }}</span>
              </div>
              <p class="text-xs text-caution-500 mt-1">Carried from previous month</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button v-if="!isApproved" @click="approve" class="btn-primary flex-1 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                </svg>
                Approve Evaluation
              </button>
              <div v-else class="flex-1 text-center py-3 bg-emerge-50 rounded-xl border border-emerge-200">
                <p class="text-sm font-bold text-emerge-600 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/>
                  </svg>
                  Approved ✓
                </p>
              </div>
              <button @click="emit('close')" class="btn-secondary px-6 py-3">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
