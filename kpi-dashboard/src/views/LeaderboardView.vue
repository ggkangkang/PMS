<script setup>
import { ref, computed } from 'vue'
import {
  getDepartmentStaff, getFinalMonthlyScore, getProjectById,
  projects, availableMonths, formatMonth,
} from '../data/dummyData'

const selectedMonth = ref(availableMonths[0].value)
const viewMode = ref('department') // 'department' | 'project'
const rankBy = ref('total') // 'total' | 'commitments' | 'contributions' | 'behaviour'

const departments = [
  { id: 'Project Site', label: 'Project Site', active: true },
  { id: 'QS', label: 'QS', active: false },
  { id: 'HR', label: 'HR', active: false },
  { id: 'IT', label: 'IT', active: false },
]
const selectedDept = ref('Project Site')

const rankOptions = [
  { id: 'total', label: 'Overall', max: 100 },
  { id: 'commitments', label: 'Commitments (50%)', max: 50 },
  { id: 'contributions', label: 'Contributions (30%)', max: 30 },
  { id: 'behaviour', label: 'Character Pillar (20%)', max: 20 },
]

const activeRankOption = computed(() => rankOptions.find(r => r.id === rankBy.value))

function getScoreVal(score) {
  if (rankBy.value === 'commitments') return score.commitScore
  if (rankBy.value === 'contributions') return score.contribScore
  if (rankBy.value === 'behaviour') return score.behaviourScore
  return score.total
}

const allStaff = computed(() => {
  return getDepartmentStaff().map(s => {
    const score = getFinalMonthlyScore(s.id, selectedMonth.value)
    const project = getProjectById(s.projectId)
    return { ...s, score, project, rankVal: getScoreVal(score) }
  })
})

const deptStaff = computed(() => allStaff.value.filter(s => s.department === selectedDept.value))
const deptRanked = computed(() => [...deptStaff.value].sort((a, b) => b.rankVal - a.rankVal))
const isDeptActive = computed(() => departments.find(d => d.id === selectedDept.value)?.active)

const projectGroups = computed(() => {
  return projects.map(p => {
    const members = deptStaff.value
      .filter(s => s.projectId === p.id)
      .sort((a, b) => b.rankVal - a.rankVal)
    const avg = members.length ? Math.round(members.reduce((s, m) => s + m.rankVal, 0) / members.length) : 0
    const top = members[0]?.rankVal || 0
    return { ...p, members, avg, top }
  }).filter(g => g.members.length > 0)
})

const stats = computed(() => {
  const list = deptRanked.value
  const total = list.length
  const avg = total ? Math.round(list.reduce((s, v) => s + v.rankVal, 0) / total) : 0
  const top = list[0]?.rankVal || 0
  const completed = list.filter(r => r.score.isComplete).length
  return { total, avg, top, completed }
})

function medal(i) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return ''
}

function gradeColor(g) {
  return g === 'emerge' ? '#008236' : g === 'ocean' ? '#2563eb' : g === 'caution' ? '#ca3500' : '#c10007'
}

function barWidth(score) {
  return Math.round((score / (activeRankOption.value?.max || 100)) * 100) + '%'
}

function scoreColor(val) {
  const max = activeRankOption.value?.max || 100
  const pct = (val / max) * 100
  if (pct >= 80) return '#008236'
  if (pct >= 60) return '#2563eb'
  if (pct >= 40) return '#ca3500'
  return '#c10007'
}
</script>

