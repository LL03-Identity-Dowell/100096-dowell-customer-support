import { useEffect, useState } from "react";

const getTicketData = () => {
  const data = localStorage.getItem("create_ticket_detail");
  if (!data) {
    console.log("Data Removed");
    return null;
  }

  const parsedData = JSON.parse(data);
  const { expiryTime } = parsedData;
  if (Date.now() > expiryTime) {
    // If the data has expired, remove it from localStorage
    localStorage.removeItem("create_ticket_detail");
    localStorage.removeItem("chatEndTime");
    return null;
  }

  return parsedData;
};

const removeTicketData = () => {
  localStorage.removeItem("create_ticket_detail");
};

const usePersistedTicketData = () => {
  const [storedData, setStoredData] = useState(getTicketData());

  useEffect(() => {
    if (storedData) {
      const { expiryTime } = storedData;
      const remainingTime = expiryTime - Date.now();

      const timerId = setTimeout(() => {
        removeTicketData();
        setStoredData(null);
      }, remainingTime);

      return () => clearTimeout(timerId);
    }
  }, [storedData]);

  return storedData;
};

export default usePersistedTicketData;
