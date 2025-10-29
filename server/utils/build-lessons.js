import fs from "fs";
import path from "path";
import crypto from "crypto";
import archiver from "archiver";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LESSONS_SRC = path.join(__dirname, "../data"); // thư mục chứa nội dung gốc
const OUTPUT_DIR = path.join(__dirname, "../content"); // thư mục chứa file zip & lessons.json

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ===== Đọc lessons.json hiện có (nếu có) =====
const lessonsFile = path.join(OUTPUT_DIR, "lessons.json");
let oldLessons = {};
if (fs.existsSync(lessonsFile)) {
  oldLessons = JSON.parse(fs.readFileSync(lessonsFile, "utf8"));
}

// ===== Hàm tạo hash từ nội dung thư mục =====
function hashDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const hash = crypto.createHash("sha256");

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      hash.update(hashDirectory(filePath)); // đệ quy
    } else {
      const content = fs.readFileSync(filePath);
      hash.update(content);
      hash.update(file.name);
    }
  }

  return hash.digest("hex");
}

// ===== Duyệt qua tất cả thư mục bài học =====
const lessons = {};
const lessonFolders = fs.readdirSync(LESSONS_SRC);

for (const folder of lessonFolders) {
  const folderPath = path.join(LESSONS_SRC, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const hash = hashDirectory(folderPath);
  const oldLesson = oldLessons[folder];
  let version = 1;

  if (oldLesson && oldLesson.hash === hash) {
    // nội dung không thay đổi
    version = oldLesson.version;
  } else if (oldLesson) {
    // nội dung thay đổi -> tăng version
    version = oldLesson.version + 1;
  }

  // Tạo file zip mới
  const zipFile = path.join(OUTPUT_DIR, `${folder}.zip`);
  const output = fs.createWriteStream(zipFile);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(output);
  archive.directory(folderPath, false);
  await archive.finalize();

  console.log(
    oldLesson && oldLesson.hash !== hash
      ? `🔁 Bài ${folder} thay đổi → version ${version}`
      : `✅ Bài ${folder} không đổi (version ${version})`
  );

  // Ghi thông tin
  lessons[folder] = {
    title: `Lessons ${folder.replace("lesson", "")}`,
    version,
    hash,
    apiUrl: `/api/lessons/${folder}/download/`,
  };
}

// ===== Ghi lại lessons.json =====
fs.writeFileSync(lessonsFile, JSON.stringify(lessons, null, 2));
console.log("🧾 Đã tạo xong lessons.json");
