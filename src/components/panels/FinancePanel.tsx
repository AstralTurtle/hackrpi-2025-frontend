import React from "react";

export const FinancePanel: React.FC = () => {
  const financialData = {
    revenue: 15000000,
    expenses: 8000000,
    profit: 7000000,
    cash: 25000000,
  };

  const revenueStreams = [
    { name: "Ticket Sales", amount: 10000000, percentage: 67 },
    { name: "Advertising", amount: 3000000, percentage: 20 },
    { name: "Retail Leases", amount: 2000000, percentage: 13 },
  ];

  const expenses = [
    { name: "Operations", amount: 4000000, percentage: 50 },
    { name: "Maintenance", amount: 2500000, percentage: 31 },
    { name: "Salaries", amount: 1500000, percentage: 19 },
  ];

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Financial Overview
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-900/30 border border-green-700 p-3 rounded">
            <div className="text-xs text-green-400 uppercase tracking-wide mb-1">
              Revenue
            </div>
            <div className="text-xl font-bold text-green-400">
              ${financialData.revenue.toLocaleString()}
            </div>
          </div>

          <div className="bg-red-900/30 border border-red-700 p-3 rounded">
            <div className="text-xs text-red-400 uppercase tracking-wide mb-1">
              Expenses
            </div>
            <div className="text-xl font-bold text-red-400">
              ${financialData.expenses.toLocaleString()}
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded col-span-2">
            <div className="text-xs text-blue-400 uppercase tracking-wide mb-1">
              Net Profit
            </div>
            <div className="text-2xl font-bold text-blue-400">
              ${financialData.profit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
          Revenue Breakdown
        </h3>
        <div className="space-y-2">
          {revenueStreams.map((stream) => (
            <div key={stream.name} className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{stream.name}</span>
                <span className="text-sm text-green-400 font-semibold">
                  ${stream.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stream.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
          Expense Breakdown
        </h3>
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div key={expense.name} className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{expense.name}</span>
                <span className="text-sm text-red-400 font-semibold">
                  ${expense.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${expense.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded transition-colors">
        View Detailed Report
      </button>
    </>
  );
};
