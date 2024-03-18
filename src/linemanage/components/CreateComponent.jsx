// SearchComponent.js

import { useEffect, useRef, useState } from "react";

//import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import NavItem from "./NavItem";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");

//eslint-disable-next-line
function CreateComponent({ closeSearchModal, option, api_key, workspace_id }) {
  const [loading, setLoading] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [modalHeight, setModalHeight] = useState(80);
  // const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null); // Ref for the search input

  // const handleSearchChange = (e) => {
  //   setSearchValue(e.target.value);
  // };

  const [topicName, setTopicName] = useState("");
  const [managerName, setManagerName] = useState("");
  const topicData = useSelector((state) => state.tickets.topicData);
  const [linkTopic, setLinkTopic] = useState({});
  const [linkNumber, setLinkNumber] = useState("");
  const [members, setMembers] = useState([]);
  const [masterLink, setMasterLink] = useState("");
  const [url, setUrl] = useState("");
  const [linkCopy, setLinkCopy] = useState(false);
  const inputRef = useRef(null);
  //setting up loading to get list of managers
  useEffect(() => {
    option === "createLineManager"
      ? members.length === 0
        ? setLoading(true)
        : setLoading(false)
      : "";
  }, [members, option]);
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const getManagerMembers = async () => {
      await getManagersList();
    };
    getManagerMembers();
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      // Set the modal height to 80% of the window height
      setModalHeight(windowHeight * 0.8);
    };

    window.addEventListener("resize", handleResize);

    console.log(modalHeight);

    // Call handleResize initially
    handleResize();

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeSearchModal();
    }
  };
  const getManagersList = async () => {
    // console.log("line manager");
    try {
      let response = await axios.post(
        "https://100014.pythonanywhere.com/api/userinfo/",
        {
          session_id: "grajrumzvk80d98r559cs99ey7da0wt2",
        }
      );
      let responseData = await response.data;
      setMembers(responseData.members.team_member);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //console.log("member", members);
  // get members to be added as line manager

  const handleAddManager = (e) => {
    e.target.value && setManagerName(e.target.value);
  };
  //set loading until getting manager list

  const createLineManager = async (user_id, api_key, workspace_id) => {
    workspace_id = "646ba835ce27ae02d024a902";
    api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";

    try {
      await socket.emit("create_line_manager", {
        user_id: managerName,
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
  const handleTopic = async function (event) {
    const { name, value } = event.target;
    setLinkTopic({ ...linkTopic, [name]: value });
  };
  const handleLinkCopy = () => {
    inputRef.current.select();
    //if (!linkCopy) {
    //document.getElementsByClassName("masterlink").select();
    //document.execCommand("copy");
    //}
    setLinkCopy(!linkCopy);
  };
  const handleLinkSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let sum = 0;
    if (!linkNumber || !url) {
      toast.warning("Please fill in all fields");
      setLoading(false);
      return;
    }
    for (let name in linkTopic) {
      if (linkTopic[name] === "") {
        toast.warning("Please fill in all fields");
        setLoading(false);
        return;
      }
      sum = sum + parseInt(linkTopic[name]);
    }
    if (sum !== parseInt(linkNumber)) {
      toast.warning("Link number must be equal to sum of each product");
      setLoading(false);
      return;
    }

    const linkData = {
      number_of_links: linkNumber,
      product_distribution: {
        ...linkTopic,
      },
      usernames: [
        "pOiUtReWsD",
        "dFgHjKlMnO",
        "LkOyHbNzIq",
        "QrTzsMwXjv",
        "UfhgJGnptE",
      ],
      url: url,
      workspace_id: "646ba835ce27ae02d024a902",
      api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",

      created_at: new Date().toISOString(),
    };

    await socket.emit("generate_share_link", linkData);

    await socket.on("share_link_response", (data) => {
      setLoading(false);
      if (data.status === "success") {
        setMasterLink(data.data);
        toast.success("generated successfully");
      } else {
        toast.warn("some error happened");
      }
      //sconsole.log("Master Link response:", data);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (option === "createTopic") {
        if (!topicName) {
          toast.warning("Please fill the topic name");
          return;
        }
        topicName && createTopic(topicName);
      } else if (option === "createLineManager") {
        // await getLineManagerMember();
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
              <div className="max-w-[400px] mx-auto overflow-x-hidden">
                <h3 className="mb-5">Fill Link Information</h3>
                {masterLink && (
                  <div className="flex w-auto justify-center align-middle mx-auto  h-15 p-2  border border-r-8 gap-1">
                    <input
                      type="text"
                      className=" border-none outline-none flex-5 w-full p-2 overflow-x-visible overflow-y-scroll h-20 bg-slate-200 text-[#22694de1] masterlink"
                      value={masterLink}
                      ref={inputRef}
                    ></input>
                    <button className="flex-1" onClick={handleLinkCopy}>
                      {linkCopy && masterLink ? "copied" : "copy"}
                    </button>
                  </div>
                )}
                <form
                  onSubmit={handleLinkSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 sm:w-[350px] md:w-[400px]"
                >
                  <div className="mb-4 flex sm:flex-col md:flex-row sm:gap-5 md:gap-10 sm:md:w-max-[380px] md:w-[400px]">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                    >
                      Link Number
                    </label>
                    <input
                      type="number"
                      id="link-number"
                      name="linkNumber"
                      value={linkNumber}
                      onChange={(e) => setLinkNumber(e.target.value)}
                      className="shadow appearance-none border rounded sm:w-max-[150px] md:w-[200px] py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  {topicData &&
                    //eslint-disable-next-line
                    topicData?.map((data) => {
                      return (
                        <div
                          className="mb-4 flex sm:flex-col md:flex-row sm:gap-5 md:gap-10 sm:md:w-max-[300px] md:w-[400px]"
                          key={data._id}
                        >
                          <label
                            htmlFor="input1"
                            className="block text-gray-700 text-sm font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                          >
                            {data.name}
                          </label>
                          <input
                            type="number"
                            id="topics"
                            name={data.name}
                            value={linkTopic[`${data.name}`]}
                            onChange={handleTopic}
                            className="shadow appearance-none border rounded sm:w-max-[150px] md:w-[200px] py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                      );
                    })}
                  <div className="mb-4 flex sm:flex-col md:flex-row sm:gap-5 md:gap-10 sm:w-max-[300px] md:w-[400px]">
                    <label
                      htmlFor="input1"
                      className="block text-gray-700 text-sm font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                    >
                      URL
                    </label>
                    <input
                      type="text"
                      id="uri"
                      name="linkurl"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="shadow appearance-none border rounded sm:w-max-[150px] md:w-[200px] py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="flex items-center w-full sm:justify-start md:justify-end">
                    <button
                      type="submit"
                      className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 sm:w-[150px] md:w-[200px] rounded-md"
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
                    <select
                      id="dropdown"
                      value={managerName}
                      onChange={handleAddManager}
                      className="shadow appearance-none border rounded w-full
                      py-1 px-2 text-gray-700 leading-tight focus:outline-none
                      focus:shadow-outline overflow-y-scroll max-h-[100px]"
                    >
                      <option value="">Choose members</option>
                      {members?.map((member) => {
                        return (
                          <option key={member._id} value={member.name}>
                            {member.name}
                          </option>
                        );
                      })}

                      {loading ? (
                        <div className="d-flex mt-3 justify-center align-items-center mx-auto">
                          <ClipLoader
                            color={"#22694de1"}
                            css={{
                              display: "block",
                              margin: "0 auto",
                              width: "50px",
                              height: "40px",
                            }}
                            size={20}
                          />{" "}
                          Loading
                        </div>
                      ) : (
                        ""
                      )}
                    </select>
                  </div>

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
            {members.length <= 0 ? "fetching members list..." : "Loading"}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default CreateComponent;
