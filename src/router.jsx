import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./linemanage/components/TicketDetail";
import AppLine from "./linemanage/App";
import App from "./App";
const basePath = "/100096-dowell-customer-support/linemanage";
const router = createBrowserRouter([
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
  {
    path: `/100096-dowell-customer-support/`,
    element: <App />,
  },
]);
export default router;
