// ─── Projects ─────────────────────────────────────────────────────────
export const projects = [
  { id: 'PRJ001', name: 'Forum 2', location: 'Kuala Lumpur', status: 'active' },
  { id: 'PRJ002', name: 'AR496', location: 'Petaling Jaya', status: 'active' },
  { id: 'PRJ003', name: 'QS-2024-001', location: 'Shah Alam', status: 'active' },
]

// ─── Users ────────────────────────────────────────────────────────────
export const users = [
  // Project Director (oversees all projects)
  { id: 'PD001', name: 'Dato Ahmad Razak', initials: 'DA', role: 'project-director', label: 'Project Director', projects: ['PRJ001','PRJ002','PRJ003'], reportsTo: null, avatarColor: 'bg-brand-primary' },

  // Project Managers
  { id: 'PM001', name: 'James Tan', initials: 'JT', role: 'project-manager', label: 'Project Manager', projectId: 'PRJ001', reportsTo: 'PD001', avatarColor: 'bg-indigo-500' },
  { id: 'PM002', name: 'Sarah Lee', initials: 'SL', role: 'project-manager', label: 'Project Manager', projectId: 'PRJ002', reportsTo: 'PD001', avatarColor: 'bg-pink-500' },

  // Staff — Forum 2 (PRJ001)
  { id: 'EMP001', name: 'Ahmad Razak', initials: 'AR', role: 'site-supervisor', label: 'Site Supervisor', projectId: 'PRJ001', reportsTo: 'PM001', avatarColor: 'bg-orange-500' },
  { id: 'EMP002', name: 'Raju Krishnan', initials: 'RK', role: 'site-engineer', label: 'Site Engineer', projectId: 'PRJ001', reportsTo: 'PM001', avatarColor: 'bg-green-600' },
  { id: 'EMP003', name: 'Mohd Hafiz', initials: 'MH', role: 'site-admin', label: 'Site Admin', projectId: 'PRJ001', reportsTo: 'PM001', avatarColor: 'bg-cyan-600' },

  // Staff — AR496 (PRJ002)
  { id: 'EMP004', name: 'Lee Wei Ming', initials: 'LW', role: 'quantity-surveyor', label: 'Quantity Surveyor', projectId: 'PRJ002', reportsTo: 'PM002', avatarColor: 'bg-emerald-600' },
  { id: 'EMP005', name: 'Siti Nurhaliza', initials: 'SN', role: 'site-supervisor', label: 'Site Supervisor', projectId: 'PRJ002', reportsTo: 'PM002', avatarColor: 'bg-violet-500' },
  { id: 'EMP006', name: 'Daniel Tan', initials: 'DT', role: 'site-engineer', label: 'Site Engineer', projectId: 'PRJ002', reportsTo: 'PM002', avatarColor: 'bg-teal-600' },
]

