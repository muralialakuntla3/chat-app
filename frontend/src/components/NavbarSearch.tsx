import {
  createStyles,
  Navbar,
  TextInput,
  Code,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Title,
  clsx,
  CSSObject,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconSearch, IconPlus, IconUser } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { matchSorter } from "match-sorter";
import { useRef, useState } from "react";
import { generatePath, NavLink, useParams } from "react-router-dom";
import { getChannelsList } from "../lib/api/channels";
import { getUsersList } from "../lib/api/users";
import QueryKeys from "../lib/query-keys";
import { ChatPageParams } from "../types";
import openCreateChannel from "./modals/CreateChannelModal";

const useStyles = createStyles((theme) => {
  const linkActiveOrHoverStyles: CSSObject = {
    backgroundColor: theme.colors.blue[9],
    color: theme.white,
  };

  return {
    navbar: {
      paddingTop: 0,
    },

    section: {
      // marginLeft: -theme.spacing.md,
      // marginRight: -theme.spacing.md,
      marginBottom: theme.spacing.md,

      "&:not(:last-of-type)": {
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[3]
        }`,
      },
    },

    searchCode: {
      fontWeight: 700,
      fontSize: 10,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2]
      }`,
    },

    links: {
      paddingLeft: theme.spacing.md - 6,
      paddingRight: theme.spacing.md - 6,
      paddingBottom: theme.spacing.md,
    },

    linksHeader: {
      paddingLeft: theme.spacing.md + 2,
      paddingRight: theme.spacing.md,
      marginBottom: 5,
    },

    chatLink: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing.xs,
      padding: `8px ${theme.spacing.xs}px`,
      textDecoration: "none",
      borderRadius: theme.radius.sm,
      fontSize: theme.fontSizes.sm,
      lineHeight: 1,
      fontWeight: 500,
      marginBottom: 4,
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      "&:hover": linkActiveOrHoverStyles,
    },

    activeChatLink: linkActiveOrHoverStyles,
  };
});

export function NavbarSearch() {
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const usersQuery = useQuery({
    queryKey: [QueryKeys.users.users_list],
    queryFn: getUsersList,
  });
  const channelsQuery = useQuery({
    queryKey: [QueryKeys.channels.channels_list],
    queryFn: getChannelsList,
  });

  const params = useParams<ChatPageParams>();
  const searchRef = useRef<HTMLInputElement>(null);
  useHotkeys(
    [
      [
        "mod+K",
        () => {
          searchRef.current?.focus();
        },
      ],
    ],
    [],
    true
  );

  const foucsChatTextInput = () => {
    const element = document.getElementById(
      "chat-text-input"
    ) as HTMLInputElement | null;
    element?.focus();
    const scrollToBottom = () => {
      const element = document.getElementById("scroll-end-element");
      element?.scrollIntoView();
    };
    scrollToBottom();
  };
  const userLinks = usersQuery.isSuccess
    ? matchSorter(usersQuery.data, search, { keys: ["username", "name"] }).map(
        (user) => {
          const isLinkActive =
            params.chatType === "dm" && params.name === user.username;
          return (
            <Text
              onClick={foucsChatTextInput}
              component={NavLink}
              color="dark"
              to={{
                pathname: generatePath("/chat/:chatType/:name", {
                  name: user.username,
                  chatType: "dm",
                }),
              }}
              key={user.email}
              className={clsx(classes.chatLink, {
                [classes.activeChatLink]: isLinkActive,
              })}
            >
              <span>{user.name}</span>
            </Text>
          );
        }
      )
    : [];

  const channelLinks = channelsQuery.isSuccess
    ? matchSorter(channelsQuery.data, search, {
        keys: ["name"],
      }).map((channel) => {
        const isLinkActive =
          params.chatType === "channel" && params.name === channel.name;

        return (
          <Text
            onClick={foucsChatTextInput}
            component={NavLink}
            color="dark"
            to={{
              pathname: generatePath("/chat/:chatType/:name", {
                name: channel.name,
                chatType: "channel",
              }),
            }}
            key={channel.name}
            className={clsx(classes.chatLink, {
              [classes.activeChatLink]: isLinkActive,
            })}
          >
            <span>{channel.name}</span>
          </Text>
        );
      })
    : [];

  return (
    <Navbar width={{ sm: 300 }} className={classes.navbar}>
      <Navbar.Section className={classes.section}>
        <Group px={"md"} h={80} position="apart">
          <Group spacing={"xs"}>
            <Title variant="gradient" fw={"bold"} ff="monospace" order={1}>
              CHAT
            </Title>
          </Group>
          <ActionIcon component={NavLink} to="/me">
            <IconUser color="blue" />
          </ActionIcon>
        </Group>
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <TextInput
          placeholder="Search"
          size="xs"
          ref={searchRef}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          px={"md"}
          icon={<IconSearch size={12} stroke={1.5} />}
          rightSectionWidth={70}
          rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
          styles={{ rightSection: { pointerEvents: "none" } }}
          mb="sm"
        />
      </Navbar.Section>

      <ScrollArea type="never">
        <Navbar.Section className={classes.section}>
          <Group className={classes.linksHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              Direct messages
            </Text>
          </Group>
          <div className={classes.links}>{userLinks}</div>
        </Navbar.Section>

        <Navbar.Section className={classes.section}>
          <Group className={classes.linksHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              Channels
            </Text>
            <Tooltip label="Create channel" withArrow position="right">
              <ActionIcon
                variant="default"
                onClick={() => openCreateChannel()}
                size={18}
              >
                <IconPlus size={12} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.links}>{channelLinks}</div>
        </Navbar.Section>
      </ScrollArea>
    </Navbar>
  );
}
