<script setup>
import { ref, reactive, computed } from 'vue'
import {
  roleKPIs, behaviourPillars, behaviourRatingScale, commitmentRatingScale,
  contributionOptions, contributionBaseline,
} from '../data/dummyData'

const activeTab = ref('kpis')
const tabs = [
  { id: 'kpis', label: 'KPI Questions' },
  { id: 'behaviour', label: 'Behaviour Pillars' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'scoring', label: 'Scoring Weights' },
]

// ─── KPI Management ─────────────────────────────────────────────────
const roleOptions = [
  { id: 'site-supervisor', label: 'Site Supervisor' },
  { id: 'site-engineer', label: 'Site Engineer' },
  { id: 'quantity-surveyor', label: 'Quantity Surveyor' },
  { id: 'site-admin', label: 'Site Admin' },
  { id: 'project-manager', label: 'Project Manager' },
]
const selectedRole = ref('site-supervisor')
const editingKpi = ref(null)
const kpiForm = reactive({ label: '', description: '', weight: 10 })

function startEditKpi(kpi) {
  editingKpi.value = kpi.id
  kpiForm.label = kpi.label
  kpiForm.description = kpi.description
  kpiForm.weight = kpi.weight
}

function saveKpi(kpi) {
  kpi.label = kpiForm.label
  kpi.description = kpiForm.description
  kpi.weight = kpiForm.weight
  editingKpi.value = null
}

function cancelEditKpi() { editingKpi.value = null }

const currentKpis = computed(() => roleKPIs[selectedRole.value] || [])

// ─── Behaviour Pillars ──────────────────────────────────────────────
const editingPillar = ref(null)
const pillarForm = reactive({ label: '', subtitle: '', description: '' })

function startEditPillar(p) {
  editingPillar.value = p.id
  pillarForm.label = p.label
  pillarForm.subtitle = p.subtitle
  pillarForm.description = p.description
}

function savePillar(p) {
  p.label = pillarForm.label
  p.subtitle = pillarForm.subtitle
  p.description = pillarForm.description
  editingPillar.value = null
}

function cancelEditPillar() { editingPillar.value = null }

// ─── Contributions ──────────────────────────────────────────────────
const editingContrib = ref(null)
const contribForm = reactive({ label: '', points: 0 })

function startEditContrib(c, i) {
  editingContrib.value = i
  contribForm.label = c.label
  contribForm.points = c.points
}

function saveContrib(c) {
  c.label = contribForm.label
  c.points = Number(contribForm.points)
  editingContrib.value = null
}

function cancelEditContrib() { editingContrib.value = null }

const showAddContrib = ref(false)
const newContribForm = reactive({ label: '', points: 0 })

function addContrib() {
  if (!newContribForm.label.trim()) return
  contributionOptions.push({ label: newContribForm.label.trim(), points: Number(newContribForm.points) })
  newContribForm.label = ''
  newContribForm.points = 0
  showAddContrib.value = false
}

function removeContrib(i) {
  contributionOptions.splice(i, 1)
}

// ─── Baseline Tiers ─────────────────────────────────────────────────
const editingTier = ref(null)
const tierForm = reactive({ min: 0, max: 0, score: 0, label: '' })

function startEditTier(t, i) {
  editingTier.value = i
  tierForm.min = t.min
  tierForm.max = t.max === Infinity ? 9999 : t.max
  tierForm.score = t.score
  tierForm.label = t.label
}

function saveTier(t) {
  t.min = Number(tierForm.min)
  t.max = Number(tierForm.max) >= 9999 ? Infinity : Number(tierForm.max)
  t.score = Number(tierForm.score)
  t.label = tierForm.label
  editingTier.value = null
}

function cancelEditTier() { editingTier.value = null }

// ─── Scoring Weights ────────────────────────────────────────────────
const weights = reactive({ commitment: 50, contribution: 30, behaviour: 20 })
const weightsTotal = computed(() => weights.commitment + weights.contribution + weights.behaviour)
const weightsValid = computed(() => weightsTotal.value === 100)

// ─── Rating Scale ───────────────────────────────────────────────────
const editingRating = ref(null)
const ratingForm = reactive({ label: '', description: '' })

function startEditRating(r, i) {
  editingRating.value = i
  ratingForm.label = r.label
  ratingForm.description = r.description || ''
}

function saveRating(r) {
  r.label = ratingForm.label
  if (ratingForm.description) r.description = ratingForm.description
  editingRating.value = null
}

function cancelEditRating() { editingRating.value = null }

