/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NavItem from "./components/NavItem";
import { Loader } from "../components/Loader";

import "./index.css";
import axios from 'axios';

function App() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [loadingFetchUserInfo, setLoadingFetchUserInfo] = useState(false)
  const [authenticationError, setAuthenticationError] = useState(false)
  
  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  })

  const getUserInfo = async () => {
    setLoadingFetchUserInfo(true);
    const session_id = searchParams.get("session_id");
    axios
      .post("https://100014.pythonanywhere.com/api/userinfo/", {
        session_id: session_id
      })

      .then((response) => {
        setUserInfo(response?.data?.userinfo);
        localStorage.setItem(
              'userInfo',
              JSON.stringify(response?.data?.userinfo)
            );
        setLoadingFetchUserInfo(false);
      })
      .catch((error) => {
        setLoadingFetchUserInfo(false);
        setAuthenticationError(true)
        console.error("Error:", error);
      });
  };


  useEffect(() => {
    if (!userInfo) {
      if (!session_id) {
        window.location.href =
          "https://100014.pythonanywhere.com/?redirect_url=" +
          `${window.location.href}`;
        return;
      }
      getUserInfo()
    }
  }, [session_id, userInfo]);

  return (
    <>
      <NavItem />
      { 
        loadingFetchUserInfo ? <Loader /> : 
        userInfo ? <Dashboard /> :
        authenticationError ? "Authentication Failed" :
        ""
      }
      
    </>
  );
}

export default App;
