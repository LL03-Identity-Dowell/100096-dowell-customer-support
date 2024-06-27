import { Link } from "react-router-dom";
import { Profile, logo } from "../../assets";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { FaUser, FaBell, FaUserTie } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedTicket } from "../Redux/ticketDetailSlice";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//eslint-disable-next-line
export default function NavItem({ component }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isNotification, setNotification] = useState(false);
  const messageData = useSelector((state) => state.tickets.messageData);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const [sessionId, setSessionId] = useState(null);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const [countMessages, setCountMessages] = useState(0);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  const lineManageTime = useSelector(
    (state) => state.lineManagers.lineManageTime
  );
  const notifications = ["Notification 1", "Notification 2", "Notification 3"];
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMouseEnter = () => {
    setShowNotifications(true);
  };

  const handleMouseLeave = () => {
    setShowNotifications(false);
  };
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionParam = url.searchParams.get("session_id");
    const idParam = url.searchParams.get("id");
    setSessionId(sessionParam);
    setId(idParam);
  }, []);

  useEffect(() => {
    //  if (messageData.length > 0) {
    if (messageData.length > 0) {
      setCountMessages((prev) => prev + 1);
    }
    getUnreadMessages();
    //}
  }, []);

  useEffect(() => {
    getUnreadMessages();
  }, [selectedTopic, lineManageTime]);

  socket.on("ticket_message_response", (data) => {
    //console.log("unread messages", data);
    // Handle response for the event
    if (data.operation === "get_unread_messages") {
      console.log("unread messages", data?.data);
      //setWaitingTime(data.data[0]?.waiting_time);
      //      console.log("waitging time ", data.data[0]?.waiting_time);
    }
  });
  const queryParams = queryString.stringify({
    session_id: sessionId,
    id: id,
  });

  const dowellLogoutUrl =
    "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
    window.location.origin;
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(dowellLogoutUrl);
  };

  function getUnreadMessages() {
    const messageData = {
      line_manager: lineManagerCredentials.username,
      ticket_date: lineManageTime,
      workspace_id: lineManagerCredentials.workspace_id,
      api_key: lineManagerCredentials.api_key,
      product: selectedTopic,
    };
    socket.emit("get_unread_messages", messageData);
  }

  return (
    <div className="flex w-full px-2 md:px-5 top-0   fixed  justify-start z-50 border-b-2  h-16 bg-[#e9fdf1] items-center text-center">
      <div className="flex justify-start  w-full flex-2">
        <Link
          to={`/linemanage/?${queryParams}`}
          className="flex justify-start flex-2"
        >
          <a className="flex justify-start text-center items-center  md:mr-2 h-14">
            <img
              src={logo}
              className="w-14 h-14  text-center   rounded-md border-none"
              alt="Dowell"
            />
          </a>
          <h2 className="text-lg font-bold text-center  text-[#22C55E] flex justify-center items-center  ">
            <span className="max-md:hidden">Customer Support | </span> Line
            Manager
          </h2>
          {/* <hr className="border-b-1 bg-slate-500 mx-auto w-[90%]" /> */}
        </Link>
      </div>
      <div className="relative">
        <div
          onMouseOver={() => {
            setNotification(true);
            setCountMessages(0);
          }}
          onMouseLeave={() => {
            setNotification(false);
          }}
          className="relative cursor-pointer inline-flex items-center p-3   text-sm font-medium text-center text-[#22C55E] rounded-lg focus:outline-none h-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="#22C55E"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M3 4v12c0 1.1.9 2 2 2h12l4 4V4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z" />
          </svg>

          <span className="sr-only">Notifications</span>
          {countMessages > 0 && (
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
              {countMessages}
            </div>
          )}
        </div>

        <div
          onMouseOver={() => {
            setNotification(true);
          }}
          onMouseLeave={() => {
            setNotification(false);
          }}
          className={`absolute -right-[50px] text-left z-50 -mt-1  p-4 bg-white border border-gray-300 rounded shadow ${
            isNotification ? "block" : "hidden"
          }`}
        >
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Ticket ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Topic
                </th>
                <th scope="col" className="px-6 py-3">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {messageData?.map((item) => {
                return (
                  <tr
                    key={item?.created_at}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => dispatch(fetchSelectedTicket(item))}
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {item.ticket_id}
                        </div>
                        <div className="font-normal text-gray-500">
                          {item.author}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{item.product}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                        {item.message_data}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {countMessages == 0 ? (
                <span className=" ml-6 text-center block w-[200px]">
                  No new message
                </span>
              ) : (
                ""
              )}
              {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="ps-3">
                    <div className="text-base font-semibold">Bonnie Green</div>
                    <div className="font-normal text-gray-500">
                      bonnie@flowbite.com
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">Designer</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
                    Online
                  </div>
                </td>
              </tr> */}
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="relative inline-block cursor-pointer "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          <FaBell
            className={`text-2xl  text-green-500 ${
              showNotifications ? "animate-rotate" : ""
            }`}
          />
          <span className="absolute  top-0 right-0 block h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        {showNotifications && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute -right-20  md:min-w-[300px] max-w-[400px] p-2 md:min-h-[400px] "
          >
            <div className="flex flex-col bg-white border md:min-h-[400px] shadow-lg rounded-lg z-40 px-5 py-2 cursor-auto">
              <div className="flex justify-between items-center w-full h-10 border-b-2 border-[#B9B9B9]">
                <h6 className="text-sm text-[#7E7E7E] font-bold">
                  Notifcations
                </h6>
                <h6 className="text-sm text-green-500 cursor-pointer font-bold">
                  Mark as read
                </h6>
              </div>
              <div className="flex-1">
                {notifications.map((notification, index) => (
                  <div key={index} className=""></div>
                ))}
              </div>
              <div className="flex justify-center items-center w-full h-10 border-t border-[#B9B9B9]">
                <h6 className="text-sm cursor-pointer text-green-500 hover:font-bold duration-500">
                  Show all notifications
                </h6>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="relative max-w-[50%] ml-3 mt-1 text-end "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative inline-block  cursor-pointer">
          <img className="w-9 h-8 p-1" src={Profile} alt="Profile" />
        </div>
        <div
          onMouseEnter={() => setIsHovered(true)}
          className={`absolute z-50 min-w-44 -left-28 md:-left-32  pt-2  p-4   bg-white border border-gray-300 rounded shadow ${
            isHovered ? "block" : "hidden"
          }`}
        >
          <ul className="w-full flex flex-col justify-start items-start gap-y-3 text-start">
            <li>
              <Link
                className="hover:text-[#22C55E] flex justify-center items-center gap-2"
                href="#"
              >
                <FaUser className="text-[#22C55E]" /> Profile
              </Link>
            </li>
            <li>
              <Link
                to={`/linemanage/settings?${queryParams}`}
                className="hover:text-[#22C55E] flex justify-center items-center gap-2"
              >
                <IoSettingsSharp className="text-[#22C55E]" /> Settings
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-[#22C55E] flex justify-center items-center gap-2"
                to={`/linemanage/linemanagers?${queryParams}`}
              >
                <FaUserTie className="text-[#22C55E]" /> Line Managers
              </Link>
            </li>
            <li>
              <div
                className="hover:text-[#22C55E] flex justify-center items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <FiLogOut className="text-[#22C55E] font-bold" /> Logout
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
