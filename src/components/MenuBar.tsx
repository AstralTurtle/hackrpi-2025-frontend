import React from "react";

export interface MenuButton {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
}

interface MenuButtonBarProps {
  buttons: MenuButton[];
  activeButton: string | null;
}

export const MenuBar: React.FC<MenuButtonBarProps> = ({
  buttons,
  activeButton,
}) => {
  return (
    <div className="flex items-center gap-3 p-2">
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
                  ? "bg-yellow-600 border-yellow-500 text-white"
                  : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
              }
            `}
          title={button.label}
        >
          <span className="text-3xl">{button.icon}</span>
        </button>
      ))}
    </div>
  );
};
