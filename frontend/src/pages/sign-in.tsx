import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useAuth from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import QueryKeys from "../lib/query-keys";
import http from "../lib/http";
import { SignInDataSchema } from "../lib/zod-schemas";
import StorageKeys from "../lib/storage-keys";
import { useEffect } from "react";

type SignInFormData = z.infer<typeof SignInDataSchema>;

export function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const mutation = useMutation({
    mutationKey: [QueryKeys.auth.sign_in],
    mutationFn: async (data: SignInFormData) => {
      return http.post("/users/sign-in", data);
    },
    onSuccess(data) {
      signIn(data.data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInDataSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    localStorage.setItem(
      StorageKeys.REMEMBER_ME,
      JSON.stringify(data.rememberMe)
    );
    mutation.mutate(data);
  };

  useEffect(() => {
    // Redirect to home if user is logged in
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor component={Link} size="sm" to="/sign-up">
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              {...register("username")}
              label="Username"
              error={errors.username?.message}
              placeholder="username"
              required
            />
            <PasswordInput
              {...register("password")}
              label="Password"
              error={errors.password?.message}
              placeholder="Your password"
              required
              mt="md"
            />
            <Group position="apart" mt="lg">
              <Checkbox
                {...register("rememberMe")}
                label="Remember me"
                sx={{ lineHeight: 1 }}
              />
              <Anchor component={Link} to="/forgot-password" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button type="submit" fullWidth mt="xl">
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
