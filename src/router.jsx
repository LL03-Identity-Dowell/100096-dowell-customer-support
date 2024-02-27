import { createBrowserRouter } from "react-router-dom";
import TicketDetail from "./components/TicketDetail";
import App from "./App";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <TicketDetail />,
      },
      {
        path: "/ticketDetail/:ticketID",
        element: <TicketDetail />,
      },
    ],
  },
]);
export default router;
