import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import Login from "./Login";
import Register from "./Register";

const Auth = ({ onClose }) => {
  const [tab, setTab] = useState("login");
  
  
  const variants = {
    initial: (direction) => ({
      x: direction === "login" ? -40 : 40,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === "login" ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl "
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          {/* Tabs */}
          <div className="flex border-b ">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2 text-center font-medium cursor-pointer ${
                tab === "login"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2 text-center font-medium cursor-pointer ${
                tab === "register"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[560px]">
            <AnimatePresence mode="wait" custom={tab}>
              <motion.div
                key={tab}
                custom={tab}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute w-full"
              >
                {tab === "login" ? <Login onClose={onClose}/> : <Register  setTab={setTab} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
