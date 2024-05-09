import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketInfo } from "../Redux/ticketDetailSlice";
import { io } from "socket.io-client";

const socket = io.connect("https://www.dowellchat.uxlivinglab.online/");

function useTicket() {
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const lineManagersData = useSelector(
    (state) => state.lineManagers.lineManagersData
  );
  const lineManageTime = useSelector(
    (state) => state.lineManagers.lineManageTime
  );
  const dispatch = useDispatch();
  const [ticketData, setTicketData] = useState({});
  const topicData = useSelector((state) => state.tickets.topicData);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);

  useEffect(() => {
    lineManagersData?.forEach(async (lineManager) => {
      if (selectedTopic.name !== undefined) {
        await getData(selectedTopic.name, lineManager);
      } else {
        await topicData?.forEach(async (topic) => {
          await getData(topic.name, lineManager);
        });
      }
    });
  }, [lineManageTime, selectedTopic, lineManagersData]);

  async function getData(name, lineManager) {
    const ticketDataPayload = {
      line_manager: lineManager.user_id,
      ticket_date: lineManageTime,
      workspace_id: lineManagerCredentials.workspace_id,
      api_key: lineManagerCredentials.api_key,
      product: name,
    };

    socket.emit("get_tickets_by_date", ticketDataPayload);

    return new Promise((resolve, reject) => {
      socket.on("ticket_response", (data) => {
        if (
          data?.status === "success" &&
          data?.operation === "get_tickets_by_date"
        ) {
          setTicketData((prevData) => ({
            ...prevData,
            [`${lineManager.user_id}${selectedTopic.name ?? ""}`]: data?.data,
          }));
        } else {
          setTicketData((prevData) => ({
            ...prevData,
            [`${lineManager.user_id}${selectedTopic.name ?? ""}`]: [],
          }));
        }
        resolve();
      });
    });
  }

  useEffect(() => {
    // Dispatch the fetched ticket data after all data is fetched
    dispatch(fetchTicketInfo(ticketData));
  }, [ticketData, dispatch]);

  return { ticketData };
}

export default useTicket;
