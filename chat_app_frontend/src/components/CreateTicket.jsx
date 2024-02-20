import TicketLogo from "./shared/TicketLogo";
import TicketMainContent from "./shared/TicketMainContent";
import TicketTopNav from "./shared/TicketTopNav";

const CreateTicket = () => {
  return (
    <section>
      <TicketTopNav />
      <div className="main_cont">
        <TicketLogo />
        <TicketMainContent />
      </div>
    </section>
  );
};

export default CreateTicket;
