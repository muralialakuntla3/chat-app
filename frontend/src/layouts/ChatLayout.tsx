import { useEffect, useState } from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import socket from "../lib/socketio";
import { ChatPageParamsSchema } from "../lib/zod-schemas";
import { ChatType, CreateMessageData, Message } from "../types";

interface ChatContext {
  getMessages: (room: string) => Message[];
  room: string;
  usernameOrChannelName: string;
  sendMessage: (message: CreateMessageData) => void;
  chatType: ChatType;
  fetchPreviousMessages: (cursor: string) => void;
  cursor: string | null;
  isLoading: boolean;
  isInitialMessagesFetched: boolean;
}

function ChatLayout() {
  const [messages, setMessages] = useState(new Map<string, Message[]>());
  const [cursors, setCursors] = useState(new Map<string, string | null>());
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const params = ChatPageParamsSchema.parse(useParams());
  const room =
    params.chatType === "dm"
      ? [auth.user?.username, params.name].sort().join("-")
      : params.name;
  const usernameOrChannelName = params.name;

  // Listen for new messages
  useEffect(() => {
    socket.on("messages:new_message", (message) => {
      const room = message.channelName
        ? message.channelName
        : [message.fromUsername, message.toUsername].sort().join("-");
      setMessages((messages) => {
        return new Map(messages).set(room, [
          ...(messages.get(room) || []),
          message,
        ]);
      });
    });

    return () => {
      socket.off("messages:new_message");
    };
  }, []);

  // Fetch old initial 20 messages
  const isInitialMessagesFetched = messages.has(room);
  useEffect(() => {
    if (isInitialMessagesFetched) {
      return;
    }
    setIsLoading(true);
    socket.emit(
      "messages:get_old_messages",
      null,
      params.chatType,
      usernameOrChannelName,
      (page) => {
        setMessages((messages) =>
          new Map(messages).set(room, page.data.reverse())
        );
        setCursors((cursors) => new Map(cursors).set(room, page.nextCursor));
        setIsLoading(false);
        const scrollToBottom = () => {
          const element = document.getElementById("scroll-end-element");
          element?.scrollIntoView();
        };
        scrollToBottom();
      }
    );
  }, [isInitialMessagesFetched, params.chatType, room, usernameOrChannelName]);

  const sendMessage = (message: CreateMessageData) => {
    socket.emit("messages:new_message", message);
  };

  const fetchPreviousMessages = (cursor: string) => {
    setIsLoading(true);
    socket.emit(
      "messages:get_old_messages",
      cursor,
      params.chatType,
      usernameOrChannelName,
      (page) => {
        setMessages((messages) =>
          new Map(messages).set(room, [
            ...page.data.reverse(),
            ...(messages.get(room) || []),
          ])
        );
        setCursors((cursors) => new Map(cursors).set(room, page.nextCursor));
        setIsLoading(false);
      }
    );
  };

  const context: ChatContext = {
    getMessages(room) {
      return messages.get(room) || [];
    },
    room,
    sendMessage,
    chatType: params.chatType,
    usernameOrChannelName,
    fetchPreviousMessages,
    cursor: cursors.get(room) || null,
    isLoading,
    isInitialMessagesFetched,
  };

  return (
    <>
      <Outlet context={context} />
    </>
  );
}

export const useChatContext = () => useOutletContext<ChatContext>();

export default ChatLayout;
