import { useState } from "react";
//eslint-disable-next-line
const Chat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", type: "text", content: "Hey there!" },
    {
      id: 2,
      sender: "receiver",
      type: "text",
      content: "Hi! How can I help you?",
    },
    // Add more messages as needed
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (message) => {
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleFileChange = (event) => {
    // Handle file upload
    console.log(event);
  };

  const handleSendButtonClick = () => {
    if (newMessage.trim() !== "") {
      const message = {
        id: messages.length + 1,
        sender: "user",
        type: "text",
        content: newMessage.trim(),
      };
      sendMessage(message);
    }
  };
  return (
    <div
      className={`fixed inset-0  flex items-end justify-end bottom-12 px-4 py-6 pointer-events-none sm:p-6 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="max-w-lg w-full bg-white shadow-lg rounded-md  border-2 border-gray-200 pointer-events-auto">
        <div className="flex justify-between bg-[#22694de1]  border-b border-gray-200 px-4 py-4">
          <h2 className="text-lg font-medium text-white">Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="px-4 py-6">
          {/* Chat content goes here */}
          <div className="px-4 py-6">
            {/* Render chat messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.type === "text" && (
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-gray-200"
                          : "bg-[#083a26e1] text-white"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                  {message.type === "file" && (
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-gray-200"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <a
                        href={message.content.dataURL}
                        download={message.content.fileName}
                        className="text-blue-500 hover:underline"
                      >
                        {message.content.fileName}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 border-t border-gray-200 flex items-center">
            <label className="cursor-pointer ml-4">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <svg
                className="h-6 w-6 text-blue-500 hover:text-blue-700"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11 4V1a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 11-2 0V3h-2v10h4V7a1 1 0 112 0v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 112 0v6h4v3a1 1 0 11-2 0v-3H4v-2h12v2h-2v3a1 1 0 11-2 0v-3h-2v2a1 1 0 11-2 0v-3a1 1 0 011-1h4a1 1 0 011 1v3h-2V7a1 1 0 112 0v3z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1  rounded-lg px-4 py-2 outline-none border-2 focus:border-blue-200 ml-2"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendButtonClick}
              className="ml-4 bg-[#22694de1] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#37755ce1] focus:outline-none focus:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
