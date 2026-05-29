<template>
  <div>
    <div v-if="loading" class="state-banner state-loading">⏳ Loading tasks…</div>
    <div v-if="error"   class="state-banner state-error">⚠️ {{ error }}</div>

    <div class="card">
      <div class="table-header">
        <div class="table-title">All Tasks</div>
        <div class="table-header-right">
          <span class="table-total">Total: {{ allTasks.length }}</span>
          <button class="btn-add" @click="showAdd = true">+ Add Task</button>
        </div>
      </div>

      <TaskTable
        :tasks="allTasks"
        @view="openView"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <AddTaskModal  v-model="showAdd" :default-date="todayStr()" @save="handleAdd" />
    <ViewTaskModal
      :task="viewingTask"
      :start-edit="editMode"
      @close="viewingTask = null; editMode = false"
      @toggle-status="handleToggle"
      @update-task="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TaskTable     from '../components/TaskTable.vue'
import AddTaskModal  from '../components/AddTaskModal.vue'
import ViewTaskModal from '../components/ViewTaskModal.vue'
import { useTasks, todayStr } from '../composables/useTasks'
import { useToast }           from '../composables/useToast'

const { allTasks, loading, error, fetchTasks, addTask, deleteTask, toggleStatus, updateTask } = useTasks()
const { showToast } = useToast()

const showAdd     = ref(false)
const viewingTask = ref(null)
const editMode    = ref(false)

onMounted(() => fetchTasks())

async function handleAdd(task)       { await addTask(task);    showToast('Task added!') }
async function handleDelete(id)      { await deleteTask(id);   showToast('Task deleted.') }
function openView(task)              { editMode.value = false; viewingTask.value = { ...task } }
function openEdit(task)              { editMode.value = true;  viewingTask.value = { ...task } }
async function handleToggle(id)      { await toggleStatus(id); viewingTask.value = null; editMode.value = false; showToast('Status updated.') }
async function handleUpdate(updated) {
  await updateTask(updated)
  viewingTask.value = null
  editMode.value = false
  showToast('Task updated!')
}
</script>

<style scoped>
.state-banner {
  border-radius: 8px; padding: 0.75rem 1rem;
  font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;
}
.state-loading { background: var(--primary-light); color: var(--primary); }
.state-error   { background: var(--red-bg); color: var(--red); border: 1px solid #fecaca; }

.card {
  background: var(--white); border-radius: var(--radius);
  border: 1px solid var(--border); box-shadow: var(--shadow); padding: 1.5rem;
}
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.table-title  { font-size: 1rem; font-weight: 700; }
.table-header-right { display: flex; align-items: center; gap: 1rem; }
.table-total  { font-size: 0.875rem; font-weight: 600; color: var(--muted); }
.btn-add {
  font-weight: 700; font-size: 0.8rem; padding: 0.5rem 1.1rem;
  background: var(--primary); color: white; border: none; border-radius: 7px;
  transition: opacity 0.2s; cursor: pointer;
}
.btn-add:hover { opacity: 0.85; }
</style>
