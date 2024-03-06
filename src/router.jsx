import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./linemanage/components/TicketDetail";
import AppLine from "./linemanage/App";
import SigninForm from "./components/shared/SigninForm";
import CreateTicket from "./components/CreateTicket";


const router = createBrowserRouter([
  {
    path: basePath,
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
    children: [
      {
        path: `/linemanage`,
        element: <TicketDetail />,
      },
      {
        path: `/linemanage/ticketDetail/:ticketID`,
        element: <TicketDetail />,
      },
    ],
  },
]);
export default router;
