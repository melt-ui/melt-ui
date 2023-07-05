import { r as redirect } from "../../../chunks/index.js";
async function load() {
  throw redirect(303, "/docs/overview/introduction");
}
export {
  load
};
