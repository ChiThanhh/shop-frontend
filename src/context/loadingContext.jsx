
import React,{ createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Hàm wrap lại bất kỳ async function nào → sẽ tự bật/tắt loading
  const withLoading = useCallback(async (fn) => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, withLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
