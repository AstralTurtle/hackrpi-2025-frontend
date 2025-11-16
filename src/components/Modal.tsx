import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white rounded p-1"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="p-5 text-gray-100">{children}</div>
        </div>
      </div>
    </div>
  );
};
