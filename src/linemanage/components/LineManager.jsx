/* eslint-disable react/prop-types */
//import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import CreateComponent from "./CreateComponent";

import { useDispatch, useSelector } from "react-redux";
import { fetchLineManagersData } from "../Redux/lineManager";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
//import { socket } from "../utils/Connection";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
function LineManager({ api_key, workspace_id }) {
  const basePath = "/linemanage/ticketDetail";
  console.log("socket", socket);
  const dispatch = useDispatch();
  const lineManagersData = useSelector(
    (state) => state.lineManagers.lineManagersData
  );
  //const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    const getAllLineManager = async (workSpaceID, api_key) => {
      workSpaceID = "646ba835ce27ae02d024a902";
      api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      try {
        await socket.emit("get_all_line_managers", {
          workspace_id: workSpaceID,
          api_key: api_key,
        });
        await socket.on("setting_response", (data) => {
          // Handle response for the event
          setLoading(false);
          dispatch(fetchLineManagersData(data.data));
          console.log("all line manager data", data);
          if (data?.status === "failure") {
            toast.warning("data not found");
          }
        });
      } catch (error) {
        console.log(error.data);
        toast.warning(error.data);
      }
    };

    try {
      getAllLineManager(20, 50);
    } catch (error) {
      console.log(error);
    }

    // Add event listener for window resize
  }, []);
  useEffect(() => {
    // async () => {
    //   await getLineManagerMember();
    // };
  });
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
    { label: "Chat Line Manager", value: "chatLineManager" },
    { label: "Create Topic", value: "createTopic" },
    { label: "Generate Link", value: "generateLink" },
  ];

  const handleSelect = (option) => {
    // setSelectedOption(option);'
    setIsOpen(false);
    openSearchModal(option.value);
    //  createTopic("login error", "1353343");
  };

  return (
    // <div className="font-sans flex justify-between h-auto sm:flex-col sm:pr-2 sm:w-full md:w-[95vw] md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2 m-5 ">
    <>
      {isSearchModalOpen && (
        <CreateComponent
          closeSearchModal={closeSearchModal}
          option={option}
          api_key={api_key}
          workspace_id={workspace_id}
        />
      )}
      <div className="bg-white w-full flex-2 shadow-md my-4 mt-12 ml-2 md:min-w-[500px]  rounded-lg  border-2 border-gray-200">
        <table className="sm:h-[450px] md:h-[450px] overflow-y-scroll w-full">
          <thead>
            <tr className="bg-[#22694de1] text-white uppercase text-sm leading-normal flex flex-wrap ">
              <th className=" sm:p-auto sm:w-16 md:18 md:py-3 md:px-6 text-left border-r-2 border-r-[#1a543ee1]">
                SN
              </th>
              <th className="py-3 px-6 text-left   flex-1  border-r-2 border-r-[#1a543ee1]">
                Line/Service Desk Name
              </th>
              <th className="sm:p-auto flex-1 md:py-3 md:px-6 text-left border-r-2 border-r-[#1a543ee1]">
                Service Manager
              </th>
              <th className="sm:p-auto flex-1 md:py-3 md:px-6 text-left">
                Tickets in waiting
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm sm:h-[300px] md:h-[350px] overflow-y-scroll font-light w-full flex flex-wrap">
            {console.log("line managers data from dispatch", lineManagersData)}
            {lineManagersData?.map((data, index) => (
              <tr
                key={data._id}
                className="border-b border-gray-200 hover:bg-gray-100  flex w-full"
              >
                <td className="py-3 px-6 text-left sm:w-13 md:15 ">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left flex-1 sm:w-20 flex-wrap">
                  <input
                    type="checkbox"
                    className="form-checkbox md:h-4 md:w-4 md:mr-2 sm:h-3 sm:w-3 sm:mr-1 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  Till-1 common
                </td>
                <td className="py-3 px-6 text-left flex-1 sm:w-15">
                  {data.user_id}
                </td>
                <td className="py-3 px-6 text-left flex flex-wrap flex-1 h-auto sm:w-[95%] p-1">
                  <div className="flex justify-start flex-wrap gap-3 h-auto">
                    <div className="bg-blue-200 rounded-sm p-2"></div>
                    <div className="bg-green-200 rounded-sm p-2"></div>
                    <div className="bg-green-200 rounded-sm p-2"></div>
                    <div className="bg-green-200 rounded-sm p-2"></div>
                  </div>
                  <div className="flex flex-col align-middle mt-1 h-auto w-full">
                    {/* <span className="text-md text-green-900">[</span> */}
                    <span className="text-md">
                      {data.ticket_count} &gt; Waiting,
                    </span>
                    <span className="text-md">
                      Service time &lt; {data.average_serving_time}
                    </span>
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
        <div className="flex justify-center items-center my-10">
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">
            &lt;
          </button>{" "}
          {/* Backward button */}
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
          {/* Forward button */}
        </div>
        <div className="flex justify-center gap-4 mb-7 w-full pr-3">
          <div className="mr-auto w-full flex justify-center gap-5">
            <button className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
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
            </button>

            <div
              className="cursor-pointer pt-2 text-lg relative "
              onClick={() => setIsOpen(!isOpen)}
            >
              <BsThreeDotsVertical />

              {isOpen && (
                <div
                  className="absolute z-10 mt-1 ml-4 w-56 bg-white rounded-md shadow-lg "
                  style={{ transform: "translateY(-100%)" }}
                >
                  {options.map((option) => (
                    <button
                      key={option.value}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleSelect(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Chat Manager
            </button> */}
            </div>
          </div>
          {/* <button className="bg-red-400 ml-auto hover:bg-red-500 text-white font-bold py-1.5 px-2 rounded-lg ">
            Logout
          </button> */}
        </div>
      </div>
      {/* ticket detail */}

      {/* <TicketDetail /> */}
      {/* </div> */}
    </>
  );
}

export default LineManager;
