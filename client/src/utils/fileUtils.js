import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

const LESSONS_DIR = `${RNFS.DocumentDirectoryPath}/lessons`;

/**
 * Kiểm tra thư mục bài học tồn tại hay chưa
 */
export async function checkLessonFolder(lessonId) {
  const dirPath = `${LESSONS_DIR}/${lessonId}`;
  return await RNFS.exists(dirPath);
}

/**
 * Lấy danh sách tất cả thư mục bài học trong LESSONS_DIR
 * @returns {Promise<string[]>} Mảng tên thư mục (lessonId)
 */
export async function getLessonFolders() {
  try {
    const exists = await RNFS.exists(LESSONS_DIR);
    if (!exists) {
      return [];
    }

    const items = await RNFS.readDir(LESSONS_DIR);
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    return folders;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thư mục bài học:', error);
    return [];
  }
}

/**
 * Tạo thư mục lưu bài học nếu chưa có
 */
export async function ensureLessonFolder(lessonId) {
  const dirPath = `${LESSONS_DIR}/${lessonId}`;
  await RNFS.mkdir(dirPath);
  return dirPath;
}

/**
 * Giải nén file ZIP đến thư mục chỉ định
 */
export async function unzipLesson(zipPath, destDir) {
  const result = await unzip(zipPath, destDir);
  await RNFS.unlink(zipPath);
  return result;
}

/**
 * Tải file ZIP về cache
 */
export async function downloadLessonZip(url, lessonId) {
  const zipPath = `${RNFS.CachesDirectoryPath}/${lessonId}.zip`;

  const download = await RNFS.downloadFile({
    fromUrl: url,
    toFile: zipPath,
    background: true,
    discretionary: true,
  }).promise;

  if (download.statusCode !== 200) {
    throw new Error(`Download failed: HTTP ${download.statusCode}`);
  }

  return zipPath;
}

/**
 * Xóa toàn bộ thư mục của bài học (nếu tồn tại)
 */
export async function deleteLessonFolder(lessonId) {
  const dirPath = `${LESSONS_DIR}/${lessonId}`;
  await RNFS.unlink(dirPath);
}
