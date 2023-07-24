import {
  Box,
  Card,
  Center,
  Divider,
  Loader,
  ScrollArea,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSend } from "@tabler/icons";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useChatContext } from "../../../layouts/ChatLayout";
import socket from "../../../lib/socketio";
import { Message } from "../../../types";

type MessagesProps = {
  messages: Message[];
};

function Messages(props: MessagesProps) {
  const auth = useAuth();
  const [text, setText] = useState("");
  const {
    usernameOrChannelName,
    chatType,
    fetchPreviousMessages,
    cursor,
    isLoading,
    isInitialMessagesFetched,
  } = useChatContext();
  const handleMessageSubmit: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.code !== "Enter") {
      return;
    }

    socket.emit(
      "messages:new_message",
      chatType === "dm"
        ? {
            chatType,
            username: usernameOrChannelName,
            text,
          }
        : {
            chatType,
            channelName: usernameOrChannelName,
            text,
          }
    );

    setText("");
  };

  useEffect(() => {
    const observeTarget = document.getElementById("fetch-previous-messages");
    const rootViewport = document.querySelector(
      "#messages-scrollarea > .mantine-ScrollArea-viewport"
    );

    if (!observeTarget || !rootViewport) {
      return;
    }

    const callback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (!cursor) {
          observer.unobserve(entry.target);
          return;
        }
        if (entry.isIntersecting) {
          fetchPreviousMessages(cursor);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: rootViewport,
      threshold: 0.1,
    });
    observer.observe(observeTarget);

    return () => {
      observer.disconnect();
    };
  }, [cursor, fetchPreviousMessages]);

  useEffect(() => {
    if (props.messages.length > 0 && props.messages.length <= 20) {
      const scrollToBottom = () => {
        const element = document.getElementById("scroll-end-element");
        element?.scrollIntoView();
      };
      scrollToBottom();
    }
  }, [props.messages.length]);

  return (
    <>
      <ScrollArea
        sx={{
          height: "100%",
        }}
        offsetScrollbars
        p={"xl"}
        styles={{}}
        id="messages-scrollarea"
      >
        <Center mb={"md"}>
          {isLoading ? (
            <>
              <Loader />
              <Text color={"indigo"} ml={"xs"}>
                Fetching previous messages...
              </Text>
            </>
          ) : (
            <div id="fetch-previous-messages" />
          )}
        </Center>

        {isInitialMessagesFetched && !cursor ? (
          <Divider
            variant="dotted"
            labelPosition="center"
            label="Your reached the end. No more previous messages exist."
            mb={"xl"}
          />
        ) : null}

        {props.messages.map((message) => {
          if (message.fromUsername === auth.user?.username) {
            return (
              <Card
                key={message.id}
                shadow={"sm"}
                withBorder
                w={"90%"}
                mb={"xs"}
                mr="auto"
                style={{
                  overflowAnchor: "none",
                }}
                radius={"md"}
                sx={(theme) => ({
                  background: theme.colors.blue[9],
                  color: theme.white,
                })}
              >
                <Card.Section>
                  <Text
                    sx={(theme) => ({
                      padding: theme.spacing.xs,
                      borderRadius: theme.radius.md,
                    })}
                    size="sm"
                  >
                    {message.text}
                  </Text>
                  <Text
                    color={"dimmed"}
                    sx={(theme) => ({
                      color: theme.colors.gray[3],
                    })}
                    size="xs"
                    p={"xs"}
                  >
                    {message.time.toString()}
                  </Text>
                </Card.Section>
              </Card>
            );
          }

          return (
            <Card
              shadow={"sm"}
              radius={"md"}
              withBorder
              key={message.id}
              w={"90%"}
              ml="auto"
              mb={"xs"}
              style={{
                overflowAnchor: "none",
              }}
            >
              <Card.Section>
                <Text
                  sx={(theme) => ({
                    // background: theme.colors.blue[9],
                    color:
                      theme.colorScheme === "light" ? theme.black : theme.white,
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                  })}
                  size="sm"
                >
                  {message.text}
                </Text>
                <Text color={"dimmed"} size="xs" p={"xs"}>
                  {message.time.toString()}
                </Text>
              </Card.Section>
            </Card>
          );
        })}
        <div
          id="scroll-end-element"
          style={{
            overflowAnchor: "auto",
            height: 1,
          }}
        />
      </ScrollArea>
      <Box>
        <TextInput
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleMessageSubmit}
          rightSection={<IconSend />}
          autoComplete="off"
          placeholder="Type here.."
          autoFocus
          tabIndex={1}
          id="chat-text-input"
        />
        <Space h={10} />
      </Box>
    </>
  );
}

export default Messages;
