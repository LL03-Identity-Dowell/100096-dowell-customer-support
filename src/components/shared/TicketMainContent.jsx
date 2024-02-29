import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const TicketMainContent = () => {
  const [formData, setFormData] = useState({
    topic: "",
    email: "",
    identity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (values, actions) => {
    console.log("Form submitted:", values);
    actions.setSubmitting(false);
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
            <div className="mb-4">
              <Field
                as="select"
                name="topic"
                className="block px-5 w-full bg-white border  border-gray-300 rounded  py-2 focus:outline-none focus:border-gray-500"
                onChange={handleChange}
              >
                <option value="">Topics</option>
                <option value="topic1">Topic 1</option>
                <option value="topic2">Topic 2</option>
                <option value="topic3">Topic 3</option>
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
              00000000
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
            <button
              type="submit"
              className="border-2 border-green-300 hover:bg-green-500 transition duration-1000 ease-in-out font-semibold py-2 w-[80%] rounded-3xl focus:outline-none focus:bg-blue-600"
            >
              Create ticket
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TicketMainContent;
