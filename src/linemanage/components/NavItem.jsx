import { Link } from "react-router-dom";
import { Profile } from "../../assets";
import { useEffect, useState } from "react";
import queryString from "query-string";

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
    <div className="flex w-full md:px-5 top-0 fixed  justify-start z-50 bg-[#e3fded] items-center text-center">
      <div className="flex justify-start  w-full flex-2">
        <a className="flex justify-start  items-start ps-2.5 md:mb-2 sm:mb-2 md:mr-2 h-16">
          <img
            src="https://psp-logos.uptimerobot.com/logos/2021049-1676548510.png"
            className="md:w-16 md:h-16   rounded-md border-none"
            alt="Flowbite Logo"
          />
        </a>
        <h2 className="text-lg font-bold text-center max-md:hidden text-[#22C55E] flex justify-center items-center  ">
          Customer Support | Line Manager
        </h2>
        {/* <hr className="border-b-1 bg-slate-500 mx-auto w-[90%]" /> */}
      </div>
      {/* {!component && (
        <div className="flex-1 mr-3">
          <button
            onClick={handleLogout}
            className="mt-4 md:mr-12 ml-2 font-sans text-sm bg-[#ba513be1] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#cf6954e1] focus:outline-none "
          >
            Logout
          </button>
        </div>
      )} */}

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
          className={`absolute z-50 min-w-28 -left-16   pt-2  p-4  bg-white border border-gray-300 rounded shadow ${
            isHovered ? "block" : "hidden"
          }`}
        >
          <ul className="w-full flex flex-col gap-y-3 text-center">
            <li>
              <a className="hover:text-[#22C55E]" href="#">
                Profile
              </a>
            </li>
            <li>
              <Link
                className="hover:text-[#22C55E]"
                to={`/linemanage/settings?${queryParams}`}
              >
                Settings
              </Link>
            </li>
            <li>
              <a
                className="hover:text-[#22C55E]"
                href="#"
                onClick={handleLogout}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
