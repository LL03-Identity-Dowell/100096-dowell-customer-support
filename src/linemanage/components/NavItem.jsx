import { Link } from "react-router-dom";
import { Profile, logo } from "../../assets";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

//eslint-disable-next-line
export default function NavItem({ component }) {
  const [isHovered, setIsHovered] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionParam = url.searchParams.get("session_id");
    const idParam = url.searchParams.get("id");
    setSessionId(sessionParam);
    setId(idParam);
  }, []);

  const queryParams = queryString.stringify({
    session_id: sessionId,
    id: id,
  });

  const dowellLogoutUrl =
    "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
    window.location.origin;
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(dowellLogoutUrl);
  };

  return (
    <div className="flex w-full px-2 md:px-5 top-0   fixed  justify-start z-50 border-b-2  h-16 bg-[#e9fdf1] items-center text-center">
      <div className="flex justify-start  w-full flex-2">
        <Link
          to={`/linemanage/?${queryParams}`}
          className="flex justify-start flex-2"
        >
          <a className="flex justify-start text-center items-center  md:mr-2 h-14">
            <img
              src={logo}
              className="w-14 h-14  text-center   rounded-md border-none"
              alt="Dowell"
            />
          </a>
          <h2 className="text-lg font-bold text-center  text-[#22C55E] flex justify-center items-center  ">
            <span className="max-md:hidden">Customer Support | </span> Line
            Manager
          </h2>
          {/* <hr className="border-b-1 bg-slate-500 mx-auto w-[90%]" /> */}
        </Link>
      </div>

      <div
        className="relative max-w-[50px] text-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative inline-block cursor-pointer">
          <img className="w-8 h-8" src={Profile} alt="Profile" />
        </div>
        <div
          onMouseEnter={() => setIsHovered(true)}
          className={`absolute z-50 min-w-28 -left-24 md:-left-20  pt-2  p-4  bg-white border border-gray-300 rounded shadow ${
            isHovered ? "block" : "hidden"
          }`}
        >
          <ul className="w-full flex flex-col justify-start items-start gap-y-3 text-start">
            <li>
              <Link
                className="hover:text-[#22C55E] flex justify-center items-center gap-2"
                href="#"
              >
                <FaUser className="text-[#22C55E]" /> Profile
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-[#22C55E] flex justify-center items-center gap-2"
                to={`/linemanage/settings?${queryParams}`}
              >
                <IoSettingsSharp className="text-[#22C55E]" /> Settings
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-[#22C55E] flex justify-center items-center gap-2"
                onClick={handleLogout}
              >
                <FiLogOut className="text-[#22C55E] font-bold" /> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
