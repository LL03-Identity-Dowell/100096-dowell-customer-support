import React, { useEffect, useLayoutEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateTicketContext } from "../../context/CreateTicketContext.jsx";

import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

const TicketMainContent = () => {
  const { createTicket } = useCreateTicketContext();
  const [getLinkRes, setGetLinkRes] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("Not assigned");
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [apiKey, setApiKey] = useState("1b834e07-c68b-4bf6-96dd-ab7cdc62f07f");
  const { search } = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const params = new URLSearchParams(search);
  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });
  const [getTicketMessages, setGetTicketMessages] = useState([]);
  const [ticketDetail, setTicketDetail] = useState({});

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    try {
      const storedcData = JSON.parse(
        localStorage.getItem("create_ticket_detail")
      );
      setTicketDetail(storedcData);

      const fetchApiKey = async () => {
        const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${params.get(
          "workspace_id"
        )}`;

        try {
          const response = await fetch(apiUrl);
          const responseData = await response.json();
          // setApiKey(responseData["data"]["api_key"]);
          setApiKey("1b834e07-c68b-4bf6-96dd-ab7cdc62f07f");
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchApiKey();

      if (apiKey) {
        socket.emit("get_share_link_details", {
          workspace_id: params.get("workspace_id"),
          link_id: params.get("link_id"),
          api_key: apiKey,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    // socket.on("ticket_message_response", (data) => {
    //   // Handle response for the event
    //   console.log(data);
    // });
    socket.on("share_link_response", (data) => {
      if (Array.isArray(data?.data)) {
        setGetLinkRes(data?.data);
      } else {
        toast.error(data?.data);
        console.error(
          "Expected an array for getLinkRes, received:",
          data?.data
        );
        setGetLinkRes([]);
      }
    });
  }, []);
  socket.on("ticket_message_response", (data) => {
    // setGetTicketMessages(data["data"]);
    console.log("data", data);
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);
      setCreatingTicket(true);

      const payload = {
        email: values.email,
        created_at: new Date().toISOString(),
        link_id: params.get("link_id"),
        workspace_id: params.get("workspace_id"),
        api_key: apiKey,
        product: values.topic,
      };
      socket.emit("create_ticket", payload);

      await new Promise((resolve) => {
        if (socket) {
          socket.on("ticket_response", (data) => {
            if (data["status"] == "success") {
              createTicket(data["data"]);

              setTicketNumber(data["data"]["_id"]);
              localStorage.setItem(
                "create_ticket_detail",
                JSON.stringify(data["data"])
              );
              const get_ticket_messages_payload = {
                ticket_id: data["data"]["_id"],
                product: data["data"]["product"],
                workspace_id: params.get("workspace_id"),
                api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
              };

              socket.emit("get_ticket_messages", get_ticket_messages_payload);

              toggleChat();
            } else {
              setTicketNumber(data["data"]);
            }
          });
        }
      });

      actions.setSubmitting(false);
      setCreatingTicket(false);
      return () => {
        socket.disconnect();
      };
    } catch (error) {
      setCreatingTicket(false);
      console.log(error);
    }
  };

  const ChatForm = ({ onClose }) => {
    const [message, setMessage] = useState("");

    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };

    const handleSend = () => {
      if (message.trim() !== "" && ticketDetail) {
        localStorage.getItem("create_ticket_detail");
        console.log(ticketDetail["_id"]);
        console.log("Sending message:", message);

        const ticket_message_payload = {
          ticket_id: ticketDetail["_id"],
          product: ticketDetail["product"],
          message_data: message,
          user_id: params.get("link_id"),
          reply_to: "None",
          workspace_id: params.get("workspace_id"),
          api_key: apiKey,
          created_at: new Date().toDateString(),
        };

        socket.emit("ticket_message_event", ticket_message_payload);

        setMessage("");
      }
      return;
    };
    return (
      <div className="fixed top-72 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[600px] min-h-[70%] max-h-[85%] bg-gray-800 rounded-lg shadow-lg z-10">
        <div className="p-4 pb-0">
          <h2 className="text-lg text-white font-semibold mb-2">
            {JSON.parse(localStorage.getItem("create_ticket_detail"))._id}
          </h2>
          <div className=" p-4 rounded-lg shadow-lg overflow-y-auto mt-10 pb-10 ">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs">
                Hello there!
              </div>
              <span className="ml-2 text-gray-500 text-sm">12:30 PM</span>
            </div>
          </div>
          <form>
            <div className="pt-[230px]">
              <div className="flex gap-x-2">
                <input
                  id="message"
                  className="w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={handleMessageChange}
                />
                <button
                  className=" bg-blue-600 text-white  py-2 rounded-lg w-30% p-2 flex items-center justify-center hover:bg-blue-700"
                  onClick={handleSend}
                  type="button"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
        <button
          className="absolute top-2 right-2 mt-1 pt-1 text-red-600 font-extrabold  rounded-full p-1 transition-all duration-1000 hover:bg-slate-700  "
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto py-3 px-5 bg-white rounded -mt-2">
      <Formik
        initialValues={{ topic: "", email: "", identity: "" }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="text-center">
            <div className="mb-4 relative">
              <Field
                as="select"
                name="topic"
                className="block px-5 w-full bg-white border border-gray-300 rounded py-3 text-[20px] font-sans cursor-pointer focus:outline-none focus:border-gray-500"
                onChange={handleChange}
              >
                <option
                  value=""
                  className="text-2xl bg-gray-300 mb-5 text-center"
                >
                  Topics
                </option>
                {getLinkRes !== null ? (
                  getLinkRes?.map((linkRes, index) => {
                    const objectToArray = Object.entries(
                      linkRes["product_distribution"]
                    );
                    const filteredArray = objectToArray.filter(
                      ([key, value]) => value !== 0
                    );
                    return filteredArray.map((dist, index) => (
                      <option
                        value={dist[0]}
                        key={index}
                        className="text-center"
                      >
                        {dist[0]}
                      </option>
                    ));
                  })
                ) : (
                  <option
                    value=""
                    className="py-5 flex justify-center items-center text-center text-green-500 my-3"
                    disabled
                  >
                    Loading...
                  </option>
                )}
              </Field>
            </div>
            <p className="font-bold">Waiting time - 00 Minutes</p>
            <div className="my-4">
              <Field
                autoComplete="off"
                type="email"
                name="email"
                placeholder="Email ID"
                className="block w-full text-center outline-none bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-gray-500"
                onChange={handleChange}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <h2 className="text-[26px] font-bold hover:text-black">
              Ticket number
            </h2>
            <h2 className="text-[26px] font-bold text-green-500">
              {ticketNumber}
            </h2>
            <div className="my-4">
              <label htmlFor="noIdentity" className="radio_style">
                <Field
                  type="radio"
                  name="identity"
                  id="noIdentity"
                  value="No Identity"
                  className="form-radio"
                  onChange={handleChange}
                />
                <span className="ml-2">No Identity</span>
              </label>
              <label htmlFor="faceId" className="radio_style">
                <Field
                  type="radio"
                  name="identity"
                  id="faceId"
                  value="Face ID"
                  className="form-radio"
                  onChange={handleChange}
                />
                <span className="ml-2">Face ID</span>
              </label>
              <label htmlFor="otp" className="radio_style">
                <Field
                  type="radio"
                  name="identity"
                  id="otp"
                  value="OTP"
                  className="form-radio"
                  onChange={handleChange}
                />
                <span className="ml-2">OTP</span>
              </label>
              <label htmlFor="idNumber" className="radio_style">
                <Field
                  type="radio"
                  name="identity"
                  id="idNumber"
                  value="ID Number"
                  className="form-radio"
                  onChange={handleChange}
                />
                <span className="ml-2">ID Number</span>
              </label>
            </div>
            {creatingTicket ? (
              <button
                type="submit"
                disabled
                className="border-2  border-green-300 cursor-not-allowed bg-green-300 transition duration-1000 ease-in-out font-semibold py-2 w-[80%] rounded-3xl focus:outline-none focus:bg-blue-600"
              >
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-slate-600 rounded-full"></div>
                </div>
              </button>
            ) : (
              <button
                type="submit"
                className="border-2 border-green-300 hover:bg-green-500 transition duration-1000 ease-in-out font-semibold py-2 w-[80%] rounded-3xl focus:outline-none focus:bg-blue-600"
              >
                Create ticket
              </button>
            )}
          </Form>
        )}
      </Formik>

      {isChatOpen && <ChatForm onClose={toggleChat} />}
    </div>
  );
};

export default TicketMainContent;
