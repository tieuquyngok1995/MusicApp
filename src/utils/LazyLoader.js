// utils/lazyLoader.js
import { lazy } from 'react';

const moduleCache = new Map();
const lazyCache = new Map();

// Load component với cache
export function loadLazyModule(importFn, key) {
  // Nếu đã có lazy component được tạo, dùng lại
  if (lazyCache.has(key)) {
    console.log(`[Lazy] ♻️ Reusing lazy component: ${key}`);
    return lazyCache.get(key);
  }

  console.log(`[Lazy] 🆕 Creating new lazy component: ${key}`);

  const LazyComp = lazy(async () => {
    // Kiểm tra cache module
    if (moduleCache.has(key)) {
      console.log(`[Lazy] 📦 Using cached module: ${key}`);
      return moduleCache.get(key);
    }

    try {
      console.log(`[Lazy] 📥 Loading module: ${key}`);
      const mod = await importFn();

      if (!mod || !mod.default) {
        console.warn(`[Lazy] ⚠️ Module ${key} has no default export!`);
        throw new Error(`Module ${key} must have a default export`);
      }

      // Cache module
      const cachedModule = { default: mod.default };
      moduleCache.set(key, cachedModule);
      console.log(`[Lazy] ✅ Module loaded and cached: ${key}`);

      return cachedModule;
    } catch (err) {
      console.error(`[Lazy] ❌ Failed to load module ${key}:`, err);
      // Xóa cache nếu load thất bại
      moduleCache.delete(key);
      lazyCache.delete(key);
      throw err;
    }
  });

  // Cache lazy component để tái sử dụng
  lazyCache.set(key, LazyComp);
  return LazyComp;
}

// Xóa cache 1 module cụ thể
export function clearLazyModule(key) {
  if (moduleCache.has(key) || lazyCache.has(key)) {
    console.log(`[Lazy] 🗑️ Clearing cached module: ${key}`);
    moduleCache.delete(key);
    lazyCache.delete(key);
  } else {
    console.log(`[Lazy] ℹ️ Module ${key} not in cache`);
  }
}

// Xóa toàn bộ cache
export function clearAllLazyModules() {
  const moduleCount = moduleCache.size;
  const lazyCount = lazyCache.size;
  console.log(
    `[Lazy] 🧹 Clearing all cached modules (${moduleCount} modules, ${lazyCount} lazy components)`,
  );

  moduleCache.clear();
  lazyCache.clear();

  console.log('[Lazy] ✅ All caches cleared');
}

// Debug: Xem các module đang được cache
export function logCachedModules() {
  console.log('[Lazy] 📊 Cached modules:', Array.from(moduleCache.keys()));
  console.log('[Lazy] 📊 Lazy components:', Array.from(lazyCache.keys()));
}
