import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanelType } from '../../types/game';

interface SidePanelProps {
  activePanel: PanelType;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  activePanel,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {activePanel && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 h-full w-1/4 min-w-[350px] bg-gray-800 border-r-2 border-gray-700 overflow-y-auto shadow-2xl z-50"
        >
          <div className="p-6">
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-700">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {activePanel}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Panel Content */}
            <div className="text-gray-300">
              <p className="mb-4">
                This is the {activePanel} panel. Replace this with your actual
                panel content.
              </p>
              
              {/* Placeholder content */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="p-3 bg-gray-700 rounded border border-gray-600 hover:bg-gray-650 cursor-pointer"
                  >
                    <div className="font-semibold">Option {item}</div>
                    <div className="text-sm text-gray-400">
                      Description for option {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};