// ─── Role-Specific KPIs (50% — 5 KPIs at 10% each) ──────────────────
export const roleKPIs = {
  'site-supervisor': [
    { id: 'kpi1', label: 'Safety Compliance & Enforcement', description: 'Ensure all site safety protocols are followed. Conduct toolbox talks, enforce PPE usage, and report incidents promptly.', weight: 10 },
    { id: 'kpi2', label: 'Daily Progress Tracking', description: 'Monitor and record daily work progress against planned schedule. Flag delays and propose catch-up measures.', weight: 10 },
    { id: 'kpi3', label: 'Subcontractor Coordination', description: 'Manage subcon workforce deployment, monitor workmanship quality, and resolve on-site conflicts.', weight: 10 },
    { id: 'kpi4', label: 'Quality Checks & Inspections', description: 'Perform regular quality inspections. Ensure work meets specifications and rectify defects before handover.', weight: 10 },
    { id: 'kpi5', label: 'Site Housekeeping & Organisation', description: 'Maintain clean, organised work areas. Ensure proper material storage and waste management.', weight: 10 },
  ],
  'site-engineer': [
    { id: 'kpi1', label: 'Technical Drawing Review', description: 'Review and interpret construction drawings. Identify discrepancies and coordinate with design team.', weight: 10 },
    { id: 'kpi2', label: 'Material Inspection & Testing', description: 'Inspect incoming materials for quality compliance. Manage material testing and maintain records.', weight: 10 },
    { id: 'kpi3', label: 'RFI & Technical Query Management', description: 'Prepare and track RFIs. Ensure timely responses and distribute technical clarifications to site team.', weight: 10 },
    { id: 'kpi4', label: 'Method Statement Preparation', description: 'Develop and review method statements for critical activities. Ensure compliance with safety and quality standards.', weight: 10 },
    { id: 'kpi5', label: 'Safety & Environmental Compliance', description: 'Ensure engineering works comply with safety regulations and environmental requirements.', weight: 10 },
  ],
  'quantity-surveyor': [
    { id: 'kpi1', label: 'Cost Tracking & Budget Monitoring', description: 'Track project costs against approved budget. Prepare monthly cost reports and forecast final accounts.', weight: 10 },
    { id: 'kpi2', label: 'Claims Processing & Certification', description: 'Prepare and process progress claims. Ensure timely submission and follow up on certifications.', weight: 10 },
    { id: 'kpi3', label: 'Variation Order Management', description: 'Identify, document, and price variation orders. Maintain VO register and track approvals.', weight: 10 },
    { id: 'kpi4', label: 'Measurement & Valuation', description: 'Conduct accurate site measurements. Prepare interim valuations and final account reconciliation.', weight: 10 },
    { id: 'kpi5', label: 'Contract Administration', description: 'Manage contract documentation. Track contractual obligations, deadlines, and correspondence.', weight: 10 },
  ],
  'site-admin': [
    { id: 'kpi1', label: 'Documentation & Filing', description: 'Maintain organised filing system for all project documents. Ensure proper version control and accessibility.', weight: 10 },
    { id: 'kpi2', label: 'Attendance & Workforce Tracking', description: 'Record daily attendance for all workers. Manage OT records and generate workforce reports.', weight: 10 },
    { id: 'kpi3', label: 'Permit & License Management', description: 'Track and renew worker permits, licenses, and certifications. Alert management before expiry.', weight: 10 },
    { id: 'kpi4', label: 'Material Ordering & Logistics', description: 'Process purchase orders, track deliveries, and manage material inventory on site.', weight: 10 },
    { id: 'kpi5', label: 'Report Preparation & Distribution', description: 'Prepare weekly/monthly site reports. Compile meeting minutes and distribute to stakeholders.', weight: 10 },
  ],
  'project-manager': [
    { id: 'kpi1', label: 'Project Planning & Scheduling', description: 'Develop and maintain project master plan. Monitor critical path, track milestones, and manage delays.', weight: 10 },
    { id: 'kpi2', label: 'Cost Management & Profitability', description: 'Monitor project P&L. Control costs, approve expenditures, and ensure project stays within budget.', weight: 10 },
    { id: 'kpi3', label: 'Client Communication & Relationship', description: 'Maintain professional client relations. Attend meetings, address concerns, and manage expectations.', weight: 10 },
    { id: 'kpi4', label: 'Team Leadership & Development', description: 'Lead, motivate, and develop project team. Conduct regular team meetings and provide mentorship.', weight: 10 },
    { id: 'kpi5', label: 'Quality Assurance & Compliance', description: 'Ensure project deliverables meet quality standards. Oversee ISO compliance and audit readiness.', weight: 10 },
  ],
}

// ─── Rating Scales ────────────────────────────────────────────────────
export const commitmentRatingScale = [
  { value: 1, label: 'Unsatisfactory', description: 'Consistently fails to meet expectations', color: 'danger' },
  { value: 2, label: 'Needs Improvement', description: 'Meets some but not all expectations', color: 'coral' },
  { value: 3, label: 'Meets Expectations', description: 'Consistently meets job requirements', color: 'caution' },
  { value: 4, label: 'Exceeds Expectations', description: 'Frequently surpasses requirements', color: 'ocean' },
  { value: 5, label: 'Outstanding', description: 'Exceptional performance', color: 'emerge' },
]

export const characterTraits = [
  { id: 'teamwork', label: 'Teamwork & Collaboration', description: 'Works effectively with colleagues, shares knowledge, supports team goals.' },
  { id: 'communication', label: 'Communication Skills', description: 'Communicates clearly and professionally. Actively listens and provides constructive feedback.' },
  { id: 'initiative', label: 'Initiative & Proactiveness', description: 'Takes ownership, anticipates problems, proposes solutions without being prompted.' },
  { id: 'integrity', label: 'Integrity & Ethics', description: 'Demonstrates honesty, accountability, and adherence to company policies.' },
  { id: 'adaptability', label: 'Adaptability & Learning', description: 'Embraces change, learns new skills, adjusts to evolving demands.' },
]

