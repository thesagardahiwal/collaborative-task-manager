import { createContext, useContext, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const parsed = JSON.parse(localStorage.getItem("user") || '{}');
    if (!parsed) return null;
    return parsed;
  });

  const updateUser = (user: User) => {
    setUser(() => user);
  }

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
