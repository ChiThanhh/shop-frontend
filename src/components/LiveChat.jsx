import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { chatAI } from "@/services/ChatService";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

 const handleSend = async () => {
  if (!inputValue.trim() || isLoading) return;

  const messageText = inputValue.trim();

  const userMessage = {
    id: Date.now(),
    sender: "user",
    text: messageText,
    time: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    // 👉 LẤY 5 MESSAGE GẦN NHẤT (không tính message mới)
    const recentMessages = messages
      .slice(-5)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

    const res = await chatAI({
      message: messageText,
      history: recentMessages,
    });

    const replyText =
      res?.reply?.trim() ||
      "Mình chưa hiểu rõ, bạn nói lại giúp mình nhé 😊";

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        sender: "bot",
        text: "Hiện hệ thống đang bận, vui lòng thử lại sau 🙏",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};




  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                  <p className="text-xs opacity-90">Trực tuyến</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                        }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border px-4 py-2 rounded-2xl text-sm text-gray-500">
                    Đang trả lời...
                  </div>
                </div>
              )}
            </div>


            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  placeholder="Nhập tin nhắn..."
                />

                <Button onClick={handleSend} size="icon" disabled={isLoading}>
                  <Send size={18} />
                </Button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow z-50 flex items-center gap-2"
          >
            <MessageCircle size={20} />
            <span className="font-medium">Chat hỗ trợ</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}
    </>
  );
}
