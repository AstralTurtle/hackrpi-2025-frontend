import React from 'react';
import type { ActionButton } from '../../types/game';

interface ActionButtonBarProps {
  buttons: ActionButton[];
  activeButton: string | null;
}

export const ActionButtonBar: React.FC<ActionButtonBarProps> = ({
  buttons,
  activeButton,
}) => {
  return (
    <div className="bg-gray-800 border-b-2 border-gray-700 p-2">
      <div className="flex items-center gap-3">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={button.onClick}
            className={`
              flex items-center justify-center
              w-24 h-16 rounded
              border-2 transition-all
              ${
                activeButton === button.id
                  ? 'bg-yellow-600 border-yellow-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
              }
            `}
            title={button.label}
          >
            <span className="text-3xl">{button.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};