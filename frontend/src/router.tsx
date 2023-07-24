import { createBrowserRouter } from "react-router-dom";
import App from "./layouts/MainLayout";
import MainLayout from "./layouts/App";
import { ForgotPassword } from "./pages/forgot-password";
import Me from "./pages/me";
import { ResetPassword } from "./pages/reset-password";
import { SignIn } from "./pages/sign-in";
import { SignUp } from "./pages/sign-up";
import chatPage from "./pages/chat";
import GenericError from "./components/GenericError";
import ChatLayout from "./layouts/ChatLayout";
import { ErrorPage } from "./pages/error-page";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "me",
            element: <Me />,
          },
          {
            path: "chat",
            element: <ChatLayout />,
            children: [
              {
                path: ":chatType/:name",
                element: <chatPage.Page />,
                loader: chatPage.loader,
                errorElement: <GenericError />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
