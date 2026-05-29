<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main area -->
    <div class="main">
      <AppTopbar :title="pageTitle" />
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <!-- Global Toast -->
    <Transition name="toast">
      <div class="toast" v-if="toastMsg">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar  from './components/AppTopbar.vue'
import { useToast } from './composables/useToast'

const route  = useRoute()
const { toastMsg } = useToast()

const pageTitle = computed(() => route.name || 'Dashboard')
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main {
  margin-left: var(--sidebar-w);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 2rem;
  flex: 1;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #1e1e2e;
  color: white;
  padding: 0.85rem 1.4rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 999;
  box-shadow: var(--shadow-md);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

.toast-enter-active,
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from,
.toast-leave-to     { opacity: 0; transform: translateY(10px); }
</style>
