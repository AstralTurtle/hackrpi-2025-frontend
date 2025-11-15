import { useState } from 'react';
import { CounterBar } from './components/CounterBar';
import { ActionButtonBar } from './components/ActionButtonBar';
import { SidePanel } from './components/SidePanel';
import { GameMap } from './components/GameMap';
import type { GameCounter, ActionButton, PanelType } from '../types/game';

function App() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  // Sample game counters - replace with your actual game state
  const counters: GameCounter[] = [
    { id: 'money', label: 'Money', value: 1000000, icon: '💰' },
    { id: 'population', label: 'Population', value: 3437202, icon: '👥' },
    { id: 'stations', label: 'Stations', value: 15, icon: '🚉' },
    { id: 'lines', label: 'Lines', value: 3, icon: '🚇' },
  ];

  // Action buttons - replace with your actual actions
  const actionButtons: ActionButton[] = [
    {
      id: 'build',
      label: 'Build',
      icon: '🔨',
      onClick: () => setActivePanel(activePanel === 'build' ? null : 'build'),
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: '💵',
      onClick: () => setActivePanel(activePanel === 'finance' ? null : 'finance'),
    },
    {
      id: 'politics',
      label: 'Politics',
      icon: '🏛️',
      onClick: () => setActivePanel(activePanel === 'politics' ? null : 'politics'),
    },
    {
      id: 'research',
      label: 'Research',
      icon: '🔬',
      onClick: () => setActivePanel(activePanel === 'research' ? null : 'research'),
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Top Counter Bar */}
      <CounterBar counters={counters} />

      {/* Action Button Bar */}
      <ActionButtonBar
        buttons={actionButtons}
        activeButton={activePanel}
      />

      {/* Main Content Area: Map with overlay panel */}
      <div className="flex-1 relative overflow-hidden">
        {/* Game Map (always full width) */}
        <GameMap />

        {/* Side Panel (overlays on top of map) */}
        <SidePanel
          activePanel={activePanel}
          onClose={() => setActivePanel(null)}
        />
      </div>
    </div>
  );
}

export default App;