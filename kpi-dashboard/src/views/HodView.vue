<script setup>
import { ref, computed } from 'vue'
import { employees, getCoreCompletionPercent, getContributionPoints, getTotalPoints } from '../data/dummyData'
import ReviewDrawer from '../components/ReviewDrawer.vue'

const sortBy = ref('totalScore')
const sortDir = ref('desc')
const selectedEmployee = ref(null)
const showDrawer = ref(false)

const stats = computed(() => {
  const t = employees.length
  const avg = Math.round(employees.reduce((s, e) => s + getCoreCompletionPercent(e), 0) / t)
  const pts = employees.reduce((s, e) => s + getTotalPoints(e), 0)
  const top = [...employees].sort((a, b) => getTotalPoints(b) - getTotalPoints(a))[0]
  return { t, avg, pts, top }
})

const sorted = computed(() => [...employees].sort((a, b) => {
  let vA, vB
  switch (sortBy.value) {
    case 'name': return sortDir.value === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    case 'core': vA = getCoreCompletionPercent(a); vB = getCoreCompletionPercent(b); break
    case 'contrib': vA = getContributionPoints(a); vB = getContributionPoints(b); break
    default: vA = getTotalPoints(a); vB = getTotalPoints(b)
  }
  return sortDir.value === 'asc' ? vA - vB : vB - vA
}))

function toggleSort(col) { if (sortBy.value === col) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'; else { sortBy.value = col; sortDir.value = 'desc' } }
function openReview(e) { selectedEmployee.value = e; showDrawer.value = true }
function closeDrawer() { showDrawer.value = false }

function compClass(p) { return p === 100 ? 'text-txt-success bg-surface-success' : p >= 67 ? 'text-txt-warn bg-surface-warn' : 'text-txt-error bg-surface-error' }
function rank(i) { return i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '' }
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-5 animate-fade-in">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-4"><p class="text-xs text-txt-subtitle mb-1">Team Size</p><p class="text-xl font-bold text-txt-heading">{{ stats.t }}</p></div>
      <div class="card p-4"><p class="text-xs text-txt-subtitle mb-1">Avg. Completion</p><p class="text-xl font-bold" :class="stats.avg >= 75 ? 'text-txt-success' : 'text-txt-warn'">{{ stats.avg }}%</p></div>
      <div class="card p-4"><p class="text-xs text-txt-subtitle mb-1">Total Points</p><p class="text-xl font-bold text-brand-primary">{{ stats.pts }}</p></div>
      <div class="card p-4"><p class="text-xs text-txt-subtitle mb-1">Top Performer</p><div class="flex items-center gap-2 mt-1"><div class="w-6 h-6 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center">{{ stats.top.initials }}</div><span class="text-sm font-bold text-txt-heading">{{ stats.top.name }}</span></div></div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="px-5 pt-5 pb-3">
        <h3 class="text-sm font-bold text-txt-heading">Team Leaderboard</h3>
      </div>
      <table class="w-full">
        <thead>
          <tr class="border-b border-line text-left">
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider w-10">#</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider cursor-pointer select-none" @click="toggleSort('name')">Employee <span v-if="sortBy==='name'">{{ sortDir==='asc'?'↑':'↓' }}</span></th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center cursor-pointer select-none" @click="toggleSort('core')">Core % <span v-if="sortBy==='core'">{{ sortDir==='asc'?'↑':'↓' }}</span></th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center cursor-pointer select-none" @click="toggleSort('contrib')">Contrib Pts <span v-if="sortBy==='contrib'">{{ sortDir==='asc'?'↑':'↓' }}</span></th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center cursor-pointer select-none" @click="toggleSort('totalScore')">Total <span v-if="sortBy==='totalScore'">{{ sortDir==='asc'?'↑':'↓' }}</span></th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in sorted" :key="e.id" class="border-b border-line/50 last:border-b-0 hover:bg-surface-gray/50 transition-colors">
            <td class="px-5 py-3 text-left"><span v-if="rank(i)" class="text-base">{{ rank(i) }}</span><span v-else class="text-xs text-txt-disabled">{{ i+1 }}</span></td>
            <td class="px-5 py-3 text-left">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">{{ e.initials }}</div>
                <div><p class="text-sm font-semibold text-txt-body">{{ e.name }}</p><p class="text-[11px] text-txt-disabled">{{ e.role }}</p></div>
              </div>
            </td>
            <td class="px-5 py-3 text-center"><span class="tag text-[10px]" :class="compClass(getCoreCompletionPercent(e))">{{ getCoreCompletionPercent(e) }}%</span></td>
            <td class="px-5 py-3 text-center text-sm font-bold text-txt-body">{{ getContributionPoints(e) }}</td>
            <td class="px-5 py-3 text-center text-sm font-bold text-brand-primary">{{ getTotalPoints(e) }}</td>
            <td class="px-5 py-3 text-right"><button @click="openReview(e)" class="btn-primary text-xs py-1.5 px-3">Review</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <ReviewDrawer v-if="showDrawer && selectedEmployee" :employee="selectedEmployee" @close="closeDrawer" />
  </div>
</template>
