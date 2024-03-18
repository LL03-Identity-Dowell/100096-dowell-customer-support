import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateTicketContext } from "../../context/CreateTicketContext.jsx";
import formatCreatedAt from "../../linemanage/utils/datefromat.js";
import { chat } from "../../assets/index.js";
import io from "socket.io-client";
import Toggler from "./Toggler.jsx";
import { faTelegramPlane } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClipLoader } from "react-spinners";
import CreateTicketSchema from "../../schema/CreateTicketSchema.jsx";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

const TicketMainContent = () => {
  const form = useRef();
  const [messages, setMessages] = useState([]);
  const { createTicket } = useCreateTicketContext();
  const [getLinkRes, setGetLinkRes] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("Not assigned");
  const [apiKey, setApiKey] = useState("1b834e07-c68b-4bf6-96dd-ab7cdc62f07f");
  const { search } = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const params = new URLSearchParams(search);
  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });
  const [ticketDetail, setTicketDetail] = useState({});
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("create_ticket_detail"))) {
      const fetchData = async () => {
        try {
          const ticketId = JSON.parse(
            localStorage.getItem("create_ticket_detail")
          )._id;
          const product = JSON.parse(
            localStorage.getItem("create_ticket_detail")
          ).product;

          await socket.emit("get_ticket_messages", {
            ticket_id: ticketId,
            product: product,
            workspace_id: params.get("workspace_id"),
            api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
          });
          socket.on("ticket_message_response", (data) => {
            const ticketMessages = data.data;
            let current_user = "12345";
            async function chat() {
              if (ticketMessages.length > 0) {
                try {
                  let messages = await Promise.all(
                    ticketMessages.map((message) => {
                      return {
                        id: message._id,
                        sender:
                          message.author !== current_user ? "receiver" : "user",
                        type: "text",
                        content: message.message_data,
                        created_at: message.created_at,
                      };
                    })
                  );
                  //console.log("loading", loading);
                  if (messages.length > 0) {
                    //  console.log("inner loading", loading);
                    setMessages(messages);
                  }
                } catch (error) {
                  console.log(error);
                  //setLoading(false);
                }
                // setLoading(false);
              } else {
                setMessages([]);
              }
            }

            chat();
          });
        } catch (error) {
          console.error("Error fetching ticket messages:", error);
        }
      };

      fetchData();
    }
    if (!socket) return;

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
  }, []);

  socket.on("share_link_response", (data) => {
    if (Array.isArray(data?.data)) {
      setGetLinkRes(data?.data);
    } else {
      toast.error(data?.data);
      console.error("Expected an array for getLinkRes, received:", data?.data);
      setGetLinkRes([]);
    }
  });

  socket.on("ticket_message_response", (data) => {
    if (data.status === "success") {
      const { author, created_at, message_data } = data.data;
      let current_user = "12345";

      const message = {
        id: messages.length + 1,
        sender: author !== current_user ? "receiver" : "user",
        type: "text",
        content: message_data,
        created_at: created_at,
      };

      setMessages([...messages, message]);
      setIsChatOpen(true);
    }
  });

  let messageToDisplay = [...messages]
    .filter((message) => message.content !== "") // Filter out items with empty content
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (values, actions) => {
    try {
      actions.setSubmitting(true);

      const payload = {
        email: values.email,
        created_at: new Date().toISOString(),
        link_id: params.get("link_id"),
        workspace_id: params.get("workspace_id"),
        api_key: apiKey,
        product: values.topic,
      };
      await socket.emit("create_ticket", payload);

      await new Promise((resolve) => {
        socket.on("ticket_response", (data) => {
          if (data.status === "success") {
            createTicket(data.data);

            setTicketNumber(data.data._id);
            localStorage.setItem(
              "create_ticket_detail",
              JSON.stringify(data.data)
            );
            const getTicketMessagesPayload = {
              ticket_id: data.data._id,
              product: data.data.product,
              workspace_id: params.get("workspace_id"),
              api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
            };

            socket.emit("get_ticket_messages", getTicketMessagesPayload);

            toggleChat();
          } else {
            setTicketNumber(data.data);
          }
        });
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
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const ChatForm = ({ onClose }) => {
    const [message, setMessage] = useState("");
    const containerRef = useRef(null);
    useEffect(() => {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, []);

    const scrollToBottom = () => {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    };
    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    };
    const handleSend = () => {
      if (message.trim() !== "" && ticketDetail) {
        scrollToBottom();
        const ticketMessagePayload = {
          ticket_id: JSON.parse(localStorage.getItem("create_ticket_detail"))
            ._id,
          product: JSON.parse(localStorage.getItem("create_ticket_detail"))
            .product,
          message_data: message,
          user_id: "12345",
          reply_to: "None",
          workspace_id: params.get("workspace_id"),
          api_key: apiKey,
          created_at: new Date().toISOString(),
        };

        socket.emit("ticket_message_event", ticketMessagePayload);

        setMessage("");
      }
    };

    return (
      <div
        className={`fixed flex left-1/2 transform -translate-x-1/2  -translate-y-1/2 w-[38%] max-w-[60%] min-w-[360px] min-h-[85%] max-h-[95%] ${
          darkMode ? "bg-gray-800" : "bg-neutral-400"
        } rounded-lg shadow-lg z-10 top-[50%] duration-1000`}
      >
        <div className={`p-1 pb-0 w-full `}>
          <div className="flex justify-between">
            <h2
              className={`text-lg ${
                darkMode ? "text-white" : "text-slate-900"
              } font-semibold p-2 mb-2`}
            >
              {JSON.parse(localStorage.getItem("create_ticket_detail"))._id}
            </h2>
            <div className="flex justify-end items-end overflow-hidden h-10 min-w-20  pr-1">
              <Toggler darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <button
                className="text-red-600 font-extrabold rounded-full h-10 w-10 text-center px-auto  transition-all duration-1000 hover:bg-slate-700"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mx-auto"
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
          </div>

          <div className=" p-4 rounded-lg shadow-lg overflow-y-auto h-[79%]  pb-10 w-full ">
            {/* Render chat messages */}
            <div
              ref={containerRef}
              className="custom-scrollbar space-y-4 pl-1  -pr-1 pb-5  w-full "
            >
              {!messageToDisplay && (
                <div className="flex flex-col justify-center mt-10 items-center text-center w-full h-full">
                  <h1 className="text-white text-4xl font-bold font-mono mb-5">
                    Need help?
                  </h1>
                  <img src={chat} className="w-[70%] h-auto" alt="Hi" />
                  <h1 className="text-white text-xl font-bold font-mono ">
                    Ask Us
                  </h1>
                </div>
              )}
              {messageToDisplay.length > 0 &&
                messageToDisplay.map((message) => (
                  <div
                    key={message.id}
                    className={`flex font-sans text-sm ${
                      message.sender === "user"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {message.type === "text" && message.content && (
                      <div
                        className={`text-[17px] rounded-lg px-4 max-w-[98%] py-2 ${
                          message.sender === "user"
                            ? "bg-gray-200 "
                            : "bg-[#083a26e1] text-white "
                        } ${
                          message.sender === "user" && darkMode
                            ? "bg-gray-400"
                            : "bg-[#083a26e1] "
                        }`}
                      >
                        <p>{message.content}</p>
                        <p>
                          <small
                            className={`text-sm ${
                              darkMode ? "text-gray-200" : "text-gray-400"
                            }`}
                          >
                            <i>{formatCreatedAt(message.created_at)}</i>
                          </small>
                        </p>
                      </div>
                    )}
                    {message.type === "file" && (
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-gray-200"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <a
                          href={message.content.dataURL}
                          download={message.content.fileName}
                          className="text-blue-500 hover:underline"
                        >
                          {message.content.fileName}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <form>
            <div
              className={`pt-5 px-3 ${
                darkMode ? "bg-gray-800" : "bg-neutral-400"
              }`}
            >
              <div
                className="flex gap-x-2"
                style={{
                  position: "relative",
                  textAlign: "end",
                  outline: "none",
                }}
              >
                <input
                  id="message"
                  className="w-full px-3 py-2 bg-gray-200 rounded-lg  focus:ring-2 focus:border-blue-400 focus:outline-none"
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={handleMessageChange}
                />
                <button
                  className="text-white rounded-lg w-[15%]  flex items-center justify-center bg-slate-700 hover:bg-slate-800 transition-delay-1000"
                  onClick={handleSend}
                  type="button"
                >
                  <FontAwesomeIcon
                    className="mx-2 w-8 h-8 text-green-500 "
                    icon={faTelegramPlane}
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto py-3 px-5 bg-white rounded -mt-10">
      <Formik
        initialValues={{ topic: "", email: "", identity: "" }}
        onSubmit={handleSubmit}
        validationSchema={CreateTicketSchema}
      >
        {({ handleChange, values, isSubmitting, isValid }) => (
          <Form ref={form} className="text-center">
            <div className="mb-4 relative mx-auto my-5">
              <Field
                as="select"
                name="topic"
                className="block w-[90%] bg-white border text-neutral-600 border-gray-300 rounded py-2 text-[20px] mx-auto font-sans cursor-pointer focus:outline-none focus:border-gray-500"
                onChange={handleChange}
              >
                <option
                  value=""
                  className="text-2xl bg-gray-400 text-neutral-700 text-center px-auto"
                >
                  Products
                </option>
                {getLinkRes.length >= 0 ? (
                  getLinkRes.map((linkRes) => {
                    const objectToArray = Object.entries(
                      linkRes.product_distribution
                    );
                    const filteredArray = objectToArray.filter(
                      ([key, value]) => value > 0
                    );
                    return filteredArray.map((dist, index) => (
                      <option
                        value={dist[0]}
                        key={index}
                        className="text-center text-gray-700"
                        onClick={() => handleProductClick(dist[0])}
                      >
                        {dist[0]}
                      </option>
                    ));
                  })
                ) : (
                  <ClipLoader
                    color={"#22694de1"}
                    css={{
                      display: "block",
                      margin: "0 auto",
                      width: "50px",
                      height: "40px",
                    }}
                    size={20}
                  />
                )}
              </Field>
              <ErrorMessage
                name="topic"
                className="text-orange-500"
                component="div"
              />
            </div>
            <p className="-mt-2 mb-4 text-slate-500">
              Waiting time - 00 Minutes
            </p>
            <div className="my-3 mx-auto ">
              <Field
                autoComplete="off"
                type="email"
                name="email"
                placeholder="Email ID"
                className="block w-[90%] mx-auto text-center outline-none bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-gray-500 text-zinc-800 text-[20px]"
                onChange={handleChange}
              />
              <ErrorMessage
                name="email"
                className="text-orange-500"
                component="div"
              />
            </div>
            <h2 className="text-[26px] font-bold hover:text-black">
              Ticket number
            </h2>
            <h2 className="text-[26px] font-bold text-green-600">
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

            <button
              type="submit"
              disabled={
                !values.email || !values.topic || !isValid || isSubmitting
              }
              className={`border-2 border-green-300 hover:bg-green-500 transition duration-1000 ease-in-out font-semibold py-1 w-[80%] rounded-3xl focus:outline-none focus:bg-blue-600 text-[18px] disabled:bg-slate-300 disabled:border-gray-300 disabled:text-gray-400`}
            >
              {!isSubmitting ? (
                "Create ticket"
              ) : (
                <div className="flex justify-center items-center ">
                  <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-slate-600 rounded-full"></div>
                </div>
              )}
            </button>
          </Form>
        )}
      </Formik>
      {isChatOpen && <ChatForm onClose={toggleChat} />}
    </div>
  );
};

export default TicketMainContent;
