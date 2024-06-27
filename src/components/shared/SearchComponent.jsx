import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import formatCreatedAt from "../../linemanage/utils/datefromat.js";
import Toggler from "./Toggler.jsx";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");
// Emoji Mart
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { formatDate } from "../../utils/formatData.js";

function SearchComponent({ closeSearchModal, linkRes }) {
  const [messages, setMessages] = useState([]);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const [apiKey, setApiKey] = useState("");
  const [getLinkRes, setGetLinkRes] = useState(linkRes || []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const [ticketDetail, setTicketDetail] = useState({});
  const [products, setProducts] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  socket.on("ticket_message_response", (data) => {
    if (data.status === "success") {
      const { author, created_at, message_data } = data.data;
      let current_user = "12345";

      const message = {
        id: messages.length + 1,
        sender: author !== current_user ? "receiver" : "user",
        type: "text",
        content: message_data,
        created_at: created_at,
      };

      setMessages([...messages, message]);
      setLoading(false);
    }
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };

  let messageToDisplay = [...messages]
    .filter((message) => message.content !== "") // Filter out items with empty content
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (message.trim() !== "" && ticketDetail) {
      const ticketMessagePayload = {
        ticket_id: JSON.parse(
          localStorage.getItem("create_ticket_detail_search")
        )._id,
        product: JSON.parse(localStorage.getItem("create_ticket_detail_search"))
          .product,
        message_data: message,
        user_id: "12345",
        reply_to: "None",
        workspace_id: params.get("workspace_id"),
        api_key: apiKey,
        created_at: new Date().toISOString(),
      };
      await socket.emit("ticket_message_event", ticketMessagePayload);
    }
    setMessage("");
  };

  const toggleDropdown = () => {
    if (apiKey) {
      socket.emit("get_share_link_details", {
        workspace_id: params.get("workspace_id"),
        link_id: params.get("link_id"),
        api_key: apiKey,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    setIsOpen(!isOpen);
  };
  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeSearchModal();
    }
  };

  socket.on("ticket_response", (data) => {
    const ticketsArray = data.data;

    const findTicketById = (id) => {
      return ticketsArray.find((obj) => obj._id === id);
    };

    const ticket = findTicketById(searchValue.trim());

    console.log(ticket);
    if (ticket) {
      setTicket(ticket);
    } else {
      setTicket(null);
      setError("Ticket Not found");
    }
    setLoading(false);
  });

  useEffect(() => {
    setTicketData(JSON.parse(localStorage.getItem("create_ticket_detail")));

    const fetchApiKey = async () => {
      const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${params.get(
        "workspace_id"
      )}`;

      try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        setApiKey(responseData["data"]["api_key"]);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchApiKey();

    if (apiKey) {
      socket.emit("get_share_link_details", {
        workspace_id: params.get("workspace_id"),
        link_id: params.get("link_id"),
        api_key: apiKey,
      });
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const handleResize = () => {
      const windowHeight = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  socket.on("share_link_response", (data) => {
    if (Array.isArray(data?.data)) {
      setGetLinkRes(data?.data);
    } else {
      console.error("Expected an array for getLinkRes, received:", data?.data);
      setGetLinkRes([]);
    }
  });

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setTicket(null);
    setError(false);
    setLoading(true);
    const payload = {
      product: selectedOption,
      workspace_id: params.get("workspace_id"),
      api_key: apiKey,
    };

    socket.emit("get_tickets", payload);
  };

  const findLinks = () => {
    setProducts(true);
    if (apiKey) {
      socket.emit("get_share_link_details", {
        workspace_id: params.get("workspace_id"),
        link_id: params.get("link_id"),
        api_key: apiKey,
      });
    }
  };

  const handleOpenChat = () => {
    ticket &&
      localStorage.setItem(
        "create_ticket_detail_search",
        JSON.stringify(ticket)
      );

    if (JSON.parse(localStorage.getItem("create_ticket_detail_search"))) {
      const fetchData = async () => {
        try {
          const ticketId = JSON.parse(
            localStorage.getItem("create_ticket_detail_search")
          )._id;
          const product = JSON.parse(
            localStorage.getItem("create_ticket_detail_search")
          ).product;

          await socket.emit("get_ticket_messages", {
            ticket_id: ticketId,
            product: product,
            workspace_id: params.get("workspace_id"),
            api_key: apiKey,
          });

          await socket.on("ticket_message_response", (data) => {
            const ticketMessages = data.data;
            let current_user = "12345";
            async function chat() {
              if (ticketMessages.length > 0) {
                try {
                  let messages = await Promise.all(
                    ticketMessages.map((message) => {
                      return {
                        id: message._id,
                        sender:
                          message.author !== current_user ? "receiver" : "user",
                        type: "text",
                        content: message.message_data,
                        created_at: message.created_at,
                      };
                    })
                  );
                  if (messages.length > 0) {
                    setMessages(messages);
                  }
                } catch (error) {
                  console.log(error);
                }
              } else {
                setMessages([]);
              }
            }

            chat();
          });
        } catch (error) {
          console.error("Error fetching ticket messages:", error);
        } finally {
        }
      };

      fetchData();
    } else {
    }

    const storedcData = JSON.parse(
      localStorage.getItem("create_ticket_detail_search")
    );

    setTicketDetail(storedcData);
    setOpenChat(!openChat);
  };

  const toggleChat = () => {
    setOpenChat(!openChat);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <div
        className={`fixed w-full i ${
          !openChat ? "block" : "hidden"
        }   h-full inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-overlay`}
        onClick={closeModal}
      >
        <div
          className={`bg-white w-[95%] sm:w-[90%] md:w-[60%] lg:w-[50%] h-[300px] -mt-72 overflow-auto px-10 py-6 md:p-6 rounded-lg min-w-xl animate-fadeIn`}
        >
          <div className="flex justify-center items-center  ">
            <div className="relative inline-block text-left mr-2">
              <div onClick={findLinks}>
                <button
                  type="button"
                  className="inline-flex justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  onClick={toggleDropdown}
                >
                  {selectedOption || " Product"}
                  <svg
                    className="-mr-1 ml-2 -mt-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.707 12.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414l-2.293-2.293-2.293 2.293a1 1 0 1 1-1.414-1.414l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-auto  -mr-3 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {getLinkRes.length > 0 ? (
                      getLinkRes.map((linkRes) => {
                        const objectToArray = Object.entries(
                          linkRes.product_distribution
                        );
                        const filteredArray = objectToArray.filter(
                          ([key, value]) => value > 0
                        );
                        return filteredArray.map((dist, index) => (
                          <a
                            href="#"
                            value={dist[0]}
                            key={index}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => handleOptionSelect(dist[0])}
                          >
                            {dist[0]}
                          </a>
                        ));
                      })
                    ) : (
                      <div className="flex justify-center  items-center   w-32 p-2 -ml-2">
                        <div className="animate-spin h-6 w-6 border-t-2  mx-auto text-center   border-gray-900 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex border-2 w-full md:w-[80%]  border-slate-100 rounded-lg ">
              <input
                ref={searchInputRef}
                type="text"
                id="ticket_id"
                className=" px-5  outline-1 w-[90%] outline-none decoration-none focus:bg-white  mx-auto   rounded-md-lg  flex-none"
                placeholder="Search with ticket number"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <button
                onClick={handleSearch}
                className=" right-3 w-[10%] pt-6 flex transform transition duration-1000 -translate-y-1/2 px-2 w-8 h-8 font-bolder text-xl  text-green-300 rounded-full hover:text-green-600"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>

          <div className="h-2/4">
            {ticket !== null && !loading && !ticket?.is_closed ? (
              <div className="w-full text-center mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
                <div className="mb-4">
                  <p className="text-gray-700">{ticket.email}</p>
                  <p className="text-gray-700">{ticket.is_closed}</p>
                  <p className="text-gray-700">{ticket.line_manager}</p>
                  <p className="text-gray-700"> {ticket.user_id}</p>
                </div>
                <button
                  onClick={handleOpenChat}
                  type="button"
                  className="w-[40%] border-2 text-dark border-indigo-300 bg-indigo-200 hover:bg-indigo-500 hover:text-white hover:border-slate-100 text-zinc-600 transition duration-1000 ease-in-out font-bold py-2 px-4 rounded-full mx-auto block"
                >
                  Chat Now
                </button>
              </div>
            ) : (
              <div>
                {loading && !error ? (
                  <div className="flex justify-center items-center text-center w-full py-auto ">
                    <div className="animate-spin h-8 w-8 border-t-2 mt-16 mx-auto text-center   border-indigo-500 rounded-full"></div>
                  </div>
                ) : (
                  ""
                )}

                {ticket?.is_closed && (
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Request to Open
                  </button>
                )}

                {error && (
                  <div className="flex justify-center items-center mt-16 text-red-400">
                    {" "}
                    Ticket Not Found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {openChat && (
        <div className="w-full z-50 rounded-md  flex justify-center items-center mx-auto">
          <div
            ref={containerRef}
            className={`fixed flex transform  -translate-y-1/2 mx-auto  w-[60%] max-w-[100%] min-w-[360px] min-h-[85%] max-h-[98%] ${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg z-50  top-[50%] duration-1000 ${
              openChat ? "block" : "hidden"
            } `}
          >
            <div className="pb-0 w-full ">
              <div className="flex justify-between rounded-t-md py-3  bg-[#22C55E] ">
                <div className="flex justify-center items-center  px-2 gap-x-2">
                  <div className="w-8 h-8 rounded-full text-center p-1  bg-white ">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[#22C55E] w-5 h-5 "
                    />
                  </div>
                  <h2 className={`text-lg font-semibold text-white  `}>
                    <span>{ticket.line_manager}</span>
                  </h2>
                  {/* <h2
                  className={`text-sm pb-2 ${
                    darkMode ? "text-white" : "text-slate-900"
                  } font-semibold p-2 pb-0`}
                >
                  {
                    JSON.parse(
                      localStorage.getItem("create_ticket_detail_search")
                    )?._id
                  }
                </h2> */}
                </div>
                <hr className="h-1 bg-black" />
                <div className="flex justify-end items-end overflow-hidden gap-3 h-10 min-w-20 pr-1">
                  <Toggler
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                  <button
                    className="text-red-600 font-extrabold rounded-full h-10 w-10 text-center px-auto transition-all duration-1000 hover:bg-slate-700"
                    onClick={toggleChat}
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
              <div className="p-4  rounded-lg shadow-lg overflow-y-auto h-[77%] pb-10 w-full">
                <div
                  ref={containerRef}
                  className="custom-scrollbar space-y-4 pl-1 -pr-1 pb-5 w-full"
                >
                  {!messageToDisplay.length && (
                    <div className="text-center">
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
                          onClick={() => {}}
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
                    </div>
                  )}
                  {messageToDisplay.map((message) => (
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
                          className={`relative text-[15px] rounded-3xl px-4 py-2 max-w-[75%] mb-4 ${
                            message.sender === "user"
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-300 text-black rounded-bl-none"
                          } ${
                            message.sender === "user" && darkMode
                              ? "bg-gray-600"
                              : ""
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-right ">
                            <small
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
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
              <form onSubmit={(e) => handleSend(e)}>
                <div
                  className={` px-5 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } duration-1000`}
                >
                  <hr className="mb-5 border border-gray-300" />
                  <div
                    className="flex px-10 gap-x-2 bg-transparent "
                    style={{
                      position: "relative",
                      textAlign: "end",
                      outline: "none",
                    }}
                  >
                    <div className="flex justify-between items-center w-full">
                      <input
                        id="message"
                        className={`w-full text-sm px-3 py-2 bg-transparent rounded-lg focus:ring-1 focus:border-gray-400 focus:outline-none ${
                          !darkMode ? "text-gray-800" : "text-white"
                        } `}
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleMessageChange}
                      />
                      <div
                        className="chat p-4 w-10 "
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
                            className="icon-container cursor-pointer"
                            onMouseEnter={() => setShowEmojiPicker(true)}
                          >
                            <FontAwesomeIcon
                              icon={faSmile}
                              size="lg"
                              className="text-yellow-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-white rounded-lg w-[15%]  flex items-center justify-center bg-transparent transition-delay-1000"
                      type="submit"
                    >
                      <FontAwesomeIcon
                        className="mx-2 w-7 h-7 hover:w-8 hover:h-8 text-green-500 "
                        icon={faTelegramPlane}
                      />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchComponent;
