// SearchComponent.js

import { useEffect, useRef, useState } from "react";

//import "react-toastify/dist/ReactToastify.css";

import { ClipLoader } from "react-spinners";

import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import io from "socket.io-client";
import { ManagerNavBar } from "./ManagerNavBar";
import ListData from "./ListData";
import ListTopic from "./ListTopic";
import ListLinks from "./ListLinks";

const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");

//eslint-disable-next-line
function CreateComponent({ closeSearchModal, option }) {
  const [loading, setLoading] = useState(false);
  // const [searchValue, setSearchValue] = useState("");
  const [modalHeight, setModalHeight] = useState(80);
  // const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null); // Ref for the search input

  // const handleSearchChange = (e) => {
  //   setSearchValue(e.target.value);
  // };

  const [topicName, setTopicName] = useState("");

  const [waitingTime, setWaitingTime] = useState(0);
  const [search, setSearch] = useState("");
  const [managerName, setManagerName] = useState("");
  const topicData = useSelector((state) => state.tickets.topicData);
  const [linkTopic, setLinkTopic] = useState({});
  const [linkNumber, setLinkNumber] = useState("");
  const [members, setMembers] = useState([]);
  const [masterLink, setMasterLink] = useState("");
  const [url, setUrl] = useState("https://www.dowellchat.uxlivinglab.online/");
  const [linkCopy, setLinkCopy] = useState(false);
  const inputRef = useRef(null);
  const [portfolioCode, setPortfolioCode] = useState("");

  const [tab, setTab] = useState("");

  // const [activeLink, setActiveLink] = useState(true);
  //const [userNameCount, setUserNameCount] = useState(0);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  //setting up loading to get list of managers
  // useEffect(() => {
  //   option === "createLineManager"
  //     ? members?.length === 0
  //       ? setLoading(true)
  //       : setLoading(false)
  //     : "";
  // }, [members, option]);
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const getManagerMembers = async () => {
      // setLoading(true);
      // if (option === "createLineManager") {
      await getManagersList();
      //  }
    };

    //waiting time

    getManagerMembers();

    //getUserNameCount();

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

  function addWaitingTime() {
    //    console.log("waiting time", waitingTime);
    //setLoading(true);
    function createMetaSetting() {
      const lineData = {
        waiting_time: parseInt(waitingTime),
        operation_time: "12s",
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,

        created_at: new Date().toISOString(),
      };

      socket.emit("create_meta_setting", lineData);
      //setLoading(false);
    }
    createMetaSetting();

    // getMetaSetting();
    toast.success("waiting time updated", {
      toastId: "success1",
    });
  }

  function generateRandomString(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Generate four random strings of length 10
  const randomUserNames = (linknumber) => {
    return Array.from({ length: linknumber }, () => generateRandomString(12));
  };

  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeSearchModal();
    }
  };
  const getManagersList = async () => {
    // console.log("line manager");
    try {
      let response = localStorage.getItem("userInfo");
      console.log("data response ", response);
      response = JSON.parse(response)?.selected_product;
      //added filter
      let responseData = await response?.userportfolio.filter(
        (item) => item.member_type === "team_member"
      );
      let username = responseData.map((items) => items?.username);
      //console.log("response data", responseData);
      setMembers(username);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    //setLoading(false);
  };

  const handleAddManager = (e) => {
    e.target.value && setManagerName(e.target.value);
  };
  //set loading until getting manager list
  const createLineManager = async () => {
    // workspace_id = "646ba835ce27ae02d024a902";
    //api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    setLoading(true);
    try {
      await socket.emit("create_line_manager", {
        user_id: managerName,
        positions_in_a_line: 1,
        average_serving_time: 4,
        ticket_count: 0,
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
        created_at: new Date().toISOString(),
      });
      await socket.on("setting_response", (data) => {
        setLoading(false);
        if (data.status === "failure") {
          toast.warning(data?.data);
        } else if (data.status === "success") {
          toast.success("successfully created");
        }
      });
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.warning(error.data);
    }
  };

  const createTopic = async (topic_name) => {
    setLoading(true);
    try {
      await socket.emit("create_topic", {
        name: topic_name,
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
        created_at: new Date().toISOString(),
      });

      await socket.on("setting_response", (data) => {
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
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setLinkCopy(true);
        toast.success("Link copied to clipboard!", {
          toastId: "custom-id-123",
        });
      })
      .catch((err) => {
        toast.error("Failed to copy the link.", err.message);
      });
  };
  const handleLinkSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // setActiveLink(false);
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

    try {
      let response = localStorage.getItem("userInfo");
      // console.log("data response ", response);
      response = JSON.parse(response)?.selected_product;

      let responseData = await response?.userportfolio?.find(
        (item) =>
          item.member_type === "public" &&
          item.product === "Dowell Customer Support Centre"
      );
      setPortfolioCode(responseData?.portfolio_code);
      let usernames = randomUserNames(parseInt(linkNumber));
      const linkData = {
        number_of_links: linkNumber,
        product_distribution: {
          ...linkTopic,
        },
        usernames: [...usernames],
        url: url,
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,

        created_at: new Date().toISOString(),
      };

      await socket.emit("generate_share_link", linkData);
      ///////console.log("link generated", linkgenerated);
      /// if (linkgenerated) {
      markUserNamesUsedAPI(usernames);

      /// }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message);
      setLoading(false);
    }

    await socket.on("share_link_response", (data) => {
      setLoading(false);
      if (data.status === "success") {
        setMasterLink(data.data);
        toast.success("generated successfully", {
          toastId: "success1",
        });
      } else {
        toast.warn("some error happened", data.data);
        console.log(data);
      }
      //sconsole.log("Master Link response:", data);
    });
  };
  // removing public usernames
  const markUserNamesUsedAPI = (usernames) => {
    let baseurl = `https://100093.pythonanywhere.com/api/remove_public_usernames/`;

    const data = {
      org_id: lineManagerCredentials.workspace_id,
      product: "Dowell Customer Support Centre",
      username: lineManagerCredentials.username,
      session_id: lineManagerCredentials.session_id,
      usernames,
      portfolio_code: portfolioCode,
    };

    console.log("data", data);

    axios
      .post(baseurl, data)
      .then((response) => {
        console.log("Set usernames used response:", response.data);
      })
      .catch((error) => {
        console.error("set usernames used:", error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // setLoading(true);
      if (option === "createTopic") {
        if (!topicName) {
          toast.warning("Please fill the topic name");
          //   setLoading(false);
          return;
        }
        topicName && createTopic(topicName);
      } else if (option === "addwaitingtime") {
        //setLoading(false);
        if (!waitingTime || parseInt(waitingTime) < 0) {
          toast.warning("waiting time time must be greater than 0");
          return;
        }
        waitingTime && addWaitingTime(waitingTime);
      } else if (option === "createLineManager") {
        // await getLineManagerMember();
        // getManagersList();
        if (managerName) {
          createLineManager(managerName);
        }
      }
    } catch (error) {
      //setLoading(false);
      if (error) {
        toast.warning(error?.response?.data);
      }
    }
    // setLoading(false);
  };
  // Calculate the height of the modal dynamically based on the window height

  return (
    <>
      <div
        className={`relative b h-full md:h-[600px] inset-0 z-50 flex items-center justify-center  bg-opacity-50 `}
        onClick={closeModal}
      >
        <div className="flex flex-col mt-[40px] gap-5">
          {option === "createTopic" && (
            <>
              {masterLink && setMasterLink("")}

              <ManagerNavBar
                tab={tab}
                setTab={setTab}
                search={search}
                setSearch={setSearch}
                type={option}
              />
            </>
          )}
          {option === "createLink" && (
            <ManagerNavBar
              tab={tab}
              setTab={setTab}
              search={search}
              setSearch={setSearch}
              type={option}
            />
          )}
          {option === "createLineManager" && (
            <>
              {masterLink && setMasterLink("")}
              <ManagerNavBar
                tab={tab}
                setTab={setTab}
                search={search}
                setSearch={setSearch}
                type={option}
              />
            </>
          )}
          <div
            className={`w-[600px] md:w-[100%] bg-white shadow-2xl border-2 border-gray-100 overflow-auto  relative p-4 md:p-6 rounded-lg h-[90%] md:max-h-[70%] `}
          >
            {
              // eslint-disable-next-line
              option === "createTopic" && tab === "createTopic" && (
                <>
                  {masterLink && setMasterLink("")}
                  <div className="max-w-[400px] mx-auto">
                    <h3 className="mb-10 text-center font-bold text-xl w-full">
                      Fill Topic Information
                    </h3>
                    <form
                      onSubmit={handleSubmit}
                      className="bg-white   rounded px-4 py-8 "
                    >
                      <div className="mb-4 gap-y-2">
                        <label
                          htmlFor="input1"
                          className="block mb-4 text-black  font-bold  "
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
                          className="w-[80%] duration-500 font-sans text-sm mt-10 bg-[#22C55E] hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md"
                        >
                          Create Topic
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )
            }

            {option === "createTopic" && tab === "viewTopic" && (
              <>
                {masterLink && setMasterLink("")}
                <ListTopic search={search} />
              </>
            )}

            {option === "createTopic" && tab === "" && (
              <>
                {masterLink && setMasterLink("")}
                <ListTopic search={search} />
              </>
            )}

            {option === "createLink" && tab === "viewLink" && (
              // <div className={`min-h-[80%]`}>
              <>
                {masterLink && setMasterLink("")}
                <ListLinks search={search} />
              </>
              // </div>
            )}
            {option === "createLink" && tab === "" && (
              // <div className={`min-h-[80%]`}>
              <>
                {masterLink && setMasterLink("")}
                <ListLinks search={search} />
              </>
              // </div>
              // <ListLinks search={search} />
              // </div>
            )}

            {option === "addwaitingtime" && (
              <>
                <ToastContainer />
                {masterLink && setMasterLink("")}
                <div className="max-w-[400px] mx-auto">
                  <h3 className="mb-10 text-center font-bold text-xl w-full">
                    Add Waiting Time
                  </h3>
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white   rounded px-4 py-8 "
                  >
                    <div className="mb-4 gap-y-2">
                      <label
                        htmlFor="input1"
                        className="block mb-4 text-black  font-bold  "
                      >
                        Waiting Time
                      </label>
                      <input
                        type="number"
                        id="waitingtime"
                        name="waitingtime"
                        value={waitingTime}
                        onChange={(e) => setWaitingTime(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div className="flex items-center w-full justify-center">
                      <button
                        type="submit"
                        className="w-[80%] duration-500 font-sans text-sm mt-10 bg-[#22C55E] hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
            {/* generati
        ng a link */}

            {
              // eslint-disable-next-line
              option === "createLink" && tab === "createLink" && (
                <>
                  <ToastContainer />
                  <div className="max-w-[400px]  md:mb-10 mx-auto ">
                    {masterLink && (
                      <div className="flex w-auto justify-center align-middle mx-auto  h-15 p-2  border border-r-8 gap-1">
                        <input
                          type="text"
                          className=" border-none outline-none flex-5 w-full p-2 overflow-x-visible overflow-y-scroll h-20 bg-slate-200 text-[#22694de1] masterlink"
                          value={masterLink}
                          ref={inputRef}
                        ></input>
                        <button
                          className="flex-1"
                          onClick={() => handleCopy(masterLink)}
                        >
                          {linkCopy && masterLink ? "copied" : "copy"}
                        </button>
                      </div>
                    )}
                    <form
                      onSubmit={handleLinkSubmit}
                      className="bg-white  rounded px-4 pt-6  h-full mb-4  md:h-full overflow-y-scroll"
                    >
                      <div className="mb-4 flex sm:flex-col  sm:gap-2  sm:md:w-max-[380px] md:w-[400px]">
                        <label
                          htmlFor="input1"
                          className="block text-black  font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                        >
                          Link Number
                        </label>
                        <input
                          type="number"
                          id="link-number"
                          name="linkNumber"
                          value={linkNumber}
                          onChange={(e) => setLinkNumber(e.target.value)}
                          className="shadow  appearance-none border rounded w-[90%]  py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      {topicData &&
                        //eslint-disable-next-line
                        topicData?.map((data) => {
                          return (
                            <div
                              className="mb-4 flex sm:flex-col   sm:gap-2  sm:md:w-max-[300px] md:w-[400px]"
                              key={data._id}
                            >
                              <label
                                htmlFor="input1"
                                className="block text-gray-700  font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                              >
                                {data.name}
                              </label>
                              <input
                                type="number"
                                id="topics"
                                name={data.name}
                                value={linkTopic[`${data.name}`]}
                                onChange={handleTopic}
                                className="shadow appearance-none border rounded w-[90%] py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                          );
                        })}
                      <div className="mb-4 flex sm:flex-col  gap-2   sm:w-max-[300px] md:w-[400px]">
                        <label
                          htmlFor="input1"
                          className="block text-gray-700 font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                        >
                          URL
                        </label>
                        <input
                          type="text"
                          id="uri"
                          name="linkurl"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="shadow appearance-none border rounded w-[90%] py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          readOnly
                        />
                      </div>

                      <div className="flex items-center sm:justify-start md:justify-end w-full">
                        <button
                          type="submit"
                          className="bg-[#22C55E] duration-500 mx-auto mt-5 font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 w-[80%] rounded-md"
                          // disabled={!activeLink}
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
              option === "createLineManager" && tab === "createLineManager" && (
                <>
                  <ToastContainer />
                  {masterLink && setMasterLink("")}
                  <div className="max-w-md mx-auto ">
                    <h3 className="mb-10 w-full text-center text-xl font-[700]">
                      Fill Line Manager Information
                    </h3>
                    <form
                      onSubmit={handleSubmit}
                      className="bg-white rounded md:px-8 pt-6 pb-8 mb-4"
                    >
                      <div className="mb-4 gap-y-2 flex sm:flex-col ">
                        <label
                          htmlFor="input1"
                          className="block   font-bold w-1/2 mb-2"
                        >
                          Manager Name
                        </label>
                        <select
                          id="dropdown"
                          value={managerName}
                          onChange={handleAddManager}
                          className="shadow-sm cursor-pointer appearance-none border rounded w-full
                      py-1 px-2 text-gray-700 leading-tight focus:outline-none
                      focus:shadow-outline overflow-y-scroll max-h-[100px]"
                        >
                          <option value="">Choose members</option>
                          {members?.map((member, index) => {
                            return (
                              <option key={index} value={member}>
                                {member}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="flex items-center w-full mt-10 justify-center">
                        <button
                          type="submit"
                          className="bg-[#22C55E]  w-[80%] mx-auto duration-500 font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 md:w-27 rounded-md"
                        >
                          Create Manager
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )
            }
            {option === "createLineManager" && tab === "viewLineManager" && (
              <>
                {masterLink && setMasterLink("")}
                <ListData search={search} />
              </>
            )}

            {option === "createLineManager" && tab === "" && (
              <>
                {masterLink && setMasterLink("")}
                <ListData search={search} />
              </>
            )}
            {
              <>
                {loading && (
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
                    Loading...
                  </div>
                )}
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateComponent;
