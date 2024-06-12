/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLineManagersData } from "../Redux/lineManager";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import io from "socket.io-client";
import _ from "lodash";
import TextInfo from "./TextInfo";
import useTicket from "./useTickets";
import { fetchTicketInfo, fetchTopicData } from "../Redux/ticketDetailSlice";
import formatDate from "../utils/formatDate";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");

function LineManager() {
  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();
  const ticketInfo = useSelector((state) => state.tickets.ticketInfo);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);
  const [loading, setLoading] = useState(true);
  const lineManageTime = useSelector(
    (state) => state.lineManagers.lineManageTime
  );
  const { ticketData } = useTicket();

  useEffect(() => {
    dispatch(fetchTicketInfo(ticketData));
  }, [ticketData]);

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
        if (data.operation === "get_meta_setting") {
          setWaitingTime(data.data[0]?.waiting_time);
        }
      });
    };

    fetchData();

    return () => {
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
    try {
      await socket.emit("get_all_topics", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      await socket.on("setting_response", async (data) => {
        if (data.status === "success" && data.operation === "get_all_topics") {
          dispatch(fetchTopicData(data?.data));
        }
      });
    } catch (error) {
      toast.error("Some thing went wrong. We will fix soon");
      console.error(error);
    }
  };

  const getAllLineManager = async () => {
    try {
      await socket.emit("get_all_line_managers", {
        workspace_id: lineManagerCredentials.workspace_id,
        api_key: lineManagerCredentials.api_key,
      });

      await socket.on("setting_response", (data) => {
        if (data.operation === "get_all_line_managers") {
          setLoading(false);
          if (Array.isArray(data?.data)) {
            dispatch(fetchLineManagersData(data?.data));
          }
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
  }, [lineManagerCredentials]);

  useEffect(() => {
    if (lineManagerCredentials.workspace_id && lineManagerCredentials.api_key) {
      findTopic();
    }
  }, [lineManagerCredentials]);

  socket.on("new_ticket", async (data) => {
    console.log("new ticket", data);
    //console.log()

    if (data?.status === "success") {
      console.log("ticket infos========", ticketInfo);
      const ticketinf = _.cloneDeep(ticketInfo);
      const updatedTicketInfo = await Object.keys(ticketinf).reduce(
        (acc, ticket) => {
          console.log("ticket", ticket);
          console.log(
            "ticket from data",
            `${data?.data?.line_manager}${selectedTopic.name ?? ""}`
          );

          if (
            ticket === `${data?.data?.line_manager}${selectedTopic.name ?? ""}`
          ) {
            let dt = data?.data;
            acc[`${ticket}`] = [...ticketinf[ticket], dt];
          } else if (
            acc[`${data?.data?.line_manager}${selectedTopic.name ?? ""}`]
              ?.length === 0 &&
            selectedDate === currentDate
          ) {
            acc[`${data?.data?.line_manager}${selectedTopic.name ?? ""}`] = [
              data?.data,
            ];
          } else {
            acc[`${ticket}`] = ticketinf[ticket];
          }
          return acc;
        },
        {}
      );

      const selectedDate = lineManageTime;
      const currentDate = formatDate(new Date());
      console.log(
        "ticket number",
        updatedTicketInfo[
          `${data?.data?.line_manager}${selectedTopic.name ?? ""}`
        ]
      );
      /* if (
        updatedTicketInfo[
          `${data?.data?.line_manager}${selectedTopic.name ?? ""}`
        ]?.length === 0 &&
        selectedDate === currentDate
      ) {
        updatedTicketInfo[
          `${data?.data?.line_manager}${selectedTopic.name ?? ""}`
        ] = [data?.data];
      }*/
      console.log("updatedTicketInfo", updatedTicketInfo);
      dispatch(fetchTicketInfo(updatedTicketInfo));
      //ticketInfoToShow = [...ticketInfo, data?.data];
      toast.success(`new ticket added in ${data?.data?.product}`, {
        toastId: "success1",
      });
    } else {
      return;
    }
  });

  return (
    <section>
      <div className="w-[99%] flex-2   my-4 mt-16 mx-1 md:w-[99%] rounded-md md:h-[600px] relative">
        <table className="sm:h-[450px] md:h-full w-full  border-b-2 border-[#22C55E]">
          <thead>
            <tr className="bg-[#22C55E] h-[20%] border-b border-[#7E7E7E] text-white uppercase rounded-t-md text-sm leading-normal flex  flex-wrap">
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
          <div className="">
            <div className="overflow-y-auto custom-scrollbar h-[65%] ">
              <tbody className="text-gray-600 text-sm  border-0 border-[#7E7E7E] h-[550px]  font-light w-full flex sm:flex-col relative">
                {lineManagersData.length > 0 &&
                  lineManagersData.map((data1, index) => (
                    <tr
                      key={data1._id}
                      className="border-b-2 border-[#7E7E7E] hover:bg-gray-100 sm:h-[100%]  flex-1"
                    >
                      <td className="py-3 text-center px-3 md:w-[33px] border-r sm:max-w-[20%] border-[#7E7E7E] sm:w-11">
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
                      </td>
                      <td className="text-center flex-1 flex-wrap min-h-[350px]">
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
                                Waiting Time: &nbsp;
                                {waitingTime *
                                  (ticketInfo[
                                    `${data1.user_id}${
                                      selectedTopic.name ?? ""
                                    }`
                                  ]?.filter((ticket) => !ticket?.is_closed)
                                    .length >= 0
                                    ? ticketInfo[
                                        `${data1.user_id}${
                                          selectedTopic.name ?? ""
                                        }`
                                      ]?.filter((ticket) => !ticket?.is_closed)
                                        .length
                                    : 0)}{" "}
                                minutes | {data1?.ticket_count} Open tickets
                              </span>
                            </span>
                            <div className="flex justify-between gap-3 w-full items-center">
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
            </div>
          </div>
        </table>
      </div>
    </section>
  );
}

export default LineManager;
