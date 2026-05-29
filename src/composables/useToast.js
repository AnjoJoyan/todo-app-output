import { ref } from 'vue'

const toastMsg = ref('')
let timer = null

export function useToast() {
  function showToast(msg) {
    toastMsg.value = msg
    clearTimeout(timer)
    timer = setTimeout(() => { toastMsg.value = '' }, 2800)
  }

  return { toastMsg, showToast }
}
