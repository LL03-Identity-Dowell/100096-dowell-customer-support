import { logo } from "../../assets";

const TicketLogo = () => {
  return (
    <div className="flex justify-center">
      <img
        src={logo}
        alt="Dowell Logo"
        className=" h-[170px]  max-md:w-[200px] md:w-[250px] max-sm:-mt-5  sm:-pt-16"
      />
    </div>
  );
};

export default TicketLogo;
