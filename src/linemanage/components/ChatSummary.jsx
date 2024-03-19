import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import formatCreatedAt from "../utils/datefromat";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
//eslint-disable-next-line

const Chat = () => {
  //const dispatch = useDispatch();
  //console.log("data from chat summary", selectedTicket);
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  const ticketMessages = useSelector((state) => state.tickets.ticketMessage);
  const singleMessage = useSelector((state) => state.tickets.singleMessage);

  //const [loading, setLoading] = useState(true);
  let current_user = "1234";
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function chat() {
      if (ticketMessages.length > 0) {
        try {
          let messages = await Promise.all(
            ticketMessages.map((message) => {
              return {
                id: message._id,
                sender: message.author !== current_user ? "receiver" : "user",
                type: "text",
                content: message.message_data,
                created_at: message.created_at,
              };
            })
          );
          //console.log("loading", loading);
          if (messages.length > 0) {
            //  console.log("inner loading", loading);
            setMessages(messages);
          }
        } catch (error) {
          console.log(error);
          //setLoading(false);
        }
        // setLoading(false);
      } else {
        setMessages([]);
      }
    }
    // console.log("selected ticket", selectedTicket);
    if (Object.keys(selectedTicket).length > 0) {
      chat();
    } else {
      setMessages([]);
      // setLoading(false);
    }
  }, [current_user, selectedTicket, ticketMessages]);

  //getting a new message when client make first request or message
  useEffect(() => {
    if (Object.keys(singleMessage).length > 0) {
      const { author, is_read, created_at, message_data } = singleMessage;
      let current_user = "1234";
      console.log(current_user, author);
      console.log("chat datas", author, is_read, created_at, message_data);
      // if (author !== current_user) {
      const message = {
        id: messages.length + 1,
        sender: author !== current_user ? "receiver" : "user",
        type: "text",
        content: message_data,
        created_at: created_at,
      };

      setMessages([...messages, message]);

      //setLoading(false);
      //  }
    }
  }, [singleMessage]);

  //establishing a communication when a user start chatting
  socket.on("ticket_message_response", (data) => {
    // Handle response for the event
    if (data.status === "success") {
      const { author, is_read, created_at, message_data } = data.data;
      let current_user = "1234";
      const message = {
        id: messages.length + 1,
        sender: author !== current_user ? "receiver" : "user",
        type: "text",
        content: message_data,
        created_at: created_at,
      };

      setMessages([...messages, message]);
    }
  });
  const sendChat = async (newMessage) => {
    let workSpaceID = "646ba835ce27ae02d024a902";
    let api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    await socket.emit("ticket_message_event", {
      ticket_id: selectedTicket._id,
      product: selectedTicket.product,
      message_data: newMessage.trim(),
      user_id: "1234",
      reply_to: "None",
      workspace_id: workSpaceID,
      api_key: api_key,
      created_at: new Date().toISOString(),
    });

    //setLoading(false);
  };

  const sendMessage = async () => {
    //setMessages([...messages, message]);
    await sendChat(newMessage);
    setNewMessage("");
  };

  const handleFileChange = (event) => {
    // Handle file upload
    console.log(event);
  };
  let messageToDispaly = messages.slice().sort((a, b) => {
    // Convert the created_at string to Date objects for comparison
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    // Compare the dates
    return dateA - dateB;
  });
  // console.log("message to display", messageToDispaly);
  const handleSendButtonClick = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
    }
  };

  return (
    <div
      className={` flex flex-col pb-4 border-b border-gray-300 shadow-md h-svh mr-2`}
    >
      <div className="flex justify-between bg-[#22694de1]  border-b border-gray-200 px-4 py-4 w-full">
        <h2 className="font-sans sm:text-sm md:text-[16px] font-medium text-white uppercase">
          Summary of Last Chat
        </h2>
        <button
          // onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
        >
          {/* <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path> */}
          {/* </svg> */}
        </button>
      </div>
      <div className="w-[100%] flex flex-col justify-between h-full">
        <div className="mr-auto lex mb-6  pt-2 font-sans text-sm flex justify-center gap-5 w-[100%]">
          <button className="bg-gray-300  hover:bg-gray-400 text-black font-bold py-2 px-1.5 text-sm  rounded-md">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 mr-1 text-indigo-600 transition duration-150 ease-in-out"
            />
            Verify ID
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-1  rounded-md">
            Reopen Ticket
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-1  rounded-md">
            Close Ticket
          </button>

          {/* <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Chat Manager
            </button> */}

          {/* <button className="bg-red-400 ml-auto hover:bg-red-500 text-white font-bold py-1.5 px-2 rounded-lg ">
            Logout
          </button> */}
        </div>
        <div className="flex gap-2 font-sans text-sm">
          <p className="ml-2 text-lg">Level:</p>
          <button className="bg-gray-300 hover:bg-gray-350 px-3 py-0.5 mb-2 text-[#287757e1] rounded-full">
            1
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full">
            2
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full">
            3
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full">
            4
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full">
            5
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full">
            6
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full">
            7
          </button>
          <button className="bg-[#22694de1] hover:bg-[#287757e1] px-3 py-0.5 mb-2 text-white rounded-full mr-2">
            8
          </button>
        </div>
        <hr className="bg-slate-500 mt-3 w-full" />
        {/* Chat content goes here */}

        {/* Render chat messages */}
        <div className="space-y-4 px-4 py-6 sm:h-[100px] md:h-[300px] overflow-y-scroll">
          {Object.keys(messageToDispaly).length > 0 &&
            messageToDispaly?.map((message) => (
              <div
                key={message.id}
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
            ))}
          {Object.keys(messageToDispaly).length <= 0 && ""}
        </div>

        <div className="px-4 py-2  flex items-center">
          <label className="cursor-pointer ml-4">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <svg
              className="h-6 w-6 text-blue-500 hover:text-blue-700"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11 4V1a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 11-2 0V3h-2v10h4V7a1 1 0 112 0v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 112 0v6h4v3a1 1 0 11-2 0v-3H4v-2h12v2h-2v3a1 1 0 11-2 0v-3h-2v2a1 1 0 11-2 0v-3a1 1 0 011-1h4a1 1 0 011 1v3h-2V7a1 1 0 112 0v3z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1  rounded-lg px-4 py-2 outline-none border-2 focus:border-blue-200 ml-2"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendButtonClick}
            className="ml-2 font-sans text-sm bg-[#22694de1] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#37755ce1] focus:outline-none "
            disabled={selectedTicket ? false : true}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
