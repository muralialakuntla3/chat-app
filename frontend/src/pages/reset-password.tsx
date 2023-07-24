import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStyles,
  Paper,
  Title,
  Text,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  PasswordInput,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import http from "../lib/http";
import { notify } from "../lib/notifications";
import QueryKeys from "../lib/query-keys";
import { ResetPasswordSchema } from "../lib/zod-schemas";
import { PasswordResetData } from "../types";

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

export function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetData>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const [searchParams] = useSearchParams();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: [QueryKeys.users.forgot_password],
    mutationFn: async (data: PasswordResetData) => {
      const res = await http.post("/users/reset-password", {
        ...data,
        token: searchParams.get("token"),
      });
      return res.data;
    },
    onSuccess: () => {
      notify({
        type: "success",
        message: "Password reset success.",
      });
      navigate("/sign-in");
    },
  });

  const handlePasswordReset = (data: PasswordResetData) => {
    if (!searchParams.get("token")) {
      notify({
        type: "warning",
        message: "Invalid token",
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      notify({
        type: "warning",
        message: "Please make sure your passwords match.",
      });
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Reset Password
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={handleSubmit(handlePasswordReset)}>
          <PasswordInput
            {...register("password")}
            label="Password"
            error={errors.password?.message}
            placeholder="Your password"
            required
          />
          <PasswordInput
            {...register("confirmPassword")}
            label="Confirm password"
            error={errors.confirmPassword?.message}
            placeholder="Your password"
            required
            mt={"sm"}
          />

          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor color="dimmed" size="sm" className={classes.control}>
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box component={Link} to="/sign-in" ml={5}>
                  Back to fogot password
                </Box>
              </Center>
            </Anchor>
            <Button
              loading={mutation.isLoading}
              type="submit"
              className={classes.control}
            >
              Reset password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
