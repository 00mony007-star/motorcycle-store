import { ApiAdapter } from './api.interfaces'
import { indexedDbAdapter } from './indexedDbAdapter'
// import { memoryAdapter } from './memoryAdapter';

// The factory determines which adapter to use.
// We can switch to a real REST adapter here later.
let api: ApiAdapter

export function getApi(): ApiAdapter {
  if (!api) {
    // For now, we default to the IndexedDB implementation.
    // To use the memory adapter, you could switch this line:
    // api = memoryAdapter;
    api = indexedDbAdapter
  }
  return api
}

// Re-export interfaces for convenience
export * from './api.interfaces'
