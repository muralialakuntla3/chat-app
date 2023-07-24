import { Stack, Box, Divider, Flex } from "@mantine/core";
import { ColorSchemeToggle } from "../../../components/ColorSchemeToggle";
import { ChatProfile } from "../../../components/ChatProfile";
import { useChatContext } from "../../../layouts/ChatLayout";
import Messages from "./Messages";
import DeleteChannel from "./DeleteChannel";

function Page() {
  const { getMessages, room, chatType } = useChatContext();
  const messages = getMessages(room);

  return (
    <Stack
      align={"stretch"}
      sx={{ height: "100vh" }}
      pb="md"
      px={"md"}
      spacing={"md"}
      justify={"space-between"}
    >
      <Box>
        <Flex>
          <ChatProfile />
          <Flex justify={"center"} align="center" gap={16}>
            {chatType === "channel" ? <DeleteChannel /> : null}
            <ColorSchemeToggle />
          </Flex>
        </Flex>

        <Divider mx={"-md"} />
      </Box>
      <Messages messages={messages} />
    </Stack>
  );
}

export default Page;
