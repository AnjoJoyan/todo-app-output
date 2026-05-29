<template>
  <div class="stat-card" :class="colorClass">
    <div class="stat-icon-wrap">{{ icon }}</div>
    <div>
      <div class="stat-num">{{ value }}</div>
      <div class="stat-lbl">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon:       { type: String, required: true },
  value:      { type: Number, required: true },
  label:      { type: String, required: true },
  colorClass: { type: String, default: 's-purple' },
})
</script>

<style scoped>
.stat-card {
  background: var(--white);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat-lbl {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 0.2rem;
}

/* Color variants */
.s-purple .stat-icon-wrap { background: #ede9fe; color: var(--primary); }
.s-purple .stat-num       { color: var(--primary); }

.s-green .stat-icon-wrap  { background: var(--green-bg); color: var(--green); }
.s-green .stat-num        { color: var(--green); }

.s-orange .stat-icon-wrap { background: var(--orange-bg); color: var(--orange); }
.s-orange .stat-num       { color: var(--orange); }

.s-red .stat-icon-wrap    { background: var(--red-bg); color: var(--red); }
.s-red .stat-num          { color: var(--red); }
</style>
