export const employees = [
  {
    id: 'ADM001',
    name: 'Aisha Rahman',
    initials: 'AR',
    role: 'Admin Executive',
    department: 'Administration',
    avatarColor: 'bg-ocean-400',
    coreCommitments: [
      { id: 'facility', label: 'Facility Maintenance', status: 'on-track', description: 'Ensure all building systems are functioning, coordinate repairs promptly' },
      { id: 'cleanliness', label: 'Office Cleanliness & Upkeep', status: 'on-track', description: 'Maintain pristine shared spaces and workstations daily' },
      { id: 'asset', label: 'Asset & Inventory Management', status: 'missed', description: 'Track and audit company assets, manage stock levels' },
    ],
    contributions: [
      { id: 1, type: 'New Sales Referral (Min RM 50mil)', points: 180, date: '2026-04-10' },
      { id: 2, type: 'ISO Coordination', points: 10, date: '2026-04-15' },
    ],
    carryForward: 45,
  },
  {
    id: 'ADM002',
    name: 'Daniel Tan',
    initials: 'DT',
    role: 'Facilities Coordinator',
    department: 'Administration',
    avatarColor: 'bg-coral-400',
    coreCommitments: [
      { id: 'facility', label: 'Facility Maintenance', status: 'on-track', description: 'Ensure all building systems are functioning, coordinate repairs promptly' },
      { id: 'cleanliness', label: 'Office Cleanliness & Upkeep', status: 'on-track', description: 'Maintain pristine shared spaces and workstations daily' },
      { id: 'asset', label: 'Asset & Inventory Management', status: 'on-track', description: 'Track and audit company assets, manage stock levels' },
    ],
    contributions: [
      { id: 1, type: 'Support Property Sales', points: 60, date: '2026-04-05' },
      { id: 2, type: 'Host Trainings', points: 5, date: '2026-04-12' },
      { id: 3, type: 'New Sales Referral (Min RM 50mil)', points: 180, date: '2026-04-18' },
    ],
    carryForward: 80,
  },
  {
    id: 'ADM003',
    name: 'Priya Menon',
    initials: 'PM',
    role: 'Admin Assistant',
    department: 'Administration',
    avatarColor: 'bg-caution-400',
    coreCommitments: [
      { id: 'facility', label: 'Facility Maintenance', status: 'on-track', description: 'Ensure all building systems are functioning, coordinate repairs promptly' },
      { id: 'cleanliness', label: 'Office Cleanliness & Upkeep', status: 'missed', description: 'Maintain pristine shared spaces and workstations daily' },
      { id: 'asset', label: 'Asset & Inventory Management', status: 'on-track', description: 'Track and audit company assets, manage stock levels' },
    ],
    contributions: [
      { id: 1, type: 'ISO Coordination', points: 10, date: '2026-04-08' },
      { id: 2, type: 'Host Trainings', points: 5, date: '2026-04-14' },
    ],
    carryForward: 20,
  },
  {
    id: 'ADM004',
    name: 'Marcus Lee',
    initials: 'ML',
    role: 'Procurement Officer',
    department: 'Administration',
    avatarColor: 'bg-emerge-400',
    coreCommitments: [
      { id: 'facility', label: 'Facility Maintenance', status: 'missed', description: 'Ensure all building systems are functioning, coordinate repairs promptly' },
      { id: 'cleanliness', label: 'Office Cleanliness & Upkeep', status: 'on-track', description: 'Maintain pristine shared spaces and workstations daily' },
      { id: 'asset', label: 'Asset & Inventory Management', status: 'missed', description: 'Track and audit company assets, manage stock levels' },
    ],
    contributions: [
      { id: 1, type: 'Support Property Sales', points: 60, date: '2026-04-03' },
    ],
    carryForward: 10,
  },
  {
    id: 'ADM005',
    name: 'Sarah Wong',
    initials: 'SW',
    role: 'Office Manager',
    department: 'Administration',
    avatarColor: 'bg-ocean-300',
    coreCommitments: [
      { id: 'facility', label: 'Facility Maintenance', status: 'on-track', description: 'Ensure all building systems are functioning, coordinate repairs promptly' },
      { id: 'cleanliness', label: 'Office Cleanliness & Upkeep', status: 'on-track', description: 'Maintain pristine shared spaces and workstations daily' },
      { id: 'asset', label: 'Asset & Inventory Management', status: 'on-track', description: 'Track and audit company assets, manage stock levels' },
    ],
    contributions: [
      { id: 1, type: 'New Sales Referral (Min RM 50mil)', points: 180, date: '2026-04-02' },
      { id: 2, type: 'Support Property Sales', points: 60, date: '2026-04-09' },
      { id: 3, type: 'ISO Coordination', points: 10, date: '2026-04-16' },
      { id: 4, type: 'Host Trainings', points: 5, date: '2026-04-20' },
    ],
    carryForward: 120,
  },
]

