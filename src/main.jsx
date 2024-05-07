import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { Provider } from "react-redux";
import { store } from "./linemanage/Redux/store.js";
import "./index.css";
import "./App.css";
import { CreateTicketProvider } from "./context/CreateTicketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <CreateTicketProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </CreateTicketProvider>
  //  </React.StrictMode>
);
