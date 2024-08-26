import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useCreateTicketContext } from "../../context/CreateTicketContext.jsx";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

import { ClipLoader } from "react-spinners";
import CreateTicketSchema from "../../schema/CreateTicketSchema.jsx";
import TicketLogo from "./TicketLogo.jsx";
import Loading from "../Loading.jsx";
import ChatForm from "./ChatForm.jsx";
import usePersistedTicketData from "../../hooks/usePersistedTicketData.js";
import QueueUpdate from "./QueueTicket.jsx";

const TicketMainContent = () => {
  const token = localStorage.getItem("token");
  const form = useRef();
  usePersistedTicketData();
  const [messages, setMessages] = useState([]);
  const { createTicket } = useCreateTicketContext();
  const [getLinkRes, setGetLinkRes] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("Not assigned");
  const [apiKey, setApiKey] = useState("");
  const { search } = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const params = new URLSearchParams(search);
  const [loading, setLoading] = useState(true);
  const [isCreateTicket, setIsCreateTicket] = useState(false);

  const [isPrevTicketCreated, setIsPrevTicketCreated] = useState(false);

  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });
  const [showLoading, setShowLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [waitingTime, setWaitingTime] = useState(() => {
    const storedWaitingTime = localStorage.getItem("chatEndTime");
    return storedWaitingTime ? parseInt(storedWaitingTime, 10) : 0;
  });

  const [ticketDetail, setTicketDetail] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const toggleIntro = () => {
    setShowIntro(false);
  };

  // useEffect(() => {
  //   setLoading(true);
  // }, [isCreateTicket, isChatOpen]);

  // useEffect(() => {
  //   if (waitingTime === 0) {
  //     setIsChatOpen(true);
  //   }
  // }, [waitingTime, ticketDetail]);



  const decoded_data = jwtDecode(token);
  console.log('Decoded data ', decoded_data)


  const decoded_workspace_id = decoded_data.workspace_id
  const decoded_api_key = decoded_data.api_key
  const decoded_link_id = decoded_data.link_id

  const products_options = Object.entries(decoded_data.product_distribution).map(([productName, quantity]) => (
      <option key={productName} value={productName}>
        {productName} - {quantity}
      </option>
    ));

    
  useEffect(() => {
    const endTime = Number(localStorage.getItem("chatEndTime"));
    let intervalId;
    if (!endTime) {
      //setShowLoading(false);
      //setIsChatOpen(true);
      //setLoading(false);
      return;
    }

    const checkAndSetChatBox = (endTime) => {
      const updateRemainingTime = () => {
        const currentTime = Number(Date.now());
        const remainingTime = endTime - currentTime;
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          setIsChatOpen(true);
          setLoading(false);
          setShowLoading(false);
          localStorage.setItem("chatEndTime", remainingTime);
          return;
        } else {
          const ticketFound =
            localStorage.getItem("create_ticket_detail") && true;
          if (ticketFound) {
            const remainingMinutes = Math.ceil(remainingTime / 60000);
            localStorage.setItem("chatEndTime", remainingTime + currentTime);
            setWaitingTime(remainingMinutes);
            setLoading(true);
            setShowLoading(true);
          }
        }
      };

      // Initial check
      updateRemainingTime();

      // Update the remaining time every minute (60000 milliseconds)
      intervalId = setInterval(updateRemainingTime, 60000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    };

    checkAndSetChatBox(endTime);
  }, [waitingTime]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("create_ticket_detail"))) {
      setIsPrevTicketCreated(true);
      const fetchData = () => {
        try {
          const ticketId = JSON.parse(
            localStorage.getItem("create_ticket_detail")
          )._id;
          const product = JSON.parse(
            localStorage.getItem("create_ticket_detail")
          ).product;

          socket.emit("get_ticket_messages", {
            ticket_id: ticketId,
            product: product,
            workspace_id: params.get("workspace_id"),
            api_key: apiKey,
          });

          socket.on("ticket_message_response", (data) => {
            const ticketMessages = data.data;
            let current_user = "12345";
            async function chats() {
              if (ticketMessages.length > 0) {
                try {
                  let messages = await Promise.all(
                    ticketMessages?.map((message) => {
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
                  if (messages.length > 0) {
                    setMessages(messages);
                  }
                } catch (error) {
                  console.log(error);
                }
              } else {
                setMessages([]);
              }
            }

            chats();
          });
        } catch (error) {
          console.error("Error fetching ticket messages:", error);
        }
      };

      fetchData();
    }
    if (!socket) return;

    const storedcData = JSON.parse(localStorage.getItem("create_ticket_detail"));
    setTicketDetail(storedcData);

    const fetchApiKey = async () => {
      const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${params.get(
        "workspace_id"
      )}`;

      try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        setApiKey(responseData["data"]["api_key"]);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchApiKey();

    if (apiKey) {
      socket.emit("get_share_link_details", {
        workspace_id: decoded_workspace_id,
        link_id: decoded_link_id,
        api_key: decoded_api_key,
      });
    }
  }, [apiKey]);

  socket.on("share_link_response", (data) => {
    console.log(data.data);
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
      setLoading(false);
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
  const toggleCreateTicket = () => {
    setIsCreateTicket((prev) => !prev);
  };

  socket.on("waiting_time_response", (data) => {
    if (!data.data["waiting_time"] || data.data["waiting_time"] == 0) {
      setIsChatOpen(true);
      setLoading(false);
      setShowLoading(false);
      return;
    } else {
      const ticketFound = localStorage.getItem("create_ticket_detail") && true;
      if (ticketFound) {
        const timeInMilliseconds =
          Number(data.data["waiting_time"]) * 60 * 1000;
        const endTime = Number(Date.now()) + timeInMilliseconds;
        localStorage.setItem("chatEndTime", endTime);
        setWaitingTime(data.data["waiting_time"]);
      }
    }
  });

  const handleSubmit = (values) => {
    try {
      setSubmitting(true);
      setShowLoading(true);

      const payload = {
        user_id: "pOiUtReWsD",
        email: values.email,
        workspace_id: decoded_workspace_id,
        link_id: decoded_link_id,
        api_key: decoded_api_key,
        product: values.topic,
        created_at: new Date().toISOString(),
      };

      socket.emit("create_ticket", payload);

      socket.on("ticket_response", (data) => {
        //setShowLoading(false);
        if (data.status === "success") {
          setSubmitting(false);
          setShowLoading(false);
          createTicket(data.data);
          setIsQueueOpen(true)
          console.log(
            "New ticket is created with the following data response",
            data.data
          );

          setTicketNumber(data.data._id);
          localStorage.setItem(
            "create_ticket_detail",
            JSON.stringify({
              ...data.data,expiryTime: Date.now() + 4 * 60 * 60 * 1000,
            })
          );


          console.log('._id is here ', data.data._id)
          setTicketDetail(data.data);
          const getTicketMessagesPayload = {
            ticket_id: data.data._id,
            product: data.data.product,
            workspace_id: decoded_workspace_id,
            api_key: decoded_api_key,
          };
          console.log('get ticket messages payload ', getTicketMessagesPayload)
          socket.emit("get_ticket_messages", getTicketMessagesPayload);

          socket.on('ticket_message_response', (data) => {
            // Handle response for the event
            console.log('Ticket response message ', data);
        })
          // setShowLoading(false);
        } else {
          setTicketNumber(data.data);
        }
      });

      return () => {
        socket.off("ticket_response", ticketResponseHandler)
        socket.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    toggleCreateTicket();
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  
  return (
    <div className="flex justify-center items-center ">
      {/* {loading &&
      !isCreateTicket &&
      JSON.parse(localStorage.getItem("create_ticket_detail")) ? (
        <Loading />
      ) : ( */}
      <div className="main_cont">
        <TicketLogo />
        <div className="max-w-md mx-auto py-3 px-5  rounded -mt-12">
          <Formik
            initialValues={{ topic: "", email: "", identity: "" }}
            onSubmit={handleSubmit}
            validationSchema={CreateTicketSchema}
          >
            {({ handleChange, values, isValid }) => (
              <Form ref={form} className="text-center">
                <div className="mb-4 relative mx-auto my-5">
                  <Field
                    as="select"
                    name="topic"
                    className=" text-center block w-[90%] max-sm:w-[100%]  bg-white border text-neutral-600 border-gray-300 rounded py-2 max-sm:py-1 text-[20px] mx-auto font-sans cursor-pointer focus:outline-none focus:border-gray-500"
                    onChange={handleChange}
                  >
                    
                    <option
                    
                      value=""
                      className="text-2xl bg-gray-400 text-neutral-700 text-center px-auto"
                    >
                     Select a Product
                    </option>
                    {products_options}
                  
                  </Field>
                  <ErrorMessage
                    name="topic"
                    className="text-orange-500"
                    component="div"
                  />
                </div>
                <p className="-mt-2 mb-4 text-slate-500 font-medium max-sm:text-[14px]">
                  {localStorage.getItem("create_ticket_detail") ? (
                    <span>
                      {waitingTime >= 0 ? (
                        <p>
                          Waiting time :
                          <span className="text-green-500">
                            {" "}
                            {waitingTime}{" "}
                          </span>
                          minutes left
                        </p>
                      ) : (
                        <p className="text-green-500">Chat is open</p>
                      )}
                    </span>
                  ) : (
                    <p className=""> Waiting Time : </p>
                  )}
                </p>
                <div className="my-3 mx-auto ">
                  <Field
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    className="block w-[90%] mx-auto text-center outline-none bg-white border border-gray-300 rounded px-4 py-2 max-sm:py-0 focus:outline-none focus:border-gray-500 text-zinc-800 text-[20px]"
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="email"
                    className="text-orange-500"
                    component="div"
                  />
                </div>
                <h2 className="text-[26px] font-bold hover:text-black max-md:text-[24px]">
                  Ticket number
                </h2>
                <h2 className="text-[22px] font-bold flex-1 text-green-600 max-md:text-[20px] max-sm:text-[14px]">
                  {
                    JSON.parse(localStorage.getItem("create_ticket_detail"))
                      ?._id
                  }
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
                    <span className="ml-2 max-sm:text-sm">No Identity</span>
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
                    <span className="ml-2 max-sm:text-sm">Face ID</span>
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
                    <span className="ml-2 max-sm:text-sm">OTP</span>
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
                    <span className="ml-2 max-sm:text-sm">ID Number</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={
                    !values.email || !values.topic || !isValid || isSubmitting
                  }
                  className={`border-2 border-green-300 hover:bg-green-500 transition duration-1000 ease-in-out font-semibold py-1 w-48 md:w-60 rounded-3xl focus:outline-none focus:bg-blue-600 text-[18px] disabled:bg-slate-300 disabled:border-gray-300 disabled:text-gray-400`}
                >
                  {isSubmitting ? (
                    <div className="flex h-6 justify-center items-center ">
                      {showLoading ? (
                        <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-slate-600 rounded-full"></div>
                      ) : (
                        "Create Ticket"
                      )}
                    </div>
                  ) : (
                    <p>Create Ticket</p>
                  )}
                </button>
              </Form>
            )}
          </Formik>
          {isQueueOpen && !loading ? (
            <QueueUpdate />
          ): ''}
          {/* <QueueUpdate
              apiKey={decoded_api_key}
              workspaceId={decoded_workspace_id}
              darkMode={darkMode}
              toggleIntro={toggleIntro}
              showIntro={showIntro}
              toggleDarkMode={toggleDarkMode}
              messageToDisplay={messageToDisplay}
              socket={socket}
             /> */}
          {/* {isQueueOpen && !loading ?(
            <QueueUpdate
            apiKey={decoded_api_key}
            workspaceId={decoded_workspace_id}
             />
          ):(
            ""
          )} */}
          {isChatOpen && !loading ? (
            <ChatForm
              apiKey={apiKey}
              ticketDetail={ticketDetail}
              onClose={toggleChat}
              darkMode={darkMode}
              toggleIntro={toggleIntro}
              showIntro={showIntro}
              toggleDarkMode={toggleDarkMode}
              messageToDisplay={messageToDisplay}
              socket={socket}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketMainContent;
