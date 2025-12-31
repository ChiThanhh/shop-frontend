import React from "react";
import { useLoading } from "@/context/loadingContext";

export default function LoadingOverlay() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[1000]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-500"></div>
    </div>
  );
}