export const contributionOptions = [
  { label: 'New Sales Referral (Min RM 50mil)', points: 180 },
  { label: 'Support Property Sales', points: 60 },
  { label: 'ISO Coordination', points: 10 },
  { label: 'Host Trainings', points: 5 },
]

export const hodUser = {
  id: 'HOD001',
  name: 'Encik Ahmad Razak',
  initials: 'EA',
  role: 'Head of Department',
  department: 'Administration',
  avatarColor: 'bg-ocean-600',
}

// ─── Annual Evaluation Form Data ──────────────────────────────────────

// 50% — Commitments: 5 core KPIs (10% each)
export const evaluationCommitments = [
  {
    id: 'kpi1',
    label: 'Facility Maintenance & Building Systems',
    description: 'Ensure all building systems (electrical, plumbing, HVAC, fire safety) are fully operational. Coordinate preventive maintenance schedules and respond to repair requests within SLA.',
    weight: 10,
  },
  {
    id: 'kpi2',
    label: 'Office Cleanliness & Upkeep',
    description: 'Maintain high standards of cleanliness and hygiene across all shared spaces, workstations, meeting rooms, and pantry areas. Oversee cleaning vendor performance.',
    weight: 10,
  },
  {
    id: 'kpi3',
    label: 'Asset & Inventory Management',
    description: 'Maintain an accurate asset register, conduct quarterly audits, manage stock levels of office supplies, and ensure proper tagging and disposal procedures.',
    weight: 10,
  },
  {
    id: 'kpi4',
    label: 'Vendor & Contract Management',
    description: 'Manage relationships with service providers, negotiate contracts, ensure timely renewals, track vendor performance, and process payments within agreed timelines.',
    weight: 10,
  },
  {
    id: 'kpi5',
    label: 'Documentation & Compliance',
    description: 'Maintain proper filing systems (physical and digital), ensure ISO documentation is up to date, and support internal/external audit preparation.',
    weight: 10,
  },
]

// Rating scale for commitments (1–5)
export const commitmentRatingScale = [
  { value: 1, label: 'Unsatisfactory', description: 'Consistently fails to meet expectations', color: 'danger' },
  { value: 2, label: 'Needs Improvement', description: 'Meets some but not all expectations', color: 'coral' },
  { value: 3, label: 'Meets Expectations', description: 'Consistently meets job requirements', color: 'caution' },
  { value: 4, label: 'Exceeds Expectations', description: 'Frequently surpasses requirements', color: 'ocean' },
  { value: 5, label: 'Outstanding', description: 'Exceptional performance well beyond expectations', color: 'emerge' },
]

// 20% — Character: Behavioral traits
export const characterTraits = [
  {
    id: 'teamwork',
    label: 'Teamwork & Collaboration',
    description: 'Works effectively with colleagues, shares knowledge, supports team goals, and contributes to a positive work environment.',
  },
  {
    id: 'communication',
    label: 'Communication Skills',
    description: 'Communicates clearly and professionally in both written and verbal forms. Actively listens and provides constructive feedback.',
  },
  {
    id: 'initiative',
    label: 'Initiative & Proactiveness',
    description: 'Takes ownership of tasks, anticipates problems before they arise, and proposes solutions without being prompted.',
  },
  {
    id: 'integrity',
    label: 'Integrity & Ethics',
    description: 'Demonstrates honesty, accountability, and adherence to company policies. Handles confidential information with discretion.',
  },
  {
    id: 'adaptability',
    label: 'Adaptability & Continuous Learning',
    description: 'Embraces change, learns new skills willingly, and adjusts effectively to evolving work demands and technologies.',
  },
]

// Character rating scale (1–5)
export const characterRatingScale = [
  { value: 1, label: 'Rarely Demonstrated', color: 'danger' },
  { value: 2, label: 'Sometimes Demonstrated', color: 'coral' },
  { value: 3, label: 'Often Demonstrated', color: 'caution' },
  { value: 4, label: 'Consistently Demonstrated', color: 'ocean' },
  { value: 5, label: 'Exemplary', color: 'emerge' },
]

// 30% — Contributions: baseline target and scoring tiers
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

