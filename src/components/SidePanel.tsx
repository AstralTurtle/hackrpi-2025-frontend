import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidePanelProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  title,
  onClose,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 h-full w-1/4 min-w-[350px] bg-gray-800 border-r-2 border-gray-700 overflow-y-auto shadow-2xl z-50"
        >
          <div className="p-6">
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-700">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Panel Content - Flexible */}
            <div className="text-gray-300">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
