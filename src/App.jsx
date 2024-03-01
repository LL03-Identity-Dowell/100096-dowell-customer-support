import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TicketDetail from "./linemanage/components/TicketDetail";
import AppLine from "./linemanage/App";
import SigninForm from "./components/shared/SigninForm";
import CreateTicket from "./components/CreateTicket";

const basePath = "/100096-dowell-customer-support/linemanage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={`${basePath}`}
          element={
            <>
              <Route path="/" element={<AppLine />} />
              <Route
                path="/ticketDetail/:ticketID"
                element={<TicketDetail />}
              />
            </>
          }
        />
        <Route
          path={`/100096-dowell-customer-support/`}
          element={
            <>
              <Route path="/" element={<CreateTicket />} />
              <Route path="/sign-in" element={<SigninForm />} />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
