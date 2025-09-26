// contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, loadToken, saveToken, clearToken } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

async function fetchMe() {
  try {
    const { data } = await api.get("/auth/me");
    return data?.user ?? data ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await loadToken();
      if (t) {
        const me = await fetchMe();
        setUser(me);
      }
      setReady(true);
    })();
  }, []);

  async function signIn(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    if (data?.access_token) await saveToken(data.access_token);
    const me = data?.user ?? (await fetchMe());
    setUser(me);
    return me;
  }

  async function signOut() {
    await clearToken();
    setUser(null);
  }

  const value = useMemo(() => ({ ready, user, setUser, signIn, signOut }), [ready, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
