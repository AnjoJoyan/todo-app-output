<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" v-if="task" @click.self="close">
        <div class="modal">

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title">{{ isEditing ? 'Edit Task' : 'Task Details' }}</div>
            <button v-if="!isEditing" class="btn-edit-toggle" @click="toggleEdit" title="Edit Task">
              ✏️ Edit
            </button>
          </div>

          <!-- VIEW MODE -->
          <template v-if="!isEditing">
            <div class="view-field">
              <div class="view-key">Title</div>
              <div class="view-val">{{ task.title }}</div>
            </div>

            <div class="view-field" v-if="task.description">
              <div class="view-key">Description</div>
              <div class="view-val view-desc">{{ task.description }}</div>
            </div>

            <div class="view-row">
              <div class="view-field">
                <div class="view-key">Due Date</div>
                <div class="view-val">{{ formatDate(task.dueDate) }}</div>
              </div>
              <div class="view-field">
                <div class="view-key">Priority</div>
                <div class="view-val">
                  <span class="priority-badge" :class="`priority-${task.priority}`">
                    <span class="priority-dot"></span>
                    {{ capitalize(task.priority) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="view-field">
              <div class="view-key">Status</div>
              <div class="view-val">
                <span class="badge" :class="badgeClass(task.status)">{{ task.status }}</span>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-cancel" @click="close">Close</button>
              <button class="btn-save" @click="$emit('toggle-status', task.id)">
                {{ task.status === 'Completed' ? 'Mark Pending' : 'Mark Complete' }}
              </button>
            </div>
          </template>

          <!-- EDIT MODE -->
          <template v-else>
            <div class="form-group">
              <label class="form-label">Title</label>
              <input class="form-input" v-model="editForm.title" placeholder="Task title" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                class="form-input form-textarea"
                v-model="editForm.description"
                placeholder="Add a description (optional)"
                rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Due Date</label>
                <input type="date" class="form-input" v-model="editForm.dueDate" />
              </div>
              <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-input" v-model="editForm.priority">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-cancel" @click="toggleEdit">Cancel</button>
              <button class="btn-save" @click="saveEdit">Save Changes</button>
            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDate } from '../composables/useDate'

const props = defineProps({
  task:      { type: Object,  default: null },
  startEdit: { type: Boolean, default: false },
})
const emit  = defineEmits(['close', 'toggle-status', 'update-task'])

const { badgeClass } = useDate()
const isEditing = ref(false)
const editForm  = ref({})

watch(() => props.task, (t) => {
  isEditing.value = props.startEdit
  if (t) editForm.value = { ...t }
})

function toggleEdit() {
  isEditing.value = !isEditing.value
  if (isEditing.value) editForm.value = { ...props.task }
}

function saveEdit() {
  if (!editForm.value.title?.trim()) return
  emit('update-task', { ...editForm.value, title: editForm.value.title.trim() })
  close()
}

function close() {
  isEditing.value = false
  emit('close')
}

function formatDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${day} ${months[parseInt(m)-1]} ${y}`
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: var(--white);
  border-radius: 16px;
  padding: 2rem;
  width: 480px; max-width: 95vw;
  box-shadow: var(--shadow-md);
}

.modal-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.modal-title { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em; }
.btn-edit-toggle {
  font-size: 0.8rem; font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: 7px;
  border: 1.5px solid var(--border);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.btn-edit-toggle:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.view-field  { margin-bottom: 1rem; }
.view-row    { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.view-key    { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.25rem; }
.view-val    { font-size: 0.95rem; font-weight: 500; }
.view-desc   { font-size: 0.875rem; color: var(--muted); line-height: 1.5; font-weight: 400; }

.priority-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.28rem 0.7rem; border-radius: 6px;
  font-size: 0.78rem; font-weight: 700;
}
.priority-dot { width: 7px; height: 7px; border-radius: 50%; }
.priority-high   { background: var(--red-bg);    color: var(--red);    border: 1px solid #fecaca; }
.priority-high   .priority-dot { background: var(--red); }
.priority-medium { background: var(--orange-bg); color: var(--orange); border: 1px solid #fde68a; }
.priority-medium .priority-dot { background: var(--orange); }
.priority-low    { background: var(--green-bg);  color: var(--green);  border: 1px solid #bbf7d0; }
.priority-low    .priority-dot { background: var(--green); }

.badge { display: inline-flex; align-items: center; padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.775rem; font-weight: 700; }
.badge-completed { background: var(--green-bg);  color: var(--green);  border: 1px solid #bbf7d0; }
.badge-pending   { background: var(--orange-bg); color: var(--orange); border: 1px solid #fde68a; }
.badge-due       { background: var(--red-bg);    color: var(--red);    border: 1px solid #fecaca; }

.form-group { margin-bottom: 1.1rem; }
.form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-label {
  display: block; font-size: 0.8rem; font-weight: 600;
  margin-bottom: 0.4rem; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.05em;
}
.form-input {
  width: 100%; padding: 0.65rem 0.9rem;
  border: 1.5px solid var(--border); border-radius: 8px;
  font-size: 0.9rem; color: var(--text);
  outline: none; transition: border-color 0.2s;
  background: var(--white); font-family: inherit;
}
.form-input:focus { border-color: var(--primary); }
select.form-input { cursor: pointer; }
.form-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }

.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }
.btn-cancel { font-weight: 600; font-size: 0.875rem; padding: 0.6rem 1.4rem; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: 8px; transition: background 0.15s; font-family: inherit; cursor: pointer; }
.btn-cancel:hover { background: #e5e7eb; }
.btn-save   { font-weight: 700; font-size: 0.875rem; padding: 0.6rem 1.4rem; background: var(--primary); color: white; border: none; border-radius: 8px; transition: opacity 0.2s; font-family: inherit; cursor: pointer; }
.btn-save:hover { opacity: 0.85; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96) translateY(10px); }
</style>
