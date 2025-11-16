import React, { useState } from "react";
import type { Line, Station, Contract, StationDetails } from "../../../types/game";


  interface BidPanelProps {
    lines: Line[];
    Contracts: Contract[];
    currentPlayer: string;
    currentYear: number;
    playerMoney: number;
    bid: (bid: number, biddable: string) => void;
    stationDetails: Record<string, StationDetails>
  }


export const BidPanel: React.FC<BidPanelProps> = ({
  Contracts,
  playerMoney,
  bid,
  stationDetails,
}) => {
  const [selectedLineId, setSelectedLineId] = useState<string>("");
  const [newBidAmount, setNewBidAmount] = useState<number>(0);


  // Color scheme for each owner

  // Helper to check if a line has 2 or more stations built
  // const isLineBuilding = (line: Line): boolean => {
  //   let count = 0;
  //   line.stations.forEach((station) => {
  //     if (JSON.parse(station).built === true) count++;
  //   });
  //   return count >= 2;
  // };
  // // Helper to check if line is in active auction
  // const isLineInAuction = (obj: Contract): boolean => {
  //   return activeBids.some((bid) => bid.lineId === lineId);
  // };


  // // Filter lines available for new bidding
  // const OpenBids = Contracts.filter(c: Contract => {
  //   // Must not be in the process of being built
  //   if (isLineBuilding(c)) return false;
  //   // // Must not be in active auction
  //   // if (isLineInAuction(line.name, Contracts)) return false;

  //   return true;
  // });




  // const handleOutbid = (bidId: string, currentAmount: number) => {
  //   const outbidAmountStr = outbidAmounts[bidId] || "";
  //   const amount = parseInt(outbidAmountStr);

  //   if (isNaN(amount) || amount <= 0) {
  //     alert("Please enter a valid bid amount");
  //     return;
  //   }

  //   if (amount < currentAmount + MINIMUM_BID_INCREMENT) {
  //     alert(
  //       `You must bid at least $${MINIMUM_BID_INCREMENT.toLocaleString()} more than the current bid`
  //     );
  //     return;
  //   }

  //   if (amount > playerMoney) {
  //     alert("Insufficient funds!");
  //     return;
  //   }

  //   onOutbid(bidId, amount);
  //   setOutbidAmounts({ ...outbidAmounts, [bidId]: "" });
  // };

  // const getLineName = (lineId: string): string => {
  //   return lines.find((l) => l.id === lineId)?.name || lineId;
  // };

  // const getLineCompletionPercentage = (lineId: string): number => {
  //   const line = lines.find((l) => l.id === lineId);
  //   if (!line) return 0;

  //   const lineStations = line.stationIds
  //     .map((id) => stations.find((s) => s.id === id))
  //     .filter((s): s is Station => s !== undefined);

  //   const builtStations = lineStations.filter(
  //     (s) => s.owner !== "unclaimed"
  //   ).length;
  //   return Math.round((builtStations / lineStations.length) * 100);
  // };

  return (
    <>
      {/* New Bid Submission Box */}
      <div className="mb-6 bg-gray-700 p-4 rounded border-2 border-yellow-600">
        <h3 className="text-lg font-semibold text-white mb-4">
          Start New Auction
        </h3>

        <div className="space-y-3">
          {/* Line Dropdown */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Select Line
            </label>
            <select
              value={selectedLineId}
              onChange={(e) => setSelectedLineId(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
            >
              <option value="">-- Choose a contract --</option>
              {
                Contracts.map((contract : Contract) => {
                  let key = "";
                  if (contract.type === 'line'){
                    let line = contract.biddable as Line;
                    key = line.name;}
                  else {
                    let station = contract.biddable as Station;
                    key = stationDetails[station.id].name ;
                  }
                  return <option key={key} value={key}>
                      {key} ({contract.type.toUpperCase()})
                  </option>
                })
              
              /* {availableLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name} ({getLineCompletionPercentage(line.id)}% built)
                </option>
              ))} */}
            </select>
            {Contracts.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No lines available for auction
              </p>
            )}
          </div>

          {/* Bid Amount */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Bid Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                value={newBidAmount}
                onChange={(e) => setNewBidAmount(parseInt(e.target.value))}
                placeholder="0"
                className="w-full bg-gray-800 text-white p-2 pl-7 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available: ${playerMoney.toLocaleString()}
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => {bid(newBidAmount, selectedLineId)}}
            disabled={!selectedLineId || !newBidAmount}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded transition-colors"
          >
            Submit Bid
          </button>
        </div>
      </div>

     {/* Active Auctions List
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Active Auctions
        </h3>

        {Contracts.length === 0 ? (
          <div className="bg-gray-700 p-6 rounded border border-gray-600 text-center text-gray-400">
            No active auctions. Start one above!
          </div>
        ) : (
          <div className="space-y-3">
            {Contracts.map((bid) => {
              const line = lines.find((l) => l.name === bid.);
              const isPlayerLeading = bid.leadingBidder === currentPlayer;
              const completionPct = getLineCompletionPercentage(bid.lineId);

              return (
                <div
                  key={bid.id}
                  className={`bg-gray-700 p-4 rounded border-2 ${
                    isPlayerLeading ? "border-green-500" : "border-gray-600"
                  }`}
                >
                 
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {getLineName(bid.lineId)}
                      </h4>
                      <div className="text-xs text-gray-400 mt-1">
                        {completionPct}% built • Ends in Year {bid.expiresYear}
                      </div>
                    </div>
                    {isPlayerLeading && (
                      <span className="bg-green-900/30 border border-green-700 text-green-400 text-xs px-2 py-1 rounded">
                        You're Leading
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-800 p-3 rounded mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Leading Bidder
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded`} />
                          <span className={`font-semibold`}>
                            {bid.leadingBidder}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">
                          Current Bid
                        </div>
                        <div className="text-xl font-bold text-yellow-400">
                          ${bid.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

              {/* Outbid Section 
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-2 text-gray-400 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        value={outbidAmounts[bid.id] || ""}
                        onChange={(e) =>
                          setOutbidAmounts({
                            ...outbidAmounts,
                            [bid.id]: e.target.value,
                          })
                        }
                        placeholder={`Min: ${(bid.amount + MINIMUM_BID_INCREMENT).toLocaleString()}`}
                        className="w-full bg-gray-800 text-white p-2 pl-7 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleOutbid(bid.id, bid.amount)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 rounded transition-colors"
                    >
                      Outbid
                    </button>
                  </div>
         

                  <p className="text-xs text-gray-500 mt-2">
                    Minimum bid: $
                    {(bid.amount + MINIMUM_BID_INCREMENT).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div> */}
    </>
  );
};
