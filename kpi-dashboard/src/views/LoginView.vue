<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { employees, hodUser } from '../data/dummyData'

const router = useRouter()
const staffId = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  if (!staffId.value.trim()) { error.value = 'Please enter your Staff ID'; return }
  isLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  const id = staffId.value.trim().toUpperCase()
  if (id === hodUser.id) {
    localStorage.setItem('currentUser', JSON.stringify(hodUser))
    localStorage.setItem('userRole', 'hod')
    router.push('/hod')
  } else {
    const emp = employees.find(e => e.id === id)
    if (emp) {
      localStorage.setItem('currentUser', JSON.stringify(emp))
      localStorage.setItem('userRole', 'employee')
      router.push('/employee')
    } else { error.value = 'Staff ID not found. Try ADM001–ADM005 or HOD001' }
  }
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-bg px-4">
    <div class="w-full max-w-sm animate-fade-in">
      <!-- Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-brand-primary text-white rounded-xl mb-4 text-xl font-bold">P</div>
        <h1 class="text-xl font-bold text-txt-heading">GrowthPulse</h1>
        <p class="text-xs text-txt-subtitle mt-1">KPI Evaluation & L&D Dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="card p-6">
        <h2 class="text-base font-bold text-txt-heading mb-1">Sign In</h2>
        <p class="text-xs text-txt-subtitle mb-5">Enter your Staff ID to continue</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="staffId" class="block text-sm font-medium text-txt-body mb-1.5">Staff ID</label>
            <input id="staffId" v-model="staffId" type="text" placeholder="e.g. ADM001" class="input-field" :class="{ 'border-red-400 focus:ring-red-200': error }" autocomplete="off" />
            <p v-if="error" class="mt-1.5 text-xs text-txt-error flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"/></svg>
              {{ error }}
            </p>
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="isLoading" :class="{ 'opacity-60': isLoading }">
            <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            {{ isLoading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-5 p-3 bg-surface-info rounded-container border border-blue-200/50">
          <p class="text-[11px] font-semibold text-txt-info mb-1">Demo Credentials</p>
          <p class="text-[11px] text-txt-info">Employee: <code class="font-mono bg-white/60 px-1 rounded">ADM001</code> – <code class="font-mono bg-white/60 px-1 rounded">ADM005</code></p>
          <p class="text-[11px] text-txt-info mt-0.5">Manager: <code class="font-mono bg-white/60 px-1 rounded">HOD001</code></p>
        </div>
      </div>
    </div>
  </div>
</template>
