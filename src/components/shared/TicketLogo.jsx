import { logo2 } from "../../assets";

const TicketLogo = () => {
  return (
    <div className="flex justify-center -mt-2 md:-mt-8 ">
      <img
        src={logo2}
        alt="Dowell Logo"
        className=" h-auto   max-md:w-[150px] md:w-[180px] md:h-[180px] max-sm:-mt-5   sm:-pt-16"
      />
    </div>
  );
};

export default TicketLogo;
