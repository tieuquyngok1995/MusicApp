// src/api/lessonService.js
// const API_BASE = 'http://172.16.4.38:9891/api/lessons';
const API_BASE = 'http://192.168.1.190:9891/api/lessons';

/**
 * Lấy metadata cho danh sách bài học
 * @param {string[]} lessonIds - danh sách ID bài học
 */
export async function fetchLessonMetadata(lessonIds) {
  try {
    const response = await fetch(`${API_BASE}/metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessons: lessonIds }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchLessonMetadata] API trả lỗi:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('[fetchLessonMetadata] Lỗi khi gọi API:', error);
    throw error;
  }
}

/**
 * Tải file ZIP cho 1 bài học
 * @param {string} lessonId - ID bài học
 * @returns {string} URL tải ZIP
 */
export function getLessonDownloadUrl(lessonId) {
  try {
    if (!lessonId) {
      console.error('[getLessonDownloadUrl] Thiếu lessonId');
      throw new Error('lessonId không hợp lệ');
    }

    const url = `${API_BASE}/${lessonId}/download`;
    console.log(`[getLessonDownloadUrl] Tạo URL tải: ${url}`);
    return url;
  } catch (error) {
    console.error('[getLessonDownloadUrl] Lỗi khi tạo URL:', error);
    throw error;
  }
}
