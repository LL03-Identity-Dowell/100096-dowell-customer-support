import { fetchSelectedTicket } from "../Redux/ticketDetailSlice";
import { useDispatch } from "react-redux";
//eslint-disable-next-line
const TextInfo = ({
  //eslint-disable-next-line
  ticketInfo,
  //eslint-disable-next-line
  data1,
  //eslint-disable-next-line
  handlePrevClick,
  //eslint-disable-next-line
  handleNextClick,
  //eslint-disable-next-line
  startIndex,
}) => {
  const dispatch = useDispatch();
  const handleTicketClick = (data) => {
    dispatch(fetchSelectedTicket(data));
  };
  return (
    <div className="h-full max-w-full">
      <ul className="min-h-[270px]  text-end ">
        {ticketInfo
          //eslint-disable-next-line
          ?.slice(startIndex, startIndex + 15)
          ?.sort((a, b) => {
            // Convert the created_at string to Date objects for comparison
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            // Compare the dates
            return dateB - dateA;
          })
          .map((data, index) => {
            return (
              //eslint-disable-next-line
              data1?.user_id === data?.line_manager && (
                <button
                  key={index}
                  className={`${
                    data.is_closed
                      ? "bg-red-300 hover:bg-red-500 hover:text-white  hover:font-bold duration-500"
                      : "bg-blue-300 hover:bg-blue-500 hover:text-white  hover:font-bold duration-500"
                  } rounded-sm  h-8  w-[19%]  max-w-12 m-1  ${
                    startIndex == 0 ? "w-[30px] max-w-12 px-1" : "w-[30px]"
                  }`}
                  onClick={() => handleTicketClick(data)}
                >
                  {startIndex + index}
                </button>
              )
            );
          })}
        <div className="flex justify-between  mt-2 pl-8 ">
          <div>
            {startIndex > 0 && (
              <button
                type="button"
                className="bg-slate-200 px-2 py-1  rounded-sm hover:bg-slate-300 duration-500"
                onClick={handlePrevClick}
                disabled={startIndex === 0}
              >
                Previous
              </button>
            )}
          </div>
          <div>
            {
              //eslint-disable-next-line
              startIndex + 15 < ticketInfo?.length > 0 && (
                <button
                  type="button"
                  className="bg-slate-200 px-5 py-1 rounded-sm cursor-pointer hover:bg-slate-300 duration-500"
                  onClick={handleNextClick}
                  disabled={
                    //eslint-disable-next-line
                    startIndex + 15 >= ticketInfo.length
                  }
                >
                  Next
                </button>
              )
            }
          </div>
        </div>
      </ul>
    </div>
  );
};

export default TextInfo;
