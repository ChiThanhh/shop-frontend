import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SessionExpiredDialog({ open, onClose }) {
  const navigate = useNavigate();

  const handleOk = () => {
    onClose();
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phiên đăng nhập đã hết hạn</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Vui lòng đăng nhập lại để tiếp tục.
        </p>
        <DialogFooter>
          <Button onClick={handleOk}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
