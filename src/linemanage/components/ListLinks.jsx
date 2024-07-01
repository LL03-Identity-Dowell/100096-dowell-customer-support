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
      <div className="shadow-md sm:rounded-lg w-[750px] h-[340px] overflow-y-scroll ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
          <thead className="bg-gray-200">
            <tr className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="col"
                className="h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                style={{
                  width: "30px",
                  position: "sticky",
                  top: 0,
                  background: "inherit",
                  zIndex: 1,
                }}
              >
                Serial No
              </th>
              <th
                scope="col"
                className="h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                style={{
                  width: "30px",
                  position: "sticky",
                  top: 0,
                  background: "inherit",
                  zIndex: 1,
                }}
              >
                Number of Links
              </th>
              <th
                scope="col"
                className="h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                style={{
                  width: "30px",
                  position: "sticky",
                  top: 0,
                  background: "inherit",
                  zIndex: 1,
                }}
              >
                Available links
              </th>
              <th
                scope="col"
                className="h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                style={{
                  width: "120px",
                  position: "sticky",
                  top: 0,
                  background: "inherit",
                  zIndex: 1,
                }}
              >
                Master Link
              </th>
            </tr>
          </thead>
          <tbody>
            {Links?.response?.map((item, index) => (
              <>
                {/* <p className="border border-spacing-1 border-x-cyan-700 bg-teal-700 text-white"> */}
                {console.log("items=>", item)}

                <tr className="w-[80%] bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td
                    scope="row"
                    className=" h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                    style={{ width: "30px" }}
                  >
                    {index + 1}
                  </td>
                  <td
                    scope="row"
                    className=" h-auto px-6 py-4 font-medium text-gray-900 dark:text-white text-wrap whitespace-normal"
                    style={{ width: "30px" }}
                  >
                    {item.number_of_links}
                  </td>
                  <td
                    scope="row"
                    className=" h-auto px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal"
                    style={{ width: "30px" }}
                  >
                    {item.available_links}
                  </td>
                  <td
                    scope="row"
                    className="h-auto px-6 py-4 font-medium text-gray-900 dark:text-white"
                    style={{
                      width: "120px",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {item.master_link}
                  </td>

                  <td className="w-[60px] px-6 py-4 text-right">
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