export const characterRatingScale = [
  { value: 1, label: 'Rarely Demonstrated', color: 'danger' },
  { value: 2, label: 'Sometimes Demonstrated', color: 'coral' },
  { value: 3, label: 'Often Demonstrated', color: 'caution' },
  { value: 4, label: 'Consistently Demonstrated', color: 'ocean' },
  { value: 5, label: 'Exemplary', color: 'emerge' },
]

// ─── Contributions (30%) ──────────────────────────────────────────────
export const contributionOptions = [
  { label: 'New Sales Referral (Min RM 50mil)', points: 180 },
  { label: 'Support Property Sales', points: 60 },
  { label: 'ISO Coordination', points: 10 },
  { label: 'Host Trainings', points: 5 },
]

export const contributionBaseline = {
  minimumPoints: 100,
  tiers: [
    { min: 0, max: 49, score: 1, label: 'Below Baseline' },
    { min: 50, max: 99, score: 2, label: 'Approaching Baseline' },
    { min: 100, max: 199, score: 3, label: 'Meets Baseline' },
    { min: 200, max: 349, score: 4, label: 'Above Baseline' },
    { min: 350, max: Infinity, score: 5, label: 'Exceptional' },
  ],
}

// ─── Monthly Evaluation Records ──────────────────────────────────────
// Key format: userId-YYYY-MM
export const monthlyEvaluations = {
  // EMP001 — Ahmad Razak (Site Supervisor, Forum 2) — April
  'EMP001-2026-04': {
    employeeId: 'EMP001', month: '2026-04', projectId: 'PRJ001', status: 'submitted',
    self: {
      commitmentRatings: { kpi1: 4, kpi2: 4, kpi3: 3, kpi4: 4, kpi5: 3 },
      contributions: [
        { id: 1, type: 'ISO Coordination', points: 10, date: '2026-04-10' },
        { id: 2, type: 'Host Trainings', points: 5, date: '2026-04-18' },
      ],
      notes: 'Achieved zero incidents this month. Toolbox talks conducted daily without fail.',
    },
    supervisor: {
      commitmentRatings: { kpi1: 4, kpi2: 3, kpi3: 4, kpi4: 4, kpi5: 3 },
      notes: 'Ahmad has shown strong safety leadership. Needs to improve daily progress reporting detail.',
      ratedBy: 'PM001', ratedAt: '2026-05-03',
    },
  },
  'EMP001-2026-03': {
    employeeId: 'EMP001', month: '2026-03', projectId: 'PRJ001', status: 'reviewed',
    self: {
      commitmentRatings: { kpi1: 3, kpi2: 3, kpi3: 3, kpi4: 3, kpi5: 3 },
      contributions: [{ id: 1, type: 'Host Trainings', points: 5, date: '2026-03-12' }],
      notes: 'Standard month with consistent performance across all KPIs.',
    },
    supervisor: {
      commitmentRatings: { kpi1: 3, kpi2: 3, kpi3: 3, kpi4: 3, kpi5: 2 },
      notes: 'Consistent but could push harder on housekeeping standards.',
      ratedBy: 'PM001', ratedAt: '2026-04-05',
    },
  },
  // EMP002 — Raju Krishnan (Site Engineer, Forum 2) — April
  'EMP002-2026-04': {
    employeeId: 'EMP002', month: '2026-04', projectId: 'PRJ001', status: 'submitted',
    self: {
      commitmentRatings: { kpi1: 5, kpi2: 4, kpi3: 4, kpi4: 3, kpi5: 4 },
      contributions: [
        { id: 1, type: 'New Sales Referral (Min RM 50mil)', points: 180, date: '2026-04-05' },
      ],
      notes: 'Resolved 3 critical RFIs this month. All material tests passed.',
    },
    supervisor: null, // Not yet rated by PM
  },
  // EMP003 — Mohd Hafiz (Site Admin, Forum 2) — April
  'EMP003-2026-04': {
    employeeId: 'EMP003', month: '2026-04', projectId: 'PRJ001', status: 'draft',
    self: {
      commitmentRatings: { kpi1: 3, kpi2: 0, kpi3: 0, kpi4: 0, kpi5: 0 },
      contributions: [],
      notes: '',
    },
    supervisor: null,
  },
  // EMP004 — Lee Wei Ming (QS, AR496) — April
  'EMP004-2026-04': {
    employeeId: 'EMP004', month: '2026-04', projectId: 'PRJ002', status: 'submitted',
    self: {
      commitmentRatings: { kpi1: 4, kpi2: 4, kpi3: 5, kpi4: 4, kpi5: 3 },
      contributions: [
        { id: 1, type: 'ISO Coordination', points: 10, date: '2026-04-08' },
        { id: 2, type: 'Support Property Sales', points: 60, date: '2026-04-20' },
      ],
      notes: 'Processed 2 major VO claims successfully this month.',
    },
    supervisor: {
      commitmentRatings: { kpi1: 4, kpi2: 4, kpi3: 5, kpi4: 4, kpi5: 3 },
      notes: 'Wei Ming excels at variation management. Strong month.',
      ratedBy: 'PM002', ratedAt: '2026-05-02',
    },
  },
  // EMP005 — Siti (Site Supervisor, AR496) — April
  'EMP005-2026-04': {
    employeeId: 'EMP005', month: '2026-04', projectId: 'PRJ002', status: 'not-started',
    self: { commitmentRatings: { kpi1: 0, kpi2: 0, kpi3: 0, kpi4: 0, kpi5: 0 }, contributions: [], notes: '' },
    supervisor: null,
  },
  // EMP006 — Daniel (Site Engineer, AR496) — April
  'EMP006-2026-04': {
    employeeId: 'EMP006', month: '2026-04', projectId: 'PRJ002', status: 'submitted',
    self: {
      commitmentRatings: { kpi1: 4, kpi2: 3, kpi3: 4, kpi4: 4, kpi5: 4 },
      contributions: [{ id: 1, type: 'Host Trainings', points: 5, date: '2026-04-15' }],
      notes: 'Completed method statements for all upcoming piling works.',
    },
    supervisor: null,
  },
  // PM001 — James Tan (PM, Forum 2) — April
  'PM001-2026-04': {
    employeeId: 'PM001', month: '2026-04', projectId: 'PRJ001', status: 'submitted',
    self: {
      commitmentRatings: { kpi1: 4, kpi2: 4, kpi3: 5, kpi4: 4, kpi5: 4 },
      contributions: [
        { id: 1, type: 'New Sales Referral (Min RM 50mil)', points: 180, date: '2026-04-12' },
        { id: 2, type: 'ISO Coordination', points: 10, date: '2026-04-22' },
      ],
      notes: 'Project on track. Client meeting went well. Budget within 2% variance.',
    },
    supervisor: null, // PD hasn't rated yet
  },
  // PM002 — Sarah Lee (PM, AR496) — April
  'PM002-2026-04': {
    employeeId: 'PM002', month: '2026-04', projectId: 'PRJ002', status: 'submitted',
    self: {
      commitmentRatings: { kpi1: 4, kpi2: 3, kpi3: 4, kpi4: 5, kpi5: 4 },
      contributions: [
        { id: 1, type: 'Support Property Sales', points: 60, date: '2026-04-06' },
      ],
      notes: 'Managed two critical subcon changeovers smoothly this month.',
    },
    supervisor: {
      commitmentRatings: { kpi1: 4, kpi2: 3, kpi3: 4, kpi4: 5, kpi5: 4 },
      notes: 'Sarah managed the team well during a challenging transition period.',
      ratedBy: 'PD001', ratedAt: '2026-05-04',
    },
  },
}

