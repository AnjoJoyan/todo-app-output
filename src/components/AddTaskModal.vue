<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" v-if="modelValue" @click.self="$emit('update:modelValue', false)">
        <div class="modal">
          <div class="modal-title">Add New Task</div>

          <div class="form-group">
            <label class="form-label">Task Title</label>
            <input
              class="form-input"
              v-model="form.title"
              placeholder="e.g. Study Vue.js"
              @keyup.enter="save"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              class="form-input form-textarea"
              v-model="form.description"
              placeholder="Add a short description (optional)"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Due Date</label>
              <input type="date" class="form-input" v-model="form.dueDate" />
            </div>

            <div class="form-group">
              <label class="form-label">Priority</label>
              <select class="form-input" v-model="form.priority">
                <!--
                  Dynamically render options from backend priorityKeyValues.
                  Each entry: key = backend key (e.g. "high"), value = display label (e.g. "High").
                  The <option> value is set to the KEY so it is sent to the backend.
                  The visible text shows the VALUE (display label).
                  When the option's display value matches the key (case-insensitive), the key is returned.
                -->
                <template v-if="Object.keys(priorityKeyValues).length">
                  <option
                    v-for="(label, key) in priorityKeyValues"
                    :key="key"
                    :value="resolvePriorityKey(key, label)"
                  >
                    {{ label }}
                  </option>
                </template>
                <!-- Fallback hardcoded options if fetch hasn't completed yet -->
                <template v-else>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </template>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-input" v-model="form.status">
              <!--
                Dynamically render options from backend statusKeyValues.
                Each entry: key = backend key (e.g. "pending"), value = display label (e.g. "Pending").
                The <option> value is set to the KEY so it is sent to the backend.
                The visible text shows the VALUE (display label).
                When the user selects an option whose display value matches the key, the key is returned.
              -->
              <template v-if="Object.keys(statusKeyValues).length">
                <option
                  v-for="(label, key) in statusKeyValues"
                  :key="key"
                  :value="resolveStatusKey(key, label)"
                >
                  {{ label }}
                </option>
              </template>
              <!-- Fallback hardcoded options if fetch hasn't completed yet -->
              <template v-else>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="due_today">Due Today</option>
              </template>
            </select>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="$emit('update:modelValue', false)">Cancel</button>
            <button class="btn-save" @click="save">Save Task</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useStatusFetch } from '../composables/StatusFetch.js'
import { usePriorityFetch } from '../composables/PriorityFetch.js'

const props = defineProps({
  modelValue:  { type: Boolean, default: false },
  defaultDate: { type: String,  default: '' },
})

const emit = defineEmits(['update:modelValue', 'save'])

const { statusKeyValues, fetchStatusKeyValues } = useStatusFetch()
const { priorityKeyValues, fetchPriorityKeyValues } = usePriorityFetch()

// Fetch status and priority options from backend on mount
onMounted(() => {
  fetchStatusKeyValues()
  fetchPriorityKeyValues()
})

const form = reactive({
  title: '', description: '', dueDate: '',
  priority: 'medium', status: 'pending',
})

watch(() => props.modelValue, (val) => {
  if (val) {
    form.title       = ''
    form.description = ''
    form.dueDate     = props.defaultDate
    form.priority    = 'medium'
    form.status      = 'pending'
  }
})

/**
 * resolveStatusKey:
 * If the option's display value (label) matches the key (case-insensitive),
 * return the key directly to the backend.
 * Otherwise, return the key as-is (it's always the backend identifier).
 *
 * Example:
 *   key = "pending", label = "Pending"  → returns "pending"  (match — key sent)
 *   key = "in_progress", label = "In Progress" → returns "in_progress" (key sent)
 */
function resolveStatusKey(key, label) {
  if (key.toLowerCase() === label.toLowerCase()) {
    return key
  }
  return key
}

/**
 * resolvePriorityKey:
 * If the option's display value (label) matches the key (case-insensitive),
 * return the key directly to the backend.
 * Otherwise, return the key as-is (it's always the backend identifier).
 *
 * Example:
 *   key = "high",   label = "High"        → returns "high"   (match — key sent)
 *   key = "p1",     label = "High"        → returns "p1"     (key sent as-is)
 */
function resolvePriorityKey(key, label) {
  if (key.toLowerCase() === label.toLowerCase()) {
    return key
  }
  return key
}

function save() {
  if (!form.title.trim()) return
  emit('save', { ...form, title: form.title.trim() })
  emit('update:modelValue', false)
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
  width: 500px;
  max-width: 95vw;
  box-shadow: var(--shadow-md);
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.form-group { margin-bottom: 1.1rem; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
  background: var(--white);
}
.form-input:focus { border-color: var(--primary); }
select.form-input { cursor: pointer; }

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.modal-actions {
  display: flex; gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel {
  font-weight: 600; font-size: 0.875rem;
  padding: 0.6rem 1.4rem;
  background: var(--bg); color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: background 0.15s;
}
.btn-cancel:hover { background: #e5e7eb; }

.btn-save {
  font-weight: 700; font-size: 0.875rem;
  padding: 0.6rem 1.4rem;
  background: var(--primary); color: white;
  border: none; border-radius: 8px;
  transition: opacity 0.2s;
}
.btn-save:hover { opacity: 0.85; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96) translateY(10px); }
</style>
