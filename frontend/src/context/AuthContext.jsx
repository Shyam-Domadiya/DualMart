import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Login
  const login = async (data) => {
    const res = await API.post("auth/login/", data);

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const me = await API.get("auth/me/");
    setUser(me.data);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // ♻️ Restore user on refresh
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      API.get("auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
