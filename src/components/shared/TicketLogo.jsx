import { logo2 } from "../../assets";

const TicketLogo = () => {
  return (
    <div className="flex justify-center max-md:-mt-5">
      <img
        src={logo2}
        alt="Dowell Logo"
        className=" h-auto   max-md:w-[150px] md:w-[250px] max-sm:-mt-5   sm:-pt-16"
      />
    </div>
  );
};

export default TicketLogo;
