// LessonPackager.test.js
import fs from "fs";
import path from "path";
import { LessonPackager } from "../LessonPackager";

const TMP_SRC = path.join(process.cwd(), "tmp_data");
const TMP_OUT = path.join(process.cwd(), "tmp_output");

// Tạo file giả
beforeAll(() => {
  fs.mkdirSync(TMP_SRC, { recursive: true });
  const lesson1 = path.join(TMP_SRC, "lesson1");
  fs.mkdirSync(lesson1, { recursive: true });
  fs.writeFileSync(path.join(lesson1, "hello.txt"), "Hello world!");
});

afterAll(() => {
  fs.rmSync(TMP_SRC, { recursive: true, force: true });
  fs.rmSync(TMP_OUT, { recursive: true, force: true });
});

test("Tạo lessons.json lần đầu", async () => {
  const packager = new LessonPackager(TMP_SRC, TMP_OUT);
  const result = await packager.buildAll();

  expect(result["lesson1"]).toBeDefined();
  expect(result["lesson1"].version).toBe(1);
  expect(fs.existsSync(path.join(TMP_OUT, "lesson1.zip"))).toBe(true);
});

test("Không đổi nội dung -> giữ nguyên version", async () => {
  const packager = new LessonPackager(TMP_SRC, TMP_OUT);
  const result = await packager.buildAll();

  expect(result["lesson1"].version).toBe(1); // Không tăng
});

test("Thay đổi file -> tăng version", async () => {
  fs.appendFileSync(path.join(TMP_SRC, "lesson1", "hello.txt"), " changed");
  const packager = new LessonPackager(TMP_SRC, TMP_OUT);
  const result = await packager.buildAll();

  expect(result["lesson1"].version).toBe(2);
});
