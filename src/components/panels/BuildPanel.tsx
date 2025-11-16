import React from "react";

export const BuildPanel: React.FC = () => {
  const buildOptions = [
    {
      id: "new-station",
      title: "Build New Station",
      description: "Construct a new subway station",
      cost: 5000000,
      icon: "🚉",
    },
    {
      id: "extend-line",
      title: "Extend Subway Line",
      description: "Add new track to existing line",
      cost: 10000000,
      icon: "🛤️",
    },
    {
      id: "new-line",
      title: "Create New Line",
      description: "Start a brand new subway route",
      cost: 25000000,
      icon: "🚇",
    },
    {
      id: "upgrade-tracks",
      title: "Upgrade Tracks",
      description: "Improve existing infrastructure",
      cost: 3000000,
      icon: "⚙️",
    },
  ];

  return (
    <>
      <p className="mb-6 text-gray-400">
        Select a construction project to begin building your subway empire.
      </p>

      <div className="space-y-3">
        {buildOptions.map((option) => (
          <div
            key={option.id}
            className="bg-gray-700 p-4 rounded border border-gray-600 hover:bg-gray-650 hover:border-yellow-500 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{option.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-white text-lg mb-1">
                  {option.title}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {option.description}
                </div>
                <div className="text-green-400 font-semibold">
                  ${option.cost.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-900 rounded border border-gray-600">
        <div className="text-sm text-gray-400 mb-2">
          💡 <strong>Tip:</strong> Click on the map to place new stations
        </div>
      </div>
    </>
  );
};
