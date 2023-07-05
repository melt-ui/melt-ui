import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const formatStr = (s) => {
  return s.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
};
export {
  cn as c,
  formatStr as f
};
