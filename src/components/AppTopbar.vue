<template>
  <header class="topbar">
    <h1 class="topbar-title">{{ title }}</h1>
    <div class="user-badge">
      <div class="avatar">👤</div>
      <span class="user-name">John Doe</span>
      <span class="chevron">▾</span>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Dashboard' }
})
</script>

<style scoped>
.topbar {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; top: 0; z-index: 40;
}

.topbar-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 99px;
  transition: background 0.15s;
}

.user-badge:hover { background: var(--bg); }

.avatar {
  width: 36px; height: 36px;
  background: var(--bg);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  color: var(--muted);
}

.user-name { font-weight: 600; font-size: 0.9rem; }
.chevron   { font-size: 0.75rem; color: var(--muted); }
</style>
