import React from "react";

const Toggler = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center justify-center pl-1 text-center h-10 w-10  rounded-full  duration-1000 hover:bg-slate-600">
      <button
        className="p-1 h-full w-full -mt-1  text-center  mx-auto  "
        onClick={toggleDarkMode}
      >
        <div className={`text-xl icon ${darkMode ? "dark" : ""}`} />
      </button>
    </div>
  );
};

export default Toggler;
