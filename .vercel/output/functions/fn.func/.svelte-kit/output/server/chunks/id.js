import { nanoid } from "nanoid";
function generateId() {
  return nanoid(10);
}
export {
  generateId as g
};
