import { createContext, useState, ReactNode } from "react";

interface LoginContextType {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}

export const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("token"));

  const logIn = () => setIsLoggedIn(true);
  const logOut = () => setIsLoggedIn(false);

  return <LoginContext.Provider value={{ isLoggedIn, logIn, logOut }}>{children}</LoginContext.Provider>;
};
