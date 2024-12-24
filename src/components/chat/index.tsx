"use client";

import { useState, useRef } from "react";
import { Send, RefreshCw } from "lucide-react";
// import {
//   useCreateSession,
//   useListSessions,
//   useDeleteSession,
//   useSessionHistory,
//   useSendMessage,
// } from "@/lib/hooks/useAssisterr";
// import { API_BASE_URL, API_KEY, HANDLE_NAME } from "../../lib/constants";
import { Button } from "../ui/button";
import { createSession, deleteSession, sendChatMessage } from "../../lib/assisterr";

const Chat = () => {
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  // const [sessions, setSessions] = useState<string[]>();
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const { mutate: createSession } = useCreateSession();
  // const {
  //   data: sessions,
  //   isLoading: isListLoading,
  //   refetch: refetchSessions,
  // } = useListSessions();
  // // const { mutate: deleteSession } = useDeleteSession();
  // const { data: messages = [] } = useSessionHistory(sessionId);
  // const { mutate: sendMessage, isPending } = useSendMessage(sessionId);

  // useEffect(() => {
  //   // Scroll to bottom
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages, streamingMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMessage = input;
    setInput("");
    setStreamingMessage("");

    try {
      const response = await sendChatMessage(sessionId, userMessage);
      if (!response) return;

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setStreamingMessage((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateSession = async () => {
    const sessionId = await createSession();
    // const response = await fetch(
    //   `${API_BASE_URL}/api/v1/slm/${HANDLE_NAME}/session/create/`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "X-Api-Key": API_KEY!,
    //     },
    //   }
    // );

    // console.log("sessionId resp", response);
    console.log("sessionId", sessionId);
    setSessionId(sessionId);
  };

  // const handleDeleteSession = (sid: string) => {
  //   deleteSession(sid);
  // };

  return (
    <div className="flex flex-col w-full md:w-1/2 h-screen mx-auto p-4">
      {/* Session controls */}
      <div className="flex justify-between gap-2 mb-4">
        <Button onClick={handleCreateSession} size="lg">
          New Chat
        </Button>
        <Button variant={"outline"}>
        {/* <Button variant={"outline"} onClick={() => refetchSessions()}> */}
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Sessions list */}
      {/* <div className="flex gap-2 mb-4 overflow-x-auto">
        {sessions?.map((sid) => (
          <div
            key={sid}
            className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${
              sessionId === sid ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <span onClick={() => setSessionId(sid)}>
              Session {sid.slice(-4)}
            </span>
            <Button
              variant={"secondary"}
              onClick={() => handleDeleteSession(sid)}
              className="hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div> */}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 border border-gray-100 rounded">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-full p-3 rounded ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {streamingMessage && (
          <div className="flex justify-start">
            <div className="max-w-3/4 p-3 rounded bg-white">
              {streamingMessage}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
          // disabled={isPending || !sessionId}
        />
        <Button
          type="submit"
          // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          // disabled={isPending || !input.trim() || !sessionId}
          className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
