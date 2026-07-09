import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../types";
import { loginRequest, registerRequest } from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
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

  function logout() {
    localStorage.removeItem("rolelens_token");
    localStorage.removeItem("rolelens_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
