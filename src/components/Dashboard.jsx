import { useState } from "react";
import Chat from "./ChatSummary";
function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="flex justify-between md:flex-row sm:flex-col ">
      <div className="bg-white shadow-md my-6 ml-2 w-full flex-2 rounded-lg  border-2 border-gray-200">
        <table className="min-w-max w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left w-4 border-r-2 border-r-green-500">
                SN
              </th>
              <th className="py-3 px-6 text-left w-32 border-r-2 border-r-green-500">
                Line/Service Desk Name
              </th>
              <th className="py-3 px-6 text-left w-32 border-r-2 border-r-green-500">
                Service Manager
              </th>
              <th className="py-3 px-6 text-left w-56">Tickets in waiting</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">1</td>
              <td className="py-3 px-6 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 mr-2 text-indigo-600 transition duration-150 ease-in-out"
                />
                Till-1 common
              </td>
              <td className="py-3 px-6 text-left">Thomas</td>
              <td className="py-3 px-6 text-left">
                <div className="flex justify-between">
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
                <div className="flex align-middle ">
                  <span className="text-lg text-green-900">[</span>
                  <span className="text-lg">99</span>
                  <span className="text-lg">&gt;</span>
                  <span className="text-lg">Waiting,</span>
                  <span className="text-lg">Service time</span>
                  <span className="text-lg">&lt;</span>
                  <span className="text-lg">0.99</span>
                  <span className="text-lg">]</span>
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
                <div className="flex justify-between">
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
                <div className="flex align-middle ">
                  <span className="text-lg text-green-900">[</span>
                  <span className="text-lg">97</span>
                  <span className="text-lg">&gt;</span>
                  <span className="text-lg">Waiting,</span>
                  <span className="text-lg">Service time</span>
                  <span className="text-lg">&lt;</span>
                  <span className="text-lg">0.99</span>
                  <span className="text-lg">]</span>
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
                <div className="flex justify-between">
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
                <div className="flex align-middle ">
                  <span className="text-lg text-green-900">[</span>
                  <span className="text-lg">98</span>
                  <span className="text-lg">&gt;</span>
                  <span className="text-lg">Waiting,</span>
                  <span className="text-lg">Service time</span>
                  <span className="text-lg">&lt;</span>
                  <span className="text-lg">0.99</span>
                  <span className="text-lg">]</span>
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
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">1</button>
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">2</button>
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">3</button>
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">4</button>
          <button className="px-3 py-1 bg-gray-200 rounded-md mr-2">5</button>
          <button className="px-3 py-1 bg-gray-200 rounded-md">
            &gt;
          </button>{" "}
          {/* Forward button */}
        </div>
        <div className="flex justify-center gap-4 mb-7 w-full pr-3">
          <div className="mr-auto w-full flex justify-center gap-5">
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Close Line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Split line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Merge line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Serve line
            </button>
            <button className="bg-[#22694de1] hover:bg-green-700 text-white font-bold py-0 px-2 rounded-lg">
              Chat Manager
            </button>
          </div>
          <button className="bg-red-400 ml-auto hover:bg-red-500 text-white font-bold py-1.5 px-2 rounded-lg ">
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col m-6 ml-1 rounded-lg  border-2 border-gray-150">
        <div className="w-full flex flex-col text-center">
          <h3>Ticket number</h3>
          <p>0000000000</p>
          <p>Level - 01</p>
          <table className="min-w-[500px] table-fixed">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Topic</th>
                <th className="py-3 px-6 text-left">Login error</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">Email:</td>
                <td className="py-3 px-6 text-left">abc@gmail.com</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">User Type:</td>
                <td className="py-3 px-6 text-left">Public</td>
              </tr>
            </tbody>
          </table>
          <h3 className="my-5 text-lg">Previous Chat</h3>
          <table className="min-w-[500px] table-fixed">
            <tbody className="text-gray-600 text-sm font-light">
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">12 Feb 2023</td>
                <td className="py-3 px-6 text-left">hey! need help</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">12 Dec 2023</td>
                <td className="py-3 px-6 text-left">working</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">12 Jan 2023</td>
                <td className="py-3 px-6 text-left">hello</td>
              </tr>
            </tbody>
          </table>
          <div className="App">
            <button
              onClick={toggleChat}
              className="fixed bottom-4 right-5 py-2 px-4 rounded-md shadow-md"
            >
              <img
                className="w-17 h-12 rounded-md"
                src="chatimage.svg"
                alt=""
              />
            </button>
            <Chat isOpen={isChatOpen} onClose={toggleChat} />
          </div>
        </div>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}

export default Dashboard;
