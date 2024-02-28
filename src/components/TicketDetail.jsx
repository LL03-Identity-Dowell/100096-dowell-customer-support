import Chat from "./ChatSummary";

function TicketDetail() {
  return (
    <>
      <div className="flex-1 w-full m-6 mx-3 ml-1 px-1 rounded-none border-none md:min-w-[300px] shadow-lg">
        <div className="w-[100%] flex flex-col text-center">
          <div className="w-full bg-[#436850] text-white border-2 rounded-md py-3 sm:text-sm md:text-[16px] font-sans">
            <h3 className="uppercase">Ticket number</h3>
            <p>0000000000</p>
            <p className="uppercase">Level - 01</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className=" uppercase text-sm leading-normal">
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
          <table className="w-full">
            <tbody className="text-gray-600 text-sm font-light">
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">12 Feb 2023</td>
                <td className="py-3 px-6 text-left">hey! need help</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">12 Dec 2023</td>
                <td className="py-3 px-6 text-left">working</td>
              </tr>
              <tr className="border-none hover:bg-gray-100">
                <td className="py-3 px-6 text-left">12 Jan 2023</td>
                <td className="py-3 px-6 text-left">hello</td>
              </tr>
            </tbody>
          </table>
          {/*
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
  */}
        </div>
      </div>
      <div className="flex-1 w-full  mt-6">
        <Chat isOpen={true} />
      </div>
    </>
  );
}

export default TicketDetail;
