import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const TicketMainContent = () => {
  const [getLinkRes, setGetLinkRes] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("Not assigned");
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });
  const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

  useEffect(() => {
    const fetchApiKey = async () => {
      const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${params.get(
        "workspace_id"
      )}`;

      try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();

        setApiKey(responseData?.data?.api_key);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    try {
      if (apiKey) {
        socket.emit("get_share_link_details", {
          workspace_id: params.get("workspace_id"),
          link_id: params.get("link_id"),
          api_key: apiKey,
        });

        socket.on("share_link_response", (data) => {
          setGetLinkRes(data?.data || []);
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [apiKey, params]);

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
      setCreatingTicket(true); // Set creatingTicket to true

      const payload = {
        email: values.email,
        created_at: new Date().toISOString(),
        link_id: params.get("link_id"),
        workspace_id: params.get("workspace_id"),
        api_key: apiKey,
        product: values.topic,
      };

      socket.emit("create_ticket", payload);

      // Wait for the ticket response
      await new Promise((resolve) => {
        socket.on("ticket_response", (data) => {
          data["data"]["_id"]
            ? setTicketNumber(data["data"]["_id"])
            : setTicketNumber("Couldn't create ticket");
        });
      });

      actions.setSubmitting(false);
      setCreatingTicket(false); // Set creatingTicket back to false
      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
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
                  getLinkRes.map((linkRes, index) => {
                    const objectToArray = Object.entries(
                      linkRes["product_distribution"]
                    );
                    const filteredArray = objectToArray.filter(
                      ([key, value]) => value !== 0
                    );
                    return filteredArray.map((dist, index) => (
                      <option value={dist[0]} key={index}>
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
    </div>
  );
};

export default TicketMainContent;
