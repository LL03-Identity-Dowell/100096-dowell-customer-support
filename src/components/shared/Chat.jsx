//eslint-disable-next-line
const Chat = ({ isOpen, onClose, children }) => {
  const modalClass = isOpen
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "hidden";

  return (
    <div className={modalClass}>
      <div className="fixed inset-0 bg-black opacity-50">What is this</div>
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        {children}
        <button
          className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;
