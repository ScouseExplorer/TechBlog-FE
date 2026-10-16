import { useMemo, useState } from "react";
import { ADMIN_STORAGE_KEYS } from "../constants";
import AuthContext from "./authContextStore";

function readStoredSession() {
  const raw = sessionStorage.getItem(ADMIN_STORAGE_KEYS.SESSION);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());

  const value = useMemo(() => {
    return {
      session,
      isAuthenticated: Boolean(session?.token && session?.role === "admin"),
      login(nextSession) {
        setSession(nextSession);
        sessionStorage.setItem(ADMIN_STORAGE_KEYS.SESSION, JSON.stringify(nextSession));
      },
      logout() {
        setSession(null);
        sessionStorage.removeItem(ADMIN_STORAGE_KEYS.SESSION);
      },
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
