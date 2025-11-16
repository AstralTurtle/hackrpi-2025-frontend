// API service for game management

const API_BASE_URL = "http://localhost:8080";

export interface CreateGameResponse {
  code: string;
}

export const createGame = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/create_game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create game: ${response.statusText}`);
    }

    const data: CreateGameResponse = await response.json();
    return data.code;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};
