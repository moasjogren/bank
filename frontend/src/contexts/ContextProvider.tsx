import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./LoginContext";

import { ReactNode } from "react";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <LoginProvider>{children}</LoginProvider>
    </BrowserRouter>
  );
};
