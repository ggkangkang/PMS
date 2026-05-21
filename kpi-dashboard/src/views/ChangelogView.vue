<script setup>
const versions = [
  {
    version: '2.2.0',
    date: '21 May 2026',
    tag: 'Latest',
    tagCls: 'tag-success',
    changes: [
      { type: 'feature', text: 'Project Director monitoring dashboard — no personal scoring, focused on team oversight and project health' },
      { type: 'feature', text: 'Pending Your Rating panel — shows PMs who submitted evaluations awaiting PD review' },
      { type: 'feature', text: 'Incomplete Evaluations panel — highlights staff with Draft or Not Started status for the month' },
      { type: 'feature', text: '6-month Project Performance Trend — interactive line chart (Chart.js) comparing average scores across all projects' },
      { type: 'feature', text: 'PM Team Leaderboard — Project Managers now see rankings of their own team members only' },
      { type: 'feature', text: 'Quick Actions on dashboard — fast access to Evaluation, Leaderboard, and Team views' },
      { type: 'feature', text: 'Changelog moved to profile menu — opens as a popup dialog instead of a separate page' },
      { type: 'improvement', text: 'Expanded color palette supporting 10+ projects in trend chart' },
      { type: 'improvement', text: 'Summary stats row for PD — Total Staff, Eval Completed, Pending Rating, Incomplete counts at a glance' },
      { type: 'improvement', text: 'PM navigation simplified — Team Overview & Rate Team merged into "My Team" tab' },
      { type: 'improvement', text: 'Removed Changelog tab from all role navigations — accessible via avatar menu' },
      { type: 'improvement', text: 'Removed My Evaluation tab for Project Director — monitoring-only role' },
    ],
  },
  {
    version: '2.1.0',
    date: '11 May 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'My Dashboard — unified personal dashboard for all roles with score breakdown, grade, and department rank' },
      { type: 'feature', text: 'Top 5 Leaderboard widget on My Dashboard with your position highlighted' },
      { type: 'feature', text: 'Core Commitments tracker — shows all 5 KPIs with On Track / Needs Attention / Not Started status' },
      { type: 'feature', text: 'Character Pillar rubric — full 5-level descriptors per pillar shown when rating (from official reference)' },
      { type: 'feature', text: 'Contribution carry-forward — excess points above top tier (350) roll into next month automatically' },
      { type: 'feature', text: 'Leaderboard Rank By filter — sort by Overall, Commitments (50%), Contributions (30%), or Character (20%)' },
      { type: 'feature', text: 'PD Department Dashboard — role filter dropdown (PM, Supervisor, Engineer, QS, Admin)' },
      { type: 'feature', text: 'Contribution visibility in PM Rate Team and HOD drawers — view staff logged contributions and carry-forward' },
      { type: 'improvement', text: 'Leaderboard score chips now labelled: KPI 40/50 · Contrib 12/30 · Char 17/20' },
      { type: 'improvement', text: 'Character Pillar names updated: Accountability & Attendance, Sustainability & Communication, Adaptability & Problem Solving, Synergy & Leadership' },
      { type: 'improvement', text: 'Rating scale updated: Needs Improvement → Developing → Meets Expectations → Exceeds Expectations → Role Model' },
      { type: 'improvement', text: 'Contribution form stays open after KPI submission — contributions are always additive' },
      { type: 'improvement', text: 'Rate PMs renamed to Rate Team for consistency across PD and PM views' },
      { type: 'improvement', text: 'All roles now land on My Dashboard after login' },
    ],
  },
  {
    version: '2.0.0',
    date: '8 May 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'HOD / Department Overview dashboard — view all staff by name, IC, position, score, and date of joining' },
      { type: 'feature', text: '4 Behaviour Pillars (20%): Accountability, Sustainability, Adaptability, Synergy — rated by supervisor' },
      { type: 'feature', text: 'Submit & Lock workflow — once supervisor submits, ratings become read-only' },
      { type: 'feature', text: 'Final Monthly Scoring engine: 50% Commitments + 30% Contributions + 20% Behaviour = 100%' },
      { type: 'feature', text: 'Staff Final Score view — shows full breakdown once supervisor rates behaviour' },
      { type: 'feature', text: 'User metadata: IC number and Date of Joining on all user profiles' },
      { type: 'improvement', text: 'PD/HOD login now routes to Department Overview as primary view' },
      { type: 'improvement', text: 'PM Rate Team drawer now includes behaviour 4-pillar rating section' },
      { type: 'improvement', text: 'Login page shows all 3 demo accounts: PD001, PM001, EMP001' },
    ],
  },
  {
    version: '1.2.0',
    date: '24 Apr 2026',
    tag: '',
    tagCls: '',
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
