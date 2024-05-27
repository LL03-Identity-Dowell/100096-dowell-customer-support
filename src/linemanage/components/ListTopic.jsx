import { useSelector } from "react-redux";
import _ from "lodash";

//eslint-disable-next-line
function ListTopic({ search }) {
  const topicData = useSelector((state) => state.tickets.topicData);
  let topic = _.cloneDeep(topicData);
  topic = search
    ? topic?.filter((item) =>
        //eslint-disable-next-line
        item?.name?.toLowerCase().includes(search?.toLowerCase())
      )
    : topic;
  console.log("log data", topic);
  return (
    <div className="relative md:h-[300px] sm:h-[250px] overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              No
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {topic.length > 0 &&
            topic.map((item, index) => (
              <>
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{item?.name}</td>

                  {/* <td className="px-6 py-4">{data1?.address}</td> */}
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListTopic;
