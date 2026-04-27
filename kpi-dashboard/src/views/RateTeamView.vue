<script setup>
import { ref, computed, reactive, watch } from 'vue'
import {
  getSubordinates, getUserById, getMonthlyEval, getKPIsForRole,
  commitmentRatingScale, availableMonths, formatMonth, getProjectById,
  getCommitmentScore, getContributionPoints, getEvalStatusInfo,
} from '../data/dummyData'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const selectedMonth = ref(availableMonths[0].value)
const subordinates = computed(() => getSubordinates(currentUser.value.id))
const project = computed(() => getProjectById(currentUser.value.projectId))
const selectedEmployee = ref(null)
const showDrawer = ref(false)

const supervisorForm = reactive({ commitmentRatings: {}, notes: '' })
const isSaved = ref(false)

// Filter pills
const activeFilter = ref('all')
const filters = computed(() => {
  const all = subordinates.value.length
  const rated = subordinates.value.filter(s => getMonthlyEval(s.id, selectedMonth.value)?.supervisor).length
  const pending = all - rated
  return [
    { id: 'all', label: 'All', count: all },
    { id: 'rated', label: 'Rated', count: rated },
    { id: 'pending', label: 'Pending', count: pending },
  ]
})

const filteredSubs = computed(() => {
  if (activeFilter.value === 'all') return subordinates.value
  return subordinates.value.filter(s => {
    const ev = getMonthlyEval(s.id, selectedMonth.value)
    const isRated = !!ev?.supervisor
    return activeFilter.value === 'rated' ? isRated : !isRated
  })
})

function selectEmployee(emp) {
  selectedEmployee.value = emp
  showDrawer.value = true
  isSaved.value = false
  const ev = getMonthlyEval(emp.id, selectedMonth.value)
  if (ev?.supervisor) {
    supervisorForm.commitmentRatings = { ...ev.supervisor.commitmentRatings }
    supervisorForm.notes = ev.supervisor.notes || ''
    isSaved.value = true
  } else {
    const kpis = getKPIsForRole(emp.role)
    const empty = {}; kpis.forEach(k => empty[k.id] = 0)
    supervisorForm.commitmentRatings = empty
    supervisorForm.notes = ''
  }
}

function closeDrawer() { showDrawer.value = false; selectedEmployee.value = null }

function saveRating() { isSaved.value = true }

function ratingBg(v) {
  if (v >= 5) return 'bg-green-50 border-green-300 text-green-700 ring-green-300'
  if (v >= 4) return 'bg-blue-50 border-blue-300 text-blue-700 ring-blue-300'
  if (v >= 3) return 'bg-yellow-50 border-yellow-300 text-yellow-700 ring-yellow-300'
  if (v >= 2) return 'bg-orange-50 border-orange-300 text-orange-700 ring-orange-300'
  if (v >= 1) return 'bg-red-50 border-red-300 text-red-700 ring-red-300'
  return 'bg-gray-50 border-gray-200 text-gray-400'
}

function getEvalInfo(sub) {
  const ev = getMonthlyEval(sub.id, selectedMonth.value)
  const commitScore = ev ? getCommitmentScore(ev.self?.commitmentRatings || {}) : 0
  const contribPts = ev ? getContributionPoints(ev.self?.contributions || []) : 0
  return { ev, commitScore, contribPts, status: ev?.status || 'not-started', rated: !!ev?.supervisor }
}
</script>

