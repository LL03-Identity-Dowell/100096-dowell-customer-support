import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavItem from "./components/NavItem";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
function App() {
  return (
    <>
      <Provider store={store}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <NavItem />
        <Dashboard />;
      </Provider>
    </>
  );
}

export default App;