<template>
  <div class="max-w-5xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">Leaderboard</h1>
        <p class="text-sm text-txt-subtitle mt-0.5">{{ formatMonth(selectedMonth) }} · Staff performance ranking</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <!-- Department Tabs -->
    <div class="flex gap-0 mb-5 border-b border-line">
      <button v-for="d in departments" :key="d.id" @click="selectedDept = d.id"
        :class="['nav-tab relative', { active: selectedDept === d.id }]"
      >
        {{ d.label }}
        <span v-if="!d.active" class="ml-1 text-[9px] text-txt-disabled font-normal">(Soon)</span>
      </button>
    </div>

    <!-- Coming Soon -->
    <div v-if="!isDeptActive" class="card py-16 text-center">
      <p class="text-4xl mb-4">🚧</p>
      <h3 class="text-base font-bold text-txt-heading mb-1">{{ selectedDept }} Department</h3>
      <p class="text-sm text-txt-subtitle">Coming Soon</p>
      <p class="text-xs text-txt-muted mt-2">This department's KPI evaluation is currently being set up.</p>
    </div>

    <!-- Active Department Content -->
    <template v-if="isDeptActive">
      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card p-4">
          <p class="text-xs text-txt-subtitle mb-1">Total Staff</p>
          <p class="text-xl font-bold text-txt-heading">{{ stats.total }}</p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-txt-subtitle mb-1">Average {{ activeRankOption.label.split('(')[0].trim() }}</p>
          <p class="text-xl font-bold text-brand-primary">{{ stats.avg }}<span class="text-sm text-txt-disabled font-normal">/{{ activeRankOption.max }}</span></p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-txt-subtitle mb-1">Highest</p>
          <p class="text-xl font-bold text-txt-success">{{ stats.top }}<span class="text-sm text-txt-disabled font-normal">/{{ activeRankOption.max }}</span></p>
        </div>
        <div class="card p-4">
          <p class="text-xs text-txt-subtitle mb-1">Fully Rated</p>
          <p class="text-xl font-bold" :class="stats.completed === stats.total ? 'text-txt-success' : 'text-txt-warn'">{{ stats.completed }}/{{ stats.total }}</p>
        </div>
      </div>

      <!-- Controls Row -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <!-- View Toggle -->
        <div class="flex items-center gap-2">
          <button @click="viewMode = 'department'" :class="['filter-pill', { active: viewMode === 'department' }]">All Staff</button>
          <button @click="viewMode = 'project'" :class="['filter-pill', { active: viewMode === 'project' }]">By Project</button>
        </div>
        <!-- Rank By -->
        <div class="flex items-center gap-2 sm:ml-auto">
          <span class="text-xs text-txt-muted font-medium">Rank by:</span>
          <select v-model="rankBy" class="select-field text-sm py-1.5 w-48">
            <option v-for="r in rankOptions" :key="r.id" :value="r.id">{{ r.label }}</option>
          </select>
        </div>
      </div>

      <!-- ═══ ALL STAFF VIEW ═══ -->
      <div v-if="viewMode === 'department'" class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-txt-heading">{{ selectedDept }} — Ranked by {{ activeRankOption.label }}</h3>
          <span class="text-xs text-txt-muted">Max {{ activeRankOption.max }}</span>
        </div>

        <div v-for="(s, i) in deptRanked" :key="s.id"
          class="flex items-center gap-4 px-5 py-4 border-t border-line/50 hover:bg-surface-gray/40 transition-colors"
        >
          <div class="w-10 text-center shrink-0">
            <span v-if="medal(i)" class="text-xl">{{ medal(i) }}</span>
            <span v-else class="text-sm font-bold text-txt-disabled">{{ i + 1 }}</span>
          </div>
          <div :class="[s.avatarColor || 'bg-brand-primary', 'w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0']">{{ s.initials }}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-txt-heading truncate">{{ s.name }}</h4>
              <span v-if="s.score.isComplete" class="tag tag-success text-[9px]">✓ Final</span>
              <span v-else class="tag bg-surface-gray text-txt-disabled text-[9px]">Pending 20%</span>
            </div>
            <p class="text-xs text-txt-muted mt-0.5">{{ s.label }} · {{ s.project?.name || '' }} · {{ s.id }}</p>
            <div class="flex items-center gap-3 mt-2">
              <div class="flex-1 h-2 bg-surface-gray rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  :style="{ width: barWidth(s.rankVal), backgroundColor: scoreColor(s.rankVal) }"
                ></div>
              </div>
              <!-- Breakdown chips -->
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="rankBy === 'commitments' ? 'bg-blue-100 text-blue-700' : 'text-txt-muted'"><span class="opacity-60">KPI</span> {{ s.score.commitScore }}<span class="opacity-50">/50</span></span>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="rankBy === 'contributions' ? 'bg-yellow-100 text-yellow-700' : 'text-txt-muted'"><span class="opacity-60">Contrib</span> {{ s.score.contribScore }}<span class="opacity-50">/30</span></span>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="rankBy === 'behaviour' ? 'bg-green-100 text-green-700' : 'text-txt-muted'"><span class="opacity-60">Char</span> {{ s.score.behaviourScore }}<span class="opacity-50">/20</span></span>
              </div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2">
            <p class="text-lg font-bold" :style="{ color: scoreColor(s.rankVal) }">{{ s.rankVal }}</p>
            <p class="text-[10px] text-txt-disabled">/{{ activeRankOption.max }}</p>
          </div>
        </div>
      </div>

      <!-- ═══ BY PROJECT VIEW ═══ -->
      <div v-if="viewMode === 'project'" class="space-y-5">
        <div v-for="pg in projectGroups" :key="pg.id" class="card overflow-hidden">
          <div class="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-txt-heading">{{ pg.name }}</h3>
                <span class="tag tag-info text-[10px]">{{ pg.members.length }} staff</span>
              </div>
              <p class="text-xs text-txt-muted mt-0.5">{{ pg.location }} · {{ pg.id }}</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-xs text-txt-muted">Avg</p>
                <p class="text-base font-bold text-brand-primary">{{ pg.avg }}<span class="text-xs text-txt-disabled">/{{ activeRankOption.max }}</span></p>
              </div>
              <div class="text-right">
                <p class="text-xs text-txt-muted">Top</p>
                <p class="text-base font-bold text-txt-success">{{ pg.top }}</p>
              </div>
            </div>
          </div>

          <div v-for="(s, i) in pg.members" :key="s.id"
            class="flex items-center gap-4 px-5 py-4 border-t border-line/50 hover:bg-surface-gray/40 transition-colors"
          >
            <div class="w-10 text-center shrink-0">
              <span v-if="medal(i)" class="text-lg">{{ medal(i) }}</span>
              <span v-else class="text-sm font-bold text-txt-disabled">{{ i + 1 }}</span>
            </div>
            <div :class="[s.avatarColor || 'bg-brand-primary', 'w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0']">{{ s.initials }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-txt-heading truncate">{{ s.name }}</h4>
                <span v-if="s.score.isComplete" class="tag tag-success text-[9px]">✓ Final</span>
                <span v-else class="tag bg-surface-gray text-txt-disabled text-[9px]">Pending 20%</span>
              </div>
              <p class="text-xs text-txt-muted mt-0.5">{{ s.label }} · {{ s.id }}</p>
              <div class="flex items-center gap-3 mt-2">
                <div class="flex-1 h-2 bg-surface-gray rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700"
                    :style="{ width: barWidth(s.rankVal), backgroundColor: scoreColor(s.rankVal) }"
                  ></div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="rankBy === 'commitments' ? 'bg-blue-100 text-blue-700' : 'text-txt-muted'"><span class="opacity-60">KPI</span> {{ s.score.commitScore }}<span class="opacity-50">/50</span></span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="rankBy === 'contributions' ? 'bg-yellow-100 text-yellow-700' : 'text-txt-muted'"><span class="opacity-60">Contrib</span> {{ s.score.contribScore }}<span class="opacity-50">/30</span></span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="rankBy === 'behaviour' ? 'bg-green-100 text-green-700' : 'text-txt-muted'"><span class="opacity-60">Char</span> {{ s.score.behaviourScore }}<span class="opacity-50">/20</span></span>
                </div>
              </div>
            </div>
            <div class="text-right shrink-0 ml-2">
              <p class="text-lg font-bold" :style="{ color: scoreColor(s.rankVal) }">{{ s.rankVal }}</p>
              <p class="text-[10px] text-txt-disabled">/{{ activeRankOption.max }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
