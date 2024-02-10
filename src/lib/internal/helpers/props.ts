import { writable, type Writable } from "svelte/store";
import { isWritable } from "./is.js";

export type WritableProp<T> = Writable<T> | T

export function parseProp<T>(prop: WritableProp<T>): Writable<T> {
  return isWritable(prop) ? prop : writable(prop);
}
