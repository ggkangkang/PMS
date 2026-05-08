<script setup>
import { ref, computed } from 'vue'
import {
  getDepartmentStaff, getFinalMonthlyScore, getProjectById, getMonthlyEval,
  projects, availableMonths, formatMonth,
} from '../data/dummyData'

const selectedMonth = ref(availableMonths[0].value)
const viewMode = ref('department') // 'department' | 'project'

const allStaff = computed(() => {
  return getDepartmentStaff().map(s => {
    const score = getFinalMonthlyScore(s.id, selectedMonth.value)
    const project = getProjectById(s.projectId)
    return { ...s, score, project }
  })
})

// Department view — single ranked list
const deptRanked = computed(() => [...allStaff.value].sort((a, b) => b.score.total - a.score.total))

// Project view — grouped by project, each sorted
const projectGroups = computed(() => {
  return projects.map(p => {
    const members = allStaff.value
      .filter(s => s.projectId === p.id)
      .sort((a, b) => b.score.total - a.score.total)
    const avg = members.length ? Math.round(members.reduce((s, m) => s + m.score.total, 0) / members.length) : 0
    const top = members[0]?.score.total || 0
    return { ...p, members, avg, top }
  }).filter(g => g.members.length > 0)
})

const stats = computed(() => {
  const list = deptRanked.value
  const total = list.length
  const avg = total ? Math.round(list.reduce((s, v) => s + v.score.total, 0) / total) : 0
  const top = list[0]?.score.total || 0
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
  return Math.round((score / 100) * 100) + '%'
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

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Total Staff</p>
        <p class="text-xl font-bold text-txt-heading">{{ stats.total }}</p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Average Score</p>
        <p class="text-xl font-bold text-brand-primary">{{ stats.avg }}<span class="text-sm text-txt-disabled font-normal">/100</span></p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Highest Score</p>
        <p class="text-xl font-bold text-txt-success">{{ stats.top }}<span class="text-sm text-txt-disabled font-normal">/100</span></p>
      </div>
      <div class="card p-4">
        <p class="text-xs text-txt-subtitle mb-1">Fully Rated</p>
        <p class="text-xl font-bold" :class="stats.completed === stats.total ? 'text-txt-success' : 'text-txt-warn'">{{ stats.completed }}/{{ stats.total }}</p>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex items-center gap-2 mb-5">
      <button @click="viewMode = 'department'" :class="['filter-pill', { active: viewMode === 'department' }]">
        By Department
      </button>
      <button @click="viewMode = 'project'" :class="['filter-pill', { active: viewMode === 'project' }]">
        By Project
      </button>
    </div>

    <!-- ═══ DEPARTMENT VIEW — Single Ranked List ═══ -->
    <div v-if="viewMode === 'department'" class="card overflow-hidden">
      <div class="px-5 pt-5 pb-3">
        <h3 class="text-sm font-bold text-txt-heading">Department Ranking — Construction</h3>
        <p class="text-xs text-txt-muted mt-0.5">All staff ranked across projects</p>
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
                :style="{ width: barWidth(s.score.total), backgroundColor: gradeColor(s.score.grade.color) }"
              ></div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 text-xs text-txt-muted">
              <span>{{ s.score.commitScore }}</span><span class="text-[8px] text-txt-disabled">+</span>
              <span>{{ s.score.contribScore }}</span><span class="text-[8px] text-txt-disabled">+</span>
              <span>{{ s.score.behaviourScore }}</span>
            </div>
          </div>
        </div>
        <div class="text-right shrink-0 ml-2">
          <p class="text-lg font-bold" :style="{ color: gradeColor(s.score.grade.color) }">{{ s.score.total }}</p>
          <p class="text-[10px] font-semibold mt-0.5" :style="{ color: gradeColor(s.score.grade.color) }">{{ s.score.grade.grade }} · {{ s.score.grade.label }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ PROJECT VIEW — Grouped by Project ═══ -->
    <div v-if="viewMode === 'project'" class="space-y-5">
      <div v-for="pg in projectGroups" :key="pg.id" class="card overflow-hidden">
        <!-- Project Header -->
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
              <p class="text-xs text-txt-muted">Avg Score</p>
              <p class="text-base font-bold text-brand-primary">{{ pg.avg }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-txt-muted">Top</p>
              <p class="text-base font-bold text-txt-success">{{ pg.top }}</p>
            </div>
          </div>
        </div>

        <!-- Members Ranked -->
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
                  :style="{ width: barWidth(s.score.total), backgroundColor: gradeColor(s.score.grade.color) }"
                ></div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 text-xs text-txt-muted">
                <span>{{ s.score.commitScore }}</span><span class="text-[8px] text-txt-disabled">+</span>
                <span>{{ s.score.contribScore }}</span><span class="text-[8px] text-txt-disabled">+</span>
                <span>{{ s.score.behaviourScore }}</span>
              </div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2">
            <p class="text-lg font-bold" :style="{ color: gradeColor(s.score.grade.color) }">{{ s.score.total }}</p>
            <p class="text-[10px] font-semibold mt-0.5" :style="{ color: gradeColor(s.score.grade.color) }">{{ s.score.grade.grade }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="deptRanked.length === 0" class="card py-12 text-center text-sm text-txt-muted">
      No evaluation data for this month
    </div>
  </div>
</template>
