import { createBrowserRouter } from "react-router-dom";
import AppLine from "./linemanage/App";
import SigninForm from "./components/shared/SigninForm";
import CreateTicket from "./components/CreateTicket";
import Settings from "./linemanage/components/Settings";
import LineManagers from "./linemanage/components/Linemanager/LineManagers";
import QueueTicket from "./components/shared/QueueTicket";

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
  {
    path: `/linemanage/linemanagers`,
    element: <LineManagers />,
  },
  {
    path: `/queueTicket`,
    element: <QueueTicket />,
  },
]);
export default router;
