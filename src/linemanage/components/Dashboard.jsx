//import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import io from "socket.io-client";
import CreateComponent from "./CreateComponent";
import Dropdowns from "./Search";
import { ToastContainer } from "react-toastify";
function Dashboard() {
  const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
  const basePath = "/100096-dowell-customer-support/linemanage/ticketDetail";
  console.log("socket", socket);

  //const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState("");
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
    {
      label: "Get All Line Manager ",
      value: "getAllLineManager",
    },
  ];

  const handleSelect = (option) => {
    // setSelectedOption(option);
    setIsOpen(false);
    openSearchModal(option.value);
    //  createTopic("login error", "1353343");
  };
  /*
  const createLineManager = async (
    user_id,
    api_key,
    positions_in_a_line,
    average_serving_time,
    ticket_count,
    workspace_id,
    created_at
  ) => {
    await socket.emit("create_line_manager", {
      user_id: user_id,
      positions_in_a_line: positions_in_a_line,
      average_serving_time: average_serving_time,
      ticket_count: ticket_count,
      workspace_id: workspace_id,
      api_key: api_key,
      created_at: created_at,
    });
    await socket.on("setting_response", (data) => {
      // Handle response for the event
      console.log(data);
    });
  };
*/
  /*
  const geAllLineManagers = async (workspaceid, api_key) => {
    await socket.emit("get_all_line_managers", {
      workspace_id: workspaceid,
      api_key: api_key,
    });
    await socket.on("setting_response", (data) => {
      // Handle response for the event
      console.log(data);
    });
  };


  */
  return (
    <div className="font-sans flex justify-between sm:flex-col sm:pr-2 sm:w-full md:w-[95vw] md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2 m-5 ">
      <ToastContainer
        position="top-right"
        autoClose={5000} // Adjust according to your preference
        hideProgressBar={false} // You can toggle this as per your design
        newestOnTop={false} // Set to true if you want newer toasts to appear on top
        closeOnClick
        rtl={false} // Set to true if you are using right-to-left language support
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {isSearchModalOpen && (
        <CreateComponent closeSearchModal={closeSearchModal} option={option} />
      )}
      <div className="bg-white w-full flex-2 shadow-md my-4 mt-12 ml-2 md:min-w-[500px] rounded-lg  border-2 border-gray-200">
        <table className="h-auto w-full ">
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
          <tbody className="text-gray-600 text-sm font-light w-full flex flex-wrap">
            <tr className="border-b border-gray-200 hover:bg-gray-100  flex w-full">
              <td className="py-3 px-6 text-left sm:w-13 md:15 ">1</td>
              <td className="py-3 px-6 text-left flex-1 sm:w-20 flex-wrap">
                <input
                  type="checkbox"
                  className="form-checkbox md:h-4 md:w-4 md:mr-2 sm:h-3 sm:w-3 sm:mr-1 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-1 common
              </td>
              <td className="py-3 px-6 text-left flex-1 sm:w-15">Thomas</td>
              <td className="py-3 px-6 text-left flex flex-wrap flex-1 h-auto sm:w-[95%] p-1">
                <div className="flex justify-start flex-wrap gap-3 h-auto">
                  <div className="bg-blue-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                </div>
                <div className="flex flex-col align-middle mt-1 h-auto w-full">
                  {/* <span className="text-md text-green-900">[</span> */}
                  <span className="text-md">99 &gt; Waiting,</span>
                  <span className="text-md">Service time &lt; 0.99</span>
                  {/* <span className="text-md">]</span> */}
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100  flex w-full">
              <td className="py-3 px-6 text-left sm:w-13 md:15 ">2</td>
              <td className="py-3 px-6 text-left flex-1 sm:w-20 flex-wrap">
                <input
                  type="checkbox"
                  className="form-checkbox md:h-4 md:w-4 md:mr-2 sm:h-3 sm:w-3 sm:mr-1 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-1 common
              </td>
              <td className="py-3 px-6 text-left flex-1 sm:w-15">Thomas</td>
              <td className="py-3 px-6 text-left flex flex-wrap flex-1 h-auto sm:w-[95%] p-1">
                <div className="flex justify-start flex-wrap gap-3 h-auto">
                  <div className="bg-blue-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                </div>
                <div className="flex flex-col align-middle mt-1 h-auto w-full">
                  {/* <span className="text-md text-green-900">[</span> */}
                  <span className="text-md">99 &gt; Waiting,</span>
                  <span className="text-md">Service time &lt; 0.99</span>
                  {/* <span className="text-md">]</span> */}
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100  flex w-full">
              <td className="py-3 px-6 text-left sm:w-13 md:15 ">3</td>
              <td className="py-3 px-6 text-left flex-1 sm:w-20 flex-wrap">
                <input
                  type="checkbox"
                  className="form-checkbox md:h-4 md:w-4 md:mr-2 sm:h-3 sm:w-3 sm:mr-1 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-1 common
              </td>
              <td className="py-3 px-6 text-left flex-1 sm:w-15">Thomas</td>
              <td className="py-3 px-6 text-left flex flex-wrap flex-1 h-auto sm:w-[95%] p-1">
                <div className="flex justify-start flex-wrap gap-3 h-auto">
                  <div className="bg-blue-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                  <div className="bg-green-200 rounded-sm p-2"></div>
                </div>
                <div className="flex flex-col  align-middle mt-1 h-auto w-full">
                  {/* <span className="text-md text-green-900">[</span> */}
                  <span className="text-md">99 &gt; Waiting,</span>
                  <span className="text-md">Service time &lt; 0.99</span>
                  {/* <span className="text-md">]</span> */}
                </div>
              </td>
            </tr>
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
      <div className="w-full h-auto flex-1 flex flex-col">
        <div className="flex justify-between gap-2 px-2 pt-4">
          <div className="flex-1">
            <Dropdowns search="Search Topic" />
          </div>

          <div className="flex-2">
            <Dropdowns search={"Search Ticket Number"} />
          </div>
        </div>
        <div className="w-full h-auto flex md:flex md:flex-row">
          <Outlet />
        </div>
      </div>

      {/* <TicketDetail /> */}
    </div>
  );
}

export default Dashboard;
