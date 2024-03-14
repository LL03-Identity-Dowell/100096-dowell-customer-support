export default function formatCreatedAt(created_at) {
    const createdAtDate = new Date(created_at);
    const now = new Date();

    // Check if the created_at date is today
    if (createdAtDate.toDateString() === now.toDateString()) {
      const hours = createdAtDate.getHours();
      const minutes = createdAtDate.getMinutes();
      return `${hours}:${minutes}m today`;
    } else {
      // If it's not today, you may want to format it differently
      // For example, return the full date
      const options = {
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        month: "long",
        day: "numeric",
      };
      return createdAtDate.toLocaleDateString("en-US", options);
    }
  }