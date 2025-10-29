// LessonPackager.js
import fs from "fs";
import path from "path";
import crypto from "crypto";
import archiver from "archiver";

export class LessonPackager {
  constructor(lessonsSrc, outputDir) {
    this.lessonsSrc = lessonsSrc;
    this.outputDir = outputDir;

    if (!fs.existsSync(this.outputDir))
      fs.mkdirSync(this.outputDir, { recursive: true });

    this.lessonsFile = path.join(this.outputDir, "lessons.json");
    this.oldLessons = fs.existsSync(this.lessonsFile)
      ? JSON.parse(fs.readFileSync(this.lessonsFile, "utf8"))
      : {};
  }

  hashDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const hash = crypto.createHash("sha256");

    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        hash.update(this.hashDirectory(filePath));
      } else {
        const content = fs.readFileSync(filePath);
        hash.update(content);
        hash.update(file.name);
      }
    }
    return hash.digest("hex");
  }

  async zipFolder(srcDir, outFile) {
    const output = fs.createWriteStream(outFile);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory(srcDir, false);
    await archive.finalize();
  }

  async buildAll() {
    const lessons = {};
    const folders = fs.readdirSync(this.lessonsSrc);

    for (const folder of folders) {
      const folderPath = path.join(this.lessonsSrc, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const hash = this.hashDirectory(folderPath);
      const oldLesson = this.oldLessons[folder];
      let version = 1;

      if (oldLesson && oldLesson.hash === hash) {
        version = oldLesson.version;
      } else if (oldLesson) {
        version = oldLesson.version + 1;
      }

      const zipFile = path.join(this.outputDir, `${folder}.zip`);
      await this.zipFolder(folderPath, zipFile);

      console.log(
        oldLesson && oldLesson.hash !== hash
          ? `🔁 Bài ${folder} thay đổi → version ${version}`
          : `✅ Bài ${folder} không đổi (version ${version})`
      );

      lessons[folder] = {
        title: `Bài ${folder.replace("lesson", "")}`,
        version,
        hash,
        zipUrl: `/api/lesson/${folder}.zip`,
      };
    }

    fs.writeFileSync(this.lessonsFile, JSON.stringify(lessons, null, 2));
    console.log("🧾 Đã tạo xong lessons.json");

    return lessons;
  }
}
