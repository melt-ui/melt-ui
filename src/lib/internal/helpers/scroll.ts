export function removeScroll() {
	const initialPaddingRight = getComputedStyle(document.body).paddingRight;
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

	document.documentElement.style.overflowY = 'hidden';
	document.documentElement.style.paddingRight = `calc(${scrollbarWidth}px + ${initialPaddingRight})`;
	return () => {
		document.documentElement.style.overflowY = 'auto';
		document.documentElement.style.paddingRight = '0';
	};
}
