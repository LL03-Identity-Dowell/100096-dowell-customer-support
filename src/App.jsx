import { Route, Routes } from "react-router-dom";
import CreateTicket from "./components/CreateTicket";
import SigninForm from "./components/shared/SigninForm";

export default function App() {
  return (
    <>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route index element={<CreateTicket />} />
          <Route
            path="/100096-dowell-customer-support/sign-in"
            element={<SigninForm />}
          />
        </Routes>
      </div>
    </>
  );
}
