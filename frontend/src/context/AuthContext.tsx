import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../types";
import { loginRequest, registerRequest, googleLoginRequest } from "../services/auth.service";
import { supabase } from "../lib/supabase";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  loginWithGoogleToken: (token: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("rolelens_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  function persistSession(token: string, nextUser: User) {
    localStorage.setItem("rolelens_token", token);
    localStorage.setItem("rolelens_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function login(email: string, password: string) {
    const { token, user: loggedInUser } = await loginRequest(email, password);
    persistSession(token, loggedInUser);
  }

  async function register(fullName: string, email: string, password: string) {
    const { token, user: newUser } = await registerRequest(fullName, email, password);
    persistSession(token, newUser);
  }

  async function loginWithGoogleToken(token: string) {
    const { token: customToken, user: nextUser } = await googleLoginRequest(token);
    persistSession(customToken, nextUser);
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  function logout() {
    localStorage.removeItem("rolelens_token");
    localStorage.removeItem("rolelens_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogleToken,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
