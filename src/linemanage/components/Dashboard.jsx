import Chat from "./ChatSummary";
import LineManager from "./LineManager";
import TicketDetail from "./TicketDetail";
import TicketSearch from "./TicketSearch";
import TopicSearch from "./TopicSearch";

//eslint-disable-next-line
function Dashboards() {
  return (
    <div className="font-sans flex justify-between h-auto sm:flex-col sm:pr-2 sm:w-full md:w-[95vw] md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2 m-5 ">
      <LineManager />
      <div className="w-full h-auto flex-1 flex flex-col">
        <div className="flex justify-between gap-2 px-2 pt-4">
          <div className="flex-1">
            <TopicSearch search="Search Topic" />
          </div>

          <div className="flex-2">
            <TicketSearch search={"Search Ticket Number"} />
          </div>
        </div>
        <div className="w-full h-auto flex sm:flex-col  md:flex-row">
          <TicketDetail />
          <div className="flex-1 w-full h-full  mt-3">
            <Chat isOpen={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboards;
