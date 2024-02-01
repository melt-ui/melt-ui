import structuredClonePolyfill from "@ungap/structured-clone";

// Export existing implementation if available.
if (!("structuredClone" in globalThis)) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	globalThis.structuredClone = structuredClonePolyfill;
}
