export function getCurrFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
export function getFormattedDate(date: string | undefined = "") {
  const dateString = date;
  const _date = new Date(dateString);

  if (_date < new Date()) {
    return "已过期";
  }

  const formattedDate = _date.toLocaleString();
  return formattedDate;
}
