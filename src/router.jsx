import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./components/TicketDetail";
import App from "./App";
const basePath = "/100096-dowell-customer-support/";
const router = createBrowserRouter([
  {
    path: `${basePath}`,
    element: <App />,
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
