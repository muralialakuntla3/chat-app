import "../App.css";

import { useLocalStorage, useHotkeys } from "@mantine/hooks";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Outlet } from "react-router-dom";
import AuthProvider from "../contexts/authentication/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/query-client";
import { ModalsProvider } from "@mantine/modals";

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  // Register shortcuts
  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
            }}
          >
            <ModalsProvider>
              <NotificationsProvider position="top-right">
                <Outlet />
              </NotificationsProvider>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
