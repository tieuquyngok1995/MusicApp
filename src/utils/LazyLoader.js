// utils/lazyLoader.js
import { lazy } from 'react';

const moduleCache = {};

// Load component với cache
export function loadLazyModule(importFn, key) {
  if (moduleCache[key]) {
    console.log(`[Lazy] Reusing cached module: ${key}`);
    return moduleCache[key];
  }

  const LazyComp = lazy(() =>
    importFn().then(mod => {
      moduleCache[key] = { default: mod.default };
      return mod;
    }),
  );

  moduleCache[key] = LazyComp;
  return LazyComp;
}

// Xóa cache 1 module cụ thể
export function clearLazyModule(key) {
  if (moduleCache[key]) {
    console.log(`[Lazy] Clearing cached module: ${key}`);
    delete moduleCache[key];
  }
}

// Xóa toàn bộ cache
export function clearAllLazyModules() {
  console.log('[Lazy] Clearing all cached modules');
  Object.keys(moduleCache).forEach(key => delete moduleCache[key]);
}
