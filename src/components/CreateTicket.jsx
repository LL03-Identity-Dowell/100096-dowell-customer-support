import { useState } from "react";
import SearchComponent from "./shared/SearchComponent";
import TicketLogo from "./shared/TicketLogo";
import TicketMainContent from "./shared/TicketMainContent";
import TicketTopNav from "./shared/TicketTopNav";

const CreateTicket = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
      <div className="main_cont">
        <TicketLogo />
        <TicketMainContent />
      </div>
    </section>
  );
};

export default CreateTicket;
