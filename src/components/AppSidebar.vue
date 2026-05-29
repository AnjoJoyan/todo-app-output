<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">✓</div>
      <span class="logo-text">Todo App</span>
    </div>

    <nav class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="active"
        exact-active-class="active"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="nav-spacer"></div>

    <button class="nav-item logout" @click="handleLogout">
      <span class="nav-icon">→</span>
      <span>Signout</span>
    </button>
  </aside>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

const navItems = [
  { to: '/',         icon: '⊞', label: 'Dashboard' },
  { to: '/tasks',    icon: '≡', label: 'Tasks'     },
  { to: '/calendar', icon: '📅', label: 'Calendar'  },
]

function handleLogout() {
  showToast('Logged out (demo only).')
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: var(--white);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 50;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.25rem 0.75rem 1.75rem;
}

.logo-icon {
  width: 32px; height: 32px;
  background: var(--primary);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1rem;
}

.logo-text {
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  font-size: 0.925rem;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.1rem;
  width: 22px;
  text-align: center;
}

.nav-spacer { flex: 1; }

.logout {
  color: var(--muted);
  cursor: pointer;
}
</style>
