import React from 'react';
import type { GameCounter } from '../../types/game';

interface CounterBarProps {
  counters: GameCounter[];
}

export const CounterBar: React.FC<CounterBarProps> = ({ counters }) => {
  return (
    <div className="bg-gray-800 border-b-2 border-gray-700 p-2">
      <div className="flex items-center gap-2">
        {counters.map((counter) => (
          <div
            key={counter.id}
            className="flex items-center gap-3 px-4 py-2 bg-gray-700 rounded border border-gray-600"
          >
            <span className="text-yellow-400 text-xl">{counter.icon}</span>
            <span className="text-white font-semibold text-sm">
              {counter.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};