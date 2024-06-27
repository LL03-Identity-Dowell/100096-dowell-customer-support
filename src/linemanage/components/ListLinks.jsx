import axios from "axios";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Loader } from "../../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
function ListLinks() {
  const [copied, setCopied] = useState("");
  const lineManagerCredentials = useSelector(
    (state) => state.lineManagers.lineManagerCredentials
  );
  const {
    data: Links,
    error,
    isLoading,
  } = useQuery(["links"], () => fetchUser());

  const fetchUser = async (limit = 10, offset = 0) => {
    const { data } = await axios.get(
      `https://www.dowellchat.uxlivinglab.online/api/masterlink/?workspace_id=${lineManagerCredentials.workspace_id}&api_key=${lineManagerCredentials.api_key}&limit=${limit}&offset=${offset}`
    );
    return data;
  };
  if (isLoading)
    return (
      <>
        <Loader type="masterlinks" />
      </>
    );
  if (error)
    return (
      <>
        <p>No data found</p>
      </>
    );

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard!");
        setCopied(text);
      })
      .catch((err) => {
        toast.error("Failed to copy the link.", err.message);
      });
  };
  return (
    <>
      <div className="shadow-md sm:rounded-lg w-full h-[340px] overflow-y-scroll ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
          <tbody>
            {Links?.response?.map((item) => (
              <>
                {/* <p className="border border-spacing-1 border-x-cyan-700 bg-teal-700 text-white"> */}

                <tr className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td
                    scope="row"
                    className=" h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                    style={{ width: "60px" }}
                  >
                    {item.master_link}
                  </td>

                  <td className="w-[20px] px-6 py-4 text-right">
                    <button
                      onClick={() => handleCopy(item.master_link)}
                      className="font-medium text-blue-600 dark:text-blue-500 cursor-pointer outline-none hover:underline"
                    >
                      {copied === item.master_link ? "copied" : "copy"}
                    </button>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </>
  );
}

export default ListLinks;
