import { useQuery } from "@tanstack/react-query";
import  { getUserHistoryView } from "@/services/UserHistoryViewService";

export const useViewHistoryQuery = (userId) => {
  return useQuery({
    queryKey: ["viewHistory", userId],
    queryFn: getUserHistoryView,
    enabled: !!userId, // 🚀 Luôn fetch khi có userId
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};