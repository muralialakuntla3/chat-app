import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Link } from "react-router-dom";
import http from "../lib/http";
import { notify } from "../lib/notifications";
import QueryKeys from "../lib/query-keys";
import { EmailSchema } from "../lib/zod-schemas";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

export function ForgotPassword() {
  const { classes } = useStyles();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationKey: [QueryKeys.users.forgot_password],
    mutationFn: async (email: string) => {
      const res = await http.post("/users/forgot-password", undefined, {
        params: {
          email,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      notify({
        type: "success",
        message: "Password reset email sent.",
      });
    },
    onError: () => {
      notify({
        type: "error",
        message: "Failed to send password reset link.",
      });
    },
  });

  const handleForgotPassword = () => {
    try {
      const email = EmailSchema.parse(emailInputRef.current?.value);
      mutation.mutate(email);
    } catch (error) {
      notify({
        type: "warning",
        message: "Please enter a valid email.",
      });
    }
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput
          ref={emailInputRef}
          label="Your email"
          placeholder="me@mantine.dev"
          type={"email"}
          required
        />
        <Group position="apart" mt="lg" className={classes.controls}>
          <Anchor color="dimmed" size="sm" className={classes.control}>
            <Center inline>
              <IconArrowLeft size={12} stroke={1.5} />
              <Box component={Link} to="/sign-in" ml={5}>
                Back to login page
              </Box>
            </Center>
          </Anchor>
          <Button
            loading={mutation.isLoading}
            onClick={handleForgotPassword}
            className={classes.control}
          >
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