// Toast
const showToast = ref(false)
const toastMsg = ref('')
function toast(msg) {
  toastMsg.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 2000)
}
</script>

<template>
  <div class="max-w-5xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-lg font-bold text-txt-heading">Admin Panel</h1>
      <p class="text-sm text-txt-subtitle mt-0.5">Manage KPI questions, scoring weights, behaviour pillars, and contribution settings</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-0 mb-6 border-b border-line">
      <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
        :class="['nav-tab', { active: activeTab === t.id }]"
      >{{ t.label }}</button>
    </div>

    <!-- ═══ KPI QUESTIONS ═══ -->
    <div v-if="activeTab === 'kpis'" class="animate-fade-in space-y-5">
      <!-- Role selector -->
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium text-txt-body">Role:</label>
        <select v-model="selectedRole" class="select-field w-56">
          <option v-for="r in roleOptions" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-txt-heading">KPIs for {{ roleOptions.find(r => r.id === selectedRole)?.label }}</h3>
          <span class="text-xs text-txt-muted">{{ currentKpis.length }} KPIs · {{ currentKpis.reduce((s,k) => s + k.weight, 0) }}% total weight</span>
        </div>

        <div v-for="(kpi, i) in currentKpis" :key="kpi.id"
          class="p-5 border-t border-line hover:bg-surface-gray/30 transition-colors"
        >
          <!-- Read mode -->
          <div v-if="editingKpi !== kpi.id">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold text-brand-primary uppercase">{{ kpi.id.toUpperCase() }}</span>
                  <span class="tag tag-info text-[10px]">{{ kpi.weight }}%</span>
                </div>
                <p class="text-sm font-semibold text-txt-body">{{ kpi.label }}</p>
                <p class="text-xs text-txt-subtitle mt-1">{{ kpi.description }}</p>
              </div>
              <button @click="startEditKpi(kpi)" class="btn-ghost text-xs">Edit</button>
            </div>
          </div>

          <!-- Edit mode -->
          <div v-else class="space-y-3">
            <div>
              <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">KPI Label</label>
              <input v-model="kpiForm.label" class="input-field text-sm" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Description</label>
              <textarea v-model="kpiForm.description" rows="2" class="input-field text-sm resize-none"></textarea>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Weight (%)</label>
              <input v-model.number="kpiForm.weight" type="number" min="1" max="50" class="input-field text-sm w-24" />
            </div>
            <div class="flex gap-2">
              <button @click="saveKpi(kpi); toast('KPI updated')" class="btn-primary text-xs">Save</button>
              <button @click="cancelEditKpi" class="btn-secondary text-xs">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Rating Scale -->
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3">
          <h3 class="text-sm font-bold text-txt-heading">Rating Scale (1–5)</h3>
        </div>
        <div v-for="(r, i) in commitmentRatingScale" :key="r.value" class="px-5 py-3 border-t border-line flex items-center justify-between">
          <div v-if="editingRating !== i" class="flex items-center gap-3 flex-1">
            <span class="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold flex items-center justify-center">{{ r.value }}</span>
            <div>
              <p class="text-sm font-medium text-txt-body">{{ r.label }}</p>
              <p v-if="r.description" class="text-xs text-txt-muted">{{ r.description }}</p>
            </div>
            <button @click="startEditRating(r, i)" class="btn-ghost text-xs ml-auto">Edit</button>
          </div>
          <div v-else class="flex items-center gap-3 flex-1">
            <span class="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold flex items-center justify-center shrink-0">{{ r.value }}</span>
            <input v-model="ratingForm.label" class="input-field text-sm flex-1" placeholder="Label" />
            <input v-model="ratingForm.description" class="input-field text-sm flex-1" placeholder="Description" />
            <button @click="saveRating(r); toast('Rating updated')" class="btn-primary text-xs">Save</button>
            <button @click="cancelEditRating" class="btn-ghost text-xs">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ BEHAVIOUR PILLARS ═══ -->
    <div v-if="activeTab === 'behaviour'" class="animate-fade-in space-y-5">
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3">
          <h3 class="text-sm font-bold text-txt-heading">4 Behaviour Pillars (20% Weight)</h3>
          <p class="text-xs text-txt-muted mt-0.5">These are rated by the supervisor (HOD / PM) for each staff member</p>
        </div>

        <div v-for="(p, i) in behaviourPillars" :key="p.id" class="p-5 border-t border-line">
          <!-- Read mode -->
          <div v-if="editingPillar !== p.id">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-bold text-txt-heading">{{ p.label }}</span>
                  <span class="tag bg-surface-gray text-txt-subtitle text-[10px]">{{ p.subtitle }}</span>
                </div>
                <p class="text-xs text-txt-subtitle">{{ p.description }}</p>
              </div>
              <button @click="startEditPillar(p)" class="btn-ghost text-xs">Edit</button>
            </div>
          </div>

          <!-- Edit mode -->
          <div v-else class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Pillar Name</label>
                <input v-model="pillarForm.label" class="input-field text-sm" />
              </div>
              <div>
                <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Subtitle</label>
                <input v-model="pillarForm.subtitle" class="input-field text-sm" />
              </div>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Description</label>
              <textarea v-model="pillarForm.description" rows="2" class="input-field text-sm resize-none"></textarea>
            </div>
            <div class="flex gap-2">
              <button @click="savePillar(p); toast('Pillar updated')" class="btn-primary text-xs">Save</button>
              <button @click="cancelEditPillar" class="btn-secondary text-xs">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Behaviour Rating Scale -->
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3">
          <h3 class="text-sm font-bold text-txt-heading">Behaviour Rating Scale</h3>
        </div>
        <div v-for="(r, i) in behaviourRatingScale" :key="r.value" class="px-5 py-3 border-t border-line flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold flex items-center justify-center shrink-0">{{ r.value }}</span>
          <p class="text-sm font-medium text-txt-body flex-1">{{ r.label }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ CONTRIBUTIONS ═══ -->
    <div v-if="activeTab === 'contributions'" class="animate-fade-in space-y-5">
      <!-- Contribution Types -->
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-txt-heading">Contribution Types</h3>
            <p class="text-xs text-txt-muted mt-0.5">Types of contributions staff can log each month</p>
          </div>
          <button @click="showAddContrib = !showAddContrib" class="btn-primary text-xs">+ Add</button>
        </div>

        <!-- Add new -->
        <div v-if="showAddContrib" class="p-5 border-t border-line bg-surface-gray/30">
          <div class="grid grid-cols-[1fr_100px_auto] gap-3 items-end">
            <div>
              <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Label</label>
              <input v-model="newContribForm.label" class="input-field text-sm" placeholder="e.g. Safety Award" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-txt-muted uppercase mb-1 block">Points</label>
              <input v-model.number="newContribForm.points" type="number" min="1" class="input-field text-sm" />
            </div>
            <button @click="addContrib; toast('Contribution added')" class="btn-primary text-xs h-[38px]">Add</button>
          </div>
        </div>

        <div v-for="(c, i) in contributionOptions" :key="i" class="px-5 py-4 border-t border-line flex items-center justify-between hover:bg-surface-gray/30 transition-colors">
          <div v-if="editingContrib !== i" class="flex items-center gap-3 flex-1">
            <div class="flex-1">
              <p class="text-sm font-medium text-txt-body">{{ c.label }}</p>
            </div>
            <span class="tag tag-info text-xs">{{ c.points }} pts</span>
            <button @click="startEditContrib(c, i)" class="btn-ghost text-xs">Edit</button>
            <button @click="removeContrib(i)" class="btn-ghost text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
          <div v-else class="flex items-center gap-3 flex-1">
            <input v-model="contribForm.label" class="input-field text-sm flex-1" />
            <input v-model.number="contribForm.points" type="number" min="1" class="input-field text-sm w-24" />
            <button @click="saveContrib(c); toast('Updated')" class="btn-primary text-xs">Save</button>
            <button @click="cancelEditContrib" class="btn-ghost text-xs">✕</button>
          </div>
        </div>
      </div>

      <!-- Baseline Tiers -->
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3">
          <h3 class="text-sm font-bold text-txt-heading">Contribution Baseline Tiers</h3>
          <p class="text-xs text-txt-muted mt-0.5">Minimum points: <strong>{{ contributionBaseline.minimumPoints }}</strong></p>
        </div>
        <table class="w-full">
          <thead>
            <tr class="border-t border-line text-left">
              <th class="px-5 py-2 text-[11px] font-semibold text-txt-disabled uppercase">Score</th>
              <th class="px-5 py-2 text-[11px] font-semibold text-txt-disabled uppercase">Label</th>
              <th class="px-5 py-2 text-[11px] font-semibold text-txt-disabled uppercase">Min Pts</th>
              <th class="px-5 py-2 text-[11px] font-semibold text-txt-disabled uppercase">Max Pts</th>
              <th class="px-5 py-2 text-[11px] font-semibold text-txt-disabled uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, i) in contributionBaseline.tiers" :key="i" class="border-t border-line/50 hover:bg-surface-gray/30">
              <template v-if="editingTier !== i">
                <td class="px-5 py-3 text-sm font-bold text-brand-primary">{{ t.score }}/5</td>
                <td class="px-5 py-3 text-sm text-txt-body">{{ t.label }}</td>
                <td class="px-5 py-3 text-sm text-txt-body">{{ t.min }}</td>
                <td class="px-5 py-3 text-sm text-txt-body">{{ t.max === Infinity ? '∞' : t.max }}</td>
                <td class="px-5 py-3 text-right"><button @click="startEditTier(t, i)" class="btn-ghost text-xs">Edit</button></td>
              </template>
              <template v-else>
                <td class="px-5 py-3"><input v-model.number="tierForm.score" type="number" min="1" max="5" class="input-field text-sm w-16" /></td>
                <td class="px-5 py-3"><input v-model="tierForm.label" class="input-field text-sm" /></td>
                <td class="px-5 py-3"><input v-model.number="tierForm.min" type="number" min="0" class="input-field text-sm w-20" /></td>
                <td class="px-5 py-3"><input v-model.number="tierForm.max" type="number" min="0" class="input-field text-sm w-20" /></td>
                <td class="px-5 py-3 text-right flex gap-1 justify-end">
                  <button @click="saveTier(t); toast('Tier updated')" class="btn-primary text-xs">Save</button>
                  <button @click="cancelEditTier" class="btn-ghost text-xs">✕</button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══ SCORING WEIGHTS ═══ -->
    <div v-if="activeTab === 'scoring'" class="animate-fade-in space-y-5">
      <div class="card p-6">
        <h3 class="text-sm font-bold text-txt-heading mb-1">Monthly Scoring Weights</h3>
        <p class="text-xs text-txt-muted mb-5">Total must equal 100%</p>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-txt-body w-40">Commitments (KPIs)</label>
            <input v-model.number="weights.commitment" type="number" min="0" max="100" class="input-field text-sm w-24" />
            <span class="text-sm text-txt-muted">%</span>
            <div class="flex-1 h-3 bg-surface-gray rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-brand-primary transition-all" :style="{ width: weights.commitment + '%' }"></div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-txt-body w-40">Contributions</label>
            <input v-model.number="weights.contribution" type="number" min="0" max="100" class="input-field text-sm w-24" />
            <span class="text-sm text-txt-muted">%</span>
            <div class="flex-1 h-3 bg-surface-gray rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-yellow-500 transition-all" :style="{ width: weights.contribution + '%' }"></div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-txt-body w-40">Behaviour (4 Pillars)</label>
            <input v-model.number="weights.behaviour" type="number" min="0" max="100" class="input-field text-sm w-24" />
            <span class="text-sm text-txt-muted">%</span>
            <div class="flex-1 h-3 bg-surface-gray rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-green-500 transition-all" :style="{ width: weights.behaviour + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="mt-5 pt-4 border-t border-line flex items-center justify-between">
          <span class="text-sm font-bold text-txt-heading">Total</span>
          <span class="text-lg font-bold" :class="weightsValid ? 'text-txt-success' : 'text-txt-error'">
            {{ weightsTotal }}%
            <span v-if="!weightsValid" class="text-xs font-normal text-txt-error ml-1">Must equal 100%</span>
            <span v-else class="text-xs font-normal text-txt-success ml-1">✓ Valid</span>
          </span>
        </div>
      </div>

      <!-- Info Card -->
      <div class="card p-5 bg-surface-info/30 border-blue-200/40">
        <h4 class="text-sm font-semibold text-txt-heading mb-2">How scoring works</h4>
        <ul class="text-sm text-txt-subtitle space-y-1.5">
          <li class="flex items-start gap-2"><span class="text-brand-primary">📋</span> <strong>Commitments</strong> — 5 role-specific KPIs, each rated 1–5 by the employee (self) and supervisor</li>
          <li class="flex items-start gap-2"><span class="text-yellow-500">⭐</span> <strong>Contributions</strong> — Extra initiatives logged by staff, scored against baseline tiers</li>
          <li class="flex items-start gap-2"><span class="text-green-500">🤝</span> <strong>Behaviour</strong> — 4 pillars rated by supervisor only (Accountability, Sustainability, Adaptability, Synergy)</li>
        </ul>
      </div>
    </div>

    <!-- Toast -->
    <teleport to="body">
      <transition name="page">
        <div v-if="showToast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg">
          ✓ {{ toastMsg }}
        </div>
      </transition>
    </teleport>
  </div>
</template>
