import { randomUUID } from "crypto";
import { RESUME_BUCKET, supabaseAdmin } from "../config/supabase";
import { ApiError } from "../utils/apiError";
import { extractTextFromFile, parseResumeStructure } from "./resumeParser.service";
import { ParsedResume } from "../types";

interface StoredResume {
  id: string;
  filePath: string;
  parsed: ParsedResume;
}

export async function storeAndParseResume(
  userId: string,
  file: Express.Multer.File
): Promise<StoredResume> {
  const rawText = await extractTextFromFile(file.buffer, file.mimetype);
  if (!rawText.trim()) {
    throw ApiError.badRequest("Could not extract any text from this file. Try another resume.");
  }

  const parsed = parseResumeStructure(rawText);

  const extension = file.originalname.split(".").pop() ?? "pdf";
  const filePath = `${userId}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(RESUME_BUCKET)
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

  if (uploadError) {
    console.error("Supabase storage upload failed:", uploadError);
    throw ApiError.internal("Failed to store the resume file");
  }

  const { data: resumeRow, error: insertError } = await supabaseAdmin
    .from("resumes")
    .insert({
      user_id: userId,
      file_name: file.originalname,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.mimetype,
      parsed_name: parsed.name,
      parsed_email: parsed.email,
      parsed_phone: parsed.phone,
      raw_text: parsed.rawText,
    })
    .select("id")
    .single();

  if (insertError || !resumeRow) {
    console.error("Failed to insert resume row:", insertError);
    throw ApiError.internal("Failed to save resume metadata");
  }

  return { id: resumeRow.id as string, filePath, parsed };
}

export async function getResumeSignedUrl(filePath: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(filePath, 60 * 10);

  if (error || !data) {
    throw ApiError.internal("Failed to generate resume download link");
  }
  return data.signedUrl;
}
