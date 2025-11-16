import React from "react";

export const ResearchPanel: React.FC = () => {
  const technologies = [
    {
      id: "electric-trains",
      title: "Electric Trains",
      description: "Reduce operating costs by 20%",
      cost: 5000000,
      duration: 180,
      progress: 65,
      status: "researching",
      icon: "⚡",
    },
    {
      id: "automated-ticketing",
      title: "Automated Ticketing",
      description: "Increase efficiency and reduce fraud",
      cost: 2000000,
      duration: 90,
      progress: 0,
      status: "available",
      icon: "🎫",
    },
    {
      id: "express-service",
      title: "Express Service",
      description: "Skip stops for faster travel times",
      cost: 3000000,
      duration: 120,
      progress: 100,
      status: "completed",
      icon: "🚄",
    },
    {
      id: "deep-tunneling",
      title: "Deep Tunneling",
      description: "Build under rivers and obstacles",
      cost: 8000000,
      duration: 240,
      progress: 0,
      status: "locked",
      icon: "⛏️",
      requirement: "Requires Advanced Engineering",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/30 border-green-700 text-green-400";
      case "researching":
        return "bg-blue-900/30 border-blue-700 text-blue-400";
      case "available":
        return "bg-gray-700 border-gray-600 text-white";
      case "locked":
        return "bg-gray-900 border-gray-700 text-gray-500";
      default:
        return "bg-gray-700 border-gray-600 text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "✓ Completed";
      case "researching":
        return "🔬 In Progress";
      case "available":
        return "Available";
      case "locked":
        return "🔒 Locked";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="mb-6 bg-gray-700 p-4 rounded border border-gray-600">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          Research Points
        </div>
        <div className="text-2xl font-bold text-purple-400">1,250 RP</div>
        <div className="text-xs text-gray-400 mt-1">+50 RP per day</div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
        Available Technologies
      </h3>

      <div className="space-y-3">
        {technologies.map((tech) => (
          <div
            key={tech.id}
            className={`p-4 rounded border ${getStatusColor(tech.status)} ${
              tech.status === "locked" ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">{tech.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold">{tech.title}</h4>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                    {getStatusLabel(tech.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{tech.description}</p>

                {tech.requirement && (
                  <div className="text-xs text-red-400 mb-2">
                    {tech.requirement}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Cost: </span>
                    <span className="text-yellow-400 font-semibold">
                      ${tech.cost.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration: </span>
                    <span className="text-blue-400 font-semibold">
                      {tech.duration} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {tech.status === "researching" && (
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{tech.progress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${tech.progress}%` }}
                  />
                </div>
              </div>
            )}

            {tech.status === "available" && (
              <button className="w-full bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold py-2 px-3 rounded transition-colors mt-2">
                Begin Research
              </button>
            )}

            {tech.status === "completed" && (
              <div className="text-sm text-green-400 text-center mt-2">
                ✓ Technology Active
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
