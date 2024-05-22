import { useEffect, useRef, useState } from "react";
import formatCreatedAt from "../../linemanage/utils/datefromat.js";
import Toggler from "./Toggler.jsx";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const ChatForm = ({
  onClose,
  darkMode,
  toggleDarkMode,
  messageToDisplay,
  ticketDetail,
  apiKey,
  socket,
}) => {
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  useEffect(() => {
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

      socket.emit("ticket_message_event", ticketMessagePayload);

      setMessage("");
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed flex left-1/2 transform -translate-x-1/2  -translate-y-1/2 w-[80%] max-w-[100%] min-w-[360px] min-h-[85%] max-h-[95%] ${
        darkMode ? "bg-gray-600" : "bg-white"
      } rounded-lg shadow-lg z-10 top-[50%] duration-1000`}
    >
      <div className={` pb-0 w-full `}>
        <div className="flex justify-between #22C55E rounded-t-md py-3 px-5 bg-[#22C55E]">
          <div className="flex justify-center items-center  px-2 gap-x-2">
            <div className="w-8 h-8 rounded-full text-center p-1  bg-white ">
              <FontAwesomeIcon
                icon={faUser}
                className="text-[#22C55E] w-5 h-5 "
              />
            </div>
            <h2
              className={`text-xl ${
                darkMode ? "text-white" : "text-slate-900"
              } font-semibold p-2 mb-2`}
            >
              {
                JSON.parse(localStorage.getItem("create_ticket_detail"))
                  .line_manager
              }
            </h2>
          </div>
          <h2
            className={`text-xl max-md:hidden ${
              darkMode ? "text-white" : "text-slate-900"
            } font-semibold p-2 mb-2`}
          >
            {JSON.parse(localStorage.getItem("create_ticket_detail"))._id}
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
            {/* {!messageToDisplay && (
              <div className="flex flex-col justify-center mt-10 items-center text-center w-full h-full">
                <h1 className="text-white text-4xl font-bold font-mono mb-5">
                  Need help?
                </h1>
                <img src={chat} className="w-[70%] h-auto" alt="Hi" />
                <h1 className="text-white text-xl font-bold font-mono ">
                  Ask Us
                </h1>
              </div>
            )} */}
            {messageToDisplay.length > 0 &&
              messageToDisplay.map((message) => (
                <div
                  key={message.id}
                  className={`flex font-sans text-sm ${
                    message.sender === "user" ? "justify-end" : "justify-start"
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
              ))}
          </div>
        </div>
        <hr className="py-5 md:w-[85%] text-center mx-auto -mt-10" />

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
              <input
                id="message"
                className="w-full md:mx-3 px-3 py-2  rounded-lg  focus:ring-2 focus:border-blue-400 focus:outline-none"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleMessageChange}
              />
              <button
                className="text-white   flex items-center justify-center transition-delay-1000"
                type="submit"
              >
                <FontAwesomeIcon
                  className="mx-2 w-10 h-10  text-green-500 hover:text-green-300 duration-500  "
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
