import { ref } from 'vue';
 
const BACKEND_URL = 'http://localhost:8080/status/get';
 
export function useStatusFetch() {
  const statusKeyValues = ref({});
 
  const fetchStatusKeyValues = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
 
      if (Array.isArray(data)) {
        // Backend returns: [{ id: 'key', name: 'value' }]
        const map = {};
        data.forEach(item => {
          map[item.id] = item.name;
        });
        statusKeyValues.value = map;
      } else {
        // Backend returns: { key: value }
        statusKeyValues.value = data;
      }
 
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };
 
  return {
    statusKeyValues,      // { completed: 'Completed', pending: 'Pending', ... }
    fetchStatusKeyValues, // call this to trigger fetch
  };
}