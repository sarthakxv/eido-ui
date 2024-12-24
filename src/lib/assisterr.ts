import { HANDLE_NAME } from "./constants";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// interface ChatRequest {
//   query: string;
// }

// API request helper method
export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`/api/${HANDLE_NAME}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      "X-Api-Key": "bGk1-3mKWHJZe4Zl1iPCy6VCz-rh04vyot4OC1PMkyA",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.log("API error:", error);
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response;
};

// Session API methods
export const createSession = async () => {
  const response = await fetchApi("/session/create/", {
    method: "POST",
  });
  console.log("createSession response", response);
  return response.json() as Promise<string>;
};

export const listSessions = async () => {
  const response = await fetchApi(`/session/list/`);
  return response.json() as Promise<string[]>;
};

export const deleteSession = async (sessionId: string) => {
  await fetchApi(`/session/${sessionId}/`, {
    method: "DELETE",
  });
};

export const getSessionHistory = async (sessionId: string) => {
  const response = await fetchApi(`/session/${sessionId}/history/`);
  return response.json() as Promise<ChatMessage[]>;
};

// Chat APIs
export const sendChatMessage = async (sessionId: string, message: string) => {
  const response = await fetchApi(`/session/${sessionId}/chat/stream/`, {
    method: "POST",
    body: JSON.stringify({ query: message }),
  });
  return response;
};
