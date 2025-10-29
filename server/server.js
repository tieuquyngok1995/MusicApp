import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import archiver from "archiver";

const app = express();
const PORT = process.env.PORT || 9891;

app.use(cors());
app.use(express.json());

const BUILT_LESSONS_DIR = path.resolve("./content");

/**
 * Utility kiểm tra tồn tại file/folder
 */
const fileExists = (filePath) => fs.existsSync(filePath);

/**
 * GET /api/lessons
 * Trả về danh sách bài học có sẵn (file .zip)
 */
app.get("/api/lessons", (req, res) => {
  try {
    if (!fileExists(BUILT_LESSONS_DIR)) {
      return res.status(500).json({ error: "Thư mục content không tồn tại." });
    }

    const files = fs
      .readdirSync(BUILT_LESSONS_DIR)
      .filter((f) => f.endsWith(".zip"))
      .map((f) => path.basename(f, ".zip"));

    return res.json({ lessons: files });
  } catch (err) {
    console.error("Lỗi đọc danh sách bài học:", err);
    return res.status(500).json({ error: "Không đọc được danh sách bài học." });
  }
});

/**
 * GET /api/lessons/metadata
 * Download file lessons.json
 */
app.get("/api/lessons/metadata", (req, res) => {
  try {
    const jsonPath = path.join(BUILT_LESSONS_DIR, "lessons.json");

    if (!fileExists(jsonPath)) {
      return res.status(404).json({ error: "Không tìm thấy lessons.json" });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=lessons.json");
    fs.createReadStream(jsonPath).pipe(res);
  } catch (err) {
    console.error("Lỗi tải lessons.json:", err);
    return res.status(500).json({ error: "Không thể tải lessons.json" });
  }
});

/**
 * POST /api/lessons/metadata
 * Body JSON: { lessons: ["lesson001", "lesson002"] }
 * Trả về dữ liệu metadata tương ứng trong lessons.json
 */
app.post("/api/lessons/metadata", (req, res) => {
  try {
    const { lessons } = req.body;

    if (!Array.isArray(lessons) || lessons.length === 0) {
      return res
        .status(400)
        .json({ error: "Danh sách bài học không hợp lệ hoặc rỗng." });
    }

    const jsonPath = path.join(BUILT_LESSONS_DIR, "lessons.json");

    if (!fileExists(jsonPath)) {
      return res.status(404).json({ error: "Không tìm thấy lessons.json." });
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const allLessons = JSON.parse(rawData);

    if (typeof allLessons !== "object" || Array.isArray(allLessons)) {
      return res
        .status(500)
        .json({ error: "Cấu trúc lessons.json không đúng định dạng object." });
    }

    // Lọc theo danh sách được truyền lên
    const filtered = {};
    for (const id of lessons) {
      if (allLessons[id]) {
        filtered[id] = allLessons[id];
      }
    }

    if (Object.keys(filtered).length === 0) {
      return res
        .status(404)
        .json({
          error: "Không tìm thấy bài học nào phù hợp trong lessons.json.",
        });
    }

    return res.json({ lessons: filtered });
  } catch (err) {
    console.error("Lỗi đọc lessons.json:", err);
    return res.status(500).json({ error: "Không thể xử lý lessons.json." });
  }
});

/**
 * GET /api/lessons/:lessonId/download
 * Download 1 bài học (ZIP)
 */
app.get("/api/lessons/:lessonId/download", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const filePath = path.join(BUILT_LESSONS_DIR, `${lessonId}.zip`);

    if (!fileExists(filePath)) {
      console.warn(`Không tìm thấy file cho bài học: ${lessonId}`);
      return res
        .status(404)
        .json({ error: `Không tìm thấy bài học ${lessonId}` });
    }

    console.log(`⬇ Đang gửi file: ${lessonId}.zip`);
    res.download(filePath, `${lessonId}.zip`, (err) => {
      if (err) {
        console.error("Lỗi khi gửi file:", err);
        if (!res.headersSent)
          res.status(500).json({ error: "Gửi file thất bại." });
      }
    });
  } catch (err) {
    console.error("Lỗi xử lý tải 1 bài học:", err);
    res.status(500).json({ error: "Lỗi khi xử lý tải bài học." });
  }
});

/**
 * POST /api/lessons/download
 * Body: { lessons: ["lesson001", "lesson002"] }
 * Trả về 1 file ZIP tổng hợp.
 */
app.post("/api/lessons/download", async (req, res) => {
  try {
    const { lessons } = req.body;
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return res.status(400).json({ error: "Danh sách bài học không hợp lệ." });
    }

    const zipName = `selected_lessons_${Date.now()}.zip`;
    const zipPath = path.join(BUILT_LESSONS_DIR, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Xử lý lỗi trong archiver
    archive.on("error", (err) => {
      console.error("Lỗi khi tạo file zip:", err);
      res.status(500).json({ error: "Không thể tạo file zip." });
    });

    archive.pipe(output);

    let addedCount = 0;
    for (const lessonId of lessons) {
      const zipFile = path.join(BUILT_LESSONS_DIR, `${lessonId}.zip`);
      if (fileExists(zipFile)) {
        archive.file(zipFile, { name: `${lessonId}.zip` });
        addedCount++;
      } else {
        console.warn(`Không tìm thấy bài học: ${lessonId}`);
      }
    }

    if (addedCount === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy bài học nào hợp lệ." });
    }

    await archive.finalize();

    output.on("close", () => {
      console.log(`Đã gộp ${addedCount} bài học vào ${zipName}`);
      res.download(zipPath, zipName, (err) => {
        if (err) console.error("Lỗi khi gửi file zip:", err);
        // Xóa file tạm sau 10 giây
        setTimeout(() => {
          fs.unlink(zipPath, (delErr) => {
            if (delErr) console.error("Không thể xóa file tạm:", delErr);
          });
        }, 10_000);
      });
    });
  } catch (err) {
    console.error("Lỗi khi xử lý download danh sách:", err);
    res.status(500).json({ error: "Lỗi khi xử lý yêu cầu tải nhiều bài học." });
  }
});

/**
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.json({ message: "Lesson server (RESTful download API)" });
});

app.listen(PORT, () => {
  console.log(`Lesson server đang chạy tại: http://localhost:${PORT}`);
});
