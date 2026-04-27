<script setup>
const versions = [
  {
    version: '1.2.0',
    date: '24 Apr 2026',
    tag: 'Latest',
    tagCls: 'tag-success',
    changes: [
      { type: 'feature', text: 'Project-based structure with 3 construction projects (Forum 2, AR496, QS-2024-001)' },
      { type: 'feature', text: '3-tier role hierarchy: Project Director → Project Manager → Staff' },
      { type: 'feature', text: 'Monthly evaluation cycle with month selector' },
      { type: 'feature', text: 'Role-specific KPIs for 5 roles (Supervisor, Engineer, QS, Admin, PM)' },
      { type: 'feature', text: 'Dual-column rating drawer (Self vs Supervisor side-by-side)' },
      { type: 'feature', text: 'Quarterly character evaluation (Mar, Jun, Sep, Dec only)' },
      { type: 'feature', text: 'Rate Team view for PM/PD to rate subordinates' },
      { type: 'feature', text: 'All Projects overview for Project Director' },
      { type: 'feature', text: 'Firebase deployment to prosync-pms.web.app' },
    ],
  },
  {
    version: '1.1.0',
    date: '23 Apr 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'Restyled to Prosync Design System (dark navy sidebar, brand blue #03439a, Open Sans)' },
      { type: 'feature', text: 'Annual Evaluation form with 50/30/20 weighted scoring' },
      { type: 'feature', text: '5 core KPI commitments rated 1–5' },
      { type: 'feature', text: '5 character/behavioral traits rated 1–5' },
      { type: 'feature', text: 'Contribution points with tier scoring system' },
      { type: 'feature', text: 'Summary tab with progress ring and grade (A–F)' },
      { type: 'improvement', text: 'Submit flow with confirmation modal and locked state' },
    ],
  },
  {
    version: '1.0.0',
    date: '22 Apr 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'Initial MVP of KPI Evaluation & L&D Dashboard' },
      { type: 'feature', text: 'Employee self-evaluation with Core Commitments (On Track / Missed)' },
      { type: 'feature', text: 'Value-Add Contributions logging with points' },
      { type: 'feature', text: 'Monthly Progress ring with total score' },
      { type: 'feature', text: 'HOD team leaderboard with sortable columns' },
      { type: 'feature', text: 'Review drawer for HOD to inspect employee details' },
      { type: 'feature', text: 'Role-based login (Employee / HOD)' },
    ],
  },
]

function typeIcon(type) {
  if (type === 'feature') return '✦'
  if (type === 'improvement') return '⬆'
  if (type === 'fix') return '🔧'
  return '•'
}

function typeCls(type) {
  if (type === 'feature') return 'text-brand-primary'
  if (type === 'improvement') return 'text-brand-primary/70'
  if (type === 'fix') return 'text-txt-success'
  return 'text-txt-subtitle'
}
</script>

<template>
  <div class="max-w-3xl mx-auto animate-fade-in">
    <div class="mb-6">
      <h1 class="text-lg font-bold text-txt-heading">Changelog</h1>
      <p class="text-sm text-txt-subtitle mt-0.5">Version history and release notes</p>
    </div>

    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-[15px] top-6 bottom-6 w-px bg-line"></div>

      <div v-for="(v, i) in versions" :key="v.version" class="relative pl-10 pb-8 last:pb-0">
        <!-- Dot -->
        <div class="absolute left-[9px] top-1.5 w-3 h-3 rounded-full border-2" :class="i === 0 ? 'bg-brand-primary border-brand-primary' : 'bg-surface-white border-line'"></div>

        <!-- Version card -->
        <div class="card p-5">
          <div class="flex items-center gap-3 mb-3">
            <h2 class="text-base font-bold text-txt-heading">v{{ v.version }}</h2>
            <span v-if="v.tag" class="tag" :class="v.tagCls">{{ v.tag }}</span>
            <span class="text-sm text-txt-muted ml-auto">{{ v.date }}</span>
          </div>

          <ul class="space-y-1.5">
            <li v-for="(c, j) in v.changes" :key="j" class="flex items-start gap-2 text-sm">
              <span class="text-xs mt-0.5 shrink-0" :class="typeCls(c.type)">{{ typeIcon(c.type) }}</span>
              <span class="text-txt-body">{{ c.text }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
