//eslint-disable-next-line
export default function NavItem({ component }) {
  const dowellLogoutUrl =
    "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
    window.location.origin;
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(dowellLogoutUrl);
  };
  return (
    <div className="flex justify-start bg-[#22C55E] bg-opacity-[9%] items-center text-center">
      <div className="flex justify-start  w-full flex-2">
        <a className="flex justify-start  items-start ps-2.5 md:mb-2 sm:mb-2 md:mr-2 h-16">
          <img
            src="https://psp-logos.uptimerobot.com/logos/2021049-1676548510.png"
            className="md:w-16 md:h-16  md:ml-5 rounded-md border-none"
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

      {/* <div>
        <FaUser />
      </div> */}
    </div>
  );
}
