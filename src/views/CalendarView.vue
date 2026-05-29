<template>
  <div class="calendar-page">

    <!-- Calendar Card (compact) -->
    <div class="cal-card">
      <!-- Month Navigation -->
      <div class="cal-header">
        <button class="nav-btn" @click="prevMonth">&#8592;</button>
        <div class="month-info">
          <h2 class="month-title">{{ monthNames[currentMonth] }}</h2>
          <span class="year-label">{{ currentYear }}</span>
        </div>
        <button class="nav-btn" @click="nextMonth">&#8594;</button>
      </div>

      <!-- Day Labels -->
      <div class="day-labels">
        <span v-for="d in dayNames" :key="d">{{ d }}</span>
      </div>

      <!-- Calendar Grid -->
      <div class="cal-grid">
        <div v-for="n in firstDayOfMonth" :key="'e'+n" class="cal-cell empty"></div>

        <div
          v-for="day in daysInMonth"
          :key="day"
          class="cal-cell"
          :class="{
            today:     isToday(day),
            selected:  isSelected(day),
            'has-tasks': hasTasks(day),
          }"
          @click="selectDay(day)"
        >
          <span class="day-num">{{ day }}</span>
          <div class="dots" v-if="hasTasks(day)">
            <span class="dot dot-green"  v-if="countFor(day).completed > 0"></span>
            <span class="dot dot-orange" v-if="countFor(day).pending   > 0"></span>
            <span class="dot dot-red"    v-if="countFor(day).due       > 0"></span>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <span class="legend-item"><span class="dot dot-green"></span> Completed</span>
        <span class="legend-item"><span class="dot dot-orange"></span> Pending</span>
        <span class="legend-item"><span class="dot dot-red"></span> Due</span>
      </div>
    </div>

    <!-- Tasks Panel -->
    <div class="tasks-panel" v-if="selectedDate">
      <div class="panel-header">
        <div class="panel-date-block">
          <div class="panel-day-num">{{ selectedDate.split('-')[2] }}</div>
          <div>
            <div class="panel-date">{{ formattedSelectedDate }}</div>
            <div class="panel-sub">{{ selectedTasks.length }} task{{ selectedTasks.length !== 1 ? 's' : '' }} scheduled</div>
          </div>
        </div>
        <div class="progress-counts">
          <div class="prog-badge prog-green">
            <span class="prog-icon">✅</span>
            <div class="prog-text">
              <span class="prog-num">{{ selectedCounts.completed }}</span>
              <span class="prog-lbl">Done</span>
            </div>
          </div>
          <div class="prog-badge prog-orange">
            <span class="prog-icon">🕐</span>
            <div class="prog-text">
              <span class="prog-num">{{ selectedCounts.pending }}</span>
              <span class="prog-lbl">Pending</span>
            </div>
          </div>
          <div class="prog-badge prog-red">
            <span class="prog-icon">❗</span>
            <div class="prog-text">
              <span class="prog-num">{{ selectedCounts.due }}</span>
              <span class="prog-lbl">Due</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" v-if="selectedTasks.length === 0">
        <div class="empty-icon">📭</div>
        <div class="empty-text">No tasks scheduled for this date.</div>
      </div>

      <div class="task-list" v-else>
        <div class="task-row" v-for="task in selectedTasks" :key="task.id">
          <div class="task-left">
            <div class="task-dot" :class="'tdot-' + task.status.toLowerCase().replace(' ', '-')"></div>
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
            </div>
          </div>
          <span class="badge" :class="badgeClass(task.status)">{{ task.status }}</span>
        </div>
      </div>
    </div>

    <!-- Placeholder when nothing selected -->
    <div class="no-selection" v-else>
      <div class="no-sel-icon">📅</div>
      <p>Select a date to view its tasks</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasks }  from '../composables/useTasks'
import { useDate }   from '../composables/useDate'

const { allTasks, fetchTasks } = useTasks()
onMounted(() => fetchTasks())
const { badgeClass } = useDate()

const now          = new Date()
const currentYear  = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())
const selectedDate = ref(now.toISOString().split('T')[0])

const dayNames   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthNames = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December']

const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
)
const firstDayOfMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).getDay()
)

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

