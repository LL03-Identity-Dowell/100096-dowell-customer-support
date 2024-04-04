//eslint-disable-next-line
export default function NavItem({ component }) {
  const dowellLogoutUrl =
    "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
    window.location.origin;
  const handleLogout = () => {
    window.location.replace(dowellLogoutUrl);
  };
  return (
    <div className="flex md:flex-row ">
      <div className="md:flex md:flex-row h-300 w-full sm:flex-row flex-2">
        <a className="flex items-center ps-2.5 md:mb-2 sm:mb-2 w-[25%] h-16">
          <img
            src="https://psp-logos.uptimerobot.com/logos/2021049-1676548510.png"
            className="md:h-full md:w-[25%] mx-auto sm:w-[10%] rounded-md border-none"
            alt="Flowbite Logo"
          />
        </a>
        <h2 className="text-lg text-center justify-self-center self-center">
          Customer Support | Line Manager
        </h2>
        {/* <hr className="border-b-1 bg-slate-500 mx-auto w-[90%]" /> */}
      </div>
      {!component && (
        <div className="flex-1 mr-3">
          <button
            onClick={handleLogout}
            className="mt-4 md:mr-12 ml-2 font-sans text-sm bg-[#ba513be1] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#cf6954e1] focus:outline-none "
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
