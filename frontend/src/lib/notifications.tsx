import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconExclamationCircle,
  IconInfoCircle,
} from "@tabler/icons";
import { ShowNotificationOptions } from "../types";

export function notify(options: ShowNotificationOptions) {
  switch (options.type) {
    case "success":
      showNotification({
        icon: <IconCheck />,
        color: "teal",
        title: "Success",
        ...options,
      });
      break;
    case "error":
      showNotification({
        icon: <IconExclamationCircle />,
        color: "red",
        ...options,
      });
      break;
    case "info":
      showNotification({
        icon: <IconInfoCircle />,
        color: "blue",
        ...options,
      });
      break;
    case "warning":
      showNotification({
        icon: <IconExclamationCircle />,
        color: "orange",
        ...options,
      });
      break;
    default:
      {
        const _exhaustiveCheck: never = options.type;
        return _exhaustiveCheck;
      }
      break;
  }
}
