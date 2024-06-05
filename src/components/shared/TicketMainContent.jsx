import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateTicketContext } from "../../context/CreateTicketContext.jsx";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

import { ClipLoader } from "react-spinners";
import CreateTicketSchema from "../../schema/CreateTicketSchema.jsx";
import TicketLogo from "./TicketLogo.jsx";
import Loading from "../Loading.jsx";
import ChatForm from "./ChatForm.jsx";

const TicketMainContent = () => {
  const form = useRef();
  const [messages, setMessages] = useState([]);
  const { createTicket } = useCreateTicketContext();
  const [getLinkRes, setGetLinkRes] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("Not assigned");
  const [apiKey, setApiKey] = useState("");
  const { search } = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const params = new URLSearchParams(search);
  const [loading, setLoading] = useState(true);
  const [isCreateTicket, setIsCreateTicket] = useState(false);

  const [isPrevTicketCreated, setIsPrevTicketCreated] = useState(false);

  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });

  const [ticketDetail, setTicketDetail] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  // }, [isCreateTicket, isChatOpen]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("create_ticket_detail"))) {
      setIsPrevTicketCreated(true);
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
            api_key: apiKey,
          });

          await socket.on("ticket_message_response", (data) => {
            const ticketMessages = data.data;
            let current_user = "12345";
            async function chats() {
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
        } finally {
        }
      };

      fetchData();
    } else {
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
        setApiKey(responseData["data"]["api_key"]);
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
    } else {
    }
  }, [apiKey]);

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
      setLoading(false);
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
  const toggleCreateTicket = () => {
    setIsCreateTicket((prev) => !prev);
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
            console.log("created ticket response", data.data);
            setTicketNumber(data.data._id);
            localStorage.setItem(
              "create_ticket_detail",
              JSON.stringify(data.data)
            );

            setTicketDetail(data.data);
            const getTicketMessagesPayload = {
              ticket_id: data.data._id,
              product: data.data.product,
              workspace_id: params.get("workspace_id"),
              api_key: apiKey,
            };
            socket.emit("get_ticket_messages", getTicketMessagesPayload);

            toggleChat();
          } else {
            setTicketNumber(data.data);
          }
        });
      });

      actions.setSubmitting(false);
      return () => {
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
        <div className="max-w-md mx-auto py-3 px-5  rounded -mt-10">
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
                  {/* {console.log(typeof ticketNumber)} {Number(ticketNumber)} */}

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
          {/* {isChatOpen && !loading ? (
              <ChatForm
                apiKey={apiKey}
                ticketDetail={ticketDetail}
                onClose={toggleChat}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                messageToDisplay={messageToDisplay}
                socket={socket}
              />
            ) : (
              ""
            )} */}
        </div>
      </div>
      )}
    </div>
  );
};

export default TicketMainContent;
