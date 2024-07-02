import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import formatCreatedAt from "../utils/datefromat";
import io from "socket.io-client";
import { toast } from "react-toastify";
import {
  //fetchMessageData,
  fetchTicketMessage,
} from "../Redux/ticketDetailSlice";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
// Emoji Mart
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
//import formatDate from "../utils/formatDate";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//eslint-disable-next-line

const Chat = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  // const messageData = useSelector((state) => state.tickets.messageData);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  let current_user = lineManagerCredentials?.username;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };
  function formatDates(dateString) {
    console.log("inside dates====", dateString);
    const dateObj = new Date(dateString);

    // Check if parsing was successful (optional)
    if (isNaN(dateObj.getTime())) {
      console.error(
        "Invalid date format. Please provide a valid ISO 8601 formatted date string."
      );
      // Handle the error case (e.g., return null)
    } else {
      // Extract year, month, and day using getter methods
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const day = String(dateObj.getUTCDate()).padStart(2, "0");

      // Format the date as YYYY_MM_DD
      const formattedDate = `${year}_${month}_${day}`;
      return formattedDate;
      // console.log(formattedDate); // Output: 2024_06_11
    }
    // Format the date as YYYY_MM_DD
    // return `${year}_${month}_${day}`;
  }
  //useEffect(() => {
  console.log("date===", formatDates(selectedTicket?.created_at));
  // }, []);
  useEffect(() => {
    setLoading(true);
    const getTicketMessages = (selectedTicket) => {
      try {
        socket.emit("get_ticket_messages", {
          ticket_id: selectedTicket._id ?? selectedTicket.ticket_id,
          product: selectedTicket.product,
          ticket_date: formatDates(selectedTicket.created_at),
          workspace_id: lineManagerCredentials.workspace_id,
          api_key: lineManagerCredentials.api_key,
        });
      } catch (error) {
        toast.warn(error.message);
      }
    };

    // If selectedTicket changes, fetch ticket messages
    if (selectedTicket && Object.keys(selectedTicket).length > 0) {
      getTicketMessages(selectedTicket);
    }
  }, [selectedTicket._id]);

  //getting ticket messages and making a chat
  useEffect(() => {
    const targetNode = document.getElementById("scroller");

    const config = { childList: true };
    //eslint-disable-next-line
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          targetNode.scrollTop = targetNode.scrollHeight;
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }, []);

  // Ensure to include all dependencies used inside the effect

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendButtonClick();
    }
  };
  // useEffect(() => {

  //}, [socket]);
  const sendChat = async (newMessage) => {
    // let workSpaceID = "646ba835ce27ae02d024a902";
    //let api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    await socket.emit("ticket_message_event", {
      ticket_id: selectedTicket._id,
      product: selectedTicket.product,
      message_data: newMessage.trim(),
      user_id: current_user,
      reply_to: "None",
      workspace_id: lineManagerCredentials.workspace_id,
      api_key: lineManagerCredentials.api_key,
      created_at: new Date().toISOString(),
    });

    //setLoading(false);
  };

  const sendMessage = async () => {
    //setMessages([...messages, message]);
    await sendChat(newMessage);
    setNewMessage("");
  };
  //let x = 0;
  //useEffect(() => {
  socket.on("ticket_message_response", (data) => {
    //console.log("hello", data?.data);
    //console.log("x",x++);
    if (data.operation === "send_message") {
      const dat = data?.data;
      const { author, created_at, message_data } = dat;

      if (data?.data?.ticket_id === selectedTicket._id) {
        const newMessage = {
          id: messages.length + 1,
          sender: author !== current_user ? "user" : "receiver",
          type: "text",
          content: message_data,
          created_at: created_at,
        };

        // if (messages[messages.length - 1].created_at !== created_at) {
        setMessages([...messages, newMessage]);
        // }
      }
    } else if (data.operation === "get_ticket_messages") {
      const ticketMessages = data?.data;
      const formattedMessages = ticketMessages.map((message) => ({
        id: message._id,
        sender: message.author !== current_user ? "user" : "receiver",
        type: "text",
        content: message.message_data,
        created_at: message.created_at,
      }));
      setMessages(formattedMessages);
      dispatch(fetchTicketMessage(formattedMessages));
    }
    setLoading(false);
    // return;
    // return;s
  });
  //}, [socket]);
  const handleFileChange = (event) => {
    // Handle file upload
    console.log(event);
  };
  let messageToDispaly = [...messages].slice().sort((a, b) => {
    // Convert the created_at string to Date objects for comparison
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    // Compare the dates
    return dateA - dateB;
  });
  // console.log("message to display", messageToDispaly);
  const handleSendButtonClick = function () {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
    }
  };
  //console.log("date for ticketts=", selectedTicket.created_at);
  const closeTicket = () => {
    const roomData = {
      ticket_id: selectedTicket._id,
      line_manager: lineManagerCredentials.username,
      workspace_id: lineManagerCredentials.workspace_id,
      api_key: lineManagerCredentials.api_key,
      ticket_date: formatDates(selectedTicket.created_at),
      product: selectedTicket.product,
    };
    socket.emit("close_ticket", roomData);
  };
  return (
    <div
      className={`md:h-[600px] flex flex-col max-md:mx-2  px-2 py-2 rounded-[14.35px] border border-[#5B5B5B] shadow-md h-svh mr-2`}
    >
      <div className="flex justify-between  bg-white border border-[#22C55E] py-4 text-[#22C55E]  border-b  px-4 rounded-t-md rounded-b-sm w-full">
        <h2 className=" sm:text-sm mb-5 md:text-[16px]  text-[#22C55E] font-[700]  uppercase">
          Summary of Last Chat
        </h2>
        <button
          // onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
        ></button>
      </div>
      <div className="w-[100%]  flex flex-col justify-between h-full">
        <div className="mr-auto  lex mb-3   font-sans text-sm flex justify-center items-center mt-2 gap-5 w-[100%]">
          <button className="bg-[#667080] bg-opacity-[16%] flex justify-center  hover:bg-gray-400 text-black font-bold py-2 px-1.5 text-sm  rounded-sm">
            <input
              type="checkbox"
              className="form-checkbox h-3 w-3 mr-3 text-indigo-600 transition duration-150 rounded-sm ease-in-out"
            />
            Verify ID
          </button>
          <button className="bg-[#667080] bg-opacity-[16%] hover:bg-gray-400 text-black font-bold py-2 px-1  rounded-sm">
            Reopen Ticket
          </button>
          <button
            className={`${
              !selectedTicket?.is_closed
                ? "bg-[#667080] bg-opacity-[16%] hover:bg-gray-400"
                : "bg-red-300 hover:bg-red-400"
            } " text-black font-bold py-2 px-1 rounded-sm`}
            onClick={() => closeTicket()}
            disabled={selectedTicket?.is_closed}
          >
            {selectedTicket?.is_closed ? "closed" : "Close Ticket"}
          </button>
        </div>
        <div className="flex justify-center gap-2  font-sans text-sm">
          <p className="ml-2 text-lg">Level:</p>
          <button className="hover:bg-gray-350 w-6 h-6 text-white bg-[#22C55E] rounded-full">
            1
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            2
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            3
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            4
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            5
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            6
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            6
          </button>
          <button className="hover:bg-gray-350 w-6 h-6 text-[#22C55E] bg-white border border-[#22C55E] rounded-full">
            8
          </button>
        </div>
        <hr className="bg-slate-500 mt-3 w-full" />
        {/* Chat content goes here */}

        {/* Render chat messages */}

        <div
          className={`bg-green-500 rounded-t-md rounded-b-sm py-3  ${
            selectedTicket?._id ? "block" : "hidden"
          }`}
        >
          <p className="text-white w-full sm:px-5">{selectedTicket._id}</p>
        </div>
        {console.log(messageToDispaly)}
        <div
          className="space-y-3   py-3 h-[250px] overflow-y-scroll"
          id="scroller"
        >
          {Object.keys(messageToDispaly).length > 0 ? (
            messageToDispaly?.map((message, index) => (
              <div
                key={message.created_at + index}
                className={`flex font-sans text-sm ${
                  message.sender === "user" ? "justify-start" : "justify-end"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gray-200"
                        : "bg-[#083a26e1] text-white"
                    }`}
                  >
                    <p> {message.content}</p>

                    <p>
                      <small className="text-sm text-gray-400">
                        <i> {formatCreatedAt(message.created_at)}</i>
                      </small>
                    </p>
                  </div>
                )}
                {message.type === "file" && (
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gray-200"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <a
                      href={message.content.dataURL}
                      download={message.content.fileName}
                      className="text-blue-500 hover:underline"
                    >
                      {message.content.fileName}
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="border-none w-full text-sm text-center text-gray-600  flex justify-center  h-full">
              No previous messages
            </p>
          )}
          {Object.keys(messageToDispaly).length <= 0 && ""}
          {Object.keys(selectedTicket).length > 0 && loading ? (
            <div className=" flex flex-col w-full justify-center items-center -mt-20 mx-auto h-full gap-y-2 text-gray-600 font-bold ">
              <ClipLoader
                color={"#22694de1"}
                css={{
                  display: "block",
                  margin: "auto auto",
                }}
                size={40}
              />
              <small className="text-sm">Loading Messages... </small>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="px-4   flex items-center">
          <label className="cursor-pointer mx-auto">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#22694de1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.2V17c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5.8c0-.6.4-1 1-1h2.2M12 2v10M12 2l3.5 3.5M12 2l-3.5 3.5" />
            </svg>
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1  rounded-lg px-2 py-2 outline-none border-2 focus:border-blue-200 ml-2"
            placeholder="Type your message..."
          />
          <div
            className="chat p-2 "
            onMouseEnter={() => setShowEmojiPicker(true)}
            onMouseLeave={() => setShowEmojiPicker(false)}
          >
            <div className="input-area w-full flex items-center relative">
              {showEmojiPicker && (
                <div className="emoji-picker  absolute bottom-12 -right-20">
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
              )}
              <div
                className="icon-container cursor-pointer mr-2"
                onMouseEnter={() => setShowEmojiPicker(true)}
              >
                <FontAwesomeIcon
                  icon={faSmile}
                  className="text-yellow-400 w-6 h-6 p-1 rounded-full border"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSendButtonClick}
            className="ml-2 font-sans text-sm bg-[#22694de1] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#37755ce1] focus:outline-none "
            disabled={Object.keys(selectedTicket).length === 0 ? true : false}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
