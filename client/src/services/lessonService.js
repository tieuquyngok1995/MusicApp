// src/api/lessonService.js
const API_BASE = 'http://172.16.4.38:9891/api/lessons';

/**
 * Lấy metadata cho danh sách bài học
 * @param {string[]} lessonIds - danh sách ID bài học
 */
export async function fetchLessonMetadata(lessonIds) {
  const response = await fetch(`${API_BASE}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessons: lessonIds }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Tải file ZIP cho 1 bài học
 * @param {string} lessonId - ID bài học
 * @returns {string} URL tải ZIP
 */
export function getLessonDownloadUrl(lessonId) {
  return `${API_BASE}/${lessonId}/download`;
}