// ─── Quarterly Character Evaluations ─────────────────────────────────
// Key format: userId-YYYY-QN
export const quarterlyCharacter = {
  'EMP001-2026-Q1': {
    employeeId: 'EMP001', quarter: 'Q1', year: 2026, status: 'reviewed',
    self: { teamwork: 4, communication: 3, initiative: 4, integrity: 5, adaptability: 3 },
    supervisor: { teamwork: 4, communication: 3, initiative: 3, integrity: 5, adaptability: 3, ratedBy: 'PM001' },
  },
  'EMP002-2026-Q1': {
    employeeId: 'EMP002', quarter: 'Q1', year: 2026, status: 'reviewed',
    self: { teamwork: 5, communication: 4, initiative: 5, integrity: 4, adaptability: 4 },
    supervisor: { teamwork: 5, communication: 4, initiative: 5, integrity: 4, adaptability: 4, ratedBy: 'PM001' },
  },
  'EMP004-2026-Q1': {
    employeeId: 'EMP004', quarter: 'Q1', year: 2026, status: 'reviewed',
    self: { teamwork: 4, communication: 4, initiative: 4, integrity: 5, adaptability: 4 },
    supervisor: { teamwork: 4, communication: 4, initiative: 4, integrity: 5, adaptability: 3, ratedBy: 'PM002' },
  },
  'PM001-2026-Q1': {
    employeeId: 'PM001', quarter: 'Q1', year: 2026, status: 'reviewed',
    self: { teamwork: 5, communication: 5, initiative: 4, integrity: 5, adaptability: 4 },
    supervisor: { teamwork: 5, communication: 4, initiative: 4, integrity: 5, adaptability: 4, ratedBy: 'PD001' },
  },
}

