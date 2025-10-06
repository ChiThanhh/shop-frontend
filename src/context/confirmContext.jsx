import React, { createContext, useContext, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resolvePromise, setResolvePromise] = useState(null);

  // Hàm mở confirm, trả về promise chờ người dùng chọn
  const confirm = useCallback((msg) => {
    setMessage(msg);
    setOpen(true);

    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleConfirm = () => {
    if (resolvePromise) resolvePromise(true);
    handleClose();
  };

  const handleCancel = () => {
    if (resolvePromise) resolvePromise(false);
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <div className="py-2">{message}</div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all duration-300"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-1 rounded bg-black text-white hover:bg-gray-700 cursor-pointer transition-all duration-300"
            >
              Đồng ý
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
