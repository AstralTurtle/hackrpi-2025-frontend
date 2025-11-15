export interface GameCounter {
  id: string;
  label: string;
  value: number;
  icon: string; // You can replace this with an icon component later
}

export interface ActionButton {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
}

export type PanelType = 'build' | 'finance' | 'politics' | 'research' | null;