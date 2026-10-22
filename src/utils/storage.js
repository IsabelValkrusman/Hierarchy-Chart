
import hierarchyData from '../data/hierarchyData.json';

const STORAGE_KEY = 'merchant-hierarchy-data';

// Load saved hierarchy or use initial JSON data.
// Загружаем сохранённые данные или начальные данные JSON.
export function loadHierarchy() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const data = JSON.parse(saved);

      if (
        Array.isArray(data.nodes) &&
        Array.isArray(data.edges)
      ) {
        return data;
      }
    }
  } catch (error) {
    console.error('Could not load saved hierarchy:', error);
  }

  return {
    nodes: hierarchyData.nodes,
    edges: hierarchyData.edges,
  };
}

// Save the current hierarchy.
// Сохраняем текущую иерархию.
export function saveHierarchy(nodes, edges) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nodes, edges })
    );
  } catch (error) {
    console.error('Could not save hierarchy:', error);
  }
}
