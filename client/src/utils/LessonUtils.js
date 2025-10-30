// LessonUtils.js
import RNFS from 'react-native-fs';

const LESSONS_DIR = `${RNFS.DocumentDirectoryPath}/lessons`;

/**
 * Đọc file meta.json của bài học từ thư mục local
 * @param {string} lessonId - ID bài học, ví dụ 'lesson001'
 * @returns {Promise<Object|null>} object meta hoặc null nếu lỗi
 */
export async function loadLessonMeta(lessonId) {
  const metaPath = `${LESSONS_DIR}/${lessonId}/meta.json`;

  try {
    const raw = await RNFS.readFile(metaPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[loadLessonMeta] Lỗi đọc meta.json của ${lessonId}:`, err);
    return null;
  }
}

/**
 * Lấy đường dẫn URI của video trong bài học
 * @param {string} lessonId - ID bài học
 * @param {string} videoFileName - tên file video, ví dụ 'P.1_Hello Song.mp4'
 * @returns {string} file URI dạng 'file://...'
 */
export function getLessonVideoUri(lessonId, videoFileName) {
  return `file://${LESSONS_DIR}/${lessonId}/${videoFileName}`;
}

export async function listLessonFiles() {
  try {
    const exists = await RNFS.exists(LESSONS_DIR);
    if (!exists) {
      console.log('[RNFS] Thư mục lessons chưa tồn tại:', LESSONS_DIR);
      return [];
    }

    const lessons = await RNFS.readDir(LESSONS_DIR);
    const result = [];

    for (const lesson of lessons) {
      if (lesson.isDirectory()) {
        const lessonFiles = await RNFS.readDir(lesson.path);

        // Lọc ra video + image nếu muốn
        const mediaFiles = lessonFiles.filter(
          f => f.isFile() && /\.(mp4|jpg|png)$/i.test(f.name),
        );

        console.log(
          `Files trong ${lesson.path} ${lesson.name}:`,
          mediaFiles.map(f => f.name),
        );

        result.push({
          lessonId: lesson.name,
          files: mediaFiles, // chứa name, path, isFile(), isDirectory()
        });
      }
    }

    return result;
  } catch (err) {
    console.error('[RNFS] Lỗi đọc thư mục lessons:', err);
    return [];
  }
}
