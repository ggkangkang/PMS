<script setup>
import { ref, computed } from 'vue'
import { employees, getCoreCompletionPercent, getContributionPoints, getTotalPoints, formatDate } from '../data/dummyData'
import ReviewDrawer from '../components/ReviewDrawer.vue'

const sortBy = ref('totalScore')
const sortDir = ref('desc')

const selectedEmployee = ref(null)
const showDrawer = ref(false)

const teamStats = computed(() => {
  const total = employees.length
  const avgCompletion = Math.round(
    employees.reduce((sum, e) => sum + getCoreCompletionPercent(e), 0) / total
  )
  const totalPoints = employees.reduce((sum, e) => sum + getTotalPoints(e), 0)
  const topPerformer = [...employees].sort((a, b) => getTotalPoints(b) - getTotalPoints(a))[0]
  return { total, avgCompletion, totalPoints, topPerformer }
})

const sortedEmployees = computed(() => {
  return [...employees].sort((a, b) => {
    let valA, valB
    switch (sortBy.value) {
      case 'name':
        valA = a.name; valB = b.name
        return sortDir.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      case 'coreCompletion':
        valA = getCoreCompletionPercent(a); valB = getCoreCompletionPercent(b)
        break
      case 'contributionPoints':
        valA = getContributionPoints(a); valB = getContributionPoints(b)
        break
      case 'totalScore':
      default:
        valA = getTotalPoints(a); valB = getTotalPoints(b)
    }
    return sortDir.value === 'asc' ? valA - valB : valB - valA
  })
})

function toggleSort(col) {
  if (sortBy.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDir.value = 'desc'
  }
}

function openReview(emp) {
  selectedEmployee.value = emp
  showDrawer.value = true
}

function closeDrawer() {
  showDrawer.value = false
  selectedEmployee.value = null
}

function getCompletionClass(pct) {
  if (pct === 100) return 'text-emerge-600 bg-emerge-50'
  if (pct >= 67) return 'text-caution-600 bg-caution-50'
  return 'text-danger-600 bg-danger-50'
}

function getRankBadge(index) {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return ''
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-fade-in">
    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-5 group">
        <p class="text-sm text-sand-500 mb-1">Team Size</p>
        <p class="text-2xl font-bold text-sand-900 font-body">{{ teamStats.total }}</p>
        <p class="text-xs text-sand-400 mt-1">Active members</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-sand-500 mb-1">Avg. Core Completion</p>
        <p class="text-2xl font-bold font-body" :class="teamStats.avgCompletion >= 75 ? 'text-emerge-600' : 'text-caution-600'">{{ teamStats.avgCompletion }}%</p>
        <p class="text-xs text-sand-400 mt-1">Across all commitments</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-sand-500 mb-1">Total Team Points</p>
        <p class="text-2xl font-bold text-ocean-600 font-body">{{ teamStats.totalPoints }}</p>
        <p class="text-xs text-sand-400 mt-1">Combined score</p>
      </div>
      <div class="card p-5 bg-gradient-to-br from-caution-50 to-white border-caution-200/60">
        <p class="text-sm text-sand-500 mb-1">Top Performer</p>
        <div class="flex items-center gap-2 mt-1">
          <div :class="[teamStats.topPerformer.avatarColor, 'w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold']">
            {{ teamStats.topPerformer.initials }}
          </div>
          <p class="text-sm font-bold text-sand-800">{{ teamStats.topPerformer.name }}</p>
        </div>
        <p class="text-xs text-sand-400 mt-1">{{ getTotalPoints(teamStats.topPerformer) }} pts total 🏆</p>
      </div>
    </div>

    <!-- Leaderboard Table -->
    <div class="card overflow-hidden">
      <div class="p-5 pb-0">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 bg-ocean-50 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="#1a8774">
              <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,49.53,108.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-sand-800 font-body">Team Leaderboard</h3>
        </div>
        <p class="text-sm text-sand-400 mb-4 ml-10">Click column headers to sort · Click "Review" to view details</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-sand-100 text-left">
              <th class="px-5 py-3 text-xs font-semibold text-sand-400 uppercase tracking-wider w-8">#</th>
              <th
                class="px-5 py-3 text-xs font-semibold text-sand-400 uppercase tracking-wider cursor-pointer hover:text-sand-600 select-none"
                @click="toggleSort('name')"
              >
                Employee
                <span v-if="sortBy === 'name'" class="ml-1">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold text-sand-400 uppercase tracking-wider cursor-pointer hover:text-sand-600 select-none text-center"
                @click="toggleSort('coreCompletion')"
              >
                Core Completion
                <span v-if="sortBy === 'coreCompletion'" class="ml-1">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold text-sand-400 uppercase tracking-wider cursor-pointer hover:text-sand-600 select-none text-center"
                @click="toggleSort('contributionPoints')"
              >
                Contribution Pts
                <span v-if="sortBy === 'contributionPoints'" class="ml-1">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold text-sand-400 uppercase tracking-wider cursor-pointer hover:text-sand-600 select-none text-center"
                @click="toggleSort('totalScore')"
              >
                Total Score
                <span v-if="sortBy === 'totalScore'" class="ml-1">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="px-5 py-3 text-xs font-semibold text-sand-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(emp, index) in sortedEmployees"
              :key="emp.id"
              class="border-b border-sand-100/60 last:border-b-0 hover:bg-sand-50/60 transition-colors duration-150"
            >
              <!-- Rank -->
              <td class="px-5 py-4 text-left">
                <span v-if="getRankBadge(index)" class="text-lg">{{ getRankBadge(index) }}</span>
                <span v-else class="text-sm text-sand-400 font-medium">{{ index + 1 }}</span>
              </td>

              <!-- Employee -->
              <td class="px-5 py-4 text-left">
                <div class="flex items-center gap-3">
                  <div :class="[emp.avatarColor, 'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm']">
                    {{ emp.initials }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-sand-800">{{ emp.name }}</p>
                    <p class="text-[11px] text-sand-400">{{ emp.role }}</p>
                  </div>
                </div>
              </td>

              <!-- Core Completion -->
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold" :class="getCompletionClass(getCoreCompletionPercent(emp))">
                  {{ getCoreCompletionPercent(emp) }}%
                </span>
              </td>

              <!-- Contribution Points -->
              <td class="px-5 py-4 text-center">
                <span class="text-sm font-bold text-sand-700">{{ getContributionPoints(emp) }}</span>
              </td>

              <!-- Total Score -->
              <td class="px-5 py-4 text-center">
                <span class="text-sm font-bold text-ocean-600">{{ getTotalPoints(emp) }}</span>
              </td>

              <!-- Actions -->
              <td class="px-5 py-4 text-right">
                <button
                  @click="openReview(emp)"
                  class="btn-primary text-xs py-2 px-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.29A169.47,169.47,0,0,1,24.57,128,169.47,169.47,0,0,1,48.07,97.29C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.29A169.47,169.47,0,0,1,231.43,128C223.72,141.45,189.81,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                  </svg>
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Review Drawer -->
    <ReviewDrawer
      v-if="showDrawer && selectedEmployee"
      :employee="selectedEmployee"
      @close="closeDrawer"
    />
  </div>
</template>