// ─── Available months for evaluation ─────────────────────────────────
export const availableMonths = [
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
]

// ─── Helper Functions ────────────────────────────────────────────────

export function getUserById(id) {
  return users.find(u => u.id === id)
}

export function getProjectById(id) {
  return projects.find(p => p.id === id)
}

export function getUsersByProject(projectId) {
  return users.filter(u => u.projectId === projectId)
}

export function getSubordinates(supervisorId) {
  return users.filter(u => u.reportsTo === supervisorId)
}

export function getKPIsForRole(role) {
  return roleKPIs[role] || roleKPIs['site-supervisor']
}

export function getMonthlyEval(userId, month) {
  return monthlyEvaluations[`${userId}-${month}`] || null
}

export function getQuarterlyChar(userId, year, quarter) {
  return quarterlyCharacter[`${userId}-${year}-${quarter}`] || null
}

export function getCurrentQuarter(month) {
  const m = parseInt(month.split('-')[1])
  if (m <= 3) return 'Q1'
  if (m <= 6) return 'Q2'
  if (m <= 9) return 'Q3'
  return 'Q4'
}

export function isQuarterEndMonth(month) {
  const m = parseInt(month.split('-')[1])
  return [3, 6, 9, 12].includes(m)
}

export function formatMonth(monthStr) {
  const [y, m] = monthStr.split('-')
  const date = new Date(y, parseInt(m) - 1)
  return date.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Score calculators
export function getCommitmentScore(ratings) {
  const values = Object.values(ratings).filter(v => v > 0)
  if (values.length === 0) return 0
  const avg = values.reduce((s, v) => s + v, 0) / values.length
  return Math.round((avg / 5) * 50)
}

export function getContributionScore(totalPoints) {
  const tier = contributionBaseline.tiers.find(t => totalPoints >= t.min && totalPoints <= t.max)
  if (!tier) return 0
  return Math.round((tier.score / 5) * 30)
}

export function getCharacterScore(ratings) {
  if (!ratings) return 0
  const values = Object.values(ratings).filter(v => typeof v === 'number' && v > 0)
  if (values.length === 0) return 0
  const avg = values.reduce((s, v) => s + v, 0) / values.length
  return Math.round((avg / 5) * 20)
}

export function getContributionPoints(contributions) {
  if (!contributions || !Array.isArray(contributions)) return 0
  return contributions.reduce((s, c) => s + c.points, 0)
}

export function getOverallScore(commitmentRatings, contributions, characterRatings) {
  const contribPts = getContributionPoints(contributions)
  return getCommitmentScore(commitmentRatings) + getContributionScore(contribPts) + getCharacterScore(characterRatings)
}

export function getScoreGrade(score) {
  if (score >= 90) return { grade: 'A', label: 'Outstanding', color: 'emerge' }
  if (score >= 75) return { grade: 'B', label: 'Exceeds Expectations', color: 'ocean' }
  if (score >= 60) return { grade: 'C', label: 'Meets Expectations', color: 'caution' }
  if (score >= 40) return { grade: 'D', label: 'Needs Improvement', color: 'coral' }
  return { grade: 'F', label: 'Unsatisfactory', color: 'danger' }
}

export function getEvalStatusInfo(status) {
  switch (status) {
    case 'reviewed': return { label: 'Reviewed', cls: 'tag-success' }
    case 'submitted': return { label: 'Submitted', cls: 'tag-info' }
    case 'draft': return { label: 'Draft', cls: 'tag-caution' }
    default: return { label: 'Not Started', cls: 'bg-surface-gray text-txt-disabled' }
  }
}
