<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const isAppLayout = computed(() => route.meta.layout === 'app')
</script>

<template>
  <div v-if="isAppLayout" class="flex flex-col h-screen overflow-hidden bg-surface-bg">
    <AppHeader />
    <main class="flex-1 overflow-y-auto p-6 lg:p-8">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>

  <div v-else>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