// Pre-filled evaluation data per employee (for demo)
export const employeeEvaluations = {
  ADM001: {
    period: 'April 2025 – March 2026',
    status: 'draft',
    commitmentRatings: { kpi1: 4, kpi2: 4, kpi3: 2, kpi4: 3, kpi5: 3 },
    characterRatings: { teamwork: 4, communication: 3, initiative: 4, integrity: 5, adaptability: 3 },
    selfComments: {
      commitments: 'I have maintained building systems proactively this year and improved response times for repairs. Asset management remains an area I want to strengthen.',
      contributions: 'Successfully referred a major sales deal and coordinated ISO audits across two quarters.',
      character: 'I believe I have been a strong team player and always acted with integrity.',
    },
    hodComments: '',
  },
  ADM002: {
    period: 'April 2025 – March 2026',
    status: 'submitted',
    commitmentRatings: { kpi1: 5, kpi2: 4, kpi3: 4, kpi4: 4, kpi5: 3 },
    characterRatings: { teamwork: 5, communication: 4, initiative: 4, integrity: 4, adaptability: 4 },
    selfComments: {
      commitments: 'Took ownership of the preventive maintenance schedule. Reduced emergency repairs by 30% this year.',
      contributions: 'Assisted property sales team and conducted two training workshops for new hires.',
      character: 'I always prioritize collaboration and aim to lift the entire team.',
    },
    hodComments: 'Daniel has been outstanding in facilities coordination. Highly recommend for advancement.',
  },
  ADM003: {
    period: 'April 2025 – March 2026',
    status: 'draft',
    commitmentRatings: { kpi1: 3, kpi2: 2, kpi3: 3, kpi4: 3, kpi5: 4 },
    characterRatings: { teamwork: 3, communication: 3, initiative: 2, integrity: 4, adaptability: 3 },
    selfComments: {
      commitments: 'Documentation has been my strong suit this year. I need to focus more on cleanliness standards.',
      contributions: 'Helped with ISO coordination and hosted one training session.',
      character: 'I am working on being more proactive and taking more initiative.',
    },
    hodComments: '',
  },
  ADM004: {
    period: 'April 2025 – March 2026',
    status: 'not-started',
    commitmentRatings: { kpi1: 0, kpi2: 0, kpi3: 0, kpi4: 0, kpi5: 0 },
    characterRatings: { teamwork: 0, communication: 0, initiative: 0, integrity: 0, adaptability: 0 },
    selfComments: { commitments: '', contributions: '', character: '' },
    hodComments: '',
  },
  ADM005: {
    period: 'April 2025 – March 2026',
    status: 'submitted',
    commitmentRatings: { kpi1: 5, kpi2: 5, kpi3: 5, kpi4: 4, kpi5: 4 },
    characterRatings: { teamwork: 5, communication: 5, initiative: 5, integrity: 5, adaptability: 4 },
    selfComments: {
      commitments: 'As Office Manager, I ensured all KPIs were met or exceeded. Led the digitization of our asset register.',
      contributions: 'Top contributor with referrals, property sales support, ISO coordination, and hosted training for the department.',
      character: 'I strive to lead by example and maintain the highest standards of professionalism.',
    },
    hodComments: 'Sarah is an exceptional employee. Consistently goes above and beyond in all areas.',
  },
}

// ─── Helper Functions ──────────────────────────────────────────────────

export function getEmployeeById(id) {
  return employees.find(e => e.id === id)
}

export function getTotalPoints(employee) {
  const contributionPts = employee.contributions.reduce((sum, c) => sum + c.points, 0)
  return contributionPts + employee.carryForward
}

export function getCoreCompletionPercent(employee) {
  const total = employee.coreCommitments.length
  const onTrack = employee.coreCommitments.filter(c => c.status === 'on-track').length
  return Math.round((onTrack / total) * 100)
}

export function getContributionPoints(employee) {
  return employee.contributions.reduce((sum, c) => sum + c.points, 0)
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Evaluation score calculators
export function getCommitmentScore(ratings) {
  const values = Object.values(ratings).filter(v => v > 0)
  if (values.length === 0) return 0
  const avg = values.reduce((s, v) => s + v, 0) / values.length
  return Math.round((avg / 5) * 50) // out of 50%
}

export function getContributionScore(totalPoints) {
  const tier = contributionBaseline.tiers.find(t => totalPoints >= t.min && totalPoints <= t.max)
  if (!tier) return 0
  return Math.round((tier.score / 5) * 30) // out of 30%
}

export function getCharacterScore(ratings) {
  const values = Object.values(ratings).filter(v => v > 0)
  if (values.length === 0) return 0
  const avg = values.reduce((s, v) => s + v, 0) / values.length
  return Math.round((avg / 5) * 20) // out of 20%
}

export function getOverallEvaluationScore(commitmentRatings, totalContributionPoints, characterRatings) {
  return getCommitmentScore(commitmentRatings) + getContributionScore(totalContributionPoints) + getCharacterScore(characterRatings)
}

export function getScoreGrade(score) {
  if (score >= 90) return { grade: 'A', label: 'Outstanding', color: 'emerge' }
  if (score >= 75) return { grade: 'B', label: 'Exceeds Expectations', color: 'ocean' }
  if (score >= 60) return { grade: 'C', label: 'Meets Expectations', color: 'caution' }
  if (score >= 40) return { grade: 'D', label: 'Needs Improvement', color: 'coral' }
  return { grade: 'F', label: 'Unsatisfactory', color: 'danger' }
}
