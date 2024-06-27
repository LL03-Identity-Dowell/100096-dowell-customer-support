import { LuLoader2 } from "react-icons/lu";
//eslint-disable-next-line
export function Loader({ type }) {
  return (
    <div className="p-5 mt-16">
      <div
        disabled
        className="flex text-gray-400 mx-auto text-4xl justify-center"
      >
        <LuLoader2 className="h-10 w-10 text-4xl animate-spin" />
      </div>
      <p className="flex text-gray-400 mx-auto justify-center">
        {type === "masterlinks" ? "listing master links" : "Authenticating...."}
      </p>
    </div>
  );
}
// yarn add lucide-react
