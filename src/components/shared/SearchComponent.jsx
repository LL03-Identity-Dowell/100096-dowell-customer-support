import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

function SearchComponent({ closeSearchModal }) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const ticketData = JSON.parse(localStorage.getItem("create_ticket_detail"));
  const [searchValue, setSearchValue] = useState("");
  const [chatData, setChatData] = useState([]);
  const searchInputRef = useRef(null);

  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeSearchModal();
    }
  };

  useEffect(() => {
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
      // Close socket connection when component is unmounted
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("ticket_message_response", (data) => {
      setChatData(data["data"]);
      console.log(data["data"]);
    });
  }, [socket]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    console.log("Search submitted:", searchValue);
  };

  const handleSearchHistory = () => {
    if (ticketData) {
      setSearchValue(ticketData["_id"]);
      socket.emit("get_ticket_messages", {
        ticket_id: ticketData["_id"],
        product: ticketData["product"],
        workspace_id: params.get("workspace_id"),
        api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
      });
    } else {
      return;
    }
  };

  return (
    <div
      className={`fixed h-auto md:h-full inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-overlay`}
      onClick={closeModal}
    >
      <div
        className={`bg-white h-[90%] overflow-auto p-4 md:p-6 rounded-lg w-full max-w-md animate-fadeIn`}
      >
        <div className="flex justify-center items-center">
          <input
            ref={searchInputRef}
            type="text"
            id="ticket_id"
            className="w-[90%] px-5 outline-1 outline-slate-300 mx-auto bg-gray-100 p-2 rounded-3xl mb-4 flex-none"
            placeholder="Search with ticket number"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <h2 className="text-lg font-semibold flex-grow py-[45%] items-center justify-center mb-4 flex">
          {chatData.length === 0 ? "Your Chat History" : "No Chat History"}
        </h2>

        <button
          onClick={handleSearchHistory}
          type="button"
          className="flex-none w-4/5 border-2 border-green-300 hover:bg-green-500 text-zinc-600 transition duration-1000 ease-in-out font-bold py-2 px-4 rounded-full mx-auto block"
        >
          Chat
        </button>
        <div className="flex justify-end items-end w-full">
          <button
            onClick={closeSearchModal}
            className="top-5 right-2 w-10 h-10 font-bold text-xl text-red-500 rounded-full p-2 hover:bg-red-400 text-zinc-60 transition duration-1000 ease-in-out hover:text-white"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
