import Chat from "./ChatSummary";
import LineManager from "./LineManager";
import Dropdowns from "./Search";
import TicketDetail from "./TicketDetail";

//eslint-disable-next-line
function Dashboards({ api_key, workspace_id }) {
  return (
    <div className="font-sans flex justify-between h-auto sm:flex-col sm:pr-2 sm:w-full md:w-[95vw] md:flex-row  flex-wrap lg:flex-nowrap   lg:items-stretch  border-b-2 border-t-2 m-5 ">
      <LineManager api_key={api_key} workspace_id={workspace_id} />
      <div className="w-full h-auto flex-1 flex flex-col">
        <div className="flex justify-between gap-2 px-2 pt-4">
          <div className="flex-1">
            <Dropdowns search="Search Topic" type={"topic"} />
          </div>

          <div className="flex-2">
            <Dropdowns search={"Search Ticket Number"} type={"ticket"} />
          </div>
        </div>
        <div className="w-full h-auto flex md:flex md:flex-row">
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
