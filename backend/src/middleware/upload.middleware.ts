import multer from "multer";
import { Request } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
]);

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(ApiError.badRequest("Only PDF and DOCX files are supported"));
    return;
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSizeMb * 1024 * 1024 },
  fileFilter,
}).single("resume");
