import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

import "../dropdown.css"; // Import CSS for styling (create a Dropdown.css file)
import { toast } from "react-toastify";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//import { socket } from "../utils/Connection";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopicData,
  fetchSelectedTopic,
  fetchSelectedTicket,
  fetchTicketInfo,
} from "../Redux/ticketDetailSlice";

import { ClipLoader } from "react-spinners";
//import { toast } from "react-toastify";

console.log("socket", socket);

if (!socket.connected) {
  toast.warn("socket is not connected");
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
  const topicData = useSelector((state) => state.tickets.topicData);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
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
          // Handle response for the event
          setLoading(false);
          console.log("ticket response", data.data);
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

    const findTopic = async () => {
      //workSpaceID = "646ba835ce27ae02d024a902";
      // api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      try {
        // console.log(workSpaceID);
        await socket.emit("get_all_topics", {
          workspace_id: lineManagerCredentials.workspace_id,
          api_key: lineManagerCredentials.api_key,
        });
        await socket.on("setting_response", (data) => {
          if (data.status === "success") {
            // console.log("topic data in useeffect", data?.data);
            dispatch(fetchTopicData(data?.data));
            // setTopic(data?.data);
          } else {
            throw new Error();
          }
        });
      } catch (error) {
        toast.error("Some thing went wrong.we will fix soon");
        console.error(error);
      }
    };
    //  let workSpaceID = "646ba835ce27ae02d024a902";
    //  let api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    if (type === "topic") {
      findTopic();
    } else if (type === "ticket") {
      console.log("Ticket started", selectedTopic);
      if (Object.keys(selectedTopic).length > 0) {
        findTicket(selectedTopic);
      }
    } else {
      return;
    }
  }, [type, selectedTopic]);

  socket.on("new_ticket", (data) => {
    console.log("new ticket", data);
    //console.log()
    if (data?.status === "success") {
      dispatch(fetchTicketInfo([...ticketInfo, data?.data]));
      //ticketInfoToShow = [...ticketInfo, data?.data];
      toast.success("new ticket added", { toastId: "success1" });
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
    type === "topic" ? dispatch(fetchSelectedTopic(data)) : "";
    type === "ticket" ? dispatch(fetchSelectedTicket(data)) : "";
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

            ticketInfo?.slice().map((data, index) => {
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
          {type === "ticket" && ticketInfo ? (
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

export default Dropdowns;
