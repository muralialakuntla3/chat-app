import { QueryClient } from "@tanstack/react-query";
import { handleAPIError } from "./errors";

const handleError = (error: unknown) => {
  handleAPIError(error);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      onError: handleError,
    },
    mutations: {
      onError: handleError,
    },
  },
});

export default queryClient;
