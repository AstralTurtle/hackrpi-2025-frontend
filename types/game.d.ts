export interface Player {
  name: string;
  money: number;
}

export interface Station {
  id: string;
  owner: Player;
  awarded_year: number;
  built: boolean;
  cost: number;
  revenue: number;
}

export interface StationDetails {
  name: string;
  lat: number;
  lon: number;
}

export interface Line {
  name: string;
  year: number;
  stations: Station[];
  owner: Player;
}

export interface Contract {
  biddable: Station | Line;
  highest_bid: number;
  highest_bidder: Player | null;
  deadline_year: number;
}

export interface Game {
  code: string;
  year: number;
  turns: number;
  lines: Line[];
  contracts: Contract[];
}
