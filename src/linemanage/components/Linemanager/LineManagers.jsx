import { useState } from "react";
import NavItem from "../NavItem";

const LineManagers = () => {
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  const tableData = [
    {
      number: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      attendingPeople: "xyz location street ***",
    },
    {
      number: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      attendingPeople: "xyz location street ***",
    },
    {
      number: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      attendingPeople: "xyz location street ***",
    },
    {
      number: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      attendingPeople: "xyz location street ***",
    },
    {
      number: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      attendingPeople: "xyz location street ***",
    },
    {
      number: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      attendingPeople: "xyz location street ***",
    },
    {
      number: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      attendingPeople: "xyz location street ***",
    },
  ];
  return (
    <section className="top-0 bottom-0 right-0 left-0 p-0 m-0">
      <NavItem />
      <div className="w-full mt-[130px] md:w-4/5 lg:w-3/5 mx-auto min-h-[400px] ">
        <div className="flex justify-center items-center gap-x-2">
          {[
            "All Line Managers",
            " Available Managers",
            "Attending Ticket",
            "People in Waiting",
          ].map((link, index) => (
            <div
              key={index}
              onClick={() => handleLinkClick(index)}
              onMouseEnter={(e) =>
                e.currentTarget.classList.add(
                  "bg-green-500",
                  "text-white",
                  "font-bold"
                )
              }
              onMouseLeave={(e) => {
                if (activeLink !== index) {
                  e.currentTarget.classList.remove(
                    "bg-green-500",
                    "text-white",
                    "font-bold"
                  );
                }
              }}
              className={` border flex-1 rounded-3xl duration-500 border-green-500 text-sm text-green-500 px-4 py-2 cursor-pointer ${
                activeLink === index ? "bg-green-500 text-white font-bold" : ""
              }`}
            >
              {link}
            </div>
          ))}
        </div>
        <div className="border border-gray-300 mt-10 rounded-sm text-sm">
          <div className="flex border-b border-gray-300">
            <div className="w-12 p-2 font-bold border-r border-gray-300">
              No
            </div>
            <div className="flex-1 p-2 font-bold border-r border-gray-300">
              Name
            </div>
            <div className="flex-1 p-2 font-bold border-r border-gray-300">
              Email
            </div>
            <div className="w-1/4 p-2 font-bold">Attending People</div>
          </div>
          {tableData.map((row, index) => (
            <div key={index} className="flex border-b border-gray-300">
              <div className="w-12 p-2 border-r border-gray-300">
                {row.number}
              </div>
              <div className="flex-1 p-2 border-r border-gray-300">
                {row.name}
              </div>
              <div className="flex-1 p-2 border-r border-gray-300">
                {row.email}
              </div>
              <div className="w-1/4 p-2">{row.attendingPeople}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LineManagers;
