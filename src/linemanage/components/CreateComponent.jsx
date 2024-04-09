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
  const [activeLink, setActiveLink] = useState(true);
  //const [userNameCount, setUserNameCount] = useState(0);
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  //setting up loading to get list of managers
  useEffect(() => {
    option === "createLineManager"
      ? members?.length === 0
        ? setLoading(true)
        : setLoading(false)
      : "";
  }, [members, option]);
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const getManagerMembers = async () => {
      if (option === "createLineManager") {
        await getManagersList();
      }
    };
    /*
    const getUserNameCount = async () => {
      if (option === "generateLink") {
        setLoading(true);

        try {
          /*let response = await axios.post(
          "https://100093.pythonanywhere.com/api/userinfo/",
          {
            session_id: lineManagerCredentials.session_id, //"okms05yhlfj6xl7jug9b6f6lyk8okb8o",
          }
        );
          let response = localStorage.getItem("userInfo");
          response = JSON.parse(response)?.selected_product;
          // console.log("data =", response.data);
          let responseData = await response?.userportfolio.filter(
            (item) =>
              item.member_type === "public" &&
              item.product === "Dowell Customer Support Centre"
          );
          responseData = responseData.map((items) => items?.username);
          responseData = await arrayWithMostElements(responseData);

          if (!responseData) {
            toast.warn("No usernames found!", {
              toastId: "success1",
            });
            setLoading(false);
            return;
          }
          console.log("responseData USER name count", responseData?.length);
          setUserNameCount(responseData?.length);
          //console.log(responseData);
          setLoading(false);
        } catch (e) {
          console.log("error", e.message);
        }
      }
    };
*/
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
      /* let response = await axios.post(
        "https://100093.pythonanywhere.com/api/userinfo/",
        {
          session_id: lineManagerCredentials.session_id, //"okms05yhlfj6xl7jug9b6f6lyk8okb8o",
        }
      );*/
      //  console.log(response);
      let response = localStorage.getItem("userInfo");
      //console.log("data response ", response);
      response = JSON.parse(response)?.selected_product;
      let responseData = await response?.userportfolio.find(
        (item) => item.member_type === "team_member"
      );
      //console.log("response data", responseData);
      setMembers(responseData?.username);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddManager = (e) => {
    e.target.value && setManagerName(e.target.value);
  };
  //set loading until getting manager list
  const createLineManager = async () => {
    // workspace_id = "646ba835ce27ae02d024a902";
    //api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
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
    try {
      await socket.emit("create_topic", {
        name: topic_name,
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
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
    setActiveLink(false);
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
      /* let response = await axios.post(
        "https://100093.pythonanywhere.com/api/userinfo/",
        {
          session_id: lineManagerCredentials.session_id, //"okms05yhlfj6xl7jug9b6f6lyk8okb8o",
        }
      );*/
      // console.log("data =", response.data);
      /*let responseData = await response.userportfolio.find(
        (item) =>
          item.member_type === "public" &&
          item.product === "Dowell Customer Support Centre"
      );*/
      // response = JSON.parse(response)?.selected_product;
      // console.log("data =", response.data);
      /*  let responseData = await response?.userportfolio.filter(
        (item) =>
          item.member_type === "public" &&
          item.product === "Dowell Customer Support Centre"
      );
      let responseUserNames = responseData.map((items) => items?.username);
      responseUserNames = await arrayWithMostElements(responseUserNames);

      if (!responseUserNames) {
        toast.warn("Something went wrong, couldn't find your username");
        setLoading(false);
        return;
      }
      // setUserNameCount(responseData?.username.length);
      if (linkNumber > responseUserNames?.length) {
        toast.warning(
          "Link number must be less than or equal to existing users"
        );
        setLoading(false);
        return;
      }
      */
      let responseData = await response?.userportfolio.find(
        (item) =>
          item.member_type === "public" &&
          item.product === "Dowell Customer Support Centre"
      );
      setPortfolioCode(responseData?.portfolio_code);

      //console.log("workspace id", lineManagerCredentials.workspace_id);

      //setMembers(lineManagerCredentials.workspace_id,);
      // console.log("response data", responseData.username);
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
      setLoading(true);
      if (option === "createTopic") {
        if (!topicName) {
          toast.warning("Please fill the topic name");
          return;
        }
        topicName && createTopic(topicName);
      } else if (option === "createLineManager") {
        // await getLineManagerMember();
        // getManagersList();
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
          <NavItem component={true} />
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
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
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
              <div className="max-w-[400px]   mx-auto ">
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
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 sm:w-[350px] md:w-[410px] sm:h-[150px] md:h-[350px] overflow-y-scroll"
                >
                  {/*  
                  <div className="mb-4 flex sm:flex-col md:flex-row sm:gap-5 md:gap-10 sm:w-max-[300px] md:w-[400px] ">
                    <label
                      htmlFor="usernamecount"
                      className="block text-gray-700 text-sm font-bold sm:w-max-[70px] md:w-[100px] mb-2"
                    >
                      UserName Count:
                    </label>
                    <input
                      type="number"
                      id="usernamecount"
                      name="usernamecount"
                      value={userNameCount}
                      //onChange={(e) => setUrl()}
                      className="shadow appearance-none border rounded sm:w-max-[150px] h-8 md:w-[200px] py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      readOnly
                    />
                  </div>
                  */}

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
                      readOnly
                    />
                  </div>

                  <div className="flex items-center w-full sm:justify-start md:justify-end">
                    <button
                      type="submit"
                      className="bg-[#22694de1] font-sans text-sm hover:bg-green-700 text-white font-bold py-2 px-2 sm:w-[150px] md:w-[200px] rounded-md"
                      disabled={!activeLink}
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
                      {members?.map((member, index) => {
                        return (
                          <option key={index} value={member}>
                            {member}
                          </option>
                        );
                      })}
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
        {loading && option === "createLineManager" && members?.length <= 0 ? (
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
            fetching members list...
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default CreateComponent;
