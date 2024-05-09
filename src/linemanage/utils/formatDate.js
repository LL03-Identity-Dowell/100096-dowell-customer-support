export default function formatDate(date) {
    // Extract year, month, and day components from the date object
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0"); // Add leading zero if month is less than 10
    const day = String(date?.getDate()).padStart(2, "0"); // Add leading zero if day is less than 10

    // Combine the components in the "YYYY_MM_DD" format
    return `${year}_${month}_${day}`;
  }