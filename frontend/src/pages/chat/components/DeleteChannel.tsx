import { ActionIcon, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconTrash } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import http from "../../../lib/http";
import { notify } from "../../../lib/notifications";
import QueryKeys from "../../../lib/query-keys";

function DeleteChannel() {
  const { name } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [QueryKeys.channels.delete_channel],
    mutationFn: async (channelName: string) => {
      const res = await http.delete(
        generatePath("/channels/:channelName", {
          channelName,
        })
      );
      return res.data;
    },
    onError: () => {
      notify({
        type: "error",
        message:
          "Couldn't delete the channel, please try again or contact support.",
      });
    },
    onSuccess: () => {
      navigate("/");
      queryClient.invalidateQueries([QueryKeys.channels.channels_list]);
    },
  });

  const handleDeleteChannel = () => {
    const openDeleteConfirmarionModal = () =>
      openConfirmModal({
        title: "Please confirm your action",
        centered: true,
        children: (
          <Text size="sm">
            Are you sure you want to delete this channel? This action is not
            reversable.
          </Text>
        ),
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: {
          color: "red",
        },
        onConfirm: () => {
          mutation.mutate(name as string);
        },
      });
    openDeleteConfirmarionModal();
  };

  return (
    <ActionIcon
      // TODO: reuse these styles.
      onClick={handleDeleteChannel}
      disabled={!name}
      loading={mutation.isLoading}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.yellow[4]
            : theme.colors.blue[6],
      })}
    >
      <IconTrash />
    </ActionIcon>
  );
}

export default DeleteChannel;
