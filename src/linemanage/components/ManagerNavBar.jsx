import { useEffect } from "react";

// eslint-disable-next-line
export function ManagerNavBar({ tab, setTab, search, setSearch, type }) {
  console.log("type==", type === "createLineManager");

  let view = "",
    create = "";
  if (type === "createLineManager") {
    view = "viewLineManager";
    create = "createLineManager";
  } else if (type === "createTopic") {
    view = "viewTopic";
    create = "createTopic";
  } else {
    view = "viewLink";
    create = "createLink";
  }
  useEffect(() => {
    setTab(view);
  }, []);
  return (
    <div className="flex flex-col sm:flex-col md:flex-row gap-3 mt-10 md:h-auto">
      <div className="w-full sm:w-full md:w-auto" onClick={() => setTab("")}>
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only focus:outline-none dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <input
            type="search"
            id="search"
            value={search}
            className="block w-full md:w-80% h-8 p-4 ps-10 text-sm text-start border border-[#ebe7e7] focus:outline-none rounded-lg bg-gray-50 focus:border-[#2fd26b] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex w-full sm:w-full md:w-auto">
        <button
          onClick={() => setTab(view)}
          type="button"
          className={`text-[#7E7E7E] h-9 border ${
            tab === "viewLineManager" ||
            tab === "viewTopic" ||
            tab === "viewLink"
              ? "bg-[#2fd26b] text-white"
              : ""
          } hover:text-white border-[#ebe7e7] transition-colors duration-75 ease-in-out hover:bg-[#2fd26b] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-[#22ad55] dark:hover:bg-[#2add6c] dark:focus:ring-[#22C55E]`}
        >
          {type === "createLineManager" ? "View Line Manager" : ""}
          {type === "createTopic" ? "view Topic" : ""}
          {type === "createLink" ? "view Link" : ""}
        </button>
      </div>

      <div className="flex w-full sm:w-full md:w-auto">
        <button
          type="button"
          onClick={() => setTab(create)}
          className={`group text-[#7E7E7E] h-9 border hover:text-white border-[#ebe7e7] transition-colors duration-75 ease-in-out ${
            tab === "createLineManager" ||
            tab === "createTopic" ||
            tab === "createLink"
              ? "bg-[#2fd26b] text-white"
              : ""
          } hover:bg-[#2fd26b] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-[#22ad55] dark:hover:bg-[#2add6c] dark:focus:ring-[#22C55E]`}
        >
          <svg
            className={`w-4 h-full mr-2 text-[#2add6c] ${
              tab === "createLineManager" ||
              tab === "createTopic" ||
              tab === "createLink"
                ? "text-white"
                : ""
            } group-hover:text-white dark:text-gray-400`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 4v12M4 10h12"
            />
          </svg>
          {type === "createLineManager" ? "Add Line Manager" : ""}
          {type === "createTopic" ? "Add Topic" : ""}
          {type === "createLink" ? "Add Link" : ""}
        </button>
      </div>
    </div>
  );
}
