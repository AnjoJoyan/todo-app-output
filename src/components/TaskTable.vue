<template>
  <div>
    <div v-if="tasks.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">No tasks yet. Add one!</div>
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, idx) in tasks"
          :key="task.id"
          class="task-row"
          @click="$emit('view', task)"
        >
          <td class="td-num">{{ idx + 1 }}</td>
          <td class="td-title">{{ task.title }}</td>
          <td>
            <span class="badge" :class="badgeClass(task.status)">{{ task.status }}</span>
          </td>
          <td class="actions-cell" @click.stop>
            <button class="btn-icon btn-edit" @click="$emit('edit', task)" title="Edit">✏️</button>
            <button class="btn-icon btn-del"  @click="$emit('delete', task.id)" title="Delete">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useDate } from '../composables/useDate'

defineProps({ tasks: { type: Array, default: () => [] } })
defineEmits(['view', 'edit', 'delete'])

const { badgeClass } = useDate()
</script>

<style scoped>
.empty-state { text-align: center; padding: 3.5rem 1rem; color: var(--muted); }
.empty-icon  { font-size: 2.5rem; margin-bottom: 0.75rem; }
.empty-text  { font-size: 0.95rem; }

table { width: 100%; border-collapse: collapse; }

thead th {
  text-align: left; font-size: 0.8rem; font-weight: 600;
  color: var(--muted); padding: 0.5rem 0.75rem 0.875rem;
  border-bottom: 1px solid var(--border);
}

tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.12s;
  cursor: pointer;
}
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--primary-light); }

tbody td { padding: 0.9rem 0.75rem; font-size: 0.9rem; vertical-align: middle; }

.td-num   { color: var(--muted); font-weight: 500; width: 40px; }
.td-title { font-weight: 600; }

.badge { display: inline-flex; align-items: center; padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.775rem; font-weight: 700; }
.badge-completed { background: var(--green-bg);  color: var(--green);  border: 1px solid #bbf7d0; }
.badge-pending   { background: var(--orange-bg); color: var(--orange); border: 1px solid #fde68a; }
.badge-due       { background: var(--red-bg);    color: var(--red);    border: 1px solid #fecaca; }

.actions-cell { width: 90px; display: flex; gap: 0.4rem; align-items: center; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 0.3rem; border-radius: 6px; transition: background 0.15s; display: flex; align-items: center; }
.btn-edit       { color: var(--primary); }
.btn-edit:hover { background: var(--primary-light); }
.btn-del        { color: var(--red); }
.btn-del:hover  { background: var(--red-bg); }
</style>
