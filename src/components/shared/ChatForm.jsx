import { useEffect, useRef, useState } from "react";
import formatCreatedAt from "../../linemanage/utils/datefromat.js";
import Toggler from "./Toggler.jsx";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
// Emoji Mart
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { chat } from "../../assets/index.js";
import { formatDate } from "../../utils/formatData.js";
//eslint-disable-next-line;
const ChatForm = ({
  // eslint-disable-next-line
  onClose,
  // eslint-disable-next-line
  darkMode,
  // eslint-disable-next-line
  toggleDarkMode,
  // eslint-disable-next-line
  messageToDisplay,
  // eslint-disable-next-line
  ticketDetail,
  // eslint-disable-next-line
  apiKey,
  // eslint-disable-next-line
  socket,
  showIntro,
  toggleIntro,
}) => {
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [ticketData, setTicketData] = useState(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };

  useEffect(() => {
    setTicketData(JSON.parse(localStorage.getItem("create_ticket_detail")));
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() !== "" && ticketDetail) {
      const ticketMessagePayload = {
        ticket_id: JSON.parse(localStorage.getItem("create_ticket_detail"))._id,
        product: JSON.parse(localStorage.getItem("create_ticket_detail"))
          .product,
        message_data: message,
        user_id: "12345",
        reply_to: "None",
        workspace_id: params.get("workspace_id"),
        api_key: apiKey,
        created_at: new Date().toISOString(),
      };

      //eslint-disable-next-line
      socket.emit("ticket_message_event", ticketMessagePayload);

      setMessage("");
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed flex left-1/2 transform -translate-x-1/2  -translate-y-1/2 w-[90%] md:w-[70%]  max-w-[100%] min-w-[360px] min-h-[85%] max-h-[95%] ${
        darkMode ? "bg-gray-600" : "bg-white"
      } rounded-lg shadow-lg z-10 top-[50%] duration-1000`}
    >
      <div className={` pb-0 w-full `}>
        <div className="flex justify-between #22C55E rounded-t-md py-3 px-5 bg-[#22C55E]">
          <h2
            className={`text-xl ${
              darkMode ? "text-white" : "text-slate-900"
            } font-semibold p-2 mb-2`}
          >
            {
              JSON.parse(localStorage.getItem("create_ticket_detail"))
                ?.line_manager
            }
          </h2>
          <h2
            className={`text-xl ${
              darkMode ? "text-white" : "text-slate-900"
            } font-semibold p-2 mb-2 max-md:hidden`}
          >
            {JSON.parse(localStorage.getItem("create_ticket_detail"))?._id}
          </h2>
          <div className="flex justify-end items-end gap-2 overflow-hidden h-10 min-w-20  pr-1">
            <Toggler darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button
              className="text-red-600 font-extrabold rounded-full h-10 w-10 text-center px-auto  transition-all duration-1000 hover:bg-slate-700"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className=" p-4 md:px-10 rounded-lg  overflow-y-auto h-[79%]  pb-10 w-full ">
          <div
            ref={containerRef}
            className="custom-scrollbar space-y-4 pl-1  -pr-1 pb-5  w-full "
          >
            {messageToDisplay.length === 0 && ticketData && showIntro && (
              <div className="flex  flex-col bg-gray-200 gap-y-2 md:gap-y-5 font-serif justify-center text-lg   w-full h-[100%] px-5 py-5  rounded-lg ">
                {console.log(ticketData)}
                <h1 className="flex flex-col text-center">
                  Ticket Number:{" "}
                  <span className="text-green-500 font-sans md:text-xl  font-bold">
                    {ticketData["_id"]}
                  </span>
                </h1>
                <h1 className="flex mt-5 max-md:flex-col justify-center text-gray-600  text-md text-center">
                  Your chat is with:{" "}
                  <span className="font-bold ml-2 font-sans">
                    {ticketData["line_manager"]}
                  </span>
                </h1>
                <h1 className="flex max-md:flex-col justify-center text-gray-600  text-md text-center">
                  Selected Product:{" "}
                  <span className="font-bold ml-2 font-sans">
                    {ticketData["product"]}
                  </span>
                </h1>
                <h1 className="flex max-md:flex-col justify-center text-gray-600  text-md text-center">
                  Date Created:{" "}
                  <span className="font-bold ml-2 font-sans">
                    {formatDate(ticketData["created_at"])}
                  </span>
                </h1>

                <button
                  onClick={() => {
                    toggleIntro();
                  }}
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 duration-500 text-white font-bold py-2 w-36 mx-auto px-2 rounded flex items-center justify-center space-x-1 cursor-pointer text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2v3l4-3h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-1 7H6V5h6v5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Start Messaging</span>
                </button>
              </div>
            )}

            {
              //eslint-disable-next-line
              messageToDisplay.length > 0 &&
                //eslint-disable-next-line
                messageToDisplay.map((message) => (
                  <div
                    key={message.id}
                    className={`flex font-sans text-sm ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.type === "text" && message.content && (
                      <div
                        className={`text-[17px] rounded-lg px-4 max-w-[98%] py-2 ${
                          message.sender === "user"
                            ? "bg-gray-200 "
                            : "bg-[#083a26e1] text-white "
                        } ${
                          message.sender === "user" && darkMode
                            ? "bg-gray-400"
                            : "bg-[#083a26e1] "
                        }`}
                      >
                        <p>{message.content}</p>
                        <p>
                          <small
                            className={`text-sm ${
                              darkMode ? "text-gray-200" : "text-gray-400"
                            }`}
                          >
                            <i>{formatCreatedAt(message.created_at)}</i>
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
            }
          </div>
        </div>
        <hr className="py-5 md:w-[85%] text-center mx-auto -mt-14" />

        <form onSubmit={(e) => handleSend(e)}>
          <div className={`-mt-3 md:mx-[5%] px-5  duration-1000  `}>
            <div
              className="flex gap-x-2"
              style={{
                position: "relative",
                textAlign: "end",
                outline: "none",
              }}
            >
              <div className="flex flex-1 border rounded-md">
                <input
                  id="message"
                  className={`w-full md:mx-3 px-3 text-sm  rounded-sm  m-1 outline-none border-transparent  ${
                    darkMode ? "bg-gray-600 outline-gray-600 text-white" : ""
                  } `}
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  ref={inputRef}
                  onChange={handleMessageChange}
                />
                <div
                  className="chat p-2 "
                  onMouseEnter={() => setShowEmojiPicker(true)}
                  onMouseLeave={() => setShowEmojiPicker(false)}
                >
                  <div className="input-area w-full flex items-center relative">
                    {showEmojiPicker && (
                      <div className="emoji-picker absolute bottom-10 -right-40">
                        <Picker data={data} onEmojiSelect={addEmoji} />
                      </div>
                    )}
                    <div
                      className="icon-container cursor-pointer mr-2"
                      onMouseEnter={() => setShowEmojiPicker(true)}
                    >
                      <FontAwesomeIcon
                        icon={faSmile}
                        className="text-yellow-400 w-5 h-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="text-white w-10   flex items-center justify-center transition-delay-1000"
                type="submit"
              >
                <FontAwesomeIcon
                  className="mx-2 w-7 h-7  text-green-500 hover:text-green-300 duration-500  "
                  icon={faTelegramPlane}
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatForm;
