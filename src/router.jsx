import { createBrowserRouter } from "react-router-dom";
import AppLine from "./linemanage/App";
import SigninForm from "./components/shared/SigninForm";
import CreateTicket from "./components/CreateTicket";
import Settings from "./linemanage/components/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTicket />,
    children: [
      {
        path: `/sign-in`,
        element: <SigninForm />,
      },
    ],
  },
  {
    path: `/linemanage`,
    element: <AppLine />,
  },
  {
    path: `/linemanage/settings`,
    element: <Settings />,
  },
]);
export default router;
