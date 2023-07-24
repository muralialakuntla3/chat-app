import { Paper, TextInput, Button, Center, Input, Stack } from "@mantine/core";
import UploadAvatar from "../components/UploadAvatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema } from "../lib/zod-schemas";
import { useMutation } from "@tanstack/react-query";
import QueryKeys from "../lib/query-keys";
import useAuth from "../hooks/useAuth";
import http from "../lib/http";
import { AuthState, UpdateUserData } from "../types";
import { AxiosResponse } from "axios";
import { IconLogout } from "@tabler/icons";
import { useForm } from "react-hook-form";
import avatarSampleSrc from "../assets/avatar-sample.png";
import { notify } from "../lib/notifications";

function Me() {
  const auth = useAuth();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      ...auth.user,
      avatar: auth.user?.avatar || avatarSampleSrc,
    },
  });

  const mutation = useMutation({
    mutationKey: [QueryKeys.users.update_user, auth.user?.username],
    mutationFn: async (data: UpdateUserData) => {
      const res = await http.put<
        UpdateUserData,
        AxiosResponse<Required<AuthState>>
      >("/users", data);
      return res.data;
    },
    onSuccess: (data) => {
      auth.signIn(data);
      notify({
        type: "success",
        message: "Profile updated successfully",
      });
    },
  });

  const onSubmit = (data: UpdateUserData) => {
    mutation.mutate(data);
  };

  return (
    <Center h={"100%"}>
      <Stack>
        <Paper miw={500} withBorder shadow="md" p={30} radius="md">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack dir="vertical" spacing={"xs"}>
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
                placeholder="mantine"
                required
              />
              <TextInput
                {...register("email")}
                error={errors.email?.message}
                label="Email"
                placeholder="you@mantine.dev"
                required
              />
              <Input.Wrapper
                description="Allowed file size: max: 10kb"
                label="Avatar image"
              >
                <UploadAvatar control={control} />
              </Input.Wrapper>
            </Stack>
            <Button type="submit" fullWidth mt="xl">
              Update
            </Button>
          </form>
        </Paper>
        <Paper miw={500} withBorder shadow="md" p={30} radius="md">
          <Button
            leftIcon={<IconLogout />}
            variant="light"
            color={"orange"}
            onClick={auth.signOut}
            fullWidth
          >
            Logout
          </Button>
        </Paper>
      </Stack>
    </Center>
  );
}

export default Me;
