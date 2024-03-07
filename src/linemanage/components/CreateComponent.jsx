// SearchComponent.js

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
console.log("socket", socket);
//eslint-disable-next-line
function CreateComponent({ closeSearchModal, option }) {
  const [loading, setLoading] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [modalHeight, setModalHeight] = useState(80);
  const searchInputRef = useRef(null); // Ref for the search input

  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeSearchModal();
    }
  };

  // const handleSearchChange = (e) => {
  //   setSearchValue(e.target.value);
  // };

  const [inputs, setInputs] = useState({
    WorkspaceId: "",
    TopicName: "",
    input3: "",
  });
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      // Set the modal height to 80% of the window height
      setModalHeight(windowHeight * 0.8);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    console.log(modalHeight);

    // Call handleResize initially
    handleResize();

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  /*
  const createLineManager = async (
    user_id,
    api_key,
    positions_in_a_line,
    average_serving_time,
    ticket_count,
    workspace_id,
    created_at
  ) => {
    await socket.emit("create_line_manager", {
      user_id: user_id,
      positions_in_a_line: positions_in_a_line,
      average_serving_time: average_serving_time,
      ticket_count: ticket_count,
      workspace_id: workspace_id,
      api_key: api_key,
      created_at: created_at,
    });
    await socket.on("setting_response", (data) => {
      // Handle response for the event
      console.log(data);
    });
  };
  */

  const createTopic = async (topic_name) => {
    try {
      await socket.emit("create_topic", {
        name: topic_name,
        workspace_id: "646ba835ce27ae02d024a902",
        api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
        created_at: new Date().toISOString(),
      });

      await socket.on("setting_response", (data) => {
        // Handle response for the event
        setLoading(false);
        toast.warning(data.data.toString());
        console.log("generated topic", data);
        //console.log(data);
      });
    } catch (error) {
      setLoading(false);
      toast.warning(error.data);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (option === "createTopic") {
        createTopic(inputs.TopicName, inputs.WorkspaceId);
      }
    } catch (error) {
      setLoading(false);
      if (error) {
        toast.warning(error?.response?.data);
      }
    }
    // Handle form submission here
    // console.log("Form submitted with data:", inputs);
  };
  // Calculate the height of the modal dynamically based on the window height

  return (
    <div
      className={`fixed  h-auto md:h-full inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 modal-overlay`}
      onClick={closeModal}
    >
      <div
        className={`bg-white h-[90%] overflow-auto relative p-4 md:p-6 rounded-lg w-full max-w-md animate-fadeIn`}
      >
        <div className="flex justify-end items-end w-full absolute top-2 right-3">
          <button
            onClick={closeSearchModal}
            className=" top-5  w-10 h-10 font-bold text-2xl text-red-500  rounded-full p-2 hover:text-red-400"
          >
            X
          </button>
        </div>

        {/* <div className="flex justify-center items-center mt-25">
          <input
            ref={searchInputRef}
            type="text"
            className="w-[90%] px-5 outline-1 outline-slate-300 mx-auto bg-gray-100 p-2 rounded-3xl mb-4 flex-none"
            placeholder="Search with ticket number"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div> */}

        {
          // eslint-disable-next-line
          option === "createTopic" && (
            <>
              <div className="max-w-md mx-auto mt-16">
                <h3 className="mb-5">Fill Topic Information</h3>
                <form
                  onSubmit={handleSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-4 flex sm:flex-col md:flex-row">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                    >
                      Topic Name
                    </label>
                    <input
                      type="text"
                      id="TopicName"
                      name="TopicName"
                      value={inputs.TopicName}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4 flex sm:flex-col md:flex-row ">
                    <label
                      htmlFor="input2"
                      className="block text-gray-700 text-sm font-bold mb-2 w-1/2"
                    >
                      Work space id
                    </label>
                    <input
                      type="text"
                      id="WorkspaceId"
                      name="WorkspaceId"
                      value={inputs.WorkspaceId}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  {/* <div className="mb-6 flex sm:flex-col md:flex-row items-center justify-center">
              <label
                htmlFor="input3"
                className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
              >
                Label 3:
              </label>
              <input
                type="text"
                id="input3"
                name="input3"
                value={inputs.input3}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div> */}

                  <div className="flex items-center w-full justify-center">
                    <button
                      type="submit"
                      className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md"
                    >
                      Create Topic
                    </button>
                  </div>
                </form>
              </div>
            </>
          )
        }
        {
          // eslint-disable-next-line
          option === "createLineManager" && (
            <>
              <div className="max-w-md mx-auto mt-16">
                <h3 className="mb-5">Fill Line Manager Information</h3>
                <form
                  onSubmit={handleSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-4 flex sm:flex-col md:flex-row">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                    >
                      Manager Name
                    </label>
                    <input
                      type="text"
                      id="input1"
                      name="input1"
                      value={inputs.input1}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4 flex sm:flex-col md:flex-row">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                    >
                      Position in line
                    </label>
                    <input
                      type="text"
                      id="input1"
                      name="input1"
                      value={inputs.input1}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4 flex sm:flex-col md:flex-row">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                    >
                      Ticket Count
                    </label>
                    <input
                      type="text"
                      id="input1"
                      name="input1"
                      value={inputs.input1}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4 flex sm:flex-col md:flex-row ">
                    <label
                      htmlFor="input2"
                      className="block text-gray-700 text-sm font-bold mb-2 w-1/2"
                    >
                      Work space id
                    </label>
                    <input
                      type="text"
                      id="input2"
                      name="input2"
                      value={inputs.input2}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  {/* <div className="mb-6 flex sm:flex-col md:flex-row items-center justify-center">
              <label
                htmlFor="input3"
                className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
              >
                Label 3:
              </label>
              <input
                type="text"
                id="input3"
                name="input3"
                value={inputs.input3}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div> */}

                  <div className="flex items-center w-full justify-center">
                    <button
                      type="submit"
                      className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md"
                    >
                      Create Manager
                    </button>
                  </div>
                </form>
              </div>
            </>
          )
        }
        {loading ? (
          <div className="d-flex mt-3 justify-content-center align-items-center">
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
      </div>
    </div>
  );
}

export default CreateComponent;
