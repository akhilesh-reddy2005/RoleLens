import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "../config/supabase";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { loginSchema, registerSchema } from "../utils/validation";

function signToken(userId: string, email: string) {
  return jwt.sign({ id: userId, email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", input.email)
    .maybeSingle();

  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .insert({ full_name: input.fullName, email: input.email, password_hash: passwordHash })
    .select("id, full_name, email")
    .single();

  if (error || !profile) {
    throw ApiError.internal("Failed to create account");
  }

  const token = signToken(profile.id, profile.email);

  res.status(201).json({
    success: true,
    data: { token, user: { id: profile.id, fullName: profile.full_name, email: profile.email } },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, password_hash")
    .eq("email", input.email)
    .maybeSingle();

  if (!profile) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isValid = await bcrypt.compare(input.password, profile.password_hash);
  if (!isValid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken(profile.id, profile.email);

  res.json({
    success: true,
    data: { token, user: { id: profile.id, fullName: profile.full_name, email: profile.email } },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw ApiError.notFound("Profile not found");
  }

  res.json({ success: true, data: profile });
});
