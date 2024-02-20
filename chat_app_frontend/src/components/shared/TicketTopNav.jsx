import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faTimes } from "@fortawesome/free-solid-svg-icons";

const TicketTopNav = () => {
  return (
    <nav className=" max-md:px-3 md:px-16  xl:px-20  max-md:py-2 py-5 flex justify-end items-center w-full">
      <div className="flex items-center space-x-4">
        <button className="text-yellow-500 w-10 h-10 hover:text-yellow-600 hover:bg-yellow-100 transition-colors rounded-full p-1">
          <FontAwesomeIcon icon={faSearch} className="text-lg" />
        </button>
        <button className="text-green-500 w-10 h-10 hover:text-green-600 hover:bg-green-100 transition-colors rounded-full p-1">
          <FontAwesomeIcon icon={faUser} className="text-lg" />
        </button>

        <button className="text-red-500  w-10 h-10 hover:bg-red-400 hover:text-white transition-colors rounded-full p-1">
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>
    </nav>
  );
};

export default TicketTopNav;
