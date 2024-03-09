import { LuLoader2 } from "react-icons/lu";


export function Loader() {
  return (
    <div className="p-5 mt-3">
        <div disabled className="flex text-gray-400 mx-auto text-4xl justify-center">
            <LuLoader2 className="h-10 w-10 text-4xl animate-spin" />
        </div>
        <p className="flex text-gray-400 mx-auto justify-center">Authenticating....</p>
    </div>
  )
}
// yarn add lucide-react