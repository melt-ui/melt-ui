import { r as redirect } from "../../../chunks/index.js";
const load = async () => {
  throw redirect(302, "/docs/introduction");
};
export {
  load
};
