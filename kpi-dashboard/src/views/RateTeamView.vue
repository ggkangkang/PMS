<script setup>
import { ref, computed, reactive, watch } from 'vue'
import {
  getSubordinates, getUserById, getMonthlyEval, getKPIsForRole,
  commitmentRatingScale, availableMonths, formatMonth,
  getCommitmentScore, getContributionPoints, getEvalStatusInfo,
} from '../data/dummyData'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const selectedMonth = ref(availableMonths[0].value)
const subordinates = computed(() => getSubordinates(currentUser.value.id))
const selectedEmployee = ref(null)
const showDrawer = ref(false)

const supervisorForm = reactive({ commitmentRatings: {}, notes: '' })
const isSaved = ref(false)

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
</script>

<template>
  <div class="max-w-6xl mx-auto animate-fade-in">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">Rate {{ currentUser.role === 'project-director' ? 'Project Managers' : 'Team' }}</h1>
        <p class="text-xs text-txt-subtitle">{{ formatMonth(selectedMonth) }} · Click a row to rate</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-line text-left">
            <th class="px-6 py-2.5 text-[11px] font-semibold text-txt-muted uppercase tracking-wider">Employee</th>
            <th class="px-6 py-2.5 text-[11px] font-semibold text-txt-muted uppercase tracking-wider">Role</th>
            <th class="px-6 py-2.5 text-[11px] font-semibold text-txt-muted uppercase tracking-wider text-center">Self Score</th>
            <th class="px-6 py-2.5 text-[11px] font-semibold text-txt-muted uppercase tracking-wider text-center">Eval Status</th>
            <th class="px-6 py-2.5 text-[11px] font-semibold text-txt-muted uppercase tracking-wider text-center">Your Rating</th>
            <th class="px-6 py-2.5 text-[11px] font-semibold text-txt-muted uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subordinates" :key="sub.id" class="border-b border-line/50 last:border-b-0 hover:bg-surface-gray/50 transition-colors cursor-pointer" @click="selectEmployee(sub)">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div :class="[sub.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center']">{{ sub.initials }}</div>
                <div><p class="text-sm font-semibold text-txt-body">{{ sub.name }}</p><p class="text-[11px] text-txt-disabled">{{ sub.id }}</p></div>
              </div>
            </td>
            <td class="px-5 py-3 text-sm text-txt-subtitle">{{ sub.label }}</td>
            <td class="px-5 py-3 text-center">
              <span class="text-sm font-bold text-brand-primary">{{ getMonthlyEval(sub.id, selectedMonth) ? getCommitmentScore(getMonthlyEval(sub.id, selectedMonth).self?.commitmentRatings || {}) : 0 }}/50</span>
            </td>
            <td class="px-5 py-3 text-center">
              <span class="tag text-[10px]" :class="getEvalStatusInfo(getMonthlyEval(sub.id, selectedMonth)?.status || 'not-started').cls">{{ getEvalStatusInfo(getMonthlyEval(sub.id, selectedMonth)?.status || 'not-started').label }}</span>
            </td>
            <td class="px-5 py-3 text-center">
              <span v-if="getMonthlyEval(sub.id, selectedMonth)?.supervisor" class="tag tag-success text-[10px]">✓ Done</span>
              <span v-else class="tag bg-surface-gray text-txt-disabled text-[10px]">Pending</span>
            </td>
            <td class="px-5 py-3 text-right">
              <button class="btn-primary text-xs py-1.5 px-3" :disabled="!getMonthlyEval(sub.id, selectedMonth) || getMonthlyEval(sub.id, selectedMonth)?.status === 'not-started'" :class="{ 'opacity-40': !getMonthlyEval(sub.id, selectedMonth) || getMonthlyEval(sub.id, selectedMonth)?.status === 'not-started' }">Rate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rating Drawer -->
    <teleport to="body">
      <div v-if="showDrawer && selectedEmployee" class="fixed inset-0 z-50 flex items-stretch justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeDrawer"></div>
        <div class="relative z-10 w-full max-w-2xl bg-surface-white shadow-xl overflow-y-auto animate-slide-right">
          <div class="p-5 space-y-5">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div :class="[selectedEmployee.avatarColor || 'bg-brand-primary', 'w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center']">{{ selectedEmployee.initials }}</div>
                <div>
                  <h3 class="text-sm font-bold text-txt-heading">{{ selectedEmployee.name }}</h3>
                  <p class="text-xs text-txt-disabled">{{ selectedEmployee.label }} · {{ selectedEmployee.id }} · {{ formatMonth(selectedMonth) }}</p>
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
                  <!-- Dual row -->
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Self -->
                    <div>
                      <p class="text-[10px] font-semibold text-txt-muted uppercase mb-1.5">Self Rating</p>
                      <div class="flex gap-1">
                        <span v-for="r in commitmentRatingScale" :key="r.value"
                          class="flex-1 py-1.5 text-center rounded-btn text-[11px] font-bold border"
                          :class="(getMonthlyEval(selectedEmployee.id, selectedMonth)?.self?.commitmentRatings?.[kpi.id] || 0) === r.value ? ratingBg(r.value) : 'bg-white border-line/50 text-txt-disabled'"
                        >{{ r.value }}</span>
                      </div>
                    </div>
                    <!-- Supervisor -->
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

              <!-- Self notes -->
              <div v-if="getMonthlyEval(selectedEmployee.id, selectedMonth)?.self?.notes" class="mt-4 p-3 bg-surface-gray rounded-container border border-line/50">
                <p class="text-[10px] font-semibold text-txt-muted uppercase mb-1">Employee's Notes</p>
                <p class="text-sm text-txt-body">{{ getMonthlyEval(selectedEmployee.id, selectedMonth).self.notes }}</p>
              </div>

              <!-- Supervisor comment -->
              <div class="mt-4">
                <label class="text-sm font-medium text-txt-body mb-1.5 block">Your Feedback</label>
                <textarea v-model="supervisorForm.notes" :disabled="isSaved" rows="3" class="input-field text-sm resize-none" placeholder="Provide specific feedback…"></textarea>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 mt-5">
                <button v-if="!isSaved" @click="saveRating" class="btn-primary flex-1">Submit Rating</button>
                <div v-else class="flex-1 text-center py-2.5 bg-surface-success rounded-btn border border-green-200"><p class="text-sm font-bold text-txt-success">✓ Rating Submitted</p></div>
                <button @click="closeDrawer" class="btn-secondary flex-1">Close</button>
              </div>
            </div>

            <!-- No eval yet -->
            <div v-else class="text-center py-12">
              <p class="text-sm text-txt-disabled">This employee has not started their evaluation for {{ formatMonth(selectedMonth) }}.</p>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
