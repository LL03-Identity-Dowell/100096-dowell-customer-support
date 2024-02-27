import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./components/TicketDetail";
import App from "./App";
const router = createBrowserRouter([
  {
    path: "/100096-customer-support/linemanager",
    element: <App />,
    children: [
      {
        path: "/100096-customer-support/linemanager",
        element: <TicketDetail />,
      },
      {
        path: "/100096-customer-support/linemanager/ticketDetail/:ticketID",
        element: <TicketDetail />,
      },
    ],
  },
]);
export default router;
