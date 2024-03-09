import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import io from "socket.io-client";
import "../dropdown.css"; // Import CSS for styling (create a Dropdown.css file)
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopicData,
  fetchSelectedTopic,
  fetchSelectedTicket,
  fetchTicketInfo,
} from "../Redux/ticketDetailSlice";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
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

  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);

  console.log("topic data", topicData);
  console.log("selected ticket data", selectedTicket);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const findTicket = async (workSpaceID, product, api_key) => {
      const { name } = product;
      console.log(workSpaceID, product, api_key);
      workSpaceID = "646ba835ce27ae02d024a902";
      api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      try {
        await socket.emit("get_tickets", {
          product: name,
          workspace_id: workSpaceID,
          api_key: api_key,
        });
        await socket.on("ticket_response", (data) => {
          // Handle response for the event
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

    const findTopic = async (workSpaceID, api_key) => {
      workSpaceID = "646ba835ce27ae02d024a902";
      api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      try {
        console.log(workSpaceID);
        await socket.emit("get_all_topics", {
          workspace_id: workSpaceID,
          api_key: api_key,
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
    if (type == "topic") {
      findTopic(23, 54);
    } else if (type === "ticket") {
      console.log("Ticket started", selectedTopic);
      findTicket(23, selectedTopic, 22);
    }
  }, [type, dispatch, selectedTopic]);

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
            topicData?.map((data) => {
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
            ticketInfo?.map((data, index) => {
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

          {/* Add more options as needed */}
        </div>
      )}
    </div>
  );
}

export default Dropdowns;
