<script setup>
import { ref, computed } from 'vue'
import {
  getDepartmentStaff, getMonthlyEval, getFinalMonthlyScore, getProjectById,
  getEvalStatusInfo, availableMonths, formatMonth, behaviourPillars, behaviourRatingScale,
  getKPIsForRole, commitmentRatingScale, getCommitmentScore, getContributionPoints,
} from '../data/dummyData'

const selectedMonth = ref(availableMonths[0].value)
const sortBy = ref('name')
const sortDir = ref('asc')
const activeFilter = ref('all')

// Drawer state
const selectedEmployee = ref(null)
const showDrawer = ref(false)
const behaviourForm = ref({})
const isSaved = ref(false)

const staff = computed(() => getDepartmentStaff())

const filters = computed(() => {
  const all = staff.value.length
  const completed = staff.value.filter(s => {
    const ev = getMonthlyEval(s.id, selectedMonth.value)
    return ev?.supervisor?.behaviourRatings
  }).length
  const pending = all - completed
  return [
    { id: 'all', label: 'All', count: all },
    { id: 'completed', label: 'Completed', count: completed },
    { id: 'pending', label: 'Pending', count: pending },
  ]
})

const filteredStaff = computed(() => {
  let list = staff.value
  if (activeFilter.value === 'completed') {
    list = list.filter(s => {
      const ev = getMonthlyEval(s.id, selectedMonth.value)
      return ev?.supervisor?.behaviourRatings
    })
  } else if (activeFilter.value === 'pending') {
    list = list.filter(s => {
      const ev = getMonthlyEval(s.id, selectedMonth.value)
      return !ev?.supervisor?.behaviourRatings
    })
  }
  return [...list].sort((a, b) => {
    let vA, vB
    switch (sortBy.value) {
      case 'name': return sortDir.value === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      case 'position': return sortDir.value === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)
      case 'score':
        vA = getFinalMonthlyScore(a.id, selectedMonth.value).total
        vB = getFinalMonthlyScore(b.id, selectedMonth.value).total
        break
      case 'dateOfJoin':
        vA = new Date(a.dateOfJoin).getTime()
        vB = new Date(b.dateOfJoin).getTime()
        break
      default:
        vA = 0; vB = 0
    }
    return sortDir.value === 'asc' ? vA - vB : vB - vA
  })
})

const stats = computed(() => {
  const total = staff.value.length
  const evaluated = staff.value.filter(s => {
    const ev = getMonthlyEval(s.id, selectedMonth.value)
    return ev && ['submitted', 'reviewed'].includes(ev.status)
  }).length
  const behaviourDone = staff.value.filter(s => {
    const ev = getMonthlyEval(s.id, selectedMonth.value)
    return ev?.supervisor?.behaviourRatings
  }).length
  const avgScore = staff.value.reduce((s, u) => s + getFinalMonthlyScore(u.id, selectedMonth.value).total, 0) / (total || 1)
  return { total, evaluated, behaviourDone, avgScore: Math.round(avgScore) }
})

function toggleSort(col) {
  if (sortBy.value === col) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortBy.value = col; sortDir.value = 'desc' }
}

function sortIcon(col) {
  if (sortBy.value !== col) return ''
  return sortDir.value === 'asc' ? '↑' : '↓'
}

