import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

import "../dropdown.css"; // Import CSS for styling (create a Dropdown.css file)
import { toast } from "react-toastify";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//import { socket } from "../utils/Connection";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSelectedTicket,
  fetchTicketInfo,
} from "../Redux/ticketDetailSlice";

import { ClipLoader } from "react-spinners";
//import { toast } from "react-toastify";

//eslint-disable-next-line
function TicketSearch({
  //eslint-disable-next-line
  search,
  //eslint-disable-next-line
}) {
  const dispatch = useDispatch();
  const topicData = useSelector((state) => state.tickets.topicData);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  //const ticketMessages = useSelector((state) => state.tickets.ticketMessage);
  const [loading, setLoading] = useState(true);
  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);
  // let ticketInfoToShow = [...ticketInfo];
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );

  useEffect(() => {
    console.log("topic data", topicData);
    console.log("selected ticket data", selectedTicket);
    const findTicket = async (product) => {
      const { name } = product;
      console.log("product=", product, "NAME=", name);
      //console.log(workSpaceID, product, api_key);
      //workSpaceID = "646ba835ce27ae02d024a902";
      //api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      try {
        await socket.emit("get_tickets", {
          product: name,
          workspace_id: lineManagerCredentials.workspace_id,
          api_key: lineManagerCredentials.api_key,
        });
        await socket.on("ticket_response", (data) => {
          console.log("ticket response", data);
          // Handle response for the event
          setLoading(false);
          // console.log("ticket response", data["data"]);
          if (data?.status === "success") {
            dispatch(fetchTicketInfo(data?.data));
          } else {
            throw new Error("No ticket exist for the product yet");
          }
          //      console.log(ticketData);
        });
      } catch (error) {
        toast.warning(error.message);
      }
    };

    if (Object.keys(selectedTopic).length > 0) {
      findTicket(selectedTopic);
    } else {
      return;
    }
  }, [selectedTopic]);

  socket.on("new_ticket", (data) => {
    console.log("new ticket", data);
    //console.log()
    if (data?.status === "success") {
      if (data?.data?.product === selectedTopic.name) {
        console.log("entered to update", data?.data);
        dispatch(fetchTicketInfo([...ticketInfo, data?.data]));
      }

      //ticketInfoToShow = [...ticketInfo, data?.data];
      toast.success(`new ticket added in ${data?.data?.product}`, {
        toastId: "success1",
      });
    } else {
      return;
    }
  });

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionClick = (option, data) => {
    setSearchTerm(option);
    dispatch(fetchSelectedTicket(data));
    setDropdownOpen(false);
  };

  return (
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
          {console.log("ticket info", ticketInfo)}
          {ticketInfo &&
            //eslint-disable-next-line
            ticketInfo
              .slice()
              .sort((a, b) => {
                // Convert the created_at string to Date objects for comparison
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);

                // Compare the dates
                return dateA - dateB;
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
          {ticketInfo ? (
            loading ? (
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
                Loading
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {/* Add more options as needed */}
        </div>
      )}
    </div>
  );
}

export default TicketSearch;
