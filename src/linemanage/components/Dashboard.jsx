import Chat from "./ChatSummary";
import LineManager from "./LineManager";
import TicketDetail from "./TicketDetail";
import Dropdowns from "./Search";

function Dashboards() {
  return (
    <div className="font-sans pt-16 flex justify-between h-auto sm:flex-col w-full md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2  ">
      <LineManager />
      <div className="w-full h-auto flex-1 flex flex-col">
        <div className="flex justify-between gap-2 px-2 pt-4">
          <div className="flex-1">
            <Dropdowns search={"Search Ticket Number"} type={"topic"} />
          </div>
          <div className="flex-2">
            <Dropdowns search={"Search Ticket Number"} type={"ticket"} />
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
