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
