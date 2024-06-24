import axios from "axios";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Loader } from "../../components/Loader";
import { ToastContainer } from "react-toastify";
function ListLinks() {
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

  return (
    <div className="m-2 p-3 w-full h-full">
      {Links?.response?.map((item) => (
        <>
          <p className="border border-spacing-1 border-x-cyan-700 bg-teal-700 text-white">
            {item.master_link}
          </p>
        </>
      ))}
      <ToastContainer />
    </div>
  );
}

export default ListLinks;
