<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'

const route = useRoute()
const isAppLayout = computed(() => route.meta.layout === 'app')
</script>

<template>
  <div v-if="isAppLayout" class="flex h-screen overflow-hidden bg-sand-50">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AppTopbar />
      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>

  <div v-else>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
