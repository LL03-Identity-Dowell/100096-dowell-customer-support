// SearchComponent.js

import { useEffect, useRef, useState } from "react";

//import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import NavItem from "./NavItem";
import { useSelector } from "react-redux";

import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");


//eslint-disable-next-line
function CreateComponent({ closeSearchModal, option, api_key, workspace_id }) {
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

  const [topicName, setTopicName] = useState("");
  const [managerName, setManagerName] = useState("");
  const topicData = useSelector((state) => state.tickets.topicData);
  const [linkTopic, setLinkTopic] = useState({});
  const [linkNumber, setLinkNumber] = useState(0);
  const [url, setUrl] = useState("");
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

  const createLineManager = async (user_id, api_key, workspace_id) => {
    workspace_id = "646ba835ce27ae02d024a902";
    api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";

    try {
      await socket.emit("create_line_manager", {
        user_id: user_id,
        positions_in_a_line: 1,
        average_serving_time: 4,
        ticket_count: 0,
        workspace_id: workspace_id,
        api_key: api_key,
        created_at: new Date().toISOString(),
      });
      await socket.on("setting_response", (data) => {
        // Handle response for the event
        console.log("created manager data response", data);
        setLoading(false);
        if (data.status === "failure") {
          toast.warning("Failure to create manager");
        } else if (data.status === "success") {
          toast.success("successfully created");
        }
      });
    } catch (error) {
      setLoading(false);
      toast.warning(error.data);
    }
  };

  const createTopic = async (topic_name) => {
    // console.log("workspace id, api_key", workspace_id, api_key);
    workspace_id = "646ba835ce27ae02d024a902";
    api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    try {
      await socket.emit("create_topic", {
        name: topic_name,
        workspace_id: workspace_id,
        api_key: api_key,
        created_at: new Date().toISOString(),
      });

      await socket.on("setting_response", (data) => {
        // Handle response for the event
        console.log(data);
        setLoading(false);
        if (data.status === "failure") {
          toast.warning(data?.data);
        } else if (data.status === "success") {
          toast.success(data?.data);
        }
        // console.log("generated topic", data);
        //console.log(data);
      });
    } catch (error) {
      setLoading(false);
      toast.warning(error.data);
    }
  };
  const handleTopic = function (event) {
    const { name, value } = event.target;
    setLinkTopic({ ...linkTopic, [name]: value });
  };
  const handleLinkSubmit = (event) => {
    event.preventDefault();
    // if (!(event.target.name == "linkNumber" || event.target.name == "Url")) {

    // }
    console.log(linkTopic);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (option === "createTopic") {
        topicName && createTopic(topicName);
      } else if (option === "createLineManager") {
        if (managerName) {
          createLineManager(managerName);
        }
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
        <div className="flex justify-between w-full relative mb-7 ">
          <NavItem />
          <button
            onClick={closeSearchModal}
            className=" -top-5 w-10 h-10 font-bold text-2xl text-red-500  rounded-full p-2 hover:text-red-400 absolute right-0"
          >
            X
          </button>
        </div>

        {
          // eslint-disable-next-line
          option === "createTopic" && (
            <>
              <div className="max-w-md mx-auto">
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
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

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

        {/* generating a link */}

        {
          // eslint-disable-next-line
          option === "generateLink" && (
            <>
              <div className="max-w-md mx-auto">
                <h3 className="mb-5">Fill Link Information</h3>
                <form
                  onSubmit={handleLinkSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-4 flex sm:flex-col md:flex-row">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                    >
                      Link Number
                    </label>
                    <input
                      type="number"
                      id="link-number"
                      name="linkNumber"
                      value={linkNumber}
                      onChange={(e) => setLinkNumber(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  {topicData &&
                    //eslint-disable-next-line
                    topicData?.map((data) => {
                      return (
                        <div
                          className="mb-4 flex sm:flex-col md:flex-row"
                          key={data._id}
                        >
                          <label
                            htmlFor="input1"
                            className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                          >
                            {data.name}
                          </label>
                          <input
                            type="number"
                            id="topics"
                            name={data.name}
                            value={linkTopic}
                            onChange={handleTopic}
                            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      );
                    })}
                  <div className="mb-4 flex sm:flex-col md:flex-row">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold w-1/2 mb-2"
                    >
                      URL
                    </label>
                    <input
                      type="text"
                      id="uri"
                      name="linkurl"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="flex items-center w-full justify-center">
                    <button
                      type="submit"
                      className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md"
                    >
                      Generate Link
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
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
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
