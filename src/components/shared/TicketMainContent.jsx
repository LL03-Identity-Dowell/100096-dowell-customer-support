import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const TicketMainContent = () => {
  const [getLinkRes, setGetLinkRes] = useState("");
  const [ticketNumber, setTicketNumber] = useState("Not assigned");
  const [creatingTicket, setCreatingTicket] = useState(false);
  const { search } = useLocation();
  const apiKey = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
  const params = new URLSearchParams(search);
  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });
  const socket = io.connect("https://www.dowellchat.uxlivinglab.online");
  useEffect(() => {
    try {
      socket.emit("get_share_link_details", {
        workspace_id: params.get("workspace_id"),
        link_id: params.get("link_id"),
        api_key: apiKey,
      });

      socket.on("share_link_response", (data) => {
        setGetLinkRes(data["data"]);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (values, actions) => {
    try {
      actions.setSubmitting(true);
      setCreatingTicket(false);
      const payload = {
        email: values.email,
        created_at: new Date().toISOString(),
        link_id: params.get("link_id"),
        workspace_id: params.get("workspace_id"),
        api_key: apiKey,
        product: values.topic,
      };

      socket.emit("create_ticket", payload);

      socket.on("ticket_response", (data) => {
        setTicketNumber(data["data"]["_id"]);
      });

      actions.setSubmitting(false);
      setCreatingTicket(false);
      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-3 px-5 bg-white rounded  -mt-2">
      <Formik
        initialValues={{ topic: "", email: "", identity: "" }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="text-center">
            {/* Select input for topics */}
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
                {getLinkRes ? (
                  getLinkRes.map((linkRes) => {
                    const objectToArray = Object.entries(
                      linkRes["product_distribution"]
                    );
                    const filteredArray = objectToArray.filter(
                      ([key, value]) => value !== 0
                    );
                    return filteredArray.map((dist) => {
                      return (
                        <option value={dist[0]} key={dist[0]}>
                          {dist[0]}
                        </option>
                      );
                    });
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
            <p className="  font-bold">Waiting time - 00 Minutes</p>

            {/* Email input */}
            <div className="my-4">
              <Field
                autoComplete="off"
                type="email"
                name="email"
                placeholder="Email ID"
                className="block w-full text-center outline-none  bg-white border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-gray-500"
                onChange={handleChange}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>

            <h2 className="max-md:text-[22px] text-[26px] font-bold  hover:text-black">
              Ticket number
            </h2>
            <h2 className="max-md:text-[22px] text-[26px] font-bold  text-green-500">
              {ticketNumber}
            </h2>

            {/* Radio inputs for identity */}
            <div className="my-4">
              <div>
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
                <label htmlFor="idNumber" className="inline-flex items-center">
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
              <ErrorMessage
                name="identity"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>

            {/* Submit button */}

            {creatingTicket ? (
              <button
                type="submit"
                className="border-2 border-green-300 hover:bg-green-500 transition duration-1000 ease-in-out font-semibold py-2 w-[80%] rounded-3xl focus:outline-none focus:bg-blue-600"
              >
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
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
