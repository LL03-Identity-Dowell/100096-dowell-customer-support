import { useState } from "react";
import { CiSearch } from "react-icons/ci";

import "../dropdown.css"; // Import CSS for styling (create a Dropdown.css file)
import { toast } from "react-toastify";
import {
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//import { socket } from "../utils/Connection";
import { useDispatch, useSelector } from "react-redux";
import {
  //fetchTopicData,
  fetchSelectedTopic,
  fetchSelectedTicket,
  //fetchTicketInfo,
} from "../Redux/ticketDetailSlice";

import { ClipLoader } from "react-spinners";
import useTicket from "./useTickets";
import { fetchLineManagersTime } from "../Redux/lineManager";
import formatDate from "../utils/formatDate";
//import { toast } from "react-toastify";

if (!socket.connected) {
  // toast.warn("socket is not connected");
} else {
  toast.success("socket is connected successfully");
}
//eslint-disable-next-line
function Dropdowns({
  //eslint-disable-next-line
  search,
  //eslint-disable-next-line
  type,
}) {
  const dispatch = useDispatch();
  const [date, setDate] = useState("");
  const topicData = useSelector((state) => state.tickets.topicData);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  //const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  //const [loading, setLoading] = useState(true);
  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);
  const savedUserName = JSON.parse(localStorage.getItem("userInfo"))
    .selected_product.userportfolio;
  console.log("saved user info", savedUserName);
  let userId = savedUserName?.find(
    (user) =>
      user.member_type === "team_member" &&
      user.product == "Dowell Customer Support Centre"
  )?.username;
  // let ticketInfoToShow = [...ticketInfo];
  useTicket();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  /*const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  */
  console.log("date", date);
  date && dispatch(fetchLineManagersTime(formatDate(date)));

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionClick = (option, data) => {
    setSearchTerm(option);
    type === "topic" ? dispatch(fetchSelectedTopic(data)) : "";
    type === "ticket" ? dispatch(fetchSelectedTicket(data)) : "";
    setDropdownOpen(false);
  };

  return (
    <div className="flex">
      {type === "topic" && (
        <div className=" mr-2">
          <Popover placement="bottom">
            <PopoverHandler>
              <Input
                className="w-full h-[85%] rounded-lg  border-solid px-3 py-1 border-2 focus:border-[#22694de1] outline-none"
                placeholder="Select Date"
                onChange={() => null}
                value={date ? format(date, "PPP") : ""}
              />
            </PopoverHandler>
            <PopoverContent>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                showOutsideDays
                className="border-0"
                classNames={{
                  caption:
                    "flex justify-center py-2 mb-4 relative items-center",
                  caption_label: "text-sm font-medium text-gray-900",
                  nav: "flex items-center",
                  nav_button:
                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                  nav_button_previous: "absolute left-1.5",
                  nav_button_next: "absolute right-1.5",
                  table: "w-full border-collapse",
                  head_row: "flex font-medium text-gray-900",
                  head_cell: "m-0.5 w-9 font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal",
                  day_range_end: "day-range-end",
                  day_selected:
                    "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                  day_today: "rounded-md bg-gray-200 text-gray-900",
                  day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                  day_disabled: "text-gray-500 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                  ),
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className="dropdown-container w-full">
        <div className="search-container rounded-lg  border-solid px-3 py-1 border-2 focus:border-[#22694de1]">
          <input
            type="text"
            value={searchTerm}
            placeholder={search}
            onClick={toggleDropdown}
            onChange={handleInputChange}
            className="rounded-lg w-full border-none outline-none"
          />
          <span className="search-icon text-lg">
            <CiSearch />
          </span>
        </div>
        {isDropdownOpen && (
          <div className="dropdown rounded-md overflow-y-scroll max-h-[200px]">
            {console.log("topic data", topicData)}

            {type === "topic" &&
              topicData &&
              //eslint-disable-next-line
              topicData?.slice().map((data) => {
                return (
                  <div
                    key={data.id}
                    className="option"
                    onClick={() => {
                      console.log("data to check", data);
                      handleOptionClick(data.name, data);
                    }}
                  >
                    {data.name}
                  </div>
                );
              })}
            {console.log("ticket info", ticketInfo)}
            {type === "ticket" &&
              ticketInfo &&
              //eslint-disable-next-line

              ticketInfo[`${userId}${selectedTopic.name ?? ""}`]
                ?.slice()
                .sort((a, b) => {
                  // Convert the created_at string to Date objects for comparison
                  const dateA = new Date(a.created_at);
                  const dateB = new Date(b.created_at);

                  // Compare the dates
                  return dateB - dateA;
                })

                .map((data, index) => {
                  return (
                    <div
                      key={data.id}
                      className="option"
                      onClick={() => {
                        handleOptionClick(index + 1, data);
                      }}
                    >
                      {index + 1}
                    </div>
                  );
                })}
            {type === "ticket" &&
            ticketInfo[`${savedUserName}${selectedTopic.name ?? ""}`]?.keys()
              ?.length === 0 ? (
              <div className="d-flex mt-3 justify-center align-items-center mx-auto">
                <ClipLoader
                  color={"#22694de1"}
                  css={{
                    display: "block",
                    margin: "0 auto",
                    width: "50px",
                    height: "40px",
                  }}
                  size={20}
                />{" "}
                Loading...
              </div>
            ) : (
              ""
            )}

            {/* Add more options as needed */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdowns;
