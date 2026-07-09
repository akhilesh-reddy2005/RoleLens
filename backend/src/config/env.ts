import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",

  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseAnonKey: required("SUPABASE_ANON_KEY"),

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",

  geminiApiKey: required("GEMINI_API_KEY"),
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-pro",

  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB ?? 10),

  // Live jobs module
  adzunaAppId: process.env.ADZUNA_APP_ID,
  adzunaAppKey: process.env.ADZUNA_APP_KEY,
  adzunaCountry: process.env.ADZUNA_COUNTRY ?? "in",
  serpApiKey: process.env.SERPAPI_KEY,
  jsearchRapidApiKey: process.env.JSEARCH_RAPIDAPI_KEY,
  jobRefreshCron: process.env.JOB_REFRESH_CRON ?? "*/20 * * * *",
  jobMatchNotifyThreshold: Number(process.env.JOB_MATCH_NOTIFY_THRESHOLD ?? 60),
};
