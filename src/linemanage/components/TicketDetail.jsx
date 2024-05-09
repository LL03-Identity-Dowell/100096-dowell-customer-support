//import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import formatCreatedAt from "../utils/datefromat";

function TicketDetail() {
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  const ticketMessages = useSelector((state) => state.tickets.ticketMessage);

  const messageShow = ticketMessages.length > 0 ? ticketMessages.slice(-3) : [];

  return (
    <div className="flex-1 w-full  mx-1 my-3 px-1    border border-[#5B5B5B] md:min-w-[300px] h-svh rounded-lg shadow-lg">
      <div className="w-[100%] flex flex-col  text-center ">
        <div className="w-full bg-[#22C55E] text-white border-2 rounded-t-lg py-3 sm:text-sm md:text-[16px] font-sans">
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
            <tr className="border-b mx-auto border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">User Type:</td>
              <td className="py-3 px-6 text-left">Public</td>
            </tr>
          </tbody>
        </table>
        <h3 className="my-5 font-bold">Previous Chat</h3>
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

            {/* {Object.keys(selectedTicket).length > 0 && loading ? (
              <div className="d-flex mt-3  justify-center align-items-center mx-auto">
                <ClipLoader
                  color={"#22694de1"}
                  css={{
                    display: "block",
                    margin: "0 auto",
                    width: "50px",
                    height: "50px",
                  }}
                  size={40}
                />{" "}
                <small className="text-xs">Loading chat history ...</small>
              </div>
            ) : (
              ""
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketDetail;
