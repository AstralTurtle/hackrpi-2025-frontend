import React from "react";

export const PoliticsPanel: React.FC = () => {
  const politicalIssues = [
    {
      id: "fare-increase",
      title: "Propose Fare Increase",
      description: "Increase ticket prices by 15%",
      approval: 35,
      impact: "High revenue, Low popularity",
      urgency: "high",
    },
    {
      id: "labor-negotiation",
      title: "Labor Union Negotiation",
      description: "Address worker demands for better conditions",
      approval: 72,
      impact: "Higher costs, Better service",
      urgency: "medium",
    },
    {
      id: "expansion-approval",
      title: "Seek Expansion Approval",
      description: "Request city council approval for new line",
      approval: 58,
      impact: "Long-term growth",
      urgency: "low",
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-400 bg-red-900/30 border-red-700";
      case "medium":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-700";
      case "low":
        return "text-green-400 bg-green-900/30 border-green-700";
      default:
        return "text-gray-400 bg-gray-700 border-gray-600";
    }
  };

  const getApprovalColor = (approval: number) => {
    if (approval >= 60) return "text-green-400";
    if (approval >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <>
      <div className="mb-6">
        <div className="bg-gray-700 p-4 rounded border border-gray-600">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Public Approval
          </div>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-3xl font-bold text-yellow-400">68%</div>
            <div className="text-green-400 text-sm mb-1">▲ 3%</div>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full"
              style={{ width: "68%" }}
            />
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
        Pending Decisions
      </h3>

      <div className="space-y-3">
        {politicalIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-gray-700 p-4 rounded border border-gray-600 hover:border-yellow-500 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-white">{issue.title}</h4>
              <span
                className={`text-xs px-2 py-1 rounded border ${getUrgencyColor(
                  issue.urgency,
                )}`}
              >
                {issue.urgency}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-3">{issue.description}</p>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-400">Approval: </span>
                <span
                  className={`font-semibold ${getApprovalColor(issue.approval)}`}
                >
                  {issue.approval}%
                </span>
              </div>
              <div className="text-xs text-gray-500">{issue.impact}</div>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold py-2 px-3 rounded transition-colors">
                Approve
              </button>
              <button className="flex-1 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded transition-colors">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 rounded border border-blue-700">
        <div className="text-sm text-blue-300">
          <strong>Next Election:</strong> 324 days
        </div>
      </div>
    </>
  );
};
