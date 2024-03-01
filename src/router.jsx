import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./linemanage/components/TicketDetail";
import AppLine from "./linemanage/App";
import SigninForm from "./components/shared/SigninForm";
import CreateTicket from "./components/CreateTicket";
const basePath = "/100096-dowell-customer-support/linemanage";
const router = createBrowserRouter([
  {
    path: `/100096-dowell-customer-support/`,
    element: <CreateTicket />,
    children: [
      {
        path: "/100096-dowell-customer-support/sign-in",
        element: <SigninForm />,
      },
    ],
  },
  {
    path: `${basePath}`,
    element: <AppLine />,
    children: [
      {
        path: `${basePath}`,
        element: <TicketDetail />,
      },
      {
        path: `${basePath}/ticketDetail/:ticketID`,
        element: <TicketDetail />,
      },
    ],
  },
]);
export default router;
