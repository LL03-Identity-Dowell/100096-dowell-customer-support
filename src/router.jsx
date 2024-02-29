import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./linemanage/components/TicketDetail";
import AppLine from "./linemanage/App";
import App from "./App";
const basePath = "/100096-dowell-customer-support/";
const router = createBrowserRouter([
  {
    path: `/100096-dowell-customer-support/linemanage`,
    element: <App />,
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
