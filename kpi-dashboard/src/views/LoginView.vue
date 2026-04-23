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
  if (!staffId.value.trim()) {
    error.value = 'Please enter your Staff ID'
    return
  }

  isLoading.value = true

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

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
    } else {
      error.value = 'Staff ID not found. Try ADM001–ADM005 or HOD001'
    }
  }

  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-sand-50 relative overflow-hidden px-4">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-ocean-100/40 rounded-full blur-3xl animate-float"></div>
      <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-coral-100/30 rounded-full blur-3xl animate-float" style="animation-delay: 3s;"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ocean-50/50 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 w-full max-w-md animate-fade-in">
      <!-- Logo / Brand -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-ocean-500 text-white rounded-2xl shadow-glow-ocean mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,128a96,96,0,1,1-96-96A96.11,96.11,0,0,1,224,128Zm-96-56a8,8,0,0,0-8,8v48a8,8,0,0,0,3.2,6.4l32,24a8,8,0,0,0,9.6-12.8L136,122V80A8,8,0,0,0,128,72Z"/>
          </svg>
        </div>
        <h1 class="font-display text-3xl text-sand-900 mb-2">GrowthPulse</h1>
        <p class="text-sand-500 text-sm">KPI Evaluation & L&D Dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="card p-8">
        <div class="mb-6">
          <h2 class="font-body text-xl font-semibold text-sand-900 mb-1">Welcome back</h2>
          <p class="text-sand-500 text-sm">Sign in with your Staff ID to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="staffId" class="block text-sm font-medium text-sand-700 mb-2">Staff ID</label>
            <input
              id="staffId"
              v-model="staffId"
              type="text"
              placeholder="e.g. ADM001"
              class="input-field"
              :class="{ 'border-danger-400 focus:ring-danger-200': error }"
              autocomplete="off"
            />
            <transition name="page">
              <p v-if="error" class="mt-2 text-sm text-danger-500 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"/>
                </svg>
                {{ error }}
              </p>
            </transition>
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-3 text-base"
            :disabled="isLoading"
            :class="{ 'opacity-70 cursor-wait': isLoading }"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span v-if="!isLoading">Sign In</span>
            <span v-else>Signing in…</span>
          </button>
        </form>

        <!-- Demo Hint -->
        <div class="mt-6 p-3 bg-ocean-50/60 rounded-xl border border-ocean-100">
          <p class="text-xs text-ocean-700 font-medium mb-1">🎯 Demo Credentials</p>
          <p class="text-xs text-ocean-600">
            Employee: <code class="bg-ocean-100 px-1.5 py-0.5 rounded font-mono text-ocean-800">ADM001</code> – <code class="bg-ocean-100 px-1.5 py-0.5 rounded font-mono text-ocean-800">ADM005</code>
          </p>
          <p class="text-xs text-ocean-600 mt-1">
            Manager: <code class="bg-ocean-100 px-1.5 py-0.5 rounded font-mono text-ocean-800">HOD001</code>
          </p>
        </div>
      </div>

      <p class="text-center text-xs text-sand-400 mt-6">Admin Department · Transparent Talent Growth</p>
    </div>
  </div>
</template>
