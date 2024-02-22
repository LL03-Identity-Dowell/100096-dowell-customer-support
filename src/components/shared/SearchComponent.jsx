// SearchComponent.js

import React, { useEffect, useRef, useState } from "react";

function SearchComponent({ closeSearchModal }) {
  const [searchValue, setSearchValue] = useState("");
  const [modalHeight, setModalHeight] = useState(80);
  const searchInputRef = useRef(null); // Ref for the search input
  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeSearchModal();
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Handle search submission, you can add your logic here
    console.log("Search submitted:", searchValue);
  };
  // Calculate the height of the modal dynamically based on the window height
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      // Set the modal height to 80% of the window height
      setModalHeight(windowHeight * 0.8);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    console.log(modalHeight);

    // Call handleResize initially
    handleResize();

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`fixed  h-auto md:h-full inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-overlay`}
      onClick={closeModal}
    >
      <div
        className={`bg-white h-[90%]  overflow-auto p-4 md:p-6 rounded-lg w-full max-w-md animate-fadeIn`}
      >
        <div className="flex justify-center items-center">
          <input
            ref={searchInputRef}
            type="text"
            className="w-[90%] px-5 outline-1 outline-slate-300 mx-auto bg-gray-100 p-2 rounded-3xl mb-4 flex-none"
            placeholder="Search with ticket number"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <h2 className="text-lg font-semibold flex-grow py-[45%] items-center justify-center mb-4 flex">
          Chat History
        </h2>

        <button
          onClick={handleSearchSubmit}
          className="flex-none w-4/5  border-2 border-green-300 hover:bg-green-500 text-zinc-600 transition duration-1000 ease-in-out font-bold py-2 px-4 rounded-full mx-auto block"
        >
          Chat
        </button>
        <div className="flex justify-end items-end w-full">
          <button
            onClick={closeSearchModal}
            className=" top-5 right-2 w-10 h-10 font-bold text-xl text-red-500  rounded-full p-2 hover:bg-red-400 text-zinc-60 transition duration-1000 ease-in-out hover:text-white"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
