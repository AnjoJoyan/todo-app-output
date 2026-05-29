import { ref } from 'vue';

const BACKEND_URL = 'http://localhost:8080/priority/get';

export function usePriorityFetch() {
  const priorityKeyValues = ref({});

  const fetchPriorityKeyValues = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();

      if (Array.isArray(data)) {
        // Backend returns: [{ id: '1212321', name: 'High' }]
        const map = {};
        data.forEach(item => {
          map[item.id] = item.name;
        });
        priorityKeyValues.value = map;
      } else {
        // Backend returns: { key: value }
        priorityKeyValues.value = data;
      }

    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  return {
    priorityKeyValues,      // { '1212321': 'High', '1212322': 'Medium', ... }
    fetchPriorityKeyValues, // call this to trigger fetch
  };
}