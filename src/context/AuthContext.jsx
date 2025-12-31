import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { isTokenExpired, msUntilExpiry } from "@/utils/auth";
import { setAuthExpiredHandler } from "@/services/api";
import SessionExpiredDialog from "@/components/SessionExpiredDialog";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token && !isTokenExpired(token));
  const [showDialog, setShowDialog] = useState(false);
  const logoutTimerRef = useRef(null);
  const dialogShownRef = useRef(false); 

  const logout = (silent = false) => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    if (!silent && !dialogShownRef.current) {
      setShowDialog(true);
      dialogShownRef.current = true; // ✅ đánh dấu đã show
    }
  };

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    dialogShownRef.current = false; 
    scheduleExpiryCheck(newToken);
  };

  const scheduleExpiryCheck = (t) => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    const ms = msUntilExpiry(t);
    if (ms <= 0) {
      logout();
      return;
    }
    logoutTimerRef.current = setTimeout(() => logout(), ms);
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) logout();
      else scheduleExpiryCheck(token);
    }

    setAuthExpiredHandler(() => logout());
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      setAuthExpiredHandler(null);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
      <SessionExpiredDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
