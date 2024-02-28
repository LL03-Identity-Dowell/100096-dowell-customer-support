import Dashboard from "./components/Dashboard";
import "./index.css";
function App() {
  return (
    <>
      <div className="md:flex md:flex-row h-300 w-full sm:flex-row">
        <a className="flex items-center ps-2.5 md:mb-2 sm:mb-2">
          <img
            src="https://psp-logos.uptimerobot.com/logos/2021049-1676548510.png"
            className="md:h-full md:w-[25%] mx-auto sm:w-[10%] rounded-md border-none"
            alt="Flowbite Logo"
          />
        </a>
        <h2 className="text-lg text-center justify-self-center self-center">
          Customer Support | Line Manager
        </h2>
        {/* <hr className="border-b-1 bg-slate-500 mx-auto w-[90%]" /> */}
      </div>
      <Dashboard />;
    </>
  );
}

export default App;
