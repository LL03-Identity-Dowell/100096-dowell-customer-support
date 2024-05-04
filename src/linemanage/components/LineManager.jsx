/* eslint-disable react/prop-types */
//import { useEffect } from "react";

import { useEffect, useState } from "react";
//import { BsThreeDotsVertical } from "react-icons/bs";

import CreateComponent from "./CreateComponent";

import { useDispatch, useSelector } from "react-redux";
import { fetchLineManagersData } from "../Redux/lineManager";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
//import { socket } from "../utils/Connection";
import io from "socket.io-client";
import { fetchSelectedTicket } from "../Redux/ticketDetailSlice";
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
  //const [ownerType, setOwnerType] = useState("");
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const lineManagersData = useSelector(
    (state) => state.lineManagers.lineManagersData
  );

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

  //const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const openSearchModal = (Option) => {
    setOption(Option);
    setIsSearchModalOpen(true);
  };

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
  // const handleTicketClick = (data) => {
  //   dispatch(fetchSelectedTicket(data));
  // };
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
          <tbody className="text-gray-600 text-sm border border-t-0   border-[#7E7E7E]  h-[350px] overflow-y-scroll font-light w-full flex flex-wrap">
            {console.log("line managers data  from dispatch", lineManagersData)}
            {lineManagersData.length > 0 &&
              lineManagersData?.map((data1, index) => (
                <tr
                  key={data1._id}
                  className="border-b border-[#7E7E7E] hover:bg-gray-100 sm:h-[58%] flex-1 "
                >
                  <td className="py-3 sm:w-8 border-r border-[#7E7E7E]   text-left sm:w-13  ">
                    {index + 1}
                  </td>
                  <td className="py-3 sm:max-w-[18%]    font-bold border-r border-[#7E7E7E]     text-left    ">
                    <input
                      type="checkbox"
                      className="form-checkbox md:h-4   text-indigo-600 transition duration-150 ease-in-out"
                    />
                    Till-1 common
                  </td>
                  <td className="py-3  sm:max-w-[15%] border-r border-[#7E7E7E]   text-left   ">
                    {data1.user_id}
                  </td>
                  <td className="text-center  flex-1  flex-wrap   min-h-[350px]">
                    <div className="flex justify-center flex-1  items-start flex-wrap gap-1 mx-auto text-center ">
                      <TextInfo
                        ticketInfo={ticketInfo}
                        data1={data1}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                        startIndex={startIndex}
                      />
                    </div>

                    <div className="flex  flex-col align-start justify-end pt-1 pl-8    h-auto w-full  ">
                      {/* <span className="text-md">
                        Service time &lt; {data1.average_serving_time}
                      </span> */}
                      <div className="flex justify-between gap-5 items-end  min-h-10 ">
                        <p className="text-md text-sm  ">
                          <span className="font-bold gap-2 flex justify-center items-center w-full text-center text-md">
                            {data1.ticket_count} Waiting,
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
