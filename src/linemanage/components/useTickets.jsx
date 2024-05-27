import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  const [ticketData, setTicketData] = useState({});
  const topicData = useSelector((state) => state.tickets.topicData);
  const selectedTopic = useSelector((state) => state.tickets.selectedTopic);

  useEffect(() => {
    async function fetchAllData() {
      for (const lineManager of lineManagersData) {
        if (selectedTopic.name !== undefined) {
          await getData(selectedTopic.name, lineManager.user_id);
        } else {
          for (const topic of topicData) {
            await getData(topic.name, lineManager.user_id);
          }
        }
      }
    }
    setTicketData({});
    fetchAllData();
  }, [lineManageTime, selectedTopic, lineManagersData]);

  async function getData(name, lineManager) {
    const ticketDataPayload = {
      line_manager: lineManager,
      ticket_date: lineManageTime,
      workspace_id: lineManagerCredentials.workspace_id,
      api_key: lineManagerCredentials.api_key,
      product: name,
    };

    socket.emit("get_tickets_by_date", ticketDataPayload);

    return new Promise((resolve) => {
      socket.on("ticket_response", (data) => {
        if (
          data?.status === "success" &&
          data?.operation === "get_tickets_by_date"
        ) {
          // console.log("Received data: ", data?.data);
          //  if (lineManager === data?.data[0].line_manager) {
          setTicketData((prevData) => ({
            ...prevData,
            [`${data?.data[0]?.line_manager}${selectedTopic.name ?? ""}`]:
              data?.data,
          }));
        }
        // }
        /* else {
          setTicketData((prevData) => ({
            ...prevData,
            [`${lineManager}${selectedTopic.name ?? ""}`]: [],
          }));
        }*/
        resolve();
      });
    });
  }

  return { ticketData };
}

export default useTicket;
