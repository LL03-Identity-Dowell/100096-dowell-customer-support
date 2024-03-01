import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./linemanage/components/TicketDetail";
import AppLine from "./linemanage/App";
import SigninForm from "./components/shared/SigninForm";
import CreateTicket from "./components/CreateTicket";
const basePath = "/100096-dowell-customer-support";
const router = createBrowserRouter([
  {
    path: basePath,
    element: <CreateTicket />,
    children: [
      {
        path: `${basePath}/sign-in`,
        element: <SigninForm />,
      },
    ],
  },
  {
    path: `${basePath}/linemanage`,
    element: <AppLine />,
    children: [
      {
        path: `${basePath}/linemanage`,
        element: <TicketDetail />,
      },
      {
        path: `${basePath}/linemanage/ticketDetail/:ticketID`,
        element: <TicketDetail />,
      },
    ],
  },
]);
export default router;
