import React from "react";

export interface StatisticsLabel {
  id: string;
  label: string;
  value: number;
  icon: string;
}

interface StatisticsBarProps {
  counters: StatisticsLabel[];
}

export const StatisticsBar: React.FC<StatisticsBarProps> = ({ counters }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      {counters.map((counter) => (
        <div
          key={counter.id}
          className="flex items-center gap-3 px-4 py-2 bg-black border border-slate-700"
        >
          <span className="text-yellow-400 text-xl">{counter.icon}</span>
          <span className="text-white font-semibold text-sm">
            {counter.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};
