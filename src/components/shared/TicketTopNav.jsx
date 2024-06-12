import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import SearchComponent from "./SearchComponent";
//eslint-disable-next-line
const TicketTopNav = ({ openSearchModal }) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleButtonClick = () => {
    setShowSearch(true);
  };

  return (
    <nav className=" sm:pr-[30%] max-md:py-5 py-3 flex justify-end  items-center w-full">
      <div className="flex items-center space-x-4">
        <button
          onClick={openSearchModal}
          className="text-yellow-500 w-10 h-10 hover:text-yellow-600 hover:bg-yellow-100 transition-colors rounded-full p-1"
        >
          <FontAwesomeIcon icon={faSearch} className="text-lg" />
        </button>
        <button className="text-green-500 w-10 h-10 hover:text-green-600 hover:bg-green-100 transition-colors rounded-full p-1">
          <Link to="/sign-in">
            <FontAwesomeIcon icon={faUser} className="text-lg" />
          </Link>
        </button>

        <button className="text-red-500  w-10 h-10 hover:bg-red-400 hover:text-white transition-colors rounded-full p-1">
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>
      {showSearch && <SearchComponent />}
    </nav>
  );
};

export default TicketTopNav;
