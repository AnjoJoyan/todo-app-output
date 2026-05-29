<template>
  <div>

    <!-- Loading / Error -->
    <div v-if="loading" class="state-banner state-loading">⏳ Loading tasks…</div>
    <div v-if="error"   class="state-banner state-error">⚠️ {{ error }}</div>

    <!-- Overall Status Count -->
    <div class="section-label">Overall Task Status</div>
    <div class="stats-grid">
      <StatCard icon="📋" :value="allStats.total"     label="Total Tasks" color-class="s-purple" />
      <StatCard icon="✅" :value="allStats.completed" label="Completed"   color-class="s-green"  />
      <StatCard icon="🕐" :value="allStats.pending"   label="Pending"     color-class="s-orange" />
      <StatCard icon="❗" :value="allStats.due"        label="Due Today"   color-class="s-red"    />
    </div>

    <!-- Date Picker Card -->
    <div class="card">
      <div class="date-label">Select Date</div>
      <div class="date-row">
        <input type="date" class="date-input" v-model="selectedDate" />
        <button class="btn-today" @click="setToday">Today</button>
      </div>
    </div>

    <!-- Date Stats -->
    <div class="stats-grid">
      <StatCard icon="📋" :value="dateStats.total"     label="Total for Date" color-class="s-purple" />
      <StatCard icon="✅" :value="dateStats.completed" label="Completed"      color-class="s-green"  />
      <StatCard icon="🕐" :value="dateStats.pending"   label="Pending"        color-class="s-orange" />
      <StatCard icon="❗" :value="dateStats.due"        label="Due Today"      color-class="s-red"    />
    </div>

    <!-- Tasks Card -->
    <div class="card">
      <div class="table-header">
        <div class="table-title">Tasks for {{ formatDisplayDate(selectedDate) }}</div>
        <div class="table-header-right">
          <span class="table-total">Total: {{ filteredTasks.length }}</span>
          <button class="btn-add" @click="showAdd = true">+ Add Task</button>
        </div>
      </div>

      <TaskTable
        :tasks="filteredTasks"
        @view="openView"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Modals -->
    <AddTaskModal
      v-model="showAdd"
      :default-date="selectedDate"
      @save="handleAdd"
    />

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
import { ref, computed, onMounted } from 'vue'
import StatCard      from '../components/StatCard.vue'
import TaskTable     from '../components/TaskTable.vue'
import AddTaskModal  from '../components/AddTaskModal.vue'
import ViewTaskModal from '../components/ViewTaskModal.vue'
import { useTasks, todayStr } from '../composables/useTasks'
import { useDate }            from '../composables/useDate'
import { useToast }           from '../composables/useToast'

const { allTasks, loading, error, fetchTasks, getTasksByDate, addTask, deleteTask, toggleStatus, updateTask } = useTasks()
const { formatDisplayDate } = useDate()
const { showToast } = useToast()

const selectedDate = ref(todayStr())
const showAdd      = ref(false)
const viewingTask  = ref(null)
const editMode     = ref(false)

onMounted(() => fetchTasks())

const allStats = computed(() => ({
  total:     allTasks.value.length,
  completed: allTasks.value.filter(t => t.status === 'Completed').length,
  pending:   allTasks.value.filter(t => t.status === 'Pending').length,
  due:       allTasks.value.filter(t => t.status === 'Due Today').length,
}))

const filteredTasks = computed(() => getTasksByDate(selectedDate.value).value)

const dateStats = computed(() => ({
  total:     filteredTasks.value.length,
  completed: filteredTasks.value.filter(t => t.status === 'Completed').length,
  pending:   filteredTasks.value.filter(t => t.status === 'Pending').length,
  due:       filteredTasks.value.filter(t => t.status === 'Due Today').length,
}))

function setToday() { selectedDate.value = todayStr() }

async function handleAdd(task)       { await addTask(task);    showToast('Task added successfully!') }
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
.section-label {
  font-size: 0.8rem; font-weight: 700; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.75rem;
}
.state-banner {
  border-radius: 8px; padding: 0.75rem 1rem;
  font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;
}
.state-loading { background: var(--primary-light); color: var(--primary); }
.state-error   { background: var(--red-bg); color: var(--red); border: 1px solid #fecaca; }

.card {
  background: var(--white); border-radius: var(--radius);
  border: 1px solid var(--border); box-shadow: var(--shadow);
  padding: 1.5rem; margin-bottom: 1.5rem;
}
.date-label { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; }
.date-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.date-input {
  font-size: 0.9rem; font-weight: 500; padding: 0.6rem 1rem;
  border: 1.5px solid var(--border); border-radius: 8px;
  background: var(--white); color: var(--text);
  outline: none; min-width: 200px; cursor: pointer; transition: border-color 0.2s;
}
.date-input:focus { border-color: var(--primary); }
.btn-today {
  font-weight: 700; font-size: 0.875rem; padding: 0.6rem 1.4rem;
  background: var(--primary); color: white; border: none; border-radius: 8px;
  transition: opacity 0.2s, transform 0.15s; cursor: pointer;
}
.btn-today:hover { opacity: 0.88; transform: translateY(-1px); }
.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1rem; margin-bottom: 1.5rem;
}
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.table-title  { font-size: 1rem; font-weight: 700; }
.table-header-right { display: flex; align-items: center; gap: 1rem; }
.table-total  { font-size: 0.875rem; font-weight: 600; color: var(--muted); }
.btn-add {
  font-weight: 700; font-size: 0.8rem; padding: 0.5rem 1.1rem;
  background: var(--primary); color: white; border: none; border-radius: 7px;
  display: flex; align-items: center; gap: 0.4rem; transition: opacity 0.2s; cursor: pointer;
}
.btn-add:hover { opacity: 0.85; }
</style>