function formatDoj(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

function openEmployee(emp) {
  selectedEmployee.value = emp
  showDrawer.value = true
  isSaved.value = false
  const ev = getMonthlyEval(emp.id, selectedMonth.value)
  if (ev?.supervisor?.behaviourRatings) {
    behaviourForm.value = { ...ev.supervisor.behaviourRatings }
    isSaved.value = true
  } else {
    const empty = {}
    behaviourPillars.forEach(p => empty[p.id] = 0)
    behaviourForm.value = empty
  }
}

function closeDrawer() { showDrawer.value = false; selectedEmployee.value = null }
function saveBehaviour() { isSaved.value = true }

function ratingBg(v) {
  if (v >= 5) return 'bg-green-50 border-green-300 text-green-700 ring-green-300'
  if (v >= 4) return 'bg-blue-50 border-blue-300 text-blue-700 ring-blue-300'
  if (v >= 3) return 'bg-yellow-50 border-yellow-300 text-yellow-700 ring-yellow-300'
  if (v >= 2) return 'bg-orange-50 border-orange-300 text-orange-700 ring-orange-300'
  if (v >= 1) return 'bg-red-50 border-red-300 text-red-700 ring-red-300'
  return 'bg-gray-50 border-gray-200 text-gray-400'
}

function gradeColor(g) {
  return g === 'emerge' ? '#008236' : g === 'ocean' ? '#2563eb' : g === 'caution' ? '#ca3500' : '#c10007'
}
</script>

<template>
  <div class="max-w-7xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">Department Overview</h1>
        <p class="text-sm text-txt-subtitle mt-0.5">{{ formatMonth(selectedMonth) }} · Project Site Department</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Total Staff</p>
        <p class="text-xl font-bold text-txt-heading">{{ stats.total }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">KPI Submitted</p>
        <p class="text-xl font-bold text-brand-primary">{{ stats.evaluated }}/{{ stats.total }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Behaviour Rated</p>
        <p class="text-xl font-bold" :class="stats.behaviourDone === stats.total ? 'text-txt-success' : 'text-txt-warn'">{{ stats.behaviourDone }}/{{ stats.total }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Avg. Score</p>
        <p class="text-xl font-bold text-txt-heading">{{ stats.avgScore }}<span class="text-sm text-txt-disabled font-normal">/100</span></p>
      </div>
    </div>

    <!-- Filter pills -->
    <div class="flex items-center gap-2 mb-5">
      <button
        v-for="f in filters" :key="f.id"
        @click="activeFilter = f.id"
        :class="['filter-pill', { active: activeFilter === f.id }]"
      >{{ f.label }} <span class="font-bold ml-0.5">{{ f.count }}</span></button>
    </div>

    <!-- Staff Table -->
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-line text-left">
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider w-10">#</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider cursor-pointer select-none" @click="toggleSort('name')">Name {{ sortIcon('name') }}</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider hidden lg:table-cell">IC</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider cursor-pointer select-none" @click="toggleSort('position')">Position {{ sortIcon('position') }}</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center cursor-pointer select-none" @click="toggleSort('score')">Score {{ sortIcon('score') }}</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center hidden md:table-cell">Status</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none" @click="toggleSort('dateOfJoin')">Date of Join {{ sortIcon('dateOfJoin') }}</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in filteredStaff" :key="s.id"
            class="border-b border-line/50 last:border-b-0 hover:bg-surface-gray/50 transition-colors cursor-pointer"
            @click="openEmployee(s)"
          >
            <td class="px-5 py-3 text-xs text-txt-disabled">{{ i + 1 }}</td>
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div :class="[s.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ s.initials }}</div>
                <div>
                  <p class="text-sm font-semibold text-txt-body">{{ s.name }}</p>
                  <p class="text-[11px] text-txt-disabled">{{ s.id }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3 text-sm text-txt-body hidden lg:table-cell font-mono text-[12px]">{{ s.ic }}</td>
            <td class="px-5 py-3 text-sm text-txt-body">{{ s.label }}</td>
            <td class="px-5 py-3 text-center">
              <span class="text-sm font-bold" :style="{ color: gradeColor(getFinalMonthlyScore(s.id, selectedMonth).grade.color) }">
                {{ getFinalMonthlyScore(s.id, selectedMonth).total }}
              </span>
              <span class="text-[10px] text-txt-disabled">/100</span>
            </td>
            <td class="px-5 py-3 text-center hidden md:table-cell">
              <span class="tag text-[10px]" :class="getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').cls">
                {{ getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').label }}
              </span>
            </td>
            <td class="px-5 py-3 text-sm text-txt-body hidden lg:table-cell">{{ formatDoj(s.dateOfJoin) }}</td>
            <td class="px-5 py-3 text-right">
              <button
                v-if="getFinalMonthlyScore(s.id, selectedMonth).isComplete"
                class="tag tag-success text-xs px-3 py-1.5"
              >✓ Rated</button>
              <button
                v-else
                class="btn-primary text-xs py-1.5 px-3"
                @click.stop="openEmployee(s)"
                :disabled="!getMonthlyEval(s.id, selectedMonth) || getMonthlyEval(s.id, selectedMonth)?.status === 'not-started'"
                :class="{ 'opacity-40': !getMonthlyEval(s.id, selectedMonth) || getMonthlyEval(s.id, selectedMonth)?.status === 'not-started' }"
              >Rate 20%</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredStaff.length === 0" class="py-12 text-center text-sm text-txt-muted">
        No staff match this filter
      </div>
    </div>

    <!-- Rating Drawer -->
    <teleport to="body">
      <div v-if="showDrawer && selectedEmployee" class="fixed inset-0 z-50 flex items-stretch justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeDrawer"></div>
        <div class="relative z-10 w-full max-w-2xl bg-surface-white shadow-xl overflow-y-auto animate-slide-right">
          <div class="p-6 space-y-5">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div :class="[selectedEmployee.avatarColor || 'bg-brand-primary', 'w-11 h-11 rounded-full text-white text-sm font-bold flex items-center justify-center']">{{ selectedEmployee.initials }}</div>
                <div>
                  <h3 class="text-[15px] font-bold text-txt-heading">{{ selectedEmployee.name }}</h3>
                  <p class="text-xs text-txt-muted">{{ selectedEmployee.label }} · {{ selectedEmployee.id }} · IC: {{ selectedEmployee.ic }}</p>
                  <p class="text-xs text-txt-disabled">Joined {{ formatDoj(selectedEmployee.dateOfJoin) }} · {{ getProjectById(selectedEmployee.projectId)?.name || '' }}</p>
                </div>
              </div>
              <button @click="closeDrawer" class="btn-ghost p-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg></button>
            </div>

            <!-- Score Summary -->
            <div class="card p-4 border border-line">
              <h4 class="text-[11px] font-semibold text-txt-muted uppercase tracking-wider mb-3">Score Summary · {{ formatMonth(selectedMonth) }}</h4>
              <div class="flex items-center justify-center">
                <div class="stat-block">
                  <p class="stat-value text-brand-primary">{{ getFinalMonthlyScore(selectedEmployee.id, selectedMonth).commitScore }}<span class="text-sm text-txt-muted font-normal">/50</span></p>
                  <p class="stat-label">Commitments</p>
                </div>
                <div class="stat-block">
                  <p class="stat-value">{{ getFinalMonthlyScore(selectedEmployee.id, selectedMonth).contribScore }}<span class="text-sm text-txt-muted font-normal">/30</span></p>
                  <p class="stat-label">Contributions</p>
                </div>
                <div class="stat-block">
                  <p class="stat-value" :class="getFinalMonthlyScore(selectedEmployee.id, selectedMonth).isComplete ? 'text-txt-success' : 'text-txt-warn'">{{ getFinalMonthlyScore(selectedEmployee.id, selectedMonth).behaviourScore }}<span class="text-sm text-txt-muted font-normal">/20</span></p>
                  <p class="stat-label">Behaviour</p>
                </div>
                <div class="stat-block">
                  <p class="stat-value text-lg" :style="{ color: gradeColor(getFinalMonthlyScore(selectedEmployee.id, selectedMonth).grade.color) }">{{ getFinalMonthlyScore(selectedEmployee.id, selectedMonth).total }}<span class="text-sm text-txt-muted font-normal">/100</span></p>
                  <p class="stat-label">Total</p>
                </div>
              </div>
            </div>

            <!-- Self KPI Ratings (read-only) -->
            <div v-if="getMonthlyEval(selectedEmployee.id, selectedMonth)">
              <h4 class="text-[11px] font-semibold text-txt-muted uppercase tracking-wider mb-3">Self KPI Ratings (80%)</h4>
              <div class="space-y-2">
                <div v-for="kpi in getKPIsForRole(selectedEmployee.role)" :key="kpi.id" class="flex items-center justify-between p-3 rounded-container border border-line bg-surface-gray/30">
                  <div>
                    <p class="text-sm font-medium text-txt-body">{{ kpi.label }}</p>
                    <p class="text-[10px] text-txt-muted">{{ kpi.id.toUpperCase() }} · {{ kpi.weight }}%</p>
                  </div>
                  <span class="tag border text-[10px]" :class="ratingBg(getMonthlyEval(selectedEmployee.id, selectedMonth)?.self?.commitmentRatings?.[kpi.id] || 0)">
                    {{ getMonthlyEval(selectedEmployee.id, selectedMonth)?.self?.commitmentRatings?.[kpi.id] || 0 }}/5
                  </span>
                </div>
              </div>
            </div>

            <!-- Behaviour 20% Rating (4 Pillars) -->
            <div v-if="getMonthlyEval(selectedEmployee.id, selectedMonth)">
              <h4 class="text-[11px] font-semibold text-brand-primary uppercase tracking-wider mb-3">Behaviour Rating (20%) · 4 Pillars</h4>
              <div class="space-y-3">
                <div v-for="pillar in behaviourPillars" :key="pillar.id" class="p-4 rounded-container border border-line">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p class="text-sm font-semibold text-txt-body">{{ pillar.label }}</p>
                      <p class="text-[10px] text-txt-muted">{{ pillar.subtitle }}</p>
                      <p class="text-xs text-txt-subtitle mt-1">{{ pillar.description }}</p>
                    </div>
                    <span v-if="behaviourForm[pillar.id]" class="tag border text-[10px] shrink-0" :class="ratingBg(behaviourForm[pillar.id])">{{ behaviourForm[pillar.id] }}/5</span>
                  </div>
                  <div class="flex gap-1.5">
                    <button v-for="r in behaviourRatingScale" :key="r.value" @click="behaviourForm[pillar.id] = r.value" :disabled="isSaved"
                      class="flex-1 py-2 px-1 rounded-btn text-[11px] font-medium border transition-all"
                      :class="behaviourForm[pillar.id] === r.value ? ratingBg(r.value) + ' ring-1 ring-offset-1 shadow-xs' : 'bg-white border-line text-txt-subtitle hover:bg-surface-gray'"
                    ><span class="block font-bold text-sm">{{ r.value }}</span><span class="hidden sm:block mt-0.5 leading-tight">{{ r.label }}</span></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit -->
            <div class="flex gap-2 mt-5">
              <button v-if="!isSaved && getMonthlyEval(selectedEmployee.id, selectedMonth)" @click="saveBehaviour" class="btn-primary flex-1"
                :disabled="Object.values(behaviourForm).some(v => v === 0)"
                :class="{ 'opacity-40': Object.values(behaviourForm).some(v => v === 0) }"
              >Submit & Lock</button>
              <div v-else-if="isSaved" class="flex-1 text-center py-2.5 bg-surface-success rounded-btn border border-green-200"><p class="text-sm font-bold text-txt-success">✓ Behaviour Rated & Locked</p></div>
              <div v-else class="flex-1 text-center py-2.5 bg-surface-gray rounded-btn border border-line"><p class="text-sm text-txt-muted">Staff has not submitted KPI yet</p></div>
              <button @click="closeDrawer" class="btn-secondary flex-1">Close</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
