import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import queryString from "query-string";
import NavItem from "./NavItem";
import { NavLink } from "react-router-dom";
import { Logout } from "../../assets";
import { useState } from "react";
import CreateComponent from "./CreateComponent";

const Settings = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );

  const [option, setOption] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [active, setActive] = useState("");
  const dowellLogoutUrl =
    "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
    window.location.origin;
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(dowellLogoutUrl);
  };

  const openSearchModal = (Option) => {
    setOption(Option);
    setIsSearchModalOpen(true);
  };

  const options = [
    { label: "Create Line Manager", value: "createLineManager" },
    { label: "Create Topic", value: "createTopic" },
    { label: "Generate Link", value: "generateLink" },
  ];

  const handleSelect = (option) => {
    setActive(option.value);
    openSearchModal(option.value);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <section>
      <NavItem />
      <div className="absolute flex justify-between items-center w-full">
        <div className="bg-[#EDF2F3] h-screen md:w-[310px] flex flex-col ">
          <div className="text-white text-lg font-semibold py-4 px-6">
            Your Sidebar
          </div>
          <ul className="flex-1 overflow-y-auto mt-[100px] gap-20">
            {lineManagerCredentials.ownerType === true &&
              options.map((option) => (
                <NavLink
                  key={option.value}
                  className={`block py-2 px-6  hover:text-[#22C55E] hover:bg-[#e3fded] hover:border-r-3 hover:border-r-[#22C55E]  mt-2 font-[700] text-[#9F9C9C] text-center border-r-4 border-transparent ${
                    active === option.value &&
                    "border-r-3 border-r-[#22C55E] text-[#22C55E] bg-[#e3fded]"
                  }`}
                  onClick={() => handleSelect(option)}
                  activeClassName="bg-gray-700 border-blue-500"
                >
                  {option.label}
                </NavLink>
              ))}
          </ul>

          <div className="w-full text-cener justify-center items-center p-2 pb-5">
            <div
              className=" flex justify-center items-center mx-auto  w-full hover:w-[120px]  hover:bg-red-300 hover:font-bold rounded-sm duration-700"
              onClick={handleLogout}
            >
              <img className="w-5 h-5" src={Logout} alt="" />
              <button className=" py-2 px-2  text-[#9F9C9C] font-[600] ">
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {isSearchModalOpen && (
            <CreateComponent
              closeSearchModal={closeSearchModal}
              option={option}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Settings;
