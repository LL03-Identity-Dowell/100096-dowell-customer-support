import React, { createContext, useContext, useState } from "react";

// Create a context
const CreateTicketContext = createContext();

// Create a provider component
export const CreateTicketProvider = ({ children }) => {
  const [ticketData, setTicketData] = useState({});

  const createTicket = (newTicketData) => {
    setTicketData(newTicketData);
  };

  return (
    <CreateTicketContext.Provider value={{ ticketData, createTicket }}>
      {children}
    </CreateTicketContext.Provider>
  );
};

// Custom hook to consume the context
export const useCreateTicketContext = () => useContext(CreateTicketContext);
