import { NavLink, Outlet } from "react-router-dom";
function Dashboard() {
  return (
    <div className="flex justify-between md:flex-row  sm:flex-col ">
      <div className="bg-white shadow-md my-6 ml-2 flex-2 rounded-lg  border-2 border-gray-200">
        <table className="min-w-max w-full">
          <thead>
            <tr className="bg-[#22694de1] text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left w-4 border-r-2 border-r-[#1a543ee1]">
                SN
              </th>
              <th className="py-3 px-6 text-left w-32 border-r-2 border-r-[#1a543ee1]">
                Line/Service Desk Name
              </th>
              <th className="py-3 px-6 text-left w-32 border-r-2 border-r-[#1a543ee1]">
                Service Manager
              </th>
              <th className="py-3 px-6 text-left w-56">Tickets in waiting</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left ">1</td>
              <td className="py-3 px-6 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 mr-2 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-1 common
              </td>
              <td className="py-3 px-6 text-left">Thomas</td>
              <td className="py-3 px-6 text-left">
                <div className="flex justify-start gap-6">
                  <div className="bg-blue-200 rounded-sm p-2">
                    {/* Content for Box 1 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 2 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 3 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 4 goes here */}
                  </div>
                </div>
                <div className="flex align-middle mt-1">
                  {/* <span className="text-md text-green-900">[</span> */}
                  <span className="text-md">99</span>
                  <span className="text-md">&gt;</span>
                  <span className="text-md">Waiting,</span>
                  <span className="text-md">Service time</span>
                  <span className="text-md">&lt;</span>
                  <span className="text-md">0.99</span>
                  {/* <span className="text-md">]</span> */}
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">2</td>
              <td className="py-3 px-6 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 mr-2 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-2 common
              </td>
              <td className="py-3 px-6 text-left">Kumar</td>
              <td className="py-3 px-6 text-left">
                <div className="flex justify-start gap-6">
                  <div className="bg-blue-200 rounded-sm p-2">
                    {/* Content for Box 1 goes here */}
                  </div>
                  <div className="bg-blue-200 rounded-sm p-2">
                    {/* Content for Box 2 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 3 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 4 goes here */}
                  </div>
                </div>
                <div className="flex align-middle mt-1">
                  {/* <span className="text-lg text-green-900">[</span> */}
                  <span className="text-md">97</span>
                  <span className="text-md">&gt;</span>
                  <span className="text-md">Waiting,</span>
                  <span className="text-md">Service time</span>
                  <span className="text-md">&lt;</span>
                  <span className="text-md">0.99</span>
                  {/* <span className="text-lg">]</span> */}
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">3</td>
              <td className="py-3 px-6 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 mr-2 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-3 common
              </td>
              <td className="py-3 px-6 text-left">John</td>
              <td className="py-3 px-6 text-left">
                <div className="flex justify-start gap-6">
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 1 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 2 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 3 goes here */}
                  </div>
                  <div className="bg-green-200 rounded-sm p-2">
                    {/* Content for Box 4 goes here */}
                  </div>
                </div>
                <div className="flex align-middle mt-1 ">
                  {/* <span className="text-lg text-green-900">[</span> */}
                  <span className="text-md">98</span>
                  <span className="text-md">&gt;</span>
                  <span className="text-md">Waiting,</span>
                  <span className="text-md">Service time</span>
                  <span className="text-md">&lt;</span>
                  <span className="text-md">0.99</span>
                  {/* <span className="text-lg">]</span> */}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center items-center my-10">
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">
            &lt;
          </button>{" "}
          {/* Backward button */}
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1  rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`/ticketDetail/1`}
          >
            1
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1   rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`/ticketDetail/2`}
          >
            2
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1  rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`/ticketDetail/3`}
          >
            3
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1  rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`/ticketDetail/4`}
          >
            4
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `px-3 py-1   rounded-md mr-2 ${
                isActive ? "bg-[#22694de1] text-white" : "bg-gray-200 "
              }`
            }
            to={`/ticketDetail/5`}
          >
            5
          </NavLink>
          <NavLink className="px-3 py-1 bg-gray-200 rounded-md">&gt;</NavLink>{" "}
          {/* Forward button */}
        </div>
        <div className="flex justify-center gap-4 mb-7 w-full pr-3">
          <div className="mr-auto w-full flex justify-center gap-5">
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Close Line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Split line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Merge line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md">
              Serve line
            </button>
            {/* <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Chat Manager
            </button> */}
          </div>
          {/* <button className="bg-red-400 ml-auto hover:bg-red-500 text-white font-bold py-1.5 px-2 rounded-lg ">
            Logout
          </button> */}
        </div>
      </div>
      {/* ticket detail */}
      <Outlet />
      {/* <TicketDetail /> */}
    </div>
  );
}

export default Dashboard;
