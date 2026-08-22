export const formatDuration = (startDate: string | Date): string => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const now = new Date();

  let totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) {
    totalMonths -= 1;
  }
  totalMonths = Math.max(totalMonths, 0);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}年${months}ヶ月`;
};

export const formatCategoryLocation = (
  category: string,
  prefecture: string,
  city: string,
): string => `${category}｜${prefecture} ${city}`;

export const formatCount = (count: number): string => count.toLocaleString("ja-JP");

export const truncateText = (text: string, maxLength = 20): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
