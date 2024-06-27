// formatDate.js
export function formatDate(createdAt) {
  const date = new Date(createdAt);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    hour12: true,
  };

  const simpleDate = date.toLocaleDateString("en-US", options);
  const hour = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    hour12: true,
  });

  return `${simpleDate} ${hour}`;
}
