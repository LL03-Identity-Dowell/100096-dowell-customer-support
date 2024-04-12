import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../dropdown.css"; // Import CSS for styling (create a Dropdown.css file)
import { toast } from "react-toastify";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//import { socket } from "../utils/Connection";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopicData, fetchSelectedTopic } from "../Redux/ticketDetailSlice";

//import { toast } from "react-toastify";

//eslint-disable-next-line
function TopicSearch({
  //eslint-disable-next-line
  search,
  //eslint-disable-next-line
}) {
  const dispatch = useDispatch();
  const topicData = useSelector((state) => state.tickets.topicData);

  // let ticketInfoToShow = [...ticketInfo];
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  useEffect(() => {
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

    findTopic();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionClick = (option, data) => {
    setSearchTerm(option);
    dispatch(fetchSelectedTopic(data));
    //type === "ticket" ? dispatch(fetchSelectedTicket(data)) : "";
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
          {topicData &&
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

          {/* Add more options as needed */}
        </div>
      )}
    </div>
  );
}

export default TopicSearch;
