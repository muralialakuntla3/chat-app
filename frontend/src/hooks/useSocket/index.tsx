import { IconActivity, IconCloudDataConnection } from "@tabler/icons";
import { useEffect, useState } from "react";
import { notify } from "../../lib/notifications";
import useAuth from "../useAuth";
import socket from "../../lib/socketio";

function useSocket() {
  const auth = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // Connect to socket after user authentication
  useEffect(() => {
    if (auth.isAuthenticated) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [auth.isAuthenticated]);

  // Listen for connection events
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      notify({
        title: "Connected",
        // message: "Your status set to online.",
        message: null,
        icon: <IconActivity />,
        type: "success",
      });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("connect_error", (error) => {
      if (error)
        notify({
          title: "Disconnected",
          message: "Connection disconnected, retrying...",
          icon: <IconCloudDataConnection />,
          type: "warning",
        });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  return { isConnected, setIsConnected };
}

export default useSocket;
