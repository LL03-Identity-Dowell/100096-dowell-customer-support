/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

//import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavItem from "./components/NavItem";
import { Loader } from "../components/Loader";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./Redux/store";
import axios from "axios";
import Dashboards from "./components/Dashboard";
import { fetchLineManagersCredentails } from "./Redux/lineManager";
import "./index.css";
function App() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  let session_id = searchParams.get("session_id");

  const id = searchParams.get("id");
  //const [dataFetched, setDataFetched] = useState(false);
  const [loadingFetchUserInfo, setLoadingFetchUserInfo] = useState(false);
  const [authenticationError, setAuthenticationError] = useState(false);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const Dashboard = React.memo(Dashboards);
  const [ownerType, setOwnerType] = useState(() => {
    const savedOwnerType = localStorage.getItem("ownerType");
    return savedOwnerType && savedOwnerType !== "undefined"
      ? JSON.parse(savedOwnerType)
      : true;
  });
  const savedSession = localStorage.getItem("session");
  const session =
    savedSession && savedSession !== "undefined"
      ? JSON.parse(savedSession)
      : null;

  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    //  console.log("saved api key", typeof savedApiKey);
    return savedApiKey && savedApiKey !== "undefined"
      ? JSON.parse(savedApiKey)
      : null;
  });

  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = localStorage.getItem("userInfo");

    return savedUserInfo && savedUserInfo !== "undefined"
      ? JSON.parse(savedUserInfo)?.userinfo
      : null;
  });
  if (!session_id) {
    if (!session) {
      window.location.replace(
        "https://100014.pythonanywhere.com/?redirect_url=https://www.dowellchat.uxlivinglab.online"
      );
    } else {
      session_id = session;
    }
  }
  const getUserInfo = async (url, type) => {
    setLoadingFetchUserInfo(true);
    // console.log("url", url);
    //const session_id = searchParams.get("session_id");
    //console.log("session_id==", session_id);
    await axios
      .post(`${url}`, {
        session_id: session_id,
      })

      .then((response) => {
        //console.log("response in then", response?.data);
        if (type === "other") {
          let responseData = response?.data?.portfolio_info?.findIndex(
            (item) =>
              item.member_type === "owner" &&
              item.product === "Dowell Customer Support Centre"
          );

          if (responseData === -1) {
            localStorage.setItem("ownerType", JSON.stringify(false));
            setOwnerType(false);
          } else {
            localStorage.setItem("ownerType", JSON.stringify(true));
            setOwnerType(true);
          }
        }
        setUserInfo(response?.data?.userinfo);
        //setPortfolioCode(response?.data?.portfolio_info?.find())
        //  console.log("response data user detail", response?.data);
        localStorage.setItem("userInfo", JSON.stringify(response?.data));
        // setSession(session_id);
        localStorage.setItem("session", JSON.stringify(session_id));
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
      //console.log("api key data", responseData?.data?.api_key);
      setApiKey(responseData?.data?.api_key);
    } catch (error) {
      console.error("Fetch Api Key Error", error.message);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      if (!session_id) {
        window.location.href =
          // "https://100014.pythonanywhere.com/?redirect_url=" +
          `https://www.dowellchat.uxlivinglab.online/`; //`${window.location.href}`;
        return;
      } else if (!id) {
        console.log("owner enterred");
        getUserInfo("https://100014.pythonanywhere.com/api/userinfo/", "owner");
      } else {
        console.log("user enterred");
        getUserInfo("https://100093.pythonanywhere.com/api/userinfo/", "other");
      }
    }
    if (userInfo && !apiKey) {
      fetchApiKey();
    }
    console.log("outer if");
    if (userInfo && apiKey && session_id) {
      console.log(
        "api key",
        apiKey,
        "user info in to dispatch in if",
        userInfo?.client_admin_id,
        "session info in pp",
        session_id
      );
      // const ownerType = localStorage.getItem("ownerType");

      dispatch(
        fetchLineManagersCredentails({
          api_key: apiKey,
          username: userInfo.username,
          workspace_id: userInfo.client_admin_id,
          session_id: session_id,
          // portfolio_code:
          ownerType: ownerType,
        })
      );
    }
    // console.log("api", apiKey, "user info", userInfo?.client_admin_id);
    //}
  }, [session_id, apiKey, userInfo]);

  return (
    <section>
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
        {console.log(
          "in jsx workspace id",
          lineManagerCredentials.workspace_id,
          "session id",
          session_id,
          "api key",
          lineManagerCredentials.api_key
        )}
        {loadingFetchUserInfo ? (
          <Loader />
        ) : lineManagerCredentials.workspace_id &&
          lineManagerCredentials.api_key &&
          lineManagerCredentials.session_id ? (
          <Dashboard />
        ) : authenticationError ? (
          "Authentication Failed"
        ) : (
          ""
        )}
      </Provider>
    </section>
  );
}

export default App;
