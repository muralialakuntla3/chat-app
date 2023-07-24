import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from "@mantine/core";
import { Link, useRouteError } from "react-router-dom";
import { isRouteErrorResponse } from "react-router-dom";
import { z } from "zod";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export function ErrorPage() {
  const { classes } = useStyles();
  const error = useRouteError();

  console.error(error);

  if (!isRouteErrorResponse(error) && import.meta.env.MODE === "development") {
    throw new Error("ErrorPage: Invalid error", {
      cause: error,
    });
  }

  const parsedError = z
    .object({
      statusText: z.string().optional(),
      message: z.string().optional(),
      data: z.string().optional(),
      status: z.number().optional(),
    })
    .parse(error);

  const { statusText, status, data } = parsedError;

  return (
    <Container className={classes.root}>
      <div className={classes.label}>{status || "404"}</div>
      <Title className={classes.title}>{statusText || "Page not found"}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {data || "The page you are looking for does not exist"}
      </Text>
      <Group position="center">
        <Button variant="subtle" component={Link} to="/" size="md">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}
