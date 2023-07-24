import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import useAuth from "../hooks/useAuth";
import http from "../lib/http";
import QueryKeys from "../lib/query-keys";
import StorageKeys from "../lib/storage-keys";
import { SignUpDataSchema } from "../lib/zod-schemas";

type SignUpFormData = z.infer<typeof SignUpDataSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const mutation = useMutation({
    mutationKey: [QueryKeys.auth.sign_in],
    mutationFn: async (data: SignUpFormData) => {
      const res = await http.post("/users/sign-up", data);
      return res.data;
    },
    onSuccess(data) {
      signIn(data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpDataSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
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
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Sign Up
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/sign-in">
          Sign In
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register("name")}
            error={errors.name?.message}
            label="Name"
            placeholder="Your Name"
            required
          />
          <TextInput
            {...register("username")}
            error={errors.email?.message}
            label="Username"
            placeholder="coolusername"
            required
          />
          <TextInput
            {...register("email")}
            error={errors.email?.message}
            label="Email"
            placeholder="you@example.com"
            required
          />
          <PasswordInput
            {...register("password")}
            error={errors.password?.message}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          <Group position="apart" mt="lg">
            <Checkbox
              {...register("rememberMe")}
              error={errors.rememberMe?.message}
              label="Remember me"
              sx={{ lineHeight: 1 }}
            />
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
