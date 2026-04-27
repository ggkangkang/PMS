<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProjectById } from '../data/dummyData'

const router = useRouter()
const route = useRoute()

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const userRole = computed(() => currentUser.value.role || 'site-supervisor')
const projectName = computed(() => {
  const pid = currentUser.value.projectId
  if (pid) { const p = getProjectById(pid); return p ? p.name : '' }
  return ''
})

const roleLabel = computed(() => {
  const r = userRole.value
  if (r === 'project-director') return 'Project Director'
  if (r === 'project-manager') return 'Project Manager'
  return 'Staff'
})

const navItems = computed(() => {
  const role = userRole.value
  if (role === 'project-director') {
    return [
      { label: 'All Projects', path: '/projects', icon: 'projects' },
      { label: 'Rate PMs', path: '/rate-team', icon: 'rate' },
      { label: 'My Evaluation', path: '/evaluation', icon: 'evaluation' },
      { label: 'Changelog', path: '/changelog', icon: 'changelog' },
    ]
  }
  if (role === 'project-manager') {
    return [
      { label: 'Team Overview', path: '/dashboard', icon: 'dashboard' },
      { label: 'Rate Team', path: '/rate-team', icon: 'rate' },
      { label: 'My Evaluation', path: '/evaluation', icon: 'evaluation' },
      { label: 'Changelog', path: '/changelog', icon: 'changelog' },
    ]
  }
  // Staff
  return [
    { label: 'My Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Monthly Evaluation', path: '/evaluation', icon: 'evaluation' },
    { label: 'Changelog', path: '/changelog', icon: 'changelog' },
  ]
})

const showUserMenu = ref(false)

function isActive(path) { return route.path === path }
function navigate(path) { router.push(path) }
function logout() {
  localStorage.removeItem('currentUser')
  router.push('/login')
}
function toggleUserMenu() { showUserMenu.value = !showUserMenu.value }
function closeUserMenu() { showUserMenu.value = false }
</script>

<template>
  <header class="bg-white border-b border-line shrink-0">
    <!-- Row 1: Main Bar -->
    <div class="flex items-center justify-between px-5 py-2.5">
      <!-- Left: Brand -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">P</div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[15px] font-bold text-txt-heading whitespace-nowrap">PMS</span>
          <svg v-if="projectName" xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="#9ca3af"><circle cx="2" cy="2" r="2"/></svg>
          <span v-if="projectName" class="text-sm text-txt-subtitle truncate">{{ projectName }}</span>
        </div>
      </div>

      <!-- Center: Search -->
      <div class="flex-1 max-w-md mx-6">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>
          <input type="text" placeholder="Search" class="w-full pl-9 pr-4 py-2 bg-surface-gray rounded-lg text-sm text-txt-body placeholder-txt-muted border-0 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all" />
        </div>
      </div>

      <!-- Right: Icons + Avatar -->
      <div class="flex items-center gap-3">
        <!-- Role badge (subtle) -->
        <span class="text-xs text-txt-subtitle font-medium hidden sm:block">{{ roleLabel }}</span>

        <!-- Notification bell -->
        <button class="relative p-2 rounded-lg hover:bg-surface-gray transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="#6b7280"><path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/></svg>
        </button>

        <!-- User avatar dropdown -->
        <div class="relative">
          <button @click="toggleUserMenu" class="flex items-center gap-0 cursor-pointer">
            <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-xs']">{{ currentUser.initials || '?' }}</div>
          </button>

          <!-- Dropdown menu -->
          <transition name="page">
            <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-card border border-line shadow-lg z-50 py-1 animate-scale-in">
              <div class="px-4 py-3 border-b border-line">
                <p class="text-sm font-semibold text-txt-heading truncate">{{ currentUser.name || 'User' }}</p>
                <p class="text-xs text-txt-muted truncate">{{ currentUser.label || '' }} · {{ currentUser.id || '' }}</p>
              </div>
              <button @click="logout" class="w-full text-left px-4 py-2.5 text-sm text-txt-body hover:bg-surface-gray transition-colors flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"/></svg>
                Sign Out
              </button>
            </div>
          </transition>

          <!-- Click outside to close -->
          <div v-if="showUserMenu" class="fixed inset-0 z-40" @click="closeUserMenu"></div>
        </div>
      </div>
    </div>

    <!-- Row 2: Tab Navigation -->
    <nav class="flex items-center gap-0 px-5 -mb-px">
      <div
        v-for="item in navItems"
        :key="item.path"
        :class="['nav-tab', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        {{ item.label }}
      </div>
    </nav>
  </header>
</template>
