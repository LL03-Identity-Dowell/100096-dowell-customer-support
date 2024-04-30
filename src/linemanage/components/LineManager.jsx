/* eslint-disable react/prop-types */
//import { useEffect } from "react";

import { useEffect, useRef, useState } from "react";
//import { BsThreeDotsVertical } from "react-icons/bs";

import CreateComponent from "./CreateComponent";

import { useDispatch, useSelector } from "react-redux";
import { fetchLineManagersData } from "../Redux/lineManager";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
//import { socket } from "../utils/Connection";
import io from "socket.io-client";
//import { fetchSelectedTicket } from "../Redux/ticketDetailSlice";
import TextInfo from "./TextInfo";
//import axios from "axios";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
function LineManager() {
  //console.log("socket", socket);
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);
  //const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);
  //const [ownerType, setOwnerType] = useState("");
  const ref = useRef();
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const lineManagersData = useSelector(
    (state) => state.lineManagers.lineManagersData
  );
  async function addWaitingTime() {
    console.log("waiting time", waitingTime);
    if (!ref.current.value || ref.current.value.waitingTime <= 0) {
      return;
    }
    function createMetaSetting() {
      const lineData = {
        waiting_time: parseInt(ref.current.value),
        operation_time: "12s",
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,

        created_at: new Date().toISOString(),
      };

      socket.emit("create_meta_setting", lineData);
    }
    createMetaSetting();
    getMetaSetting();
    // await socket.on("setting_response", (data) => {
    //   console.log("datas", data);
    //   // Handle response for the event
    //   // console.log("data", data?.data[0].waiting_time);
    //   if (data.operation === "get_meta_setting") {
    //     setWaitingTime(data?.data[0]?.waiting_time);
    //   }
    // });
  }
  async function getMetaSetting() {
    await socket.emit("get_meta_setting", {
      // workspace_id: "63cf89a0dcc2a171957b290b"
      //  api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
      workspace_id: lineManagerCredentials.workspace_id,
      api_key: lineManagerCredentials.api_key,
    });
  }
  socket.on("setting_response", (data) => {
    // Handle response for the event
    // console.log("data", data?.data[0].waiting_time);
    if (data.operation === "get_meta_setting") {
      setWaitingTime(data?.data[0]?.waiting_time);
      console.log("data", data);
    }
  });
  // const [navIndex, setNavIndex] = useState(0);

  //const [currentPage, setCurrentPage] = useState(0);
  //const itemsPerPage = 15; // 3 rows * 5 columns = 15 items per page

  //const totalPages = Math.ceil(ticketInfo.length / itemsPerPage);

  // const handleNextPage = () => {
  //   setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  //   setNavIndex(navIndex + 15);
  // };

  // const handlePrevPage = () => {
  //   setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  // };

  const handlePrevClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 15);
    }
  };
  const handleNextClick = () => {
    if (startIndex + 15 < ticketInfo.length) {
      setStartIndex(startIndex + 15);
    }
  };

  useEffect(() => {
    getMetaSetting();
    const getAllLineManager = async () => {
      //workSpaceID = "646ba835ce27ae02d024a902";
      //api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      console.log(
        "space id from dispatch",
        lineManagerCredentials.workspace_id,
        "api key from dispatch",
        lineManagerCredentials.api_key
      );

      try {
        /*let response = await axios.post(
          "https://100093.pythonanywhere.com/api/userinfo/",
          {
            session_id: lineManagerCredentials.session_id, //"okms05yhlfj6xl7jug9b6f6lyk8okb8o",
          }
        );
        console.log("data =", response.data);
        /* let responseData = await response?.data?.portfolio_info?.findIndex(
          (item) =>
            item.member_type === "owner" &&
            item.product === "Dowell Customer Support Centre"
        );

        if (responseData === -1) {
          setOwnerType(false);
        } else {
          setOwnerType(true);
        }*/
        //console.log

        await socket.emit("get_all_line_managers", {
          workspace_id: lineManagerCredentials.workspace_id,
          api_key: lineManagerCredentials.api_key,
        });

        await socket.on("setting_response", (data) => {
          if (data.operation === "get_all_line_managers") {
            console.log("workspace_id", lineManagerCredentials.workspace_id);
            console.log("api_key", lineManagerCredentials.api_key);
            console.log("line managers data", data);
            // Handle response for the event
            setLoading(false);
            if (Array.isArray(data?.data)) {
              dispatch(fetchLineManagersData(data.data));
            }
            //console.log("all line manager data", data);
            if (data?.status === "failure") {
              toast.warning("Line manager in this workspace is not found", {
                toastId: "success1",
              });
            }
          }
        });
      } catch (error) {
        console.log(error.data);
        toast.warning(error.data);
      }
    };

    try {
      getAllLineManager();
    } catch (error) {
      console.log(error);
    }

    // Add event listener for window resize
  }, []);

  // useEffect(() => {

  // }, []);

  //const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const openSearchModal = (Option) => {
    setOption(Option);
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };
  const options = [
    { label: "Create Line Manager", value: "createLineManager" },
    // { label: "Chat Line Manager", value: "chatLineManager" },
    { label: "Create Topic", value: "createTopic" },
    { label: "Generate Link", value: "generateLink" },
  ];

  const handleSelect = (option) => {
    // setSelectedOption(option);'
    // setIsOpen(false);
    openSearchModal(option.value);
    //  createTopic("login error", "1353343");
  };
  // const handleTicketClick = (data) => {
  //   dispatch(fetchSelectedTicket(data));
  // };
  return (
    // <div className="font-sans flex justify-between h-auto sm:flex-col sm:pr-2 sm:w-full md:w-[95vw] md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2 m-5 ">
    <>
      {isSearchModalOpen && (
        <CreateComponent closeSearchModal={closeSearchModal} option={option} />
      )}
      <div className="bg-white w-full flex-2 shadow-md my-4 mt-12 ml-2 md:min-w-[500px]  rounded-lg  border-2 border-gray-200">
        <table className="sm:h-[450px] md:h-[450px] overflow-y-scroll w-full">
          <thead>
            <tr className="bg-[#22694de1] text-white uppercase text-sm leading-normal flex flex-wrap ">
              <th className=" sm:p-auto sm:w-12 flex justify-center items-center text-center md:18  md:py-3 md:px-3  border-r-2 border-r-[#1a543ee1]">
                SN
              </th>
              <th className="py-3  px-1  text-left flex-1 border-r-2 border-r-[#1a543ee1]">
                Line/Service Desk Name
              </th>
              <th className="sm:p-auto flex  flex-1 justify-center items-center text-center md:py-3 px-1  border-r-2 border-r-[#1a543ee1]">
                Service Manager
              </th>
              <th className="sm:p-auto flex flex-1 justify-center items-center md:py-3 px-20 text-left">
                Tickets in waiting
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm  h-[350px] overflow-y-scroll font-light w-full flex flex-wrap">
            {console.log("line managers data from dispatch", lineManagersData)}
            {lineManagersData.length > 0 &&
              lineManagersData?.map((data1, index) => (
                <tr
                  key={data1._id}
                  className="border-b border-gray-200 hover:bg-gray-100 sm:h-[60%] flex-1 "
                >
                  <td className="py-3 sm:w-12  px-3 text-left sm:w-13 md:15 ">
                    {index + 1}
                  </td>
                  <td className="py-3 w-[22%]   px-3  text-left flex-1   flex-wrap">
                    <input
                      type="checkbox"
                      className="form-checkbox md:h-4 md:w-4 md:mr-2 sm:h-3 sm:w-3 sm:mr-1 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    Till-1 common
                  </td>
                  <td className="py-3 px-3 w-[23%]   text-left  sm:w-15">
                    {data1.user_id}
                  </td>
                  <td className="text-end w-[55%] flex-1  flex-wrap mx-auto   min-h-[350px]">
                    {console.log(ticketInfo)}
                    <div className="flex justify-center w-full  items-start flex-wrap gap-1 mx-auto text-center ">
                      <TextInfo
                        ticketInfo={ticketInfo}
                        data1={data1}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        startIndex={startIndex}
                      />
                    </div>

                    <div className="flex  flex-col align-middle justify-start pt-1   h-auto w-full  gap-x-2">
                      <span className="text-md text-sm ">
                        <span className="font-bold gap-2 flex justify-center items-center w-full text-center text-md">
                          {waitingTime} Waiting Time
                          {/* {waitingTime} Waiting Time, */}
                        </span>
                      </span>
                      {/* <span className="text-md">
                        Service time &lt; {data1.average_serving_time}
                      </span> */}
                      <div className="flex justify-between items-center ">
                        {" "}
                        <p className="text-green-500 text-sm">
                          blue ticket-active
                        </p>
                        <p className="text-red-400 text-sm ">
                          red ticket-closed
                        </p>
                      </div>
                      {/* <span className="text-md">]</span> */}
                    </div>
                  </td>
                </tr>
              ))}
            {loading ? (
              <div className="d-flex mt-3 justify-center align-items-center mx-auto">
                <ClipLoader
                  color={"#22694de1"}
                  css={{
                    display: "block",
                    margin: "0 auto",
                    width: "50px",
                    height: "50px",
                  }}
                  size={30}
                />{" "}
                Loading
              </div>
            ) : (
              ""
            )}
          </tbody>
        </table>
        {/* <div className="flex justify-center items-center my-10">
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">
            &lt;
          </button>{" "}
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1  rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`${basePath}/1`}
          >
            1
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1   rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`${basePath}/2`}
          >
            2
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1  rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`${basePath}/3`}
          >
            3
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1  rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`${basePath}/4`}
          >
            4
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1   rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`${basePath}/5`}
          >
            5
          </NavLink>
          <NavLink className="px-3 py-1 bg-gray-200 rounded-md">&gt;</NavLink>{" "}
        </div> */}
        <div className="flex flex-col justify-center gap-4 mb-7 w-full mt-8 pr-3">
          {console.log("owner type", lineManagerCredentials.ownerType)}
          {lineManagerCredentials.ownerType === true ? (
            <h3 className="w-[80%] text-center mx-auto items-center ">
              Setting for your customers!
            </h3>
          ) : lineManagerCredentials.ownerType === false ? (
            <h3 className="w-[80%] text-center mx-auto items-center ">
              Create topic and link for your customers!
            </h3>
          ) : (
            ""
          )}

          <hr className="w-[80%] text-center mx-auto items-center " />
          <div className="mr-auto w-full flex justify-center gap-5">
            {/* <button className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Close Line
            </button>
            <button className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Split line
            </button>
            <button className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Merge line
            </button>
            <button className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Serve line
            </button> */}

            {/* <div
              className="cursor-pointer pt-2 text-lg relative "
              // onClick={() => setIsOpen(!isOpen)}
            > */}
            {/* <BsThreeDotsVertical />

              {isOpen && ( */}
            {/* <div
              className="absolute z-10 mt-1 ml-4 w-56 bg-white rounded-md shadow-lg "
              style={{ transform: "translateY(-100%)" }}
            > */}
            {lineManagerCredentials.ownerType === false &&
              options
                .filter(
                  (option) =>
                    option.value === "createTopic" ||
                    option.value === "generateLink"
                )
                .map((option) => (
                  <button
                    key={option.value}
                    className="bg-white border border-[#22694de1] font-sans text-sm text-[#22694de1] hover:bg-green-700 hover:text-white font-bold py-2 px-2 md:w-27 rounded-md"
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </button>
                ))}
            {lineManagerCredentials.ownerType === true &&
              options.map((option) => (
                <button
                  key={option.value}
                  className="bg-white border border-[#22694de1] font-sans text-sm text-[#22694de1] hover:bg-green-700 hover:text-white font-bold py-2 px-2 md:w-27 rounded-md"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              ))}
          </div>
          <div className="flex gap-1 w-[80%] h-auto mt-3 mx-auto">
            <input
              type="number"
              ref={ref}
              id="waitingTimeInput"
              className="w-10 h-7
                          border border-[#4c8670e1] rounded
                          "
            />
            <button
              className="w-[100px] p-1 rounded h-7 text-white flex bg-[#1a543ee1] hover:bg-[#2d755ae1]"
              onClick={() => addWaitingTime()}
            >
              <small>Add Waiting</small>
            </button>
          </div>

          {/* <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Chat Manager
            </button> */}
          {/* </div> */}
        </div>
        {/* <button className="bg-red-400 ml-auto hover:bg-red-500 text-white font-bold py-1.5 px-2 rounded-lg ">
            Logout
          </button> */}
      </div>
      {/* </div> */}
      {/* ticket detail */}

      {/* <TicketDetail /> */}
      {/* </div> */}
    </>
  );
}

export default LineManager;
