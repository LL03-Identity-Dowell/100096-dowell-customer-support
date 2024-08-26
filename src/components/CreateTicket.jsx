import { useEffect, useState } from "react";
import SearchComponent from "./shared/SearchComponent";
import TicketMainContent from "./shared/TicketMainContent";
import TicketTopNav from "./shared/TicketTopNav";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

const CreateTicket = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [getLinkRes, setGetLinkRes] = useState([]);

  const toggleLoading = (state) => {
    setLoading(state);
  };
  useEffect(() => {
    const fetchApiKey = async () => {
      const apiUrl = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${params.get(
        "workspace_id"
      )}`;

      
      try {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        setApiKey(responseData["data"]["api_key"]);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchApiKey();
    if (apiKey) {
      socket.emit("get_share_link_details", {
        workspace_id: params.get("workspace_id"),
        link_id: params.get("link_id"),
        api_key: apiKey,
      });
    }
  }, [isSearchModalOpen]);

  socket.on("share_link_response", (data) => {
    if (Array.isArray(data?.data)) {
      setGetLinkRes(data?.data);
    } else {
      toast.warn(data.data);
      console.error("Expected an array for getLinkRes, received:", data?.data);
      setGetLinkRes([]);
    }
  });

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const token = params.get("token");
  

  if (token) {
    localStorage.setItem("token", token);
  }

  return (
    <section>
      {isSearchModalOpen && (
        <SearchComponent
          isSearchModalOpen={isSearchModalOpen}
          linkRes={getLinkRes}
          closeSearchModal={closeSearchModal}
          openSearchModal={openSearchModal}
        />
      )}
      <TicketTopNav openSearchModal={openSearchModal} />
      <TicketMainContent />
    </section>
  );
};

export default CreateTicket;
