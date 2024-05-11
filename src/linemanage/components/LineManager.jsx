/* eslint-disable react/prop-types */
//import { useEffect } from "react";

import { useEffect, useState } from "react";
//import { BsThreeDotsVertical } from "react-icons/bs";

//import CreateComponent from "./CreateComponent";

import { useDispatch, useSelector } from "react-redux";
import { fetchLineManagersData } from "../Redux/lineManager";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
//import { socket } from "../utils/Connection";
import io from "socket.io-client";
//import { fetchSelectedTicket } from "../Redux/ticketDetailSlice";
import TextInfo from "./TextInfo";
import useTicket from "./useTickets";
import { fetchTicketInfo, fetchTopicData } from "../Redux/ticketDetailSlice";
//import axios from "axios";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");
function LineManager() {
  //console.log("socket", socket);
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  //const [isOpen, setIsOpen] = useState(false);
  //const [option, setOption] = useState("");
  console.log("ticket info.....", ticketInfo["George_Kibetest_product"]);
  const [loading, setLoading] = useState(true);
  const { ticketData } = useTicket();
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const lineManagersData = useSelector(
    (state) => state.lineManagers.lineManagersData
  );
  const [waitingTime, setWaitingTime] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      socket.emit("get_meta_setting", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      socket.on("setting_response", (data) => {
        // Handle response for the event
        if (data.operation === "get_meta_setting") {
          setWaitingTime(data.data[0]?.waiting_time);
          //      console.log("waitging time ", data.data[0]?.waiting_time);
        }
      });
    };

    fetchData();

    // Cleanup function (if necessary)
    return () => {
      // Unsubscribe from socket event if needed
      socket.off("setting_response");
    };
  }, []);

  const handlePrevClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 15);
    }
  };
  const handleNextClick = (datas) => {
    if (startIndex + 15 < datas.length) {
      setStartIndex(startIndex + 15);
    }
  };

  const findTopic = async () => {
    //workSpaceID = "646ba835ce27ae02d024a902";
    // api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    try {
      // console.log(workSpaceID);
      await socket.emit("get_all_topics", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      await socket.on("setting_response", async (data) => {
        //  console.log("data to be shown", data);
        if (data.status === "success" && data.operation === "get_all_topics") {
          dispatch(fetchTopicData(data?.data));
          //console.log("all ticket", allTickets);
          // setTopic(data?.data);
        }
      });
    } catch (error) {
      toast.error("Some thing went wrong.we will fix soon");
      console.error(error);
    }
  };

  const getAllLineManager = async () => {
    //workSpaceID = "646ba835ce27ae02d024a902";
    //api_key = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
    console.log("test id ===", lineManagerCredentials.workspace_id);

    /*console.log(
      "space id from dispatch",
      lineManagerCredentials.workspace_id,
      "api key from dispatch",
      lineManagerCredentials.api_key
    );*/

    try {
      await socket.emit("get_all_line_managers", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      await socket.on("setting_response", (data) => {
        if (data.operation === "get_all_line_managers") {
          // console.log("workspace_id", lineManagerCredentials.workspace_id);
          // console.log("api_key", lineManagerCredentials.api_key);
          // console.log("line managers data", data);
          // Handle response for the event
          setLoading(false);
          if (Array.isArray(data?.data)) {
            dispatch(fetchLineManagersData(data?.data));
          }
          //console.log("all line manager data", data);
          if (data?.status === "failure") {
            toast.warning("Line manager in this workspace is not found", {
              toastId: "success1",
            });
          }
        }
      });
    } catch (error) {
      console.log(error.data);
      toast.warning(error.data);
    }
  };

  useEffect(() => {
    if (lineManagerCredentials.workspace_id && lineManagerCredentials.api_key) {
      getAllLineManager();
    }
  }, []);

  useEffect(() => {
    /* console.log(
      "line managers===",
      lineManagerCredentials.workspace_id,
      lineManagerCredentials.api_key
    );*/
    if (lineManagerCredentials.workspace_id && lineManagerCredentials.api_key) {
      findTopic();
    }
  }, []);

  return (
    <section>
      <div className="w-[99%] flex-2 border border-[#7E7E7E] shadow-md my-4 mt-16 mx-1 md:w-[99%] rounded-md md:h-[600px]">
        <table className="sm:h-[450px] md:h-[450px] overflow-y-scroll w-full">
          <thead className="">
            <tr className="bg-[#22C55E] h-full border-b border-[#7E7E7E] text-white uppercase rounded-t-md text-sm leading-normal flex flex-wrap">
              <th className="px-1 md:w-[33px] flex justify-center items-center text-center md:py-5 border-r border-r-[#7E7E7E]">
                SN
              </th>
              <th className="py-3 w-[100px] md:w-[120px] text-center border-r border-r-[#7E7E7E]">
                Line/Service Desk Name
              </th>
              <th className="flex w-[100px] md:w-[120px] justify-center items-center text-center md:py-3 border-r border-r-[#7E7E7E]">
                Service Manager
              </th>
              <th className="flex flex-1 justify-center items-center md:py-3">
                Tickets in waiting
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm border border-t-0 border-l-0 border-r-0 border-[#7E7E7E] h-[350px] overflow-y-scroll font-light w-full flex flex-wrap">
            {console.log("line managers data from dispatch", lineManagersData)}
            {lineManagersData.length > 0 &&
              lineManagersData.map((data1, index) => (
                <tr
                  key={data1._id}
                  className="border-b hover:bg-gray-100 sm:h-[100%] flex-1"
                >
                  <td className="py-3 text-center px-3 md:w-[33px] border-r sm:max-w-[20%] border-[#7E7E7E] sm:w-13">
                    {index + 1}
                  </td>
                  <td className="py-3 w-[100px] md:w-[120px] font-bold border-r border-[#7E7E7E] text-left">
                    <input
                      type="checkbox"
                      className="form-checkbox md:h-4 text-indigo-600 transition duration-150 ease-in-out"
                    />{" "}
                    Till-1 common
                  </td>
                  <td className="py-3 pl-2 font-bold text-[#7E7E7E] mx-auto w-[100px] md:w-[120px] border-r border-[#7E7E7E] text-left">
                    {data1.user_id}
                    {console.log("user id ", data1.user_id)}
                  </td>
                  <td className="text-center flex-1 flex-wrap min-h-[350px]">
                    {console.log(
                      "ticketts",
                      fetchTicketInfo[
                        data1.user_id +
                          (selectedTopic.name ? selectedTopic.name : "")
                      ],
                      "product ticket",
                      `${
                        data1.user_id +
                        (selectedTopic.name ? selectedTopic.name : "")
                      }`
                    )}
                    <div className="flex justify-center w-full items-start flex-wrap gap-1 mx-auto text-center">
                      <TextInfo
                        ticketInfo={
                          ticketInfo[
                            `${
                              data1.user_id +
                              (selectedTopic.name ? selectedTopic.name : "")
                            }`
                          ]
                        }
                        data1={data1}
                        handleNextClick={() =>
                          handleNextClick(
                            ticketInfo[
                              `${
                                data1.user_id +
                                (selectedTopic.name !== undefined
                                  ? selectedTopic.name
                                  : "")
                              }`
                            ]
                          )
                        }
                        handlePrevClick={handlePrevClick}
                        startIndex={startIndex}
                      />
                    </div>

                    <div className="flex flex-col align-start justify-end pl-3 w-full flex-1">
                      <div className="flex flex-col align-middle justify-start pt-1 h-auto w-full gap-x-2">
                        <span className="text-md text-sm">
                          <span className="font-bold gap-2 flex justify-center items-center w-full text-center text-md">
                            {waitingTime *
                              (ticketData[
                                `${data1.user_id}${selectedTopic.name ?? ""}`
                              ]?.filter((ticket) => !ticket?.is_closed)
                                .length >= 0
                                ? ticketData[
                                    `${data1.user_id}${
                                      selectedTopic.name ?? ""
                                    }`
                                  ]?.filter((ticket) => !ticket?.is_closed)
                                    .length
                                : 0)}{" "}
                            Waiting Time
                          </span>
                        </span>
                        <div className="flex justify-between gap-5 items-end min-h-10">
                          <p className="text-md text-sm">
                            <span className="font-bold gap-2 flex justify-center items-center w-full text-center text-md">
                              {/* {data1.ticket_count} Waiting, */}
                            </span>
                          </p>
                          <div className="flex justify-end gap-5 items-end min-h-10">
                            <div className="flex justify-center items-center gap-2">
                              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                              <p className="text-blue-400 font-bold">Open</p>
                            </div>
                            <div className="flex justify-center items-center gap-2">
                              <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                              <p className="text-red-400 font-bold">Closed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            {loading && lineManagersData.length <= 0 ? (
              <div className="d-flex gap-y-2 font-bold flex flex-col justify-center items-center mx-auto">
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
                Loading..
              </div>
            ) : (
              ""
            )}
          </tbody>
        </table>

        {/* <div className="flex flex-col justify-center gap-4 mb-7 w-full mt-8 pr-3">
          <hr className="w-[80%] text-center mx-auto items-center " />
          <div className="mr-auto w-full flex justify-center gap-5"></div>
          <div className="flex gap-1 w-[80%] h-auto mt-3 mx-auto">
            <input
              type="number"
              ref={ref}
              id="waitingTimeInput"
              className="w-10 h-7 border border-[#4c8670e1] rounded"
            />
            <button
              className="w-[100px] p-1 rounded h-7 text-white flex bg-[#1a543ee1] hover:bg-[#2d755ae1]"
              onClick={() => addWaitingTime()}
            >
              <small>Add Waiting</small>
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default LineManager;
