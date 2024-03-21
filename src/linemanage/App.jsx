/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
//import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavItem from "./components/NavItem";
import { Loader } from "../components/Loader";

import "./index.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./Redux/store";

import axios from "axios";
import Dashboards from "./components/Dashboard";
import { fetchLineManagersCredentails } from "./Redux/lineManager";

function App() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loadingFetchUserInfo, setLoadingFetchUserInfo] = useState(false);
  const [authenticationError, setAuthenticationError] = useState(false);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );

  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    return savedApiKey ? JSON.parse(savedApiKey) : null;
  });
  //const [portfolioCode, setPortfolioCode]=useState("");
  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  });

  const getUserInfo = async () => {
    setLoadingFetchUserInfo(true);
    const session_id = searchParams.get("session_id");
    axios
      .post("https://100014.pythonanywhere.com/api/userinfo/", {
        session_id: session_id,
      })

      .then((response) => {
        setUserInfo(response?.data?.userinfo);
        //setPortfolioCode(response?.data?.portfolio_info?.find())
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response?.data?.userinfo)
        );
        setLoadingFetchUserInfo(false);
      })
      .catch((error) => {
        setLoadingFetchUserInfo(false);
        setAuthenticationError(true);
        console.error("Error:", error);
      });
  };

  const fetchApiKey = async () => {
    const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${userInfo?.client_admin_id}`;

    try {
      const response = await fetch(apiUrl);
      const responseData = await response.json();
      localStorage.setItem(
        "apiKey",
        JSON.stringify(responseData?.data?.api_key)
      );
      setApiKey(responseData?.data?.api_key);
    } catch (error) {
      console.error("Fetch Api Key Error", error.message);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      if (!session_id) {
        window.location.href =
          "https://100014.pythonanywhere.com/?redirect_url=" +
          `${window.location.href}`;
        return;
      }
      getUserInfo();
    }

    if (userInfo && !apiKey) {
      fetchApiKey();
    }
    if (userInfo && apiKey) {
      dispatch(
        fetchLineManagersCredentails({
          api_key: apiKey,
          username: userInfo?.username,
          workspace_id: userInfo?.client_admin_id,
          session_id: session_id,
          // portfolio_code:
        })
      );
      console.log("api", apiKey, "user info", userInfo?.client_admin_id);
    }
  }, [session_id, userInfo]);

  /////console.log("api key from app0", lineManagerCredentials.api_key);
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
        {loadingFetchUserInfo ? (
          <Loader />
        ) : lineManagerCredentials.workspace_id &&
          lineManagerCredentials.api_key ? (
          <Dashboards />
        ) : authenticationError ? (
          "Authentication Failed"
        ) : (
          ""
        )}
      </Provider>
    </>
  );
}

export default App;
