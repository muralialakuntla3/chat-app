import { Alert } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons";

type GenericErrorProps = {
  message?: React.ReactNode;
};

function GenericError(props: GenericErrorProps) {
  return (
    <Alert icon={<IconAlertTriangle />} color={"red"}>
      {props.message || "Something went wrong!"}
    </Alert>
  );
}

export default GenericError;
