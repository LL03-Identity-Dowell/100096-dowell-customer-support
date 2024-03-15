import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchTicketMessage } from "../Redux/ticketDetailSlice";
import formatCreatedAt from "../utils/datefromat";
//import { socket } from "../utils/Connection";
import { ClipLoader } from "react-spinners";
import io from "socket.io-client";

function TicketDetail() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  const ticketMessages = useSelector((state) => state.tickets.ticketMessage);
  const messageShow = ticketMessages.length > 0 ? ticketMessages.slice(-3) : [];

  useEffect(() => {
    // Define the function for fetching ticket messages
    const getTicketMessages = async (socket, selectedTicket) => {
      const workSpaceID = "646ba835ce27ae02d024a902";
      const api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";

      try {
        socket.emit("get_ticket_messages", {
          ticket_id: selectedTicket._id,
          product: selectedTicket.product,
          workspace_id: workSpaceID,
          api_key: api_key,
        });

        socket.on("ticket_message_response", (data) => {

          if (typeof data?.data === "object" && !Array.isArray(data?.data)) {
            return;
          }
          setLoading(false);

          if (data.status === "success") {
            dispatch(fetchTicketMessage(data?.data));
          } else {
            dispatch(fetchTicketMessage([]));
          }
        });
      } catch (error) {
        toast.warn(error.message);
      }
    };

    // Create a new socket connection
    const sockets = io.connect("https://www.dowellchat.uxlivinglab.online/");

    // If selectedTicket changes, fetch ticket messages
    if (Object.keys(selectedTicket).length > 0) {
      getTicketMessages(sockets, selectedTicket);
    }

    // Clean up the socket connection when the component unmounts or selectedTicket changes
    return () => {
      sockets.disconnect();
    };
  }, [selectedTicket]);
  return (
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
              <th className="py-3 px-6 text-left">{selectedTicket.product}</th>
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
          <tbody className="text-gray-600 text-sm font-light overflow-y-scroll">
            {console.log("ticket message", ticketMessages)}
            {messageShow.length > 0 &&
              messageShow.map((message) => {
                return (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-100"
                    key={message._id}
                  >
                    <td className="py-3 px-3 text-left">
                      {formatCreatedAt(message.created_at)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {message.message_data}
                    </td>
                  </tr>
                );
              })}
            {messageShow.length === 0 && (
              <p className="border-none hover:bg-gray-100">
                No previous messages
              </p>
            )}
            {Object.keys(selectedTicket).length > 0 && loading ? (
              <div className="d-flex mt-3  justify-center align-items-center mx-auto">
                <ClipLoader
                  color={"#22694de1"}
                  css={{
                    display: "block",
                    margin: "0 auto",
                    width: "50px",
                    height: "50px",
                  }}
                  size={30}
                />{" "}
                Loading
              </div>
            ) : (
              ""
            )}
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
  );
}

export default TicketDetail;
