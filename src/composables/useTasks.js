import { ref, computed } from 'vue'

// ── Base URL ──────────────────────────────────────────────────────────────────
// Your Vue app runs on :8080, so Spring Boot must be on a different port.
// Change this to match your actual Spring Boot server port.
const API_BASE = 'http://localhost:8081/api/tasks'

// ── Shared reactive state ─────────────────────────────────────────────────────
const tasks   = ref([])
const loading = ref(false)
const error   = ref(null)

// ── Helpers ───────────────────────────────────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    // Try to get a clean error message — avoid leaking raw HTML into the UI
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.message || json?.error || `HTTP ${res.status}`)
    }
    throw new Error(`Server error: HTTP ${res.status} — check that Spring Boot is running on the correct port.`)
  }
  if (res.status === 204) return null
  return res.json()
}

// ── Composable ────────────────────────────────────────────────────────────────
export function useTasks() {

  const allTasks = computed(() => tasks.value)

  // GET /api/tasks
  async function fetchTasks() {
    loading.value = true
    error.value   = null
    try {
      tasks.value = await request(API_BASE)
    } catch (e) {
      if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
        error.value = 'Cannot connect to Spring Boot server. Make sure it is running on the correct port.'
      } else {
        error.value = e.message
      }
    } finally {
      loading.value = false
    }
  }

  // Filter by date (local — no extra API call needed)
  function getTasksByDate(date) {
    return computed(() => tasks.value.filter(t => t.dueDate === date))
  }

  // POST /api/tasks
  async function addTask(task) {
    loading.value = true
    error.value   = null
    try {
      const created = await request(API_BASE, {
        method: 'POST',
        body: JSON.stringify(task),
      })
      tasks.value.push(created)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // DELETE /api/tasks/{id}
  async function deleteTask(id) {
    loading.value = true
    error.value   = null
    try {
      await request(`${API_BASE}/${id}`, { method: 'DELETE' })
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // PATCH /api/tasks/{id}/status
  async function updateStatus(id, status) {
    loading.value = true
    error.value   = null
    try {
      const updated = await request(`${API_BASE}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      const idx = tasks.value.findIndex(t => t.id === id)
      if (idx !== -1) tasks.value[idx] = updated
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Toggle Completed ↔ Pending
  async function toggleStatus(id) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    const next = task.status === 'Completed' ? 'Pending' : 'Completed'
    await updateStatus(id, next)
  }

  // PUT /api/tasks/{id}
  async function updateTask(updated) {
    loading.value = true
    error.value   = null
    try {
      const saved = await request(`${API_BASE}/${updated.id}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      })
      const idx = tasks.value.findIndex(t => t.id === updated.id)
      if (idx !== -1) tasks.value[idx] = saved
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    allTasks,
    loading,
    error,
    fetchTasks,
    getTasksByDate,
    addTask,
    deleteTask,
    updateStatus,
    toggleStatus,
    updateTask,
  }
}
