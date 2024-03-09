import { useEffect } from "react";
import Chat from "./ChatSummary";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchTicketMessage } from "../Redux/ticketDetailSlice";
import io from "socket.io-client";
function TicketDetail() {
  const dispatch = useDispatch();
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  const ticketMessages = useSelector((state) => state.tickets.ticketMessage);

  const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
  console.log("socket", socket);
  useEffect(() => {
    const getTicketMessages = async (workSpaceID, api_key) => {
      workSpaceID = "646ba835ce27ae02d024a902";
      api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
      try {
        await socket.emit("get_ticket_messages", {
          ticket_id: selectedTicket._id,
          product: selectedTicket.product,
          workspace_id: workSpaceID,
          api_key: api_key,
        });
        socket.on("ticket_message_response", (data) => {
          // Handle response for the event
          console.log("ticket message", data);
          if (data.status === "success") {
            dispatch(fetchTicketMessage(data?.data));
          }
        });
      } catch (error) {
        toast.warn(error.message);
      }
    };
    selectedTicket && getTicketMessages(22, 233);
  }, [selectedTicket, dispatch, socket]);
  return (
    <>
      <div className="flex-1 w-full m-3 mx-3 ml-1 px-1 rounded-none border-none md:min-w-[300px] h-svh shadow-lg">
        <div className="w-[100%] flex flex-col text-center">
          <div className="w-full bg-[#436850] text-white border-2 rounded-md py-3 sm:text-sm md:text-[16px] font-sans">
            <h3 className="uppercase">Ticket ID </h3>
            <p>{selectedTicket._id}</p>
            <p className="uppercase">Level - 01</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className=" uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Topic</th>
                <th className="py-3 px-6 text-left">
                  {selectedTicket.product}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">Email:</td>
                <td className="py-3 px-6 text-left">{selectedTicket.email}</td>
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
              {console.log("ticket message", ticketMessages)}
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
      <div className="flex-1 w-full h-full  mt-3">
        <Chat isOpen={true} />
      </div>
    </>
  );
}

export default TicketDetail;
