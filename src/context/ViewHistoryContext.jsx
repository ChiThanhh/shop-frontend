import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getUserHistoryView, addUserHistoryView, clearUserHistoryView } from "@/services/UserHistoryViewService";

const ViewHistoryContext = createContext(null);

export function ViewHistoryProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [viewHistory, setViewHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history khi mount hoặc khi authentication status thay đổi
  useEffect(() => {
    const loadHistory = async () => {
      if (isAuthenticated) {
        // Đã đăng nhập: lấy từ API
        try {
          setIsLoading(true);
          const user = JSON.parse(localStorage.getItem("user"));
          if (user?.user_id) {
            const data = await getUserHistoryView(user.user_id);
            setViewHistory(data || []);
          }
        } catch (error) {
          console.error("Error loading history from API:", error);
          setViewHistory([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Chưa đăng nhập: lấy từ localStorage
        const saved = localStorage.getItem("viewHistory");
        setViewHistory(saved ? JSON.parse(saved) : []);
      }
    };

    loadHistory();
  }, [isAuthenticated]);

  // Sync với localStorage khi chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated && viewHistory.length > 0) {
      localStorage.setItem("viewHistory", JSON.stringify(viewHistory));
    }
  }, [viewHistory, isAuthenticated]);

  const addToHistory = async (product) => {
    if (isAuthenticated) {
      // Đã đăng nhập: add qua API
      try {
        await addUserHistoryView({ productIds: [product.product_id] });
        // Cập nhật local state
        setViewHistory((prev) => {
          const filtered = prev.filter((p) => p.product_id !== product.product_id);
          const updated = [product, ...filtered];
          return updated.slice(0, 20);
        });
      } catch (error) {
        console.error("Error adding to history:", error);
      }
    } else {
      // Chưa đăng nhập: add vào localStorage
      setViewHistory((prev) => {
        const filtered = prev.filter((p) => p.product_id !== product.product_id);
        const updated = [product, ...filtered];
        return updated.slice(0, 20);
      });
    }
  };

  const clearHistory = () => {
    setViewHistory([]);
    if (!isAuthenticated) {
      localStorage.removeItem("viewHistory");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.user_id) {
        clearUserHistoryView(user.user_id);
        localStorage.removeItem("viewHistory");
      }
    }
    // TODO: Nếu cần clear history trên server khi đã đăng nhập, thêm API call ở đây
  };

  return (
    <ViewHistoryContext.Provider
      value={{ viewHistory, addToHistory, clearHistory, isLoading }}
    >
      {children}
    </ViewHistoryContext.Provider>
  );
}

export function useViewHistory() {
  return useContext(ViewHistoryContext);
}
