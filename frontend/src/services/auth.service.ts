import { api } from "./api";
import { User } from "../types";

interface AuthResponse {
  success: boolean;
  data: { token: string; user: User };
}

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data.data;
}

export async function registerRequest(fullName: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/register", { fullName, email, password });
  return data.data;
}

export async function getProfileRequest() {
  const { data } = await api.get<{ success: boolean; data: User }>("/auth/profile");
  return data.data;
}
