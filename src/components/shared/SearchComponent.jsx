import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreatedTicketChat from "./CreatedTicketChat";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

function SearchComponent({ closeSearchModal, openSearchModal }) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const [apiKey, setApiKey] = useState("");
  const [getLinkRes, setGetLinkRes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
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

    if (ticket) {
      setTicket(ticket);
    } else {
      setTicket(null);
      setError("Ticket Not found");
    }
    setLoading(false);
  });

  useEffect(() => {
    const fetchApiKey = async () => {
      const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${params.get(
        "workspace_id"
      )}`;

      try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        setApiKey(responseData["data"]["api_key"]);
        // setApiKey("1b834e07-c68b-4bf6-96dd-ab7cdc62f07f");
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

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.disconnect();
    };
  }, []);

  socket.on("share_link_response", (data) => {
    if (Array.isArray(data?.data)) {
      setGetLinkRes(data?.data);
    } else {
      toast.error(data?.data);
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

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const toggleChat = () => {
    setOpenChat(!openChat);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      {!openChat ? (
        <div
          className={`fixed w-full  h-full inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-overlay`}
          onClick={closeModal}
        >
          <div
            className={`bg-white w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] h-[300px] -mt-72 overflow-auto px-10 py-6 md:p-6 rounded-lg min-w-xl animate-fadeIn`}
          >
            <div className="flex justify-center items-center  ">
              <div className="relative inline-block text-left mr-2">
                <div>
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
                        <div className="flex justify-center  items-center  w-32 p-2 -ml-2">
                          <div className="animate-spin h-6 w-6 border-t-2  mx-auto text-center   border-gray-900 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={searchInputRef}
                type="text"
                id="ticket_id"
                className="w-[70%] px-5  outline-1 outline-slate-300 mx-auto bg-gray-100 p-2 rounded-3xl  flex-none"
                placeholder="Search with ticket number"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <button
                onClick={handleSearch}
                className=" right-3 pt-10 flex transform transition duration-1000 -translate-y-1/2 px-2 w-12 h-12 font-bolder text-xl  text-indigo-300 rounded-full hover:text-indigo-600"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <div className="h-2/4">
              {ticket !== null && !loading ? (
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

                  {error && (
                    <div className="flex justify-center items-center mt-16 text-red-400">
                      {" "}
                      Ticket Not Found{" "}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CreatedTicketChat
          onClose={toggleChat}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </>
  );
}

export default SearchComponent;
