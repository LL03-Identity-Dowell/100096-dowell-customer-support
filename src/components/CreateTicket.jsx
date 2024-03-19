import { useState } from "react";
import SearchComponent from "./shared/SearchComponent";
import TicketMainContent from "./shared/TicketMainContent";
import TicketTopNav from "./shared/TicketTopNav";

const CreateTicket = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleLoading = (state) => {
    setLoading(state);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <section>
      {isSearchModalOpen && (
        <SearchComponent closeSearchModal={closeSearchModal} />
      )}
      <TicketTopNav openSearchModal={openSearchModal} />
      <TicketMainContent />
    </section>
  );
};

export default CreateTicket;
