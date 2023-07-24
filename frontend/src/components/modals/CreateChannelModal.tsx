import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, MultiSelect, Stack, TextInput } from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { ModalSettings } from "@mantine/modals/lib/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { generatePath, useNavigate } from "react-router-dom";
import { getUsersList } from "../../lib/api/users";
import http from "../../lib/http";
import QueryKeys from "../../lib/query-keys";
import { CreateChannelDataSchema } from "../../lib/zod-schemas";
import { Channel, CreateChannelData } from "../../types";

const openCreateChannel = (modalOptions?: ModalSettings) => {
  openModal({
    title: "Create new channel",
    children: <CreateChannelModal />,
    centered: true,
    ...(modalOptions || {}),
  });
};

function CreateChannelModal() {
  const usersQuery = useQuery({
    queryKey: [QueryKeys.users.users_list],
    queryFn: getUsersList,
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<CreateChannelData>({
    resolver: zodResolver(CreateChannelDataSchema),
  });

  const users =
    usersQuery.data?.map((user) => ({
      value: user.username,
      label: user.name,
    })) || [];

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: [QueryKeys.channels.create_channel],
    mutationFn: async (data: CreateChannelData) => {
      const res = await http.post("/channels", data);
      return res.data;
    },
    onSuccess: (data: Channel) => {
      queryClient.setQueryData(
        [QueryKeys.channels.channels_list],
        (currentData?: Channel[]) =>
          currentData ? [...currentData, data] : [data]
      );
      navigate(
        generatePath("/chat/:chatType/:name", {
          name: data.name,
          chatType: "channel",
        })
      );
      closeAllModals();
    },
  });

  const onSubmit = (data: CreateChannelData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={"md"}>
        <TextInput
          {...register("name")}
          label="Channel name"
          error={errors.name?.message}
        />
        <Controller
          name="channelMembers"
          control={control}
          render={({ field }) => (
            <MultiSelect
              label="Select users for the new channel"
              data={users}
              error={errors.channelMembers?.message}
              placeholder="Search user"
              searchable
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
              name={field.name}
            />
          )}
        />
        <Group position="right">
          <Button type="submit" loading={mutation.isLoading}>
            Create
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => closeAllModals()}
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default openCreateChannel;