function dateStr(day) {
  const m = String(currentMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${currentYear.value}-${m}-${d}`
}
function isToday(day) {
  return dateStr(day) === new Date().toISOString().split('T')[0]
}
function isSelected(day) {
  return selectedDate.value === dateStr(day)
}
function hasTasks(day) {
  return allTasks.value.some(t => t.dueDate === dateStr(day))
}
function countFor(day) {
  const list = allTasks.value.filter(t => t.dueDate === dateStr(day))
  return {
    completed: list.filter(t => t.status === 'Completed').length,
    pending:   list.filter(t => t.status === 'Pending').length,
    due:       list.filter(t => t.status === 'Due Today').length,
  }
}
function selectDay(day) {
  selectedDate.value = dateStr(day)
}

const selectedTasks = computed(() =>
  selectedDate.value ? allTasks.value.filter(t => t.dueDate === selectedDate.value) : []
)
const selectedCounts = computed(() => ({
  completed: selectedTasks.value.filter(t => t.status === 'Completed').length,
  pending:   selectedTasks.value.filter(t => t.status === 'Pending').length,
  due:       selectedTasks.value.filter(t => t.status === 'Due Today').length,
}))
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-')
  return `${monthNames[parseInt(m) - 1]} ${y}`
})
function formatTime(t) {
  if (!t) return 'No time set'
  const [hh, mm] = t.split(':')
  const h = parseInt(hh)
  return `${h % 12 || 12}:${mm} ${h >= 12 ? 'PM' : 'AM'}`
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────── */
.calendar-page {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.25rem;
  align-items: start;
}

/* ── Calendar Card ──────────────────────────────────────────── */
.cal-card {
  background: var(--white);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 24px rgba(79, 70, 229, 0.08), var(--shadow);
  padding: 1rem;
  overflow: hidden;
}

/* Header */
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border);
}
.month-info {
  text-align: center;
}
.month-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
  line-height: 1;
}
.year-label {
  font-size: 0.72rem;
  color: var(--muted);
  font-weight: 500;
}
.nav-btn {
  width: 28px; height: 28px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.nav-btn:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

/* Day Labels */
.day-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.375rem;
}
.day-labels span {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0;
}

/* Grid */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.cal-cell {
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
}
.cal-cell.empty { pointer-events: none; }
.cal-cell:not(.empty):hover {
  background: var(--primary-light);
  transform: scale(1.08);
  z-index: 1;
}

/* Today highlight */
.cal-cell.today .day-num {
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.45);
}

/* Selected */
.cal-cell.selected {
  background: var(--primary-light);
  box-shadow: 0 0 0 2px var(--primary);
}
.cal-cell.selected .day-num {
  color: var(--primary);
  font-weight: 800;
}

/* Has tasks glow */
.cal-cell.has-tasks {
  background: rgba(79, 70, 229, 0.04);
}

.day-num {
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1;
}

/* Dots */
.dots {
  display: flex;
  gap: 2px;
  margin-top: 3px;
}
.dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-green  { background: var(--green); }
.dot-orange { background: var(--orange); }
.dot-red    { background: var(--red); }

/* Legend */
.legend {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.875rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  justify-content: center;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  color: var(--muted);
  font-weight: 600;
}
.legend-item .dot {
  width: 6px; height: 6px;
}

/* ── Tasks Panel ────────────────────────────────────────────── */
.tasks-panel {
  background: var(--white);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 1.25rem;
  animation: fadeUp 0.2s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.panel-date-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.panel-day-num {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
  letter-spacing: -0.04em;
}
.panel-date {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}
.panel-sub {
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 0.1rem;
}

/* Progress badges */
.progress-counts {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.prog-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  font-size: 0.78rem;
}
.prog-icon { font-size: 1rem; }
.prog-text { display: flex; flex-direction: column; line-height: 1.2; }
.prog-num  { font-weight: 900; font-size: 1rem; }
.prog-lbl  { font-weight: 500; font-size: 0.68rem; opacity: 0.8; }
.prog-green  { background: var(--green-bg);  color: var(--green);  border: 1px solid #bbf7d0; }
.prog-orange { background: var(--orange-bg); color: var(--orange); border: 1px solid #fde68a; }
.prog-red    { background: var(--red-bg);    color: var(--red);    border: 1px solid #fecaca; }

/* Empty */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--muted);
}
.empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.empty-text { font-size: 0.88rem; }

/* Task rows */
.task-list { display: flex; flex-direction: column; }
.task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid var(--border);
  transition: background 0.12s;
  border-radius: 8px;
}
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: #f9fafb; }
.task-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.task-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tdot-completed  { background: var(--green); }
.tdot-pending    { background: var(--orange); }
.tdot-due-today  { background: var(--red); }
.task-info  { display: flex; flex-direction: column; gap: 0.15rem; }
.task-title { font-size: 0.875rem; font-weight: 600; color: var(--text); }
.task-time  { font-size: 0.75rem; color: var(--muted); }

/* Status badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.badge-completed { background: var(--green-bg);  color: var(--green);  border: 1px solid #bbf7d0; }
.badge-pending   { background: var(--orange-bg); color: var(--orange); border: 1px solid #fde68a; }
.badge-due       { background: var(--red-bg);    color: var(--red);    border: 1px solid #fecaca; }

/* No selection placeholder */
.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--muted);
  background: var(--white);
  border-radius: 16px;
  border: 1px dashed var(--border);
}
.no-sel-icon { font-size: 2.5rem; }
.no-selection p { font-size: 0.88rem; font-weight: 500; }

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 700px) {
  .calendar-page {
    grid-template-columns: 1fr;
  }
  .cal-card {
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
