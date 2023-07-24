import { Group, Avatar, Text, createStyles, Box, Stack } from "@mantine/core";
import { IconUsers } from "@tabler/icons";
import { useLoaderData, useParams } from "react-router-dom";
import { ChatPageParamsSchema } from "../lib/zod-schemas";
import { ChannelWithUsers, User } from "../types";

const useStyles = createStyles((theme) => ({
  user: {
    display: "flex",
    width: "100%",
    height: 80,
    alignItems: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
}));

export function ChatProfile() {
  const { chatType } = ChatPageParamsSchema.parse(useParams());
  const data = useLoaderData();
  const { classes } = useStyles();

  const user = chatType === "dm" ? (data as User) : null;
  const channel = chatType === "channel" ? (data as ChannelWithUsers) : null;

  return (
    <Box className={classes.user} h={80}>
      <Group>
        {chatType === "dm" ? (
          <Avatar size={40} src={user?.avatar} />
        ) : (
          <Avatar size={40} src={user?.avatar}>
            <IconUsers />
          </Avatar>
        )}
        <Stack spacing={4}>
          <Text variant="gradient" size="lg" weight={"bold"}>
            {user?.name || channel?.name}
          </Text>
          <Text color={"dimmed"} size="xs">
            {chatType === "dm"
              ? `@${user?.username}`
              : channel?.users.map((user) => user.name).join(",")}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}
