/* eslint-disable react/prop-types */
//import { useEffect } from "react";

import { useEffect, useRef, useState } from "react";
//import { BsThreeDotsVertical } from "react-icons/bs";

//import CreateComponent from "./CreateComponent";

import { useDispatch, useSelector } from "react-redux";
import { fetchLineManagersData } from "../Redux/lineManager";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
//import { socket } from "../utils/Connection";
import io from "socket.io-client";
//import { fetchSelectedTicket } from "../Redux/ticketDetailSlice";
import TextInfo from "./TextInfo";
import useTicket from "./useTickets";
import { fetchTicketInfo, fetchTopicData } from "../Redux/ticketDetailSlice";
//import axios from "axios";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
function LineManager() {
  //console.log("socket", socket);
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  //const [isOpen, setIsOpen] = useState(false);
  //const [option, setOption] = useState("");
  console.log("ticket info.....", ticketInfo["George_Kibetest_product"]);
  const [loading, setLoading] = useState(true);
  const { ticketData } = useTicket();

  //console.log("ticket datass", ticketData["George_Kibetest_product"]);
  // const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0);

  //const [allTickets, setAllTickets] = useState([]);
  //const [ownerType, setOwnerType] = useState("");
  const ref = useRef();
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const lineManagersData = useSelector(
    (state) => state.lineManagers.lineManagersData
  );
  async function addWaitingTime() {
    //    console.log("waiting time", waitingTime);
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
      //    console.log("data", data);
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
  const handleNextClick = (datas) => {
    if (startIndex + 15 < datas.length) {
      setStartIndex(startIndex + 15);
    }
  };
  /*
  const findTicket = async (names) => {
    try {
      await socket.emit("get_tickets", {
        product: names,
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });
      await socket.on("ticket_response", (data) => {
        //    console.log("ticket response", data?.data);
        // Handle response for the event

        // console.log("ticket response", data["data"]);

        if (data?.status === "success" && data.operation === "get_ticket") {
          let datass = data?.data;
          setAllTickets([...allTickets, ...datass]);
          dispatch(fetchTicketInfo([...allTickets, ...datass]));
        } else {
          throw new Error("No ticket exist for the product yet");
        }
        //      console.log(ticketData);
      });
    } catch (error) {
      toast.warning(error.message);
    }
  };
*/
  const findTopic = async () => {
    //workSpaceID = "646ba835ce27ae02d024a902";
    // api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    try {
      // console.log(workSpaceID);
      await socket.emit("get_all_topics", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      await socket.on("setting_response", async (data) => {
        //  console.log("data to be shown", data);
        if (data.status === "success" && data.operation === "get_all_topics") {
          // console.log("topic data in useeffect", data?.data);
          // dispatch(fetchTopicData(data?.data));
          //  let datafound = await data?.data;
          /* for (var i = 0; i < datafound.length; i++) {
            // console.log("data found", datafound[i]);
            // console.log("data name", datafound[i].name);
            // findTicket(datafound[i].name);
            setProduct(datafound[i].name);
          }
*/
          dispatch(fetchTopicData(data?.data));
          //console.log("all ticket", allTickets);
          // setTopic(data?.data);
        }
      });
    } catch (error) {
      toast.error("Some thing went wrong.we will fix soon");
      console.error(error);
    }
  };

  const getAllLineManager = async () => {
    //workSpaceID = "646ba835ce27ae02d024a902";
    //api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    console.log("test id ===", lineManagerCredentials.workspace_id);
    getMetaSetting();
    /*console.log(
      "space id from dispatch",
      lineManagerCredentials.workspace_id,
      "api key from dispatch",
      lineManagerCredentials.api_key
    );*/

    try {
      await socket.emit("get_all_line_managers", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      await socket.on("setting_response", (data) => {
        if (data.operation === "get_all_line_managers") {
          // console.log("workspace_id", lineManagerCredentials.workspace_id);
          // console.log("api_key", lineManagerCredentials.api_key);
          // console.log("line managers data", data);
          // Handle response for the event
          setLoading(false);
          if (Array.isArray(data?.data)) {
            dispatch(fetchLineManagersData(data?.data));
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

    // Add event listener for window resize
  };

  useEffect(() => {
    if (lineManagerCredentials.workspace_id && lineManagerCredentials.api_key) {
      getAllLineManager();
    }
  }, []);

  useEffect(() => {
    /* console.log(
      "line managers===",
      lineManagerCredentials.workspace_id,
      lineManagerCredentials.api_key
    );*/
    if (lineManagerCredentials.workspace_id && lineManagerCredentials.api_key) {
      findTopic();
    }
  }, []);

  //const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  /*const openSearchModal = (Option) => {
    setOption(Option);
    setIsSearchModalOpen(true);
  };*/

  // const closeSearchModal = () => {
  //   setIsSearchModalOpen(false);
  // };
  // const options = [
  //   { label: "Create Line Manager", value: "createLineManager" },
  //   // { label: "Chat Line Manager", value: "chatLineManager" },
  //   { label: "Create Topic", value: "createTopic" },
  //   { label: "Generate Link", value: "generateLink" },
  // ];

  // const handleSelect = (option) => {
  //   // setSelectedOption(option);'
  //   // setIsOpen(false);
  //   openSearchModal(option.value);
  //   //  createTopic("login error", "1353343");
  // };

  /*const handleSelect = (option) => {
    // setSelectedOption(option);'
    // setIsOpen(false);
    openSearchModal(option.value);
    //  createTopic("login error", "1353343");
  };*/
  // const handleTicketClick = (data) => {
  //   dispatch(fetchSelectedTicket(data));
  // };
  //function getTicketsByDate() {}

  return (
    // <div className="font-sans flex justify-between h-auto sm:flex-col sm:pr-2 sm:w-full md:w-[95vw] md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2 m-5 ">
    <section>
      {/* {isSearchModalOpen && (
        <CreateComponent closeSearchModal={closeSearchModal} option={option} />
      )} */}
      <div className="bg-g w-[99%] flex-2 border  border-[#7E7E7E] shadow-md my-4 mt-16 ml-2 md:min-w-[500px]  rounded-md md:h-[660px] ">
        <table className="sm:h-[450px]  md:h-[450px]     overflow-y-scroll w-full">
          <thead>
            <tr className="bg-[#22C55E] border  border-[#7E7E7E] text-white uppercase rounded-t-md text-sm leading-normal flex flex-wrap ">
              <th className=" sm:p-auto sm:w-8 flex justify-center items-center text-center md:18  md:py-3 md:px-3  border-r border-r-[#7E7E7E]">
                SN
              </th>
              <th className="py-3 sm:max-w-[18%]   px-1  text-center  border-r  border-r-[#7E7E7E]">
                Line/Service Desk Name
              </th>
              <th className=" flex sm:max-w-[15%]  px-1  justify-center items-center text-center md:py-3  border-r border-r-[#7E7E7E]">
                Service Manager
              </th>
              <th className=" flex flex-1 justify-center items-center md:py-3 ">
                Tickets in waiting
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm  h-[350px] overflow-y-scroll font-light w-full flex flex-wrap">
            {lineManagersData.length > 0 &&
              lineManagersData?.map((data1, index) => (
                <tr
                  key={data1._id}
                  className="border-b border-[#7E7E7E] hover:bg-gray-100 sm:h-[100%] flex-1  "
                >
                  <td className="py-3 sm:w-8 border-r border-[#7E7E7E]   text-left sm:w-13  ">
                    {index + 1}
                  </td>
                  <td className="py-3 sm:max-w-[18%]    font-bold border-r border-[#7E7E7E] text-left">
                    <input
                      type="checkbox"
                      className="form-checkbox md:h-4   text-indigo-600 transition duration-150 ease-in-out"
                    />
                    Till-1 common
                  </td>
                  <td className="py-3  sm:max-w-[15%] border-r border-[#7E7E7E]   text-left   ">
                    {data1.user_id}
                    {console.log("user id ", data1.user_id)}
                  </td>
                  <td className="text-end w-[55%] flex-1  flex-wrap mx-auto   min-h-[350px]">
                    {console.log(
                      "ticketts",
                      fetchTicketInfo[
                        data1.user_id + selectedTopic.name
                          ? selectedTopic.name
                          : ""
                      ],
                      "product ticket",
                      `${
                        data1.user_id +
                        (selectedTopic.name ? selectedTopic.name : "")
                      }`
                    )}
                    <div className="flex justify-center w-full  items-start flex-wrap gap-1 mx-auto text-center ">
                      <TextInfo
                        ticketInfo={
                          ticketInfo[
                            `${
                              data1.user_id +
                              (selectedTopic.name ? selectedTopic.name : "")
                            }`
                          ]
                        }
                        data1={data1}
                        handleNextClick={() =>
                          handleNextClick(
                            ticketInfo[
                              `${
                                data1.user_id +
                                (selectedTopic.name !== undefined
                                  ? selectedTopic.name
                                  : "")
                              }`
                            ]
                          )
                        }
                        handlePrevClick={handlePrevClick}
                        startIndex={startIndex}
                      />
                    </div>

                    <div className="flex  flex-col align-start justify-end pt-1 pl-8    h-auto w-full  ">
                      <div className="flex  flex-col align-middle justify-start pt-1   h-auto w-full  gap-x-2">
                        <span className="text-md text-sm ">
                          <span className="font-bold gap-2 flex justify-center items-center w-full text-center text-md">
                            {waitingTime *
                              (ticketData[
                                `${data1.user_id}${selectedTopic.name ?? ""}`
                              ]?.filter((ticket) => !ticket?.is_closed).length -
                                1 >=
                              0
                                ? ticketData[
                                    `${data1.user_id}${
                                      selectedTopic.name ?? ""
                                    }`
                                  ]?.filter((ticket) => !ticket?.is_closed)
                                    .length - 1
                                : 0)}{" "}
                            Waiting Time
                            {/* {waitingTime} Waiting Time, */}
                          </span>
                        </span>
                        {/* <span className="text-md">
                        Service time &lt; {data1.average_serving_time}
                      </span> */}
                        <div className="flex justify-between gap-5 items-end  min-h-10 ">
                          <p className="text-md text-sm  ">
                            <span className="font-bold gap-2 flex justify-center items-center w-full text-center text-md">
                              {/* {data1.ticket_count} Waiting, */}
                            </span>
                          </p>
                          <div className="flex justify-end gap-5 items-end  min-h-10">
                            <div className="flex justify-center items-center gap-2 ">
                              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                              <p className="text-blue-400 font-bold">Open</p>
                            </div>
                            <div className="flex justify-center items-center gap-2 ">
                              <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                              <p className="text-red-400 font-bold">Closed</p>
                            </div>
                          </div>
                        </div>
                        {/* <span className="text-md">]</span> */}
                      </div>
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
          {/* {console.log("owner type", lineManagerCredentials.ownerType)} */}
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
            {/* {lineManagerCredentials.ownerType === false &&
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
                ))} */}
            {/* {lineManagerCredentials.ownerType === true &&
              options.map((option) => (
                <button
                  key={option.value}
                  className="bg-white border border-[#22694de1] font-sans text-sm text-[#22694de1] hover:bg-green-700 hover:text-white font-bold py-2 px-2 md:w-27 rounded-md"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              ))} */}
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
    </section>
  );
}

export default LineManager;
