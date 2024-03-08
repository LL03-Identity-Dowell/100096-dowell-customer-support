import { useState } from "react";
import { CiSearch } from "react-icons/ci";

import "../dropdown.css"; // Import CSS for styling (create a Dropdown.css file)

//eslint-disable-next-line
function Dropdowns({ search }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setDropdownOpen(false);
  };

  return (
    <div className="dropdown-container w-full">
      <div className="search-container rounded-lg  border-solid px-3 py-1 border-2 focus:border-[#22694de1]">
        <input
          type="text"
          value={searchTerm}
          placeholder={search}
          onClick={toggleDropdown}
          onChange={handleInputChange}
          className="rounded-lg w-full border-none outline-none"
        />
        <span className="search-icon text-lg">
          <CiSearch />
        </span>
      </div>
      {isDropdownOpen && (
        <div className="dropdown rounded-md">
          <div className="option" onClick={() => handleOptionClick("Option 1")}>
            Option 1
          </div>
          <div className="option" onClick={() => handleOptionClick("Option 2")}>
            Option 2
          </div>
          <div className="option" onClick={() => handleOptionClick("Option 3")}>
            Option 3
          </div>
          {/* Add more options as needed */}
        </div>
      )}
    </div>
  );
}

export default Dropdowns;