<template>
  <div class="max-w-6xl mx-auto animate-fade-in flex gap-6">
    <!-- Main content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-lg font-bold text-txt-heading">Rate {{ currentUser.role === 'project-director' ? 'Project Managers' : 'Team' }}</h1>
          <p class="text-sm text-txt-subtitle mt-0.5">{{ formatMonth(selectedMonth) }} · Click a member to rate</p>
        </div>
        <select v-model="selectedMonth" class="select-field w-40">
          <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <!-- Filter pills (Skool style) -->
      <div class="flex items-center gap-2 mb-5">
        <button
          v-for="f in filters" :key="f.id"
          @click="activeFilter = f.id"
          :class="['filter-pill', { active: activeFilter === f.id }]"
        >{{ f.label }} <span class="font-bold ml-0.5">{{ f.count }}</span></button>
      </div>

      <!-- Member list cards (Skool Members style) -->
      <div class="card overflow-hidden">
        <div v-for="(sub, i) in filteredSubs" :key="sub.id"
          @click="selectEmployee(sub)"
          class="flex items-start gap-4 p-5 hover:bg-surface-gray/40 transition-colors cursor-pointer"
          :class="i < filteredSubs.length - 1 ? 'border-b border-line/50' : ''"
        >
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div :class="[sub.avatarColor || 'bg-brand-primary', 'w-12 h-12 rounded-full text-white text-sm font-bold flex items-center justify-center']">{{ sub.initials }}</div>
            <div v-if="getEvalInfo(sub).rated" class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white">✓</div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-[15px] font-bold text-txt-heading">{{ sub.name }}</h4>
              <span class="tag text-[10px]" :class="getEvalStatusInfo(getEvalInfo(sub).status).cls">{{ getEvalStatusInfo(getEvalInfo(sub).status).label }}</span>
            </div>
            <p class="text-sm text-txt-muted mt-0.5">{{ sub.label }} · {{ sub.id }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-txt-subtitle">
              <span>Self Score: <strong class="text-brand-primary">{{ getEvalInfo(sub).commitScore }}/50</strong></span>
              <span>Contrib: <strong class="text-txt-heading">{{ getEvalInfo(sub).contribPts }} pts</strong></span>
            </div>
          </div>

          <!-- Action -->
          <div class="shrink-0 pt-1">
            <button v-if="getEvalInfo(sub).rated"
              class="tag tag-success text-xs px-3 py-1.5"
            >✓ Rated</button>
            <button v-else
              class="btn-primary text-xs py-1.5 px-4"
              :disabled="getEvalInfo(sub).status === 'not-started'"
              :class="{ 'opacity-40': getEvalInfo(sub).status === 'not-started' }"
            >Rate</button>
          </div>
        </div>

        <div v-if="filteredSubs.length === 0" class="py-12 text-center text-sm text-txt-muted">
          No team members match this filter
        </div>
      </div>
    </div>

    <!-- Right sidebar (Skool style) -->
    <aside class="w-72 shrink-0 hidden lg:block">
      <div class="card overflow-hidden sticky top-6">
        <div class="h-24 bg-gradient-to-br from-brand-primary to-blue-400"></div>
        <div class="p-5">
          <h3 class="text-[15px] font-bold text-txt-heading">{{ project?.name || 'Rating Overview' }}</h3>
          <p class="text-xs text-txt-muted mt-0.5">{{ project?.location }} · {{ formatMonth(selectedMonth) }}</p>

          <div class="flex items-center justify-center mt-4 pt-4 border-t border-line">
            <div class="stat-block">
              <p class="stat-value text-base">{{ subordinates.length }}</p>
              <p class="stat-label">Team</p>
            </div>
            <div class="stat-block">
              <p class="stat-value text-base text-brand-primary">{{ subordinates.filter(s => getMonthlyEval(s.id, selectedMonth)?.supervisor).length }}</p>
              <p class="stat-label">Rated</p>
            </div>
            <div class="stat-block">
              <p class="stat-value text-base text-txt-warn">{{ subordinates.length - subordinates.filter(s => getMonthlyEval(s.id, selectedMonth)?.supervisor).length }}</p>
              <p class="stat-label">Pending</p>
            </div>
          </div>

          <div class="flex items-center gap-1 mt-4">
            <div v-for="sub in subordinates.slice(0, 5)" :key="sub.id"
              :class="[sub.avatarColor || 'bg-brand-primary', 'w-7 h-7 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white -ml-1 first:ml-0']"
              :title="sub.name"
            >{{ sub.initials }}</div>
          </div>
        </div>
      </div>
    </aside>

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
                  <p class="text-xs text-txt-muted">{{ selectedEmployee.label }} · {{ selectedEmployee.id }} · {{ formatMonth(selectedMonth) }}</p>
                </div>
              </div>
              <button @click="closeDrawer" class="btn-ghost p-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg></button>
            </div>

            <!-- Dual columns -->
            <div v-if="getMonthlyEval(selectedEmployee.id, selectedMonth)">
              <h4 class="text-[11px] font-semibold text-txt-muted uppercase tracking-wider mb-3">KPI Commitment Ratings</h4>
              <div class="space-y-3">
                <div v-for="kpi in getKPIsForRole(selectedEmployee.role)" :key="kpi.id" class="p-4 rounded-container border border-line">
                  <p class="text-sm font-semibold text-txt-body mb-1">{{ kpi.label }}</p>
                  <p class="text-xs text-txt-subtitle mb-3">{{ kpi.description }}</p>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <p class="text-[10px] font-semibold text-txt-muted uppercase mb-1.5">Self Rating</p>
                      <div class="flex gap-1">
                        <span v-for="r in commitmentRatingScale" :key="r.value"
                          class="flex-1 py-1.5 text-center rounded-btn text-[11px] font-bold border"
                          :class="(getMonthlyEval(selectedEmployee.id, selectedMonth)?.self?.commitmentRatings?.[kpi.id] || 0) === r.value ? ratingBg(r.value) : 'bg-white border-line/50 text-txt-muted'"
                        >{{ r.value }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-brand-primary uppercase mb-1.5">Your Rating</p>
                      <div class="flex gap-1">
                        <button v-for="r in commitmentRatingScale" :key="r.value" @click="supervisorForm.commitmentRatings[kpi.id] = r.value" :disabled="isSaved"
                          class="flex-1 py-1.5 text-center rounded-btn text-[11px] font-bold border transition-all"
                          :class="supervisorForm.commitmentRatings[kpi.id] === r.value ? ratingBg(r.value) + ' ring-1 ring-offset-1' : 'bg-white border-line text-txt-subtitle hover:bg-surface-gray'"
                        >{{ r.value }}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="getMonthlyEval(selectedEmployee.id, selectedMonth)?.self?.notes" class="mt-4 p-3 bg-surface-gray rounded-container border border-line/50">
                <p class="text-[10px] font-semibold text-txt-muted uppercase mb-1">Employee's Notes</p>
                <p class="text-sm text-txt-body">{{ getMonthlyEval(selectedEmployee.id, selectedMonth).self.notes }}</p>
              </div>

              <div class="mt-4">
                <label class="text-sm font-medium text-txt-body mb-1.5 block">Your Feedback</label>
                <textarea v-model="supervisorForm.notes" :disabled="isSaved" rows="3" class="input-field text-sm resize-none" placeholder="Provide specific feedback…"></textarea>
              </div>

              <div class="flex gap-2 mt-5">
                <button v-if="!isSaved" @click="saveRating" class="btn-primary flex-1">Submit Rating</button>
                <div v-else class="flex-1 text-center py-2.5 bg-surface-success rounded-btn border border-green-200"><p class="text-sm font-bold text-txt-success">✓ Rating Submitted</p></div>
                <button @click="closeDrawer" class="btn-secondary flex-1">Close</button>
              </div>
            </div>

            <div v-else class="text-center py-12">
              <p class="text-sm text-txt-muted">This employee has not started their evaluation for {{ formatMonth(selectedMonth) }}.</p>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
