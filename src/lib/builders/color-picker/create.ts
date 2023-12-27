import {
	HSVtoRGB,
	RGBtoHex,
	addMeltEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	hexToHSL,
	hexToHSV,
	hexToRGB,
	isBrowser,
	isValidHexColor,
	overridable,
	styleToString,
} from '$lib/internal/helpers';

import type { ColorRGB, Defaults, Orientation } from '$lib/internal/types';
import { onMount } from 'svelte';

import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
import type {
	ArrowKeys,
	ColorPickerParts,
	CreateColorPickerProps,
	EyeDropperType,
	EyeDropperWindow,
	KeyDurations,
	NodeElement,
	NodeSize,
	Position,
	ReturnedColor,
} from './types';

const defaults = {
	defaultValue: '#ff0000',
	hueSliderOrientation: 'horizontal',
	alphaSliderOrientation: 'horizontal',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

export function createColorPicker(args?: CreateColorPickerProps) {
	const argsWithDefaults = { ...defaults, ...args };
	// const options = toWritableStores(argsWithDefaults);

	let dragging = false;
	let hueDragging = false;
	let alphaDragging = false;
	let insideUpdate = false;
	let inputUpdateHue = false;
	let inputUpdatePickerPos = false;
	let lastValid = argsWithDefaults.defaultValue;
	const speedUpStep = 5;

	const keyDurations: KeyDurations = {
		ArrowDown: null,
		ArrowLeft: null,
		ArrowUp: null,
		ArrowRight: null,
	};

	const valueWritable = argsWithDefaults.value ?? writable(argsWithDefaults.defaultValue);
	const value = overridable(valueWritable, argsWithDefaults?.onValueChange);

	const colorCanvasDims: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});
	const colorPickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
	const colorPickerPos: Writable<Position> = writable({ x: 0, y: 0 });

	const hueSliderDims: Writable<NodeElement<HTMLCanvasElement>> = writable({ height: 1, width: 1 });
	const huePickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
	const hueAngle: Writable<number> = argsWithDefaults.hueAngle ?? writable(0);

	const alphaSliderDims: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});
	const alphaPickerDims: Writable<NodeSize> = writable({ height: 1, width: 1 });
	const alphaValue: Writable<number> = argsWithDefaults.alphaValue ?? writable(100);

	let eye: EyeDropperType | null = null;

	const setAlphaValue = (x: number, y: number) => {
		if (argsWithDefaults.alphaSliderOrientation === 'horizontal') {
			alphaValue.set(Math.round((x / get(alphaSliderDims).width) * 100));
		} else {
			alphaValue.set(Math.round((y / get(alphaSliderDims).height) * 100));
		}
	};

	/**
	 * Returns the current color of the color picker.
	 * This function is used in some builder return parameters,
	 * as well as the subscribe methods, since we sometimes need to
	 * update the $colors value when the hue angle is changed.
	 */
	const getCurrentColor: Readable<() => { rgb: ColorRGB; hex: string }> = derived(
		[hueAngle, colorPickerPos, colorCanvasDims, alphaValue],
		([$hueAngle, $colorPickerPos, $colorCanvasDims, $alphaValue]) => {
			const x = $colorPickerPos.x / $colorCanvasDims.width;
			const y = 1 - $colorPickerPos.y / $colorCanvasDims.height;

			const rgb = HSVtoRGB({ h: $hueAngle / 360, s: x, v: y });
			const hex = RGBtoHex(rgb);

			return () => ({ rgb: { ...rgb, a: $alphaValue }, hex });
		}
	);

	/**
	 * A derived store that returns different color representations (RGB, HSV, HSL).
	 */
	const derivedColors: Readable<ReturnedColor> = derived(
		[value, hueAngle, colorPickerPos, colorCanvasDims, alphaValue],
		([$value, $hueAngle, $colorPickerPos, $colorCanvasDims]) => {
			const x = $colorPickerPos.x / $colorCanvasDims.width;
			const y = 1 - $colorPickerPos.y / $colorCanvasDims.height;

			const rgb = HSVtoRGB({ h: $hueAngle / 360, s: x, v: y });
			const hsv = hexToHSV($value);
			const hsl = hexToHSL($value);

			return {
				rgb,
				hsv,
				hsl,
			};
		}
	);

	function isEyeDropperSupported() {
		return typeof window !== 'undefined' && 'EyeDropper' in window;
	}

	// Handlers
	type HandleMovementArgs = {
		x: number;
		y: number;
		nodeX: number;
		nodeY: number;
		width: number;
		height: number;
	};

	type HandleSliderMovementArgs = {
		x: number;
		y: number;
		nodeX: number;
		nodeY: number;
		width: number;
		height: number;
		store: Writable<number>;
		orientation: Orientation;
		maxValue: number;
	};

	function handleOutsideColorCanvasMovement(args: HandleMovementArgs) {
		const { x, y, nodeX, nodeY, width, height } = args;

		if (x <= nodeX && y <= nodeY) {
			colorPickerPos.set({ x: 0, y: 0 });
		} else if (x <= nodeX && y <= nodeY + height) {
			colorPickerPos.set({ x: 0, y: y - nodeY });
		} else if (x <= nodeX && y > nodeY + height) {
			colorPickerPos.set({ x: 0, y: height });
		} else if (x <= nodeX + width && y <= nodeY) {
			colorPickerPos.set({ x: x - nodeX, y: 0 });
		} else if (x <= nodeX + width && y > nodeY + height) {
			colorPickerPos.set({ x: x - nodeX, y: height });
		} else if (x > nodeX + width && y <= nodeY) {
			colorPickerPos.set({ x: width, y: 0 });
		} else if (x > nodeX + width && y <= nodeY + height) {
			colorPickerPos.set({ x: width, y: y - nodeY });
		} else if (x > nodeX + width && y > nodeY + height) {
			colorPickerPos.set({ x: width, y: height });
		}
	}

	/**
	 * Allows values to be changed when dragging is going on where the mouse or touch event
	 * is outside of the slider's boundaries.
	 *
	 * @param args - slider movement arguments
	 */
	function handleOutsideSliderMovement(args: HandleSliderMovementArgs) {
		const { x, y, nodeX, nodeY, width, height, store, orientation, maxValue } = args;

		if (orientation === 'horizontal') {
			if (x <= nodeX) {
				store.set(0);
			} else if (x <= nodeX + width && (y <= nodeY || y >= nodeY + height)) {
				store.set(Math.round(((x - nodeX) / width) * maxValue));
			} else if (x >= nodeX + width) {
				store.set(maxValue);
			}
		} else {
			if (y <= nodeY) {
				store.set(0);
			} else if (y <= nodeY + height && (x <= nodeX || x >= nodeX + width)) {
				store.set(Math.round(((y - nodeY) / height) * maxValue));
			} else if (y >= nodeY + height) {
				store.set(maxValue);
			}
		}
	}

	/**
	 * Move the color picker around the edges of the canvas element
	 * if the mouse moves outside of the canvas element.
	 * @param e The mousemove event.
	 */
	function handleWindowsMouseMove(e: MouseEvent) {
		if (dragging) {
			const cc = get(colorCanvasDims);

			if (!cc.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = cc;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			handleOutsideColorCanvasMovement({ x, y, nodeX, nodeY, width, height });
		} else if (hueDragging) {
			const hs = get(hueSliderDims);

			if (!hs.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = hs;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			handleOutsideSliderMovement({
				x,
				y,
				nodeX,
				nodeY,
				width,
				height,
				store: hueAngle,
				orientation: argsWithDefaults.hueSliderOrientation,
				maxValue: 359,
			});
		} else if (alphaDragging) {
			const as = get(alphaSliderDims);

			if (!as.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = as;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			handleOutsideSliderMovement({
				x,
				y,
				nodeX,
				nodeY,
				width,
				height,
				store: alphaValue,
				orientation: argsWithDefaults.alphaSliderOrientation,
				maxValue: 100,
			});
		}
	}

	/**
	 * Turn off dragging if a mouse up event occurs outside of
	 * the canvas element while dragging is going on.
	 * @param e The mouse up event.
	 */
	function handleWindowsMouseUp(e: MouseEvent) {
		if (dragging) {
			const cc = get(colorCanvasDims);

			if (!cc.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = cc;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			if (x < nodeX || x > nodeX + width || y < nodeY || y > nodeY + height) {
				dragging = false;
			}
		} else if (hueDragging || alphaDragging) {
			const dims = hueDragging ? get(hueSliderDims) : get(alphaSliderDims);

			if (!dims.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = dims;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			if (x < nodeX || x > nodeX + width || y < nodeY || y > nodeY + height) {
				hueDragging = false;
				alphaDragging = false;
			}
		}
	}

	function updateOnColorInput(hex: string) {
		const hsv = hexToHSV(hex);

		const { width, height } = get(colorCanvasDims);
		hueAngle.set(hsv.h);

		colorPickerPos.set({
			x: Math.round(hsv.s * width),
			y: Math.round((1 - hsv.v) * height),
		});
	}

	// Builders
	const colorCanvas = builder(name('color-canvas'), {
		stores: [hueAngle],
		returned: ([$hueAngle]) => {
			return {
				style: styleToString({
					'background-color': `hsl(${$hueAngle}, 100%, 50%)`,
					'background-image':
						'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
				}),
			};
		},
		action: (node: HTMLCanvasElement) => {
			const rect = node.getBoundingClientRect();

			colorCanvasDims.set({
				node,
				width: rect.width,
				height: rect.height,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const { offsetX: x, offsetY: y } = e;
					colorPickerPos.set({ x, y });
				}),
				addMeltEventListener(node, 'mousedown', () => {
					dragging = true;
				}),
				addMeltEventListener(node, 'mouseup', () => {
					dragging = false;
				}),
				addMeltEventListener(node, 'mousemove', (e) => {
					if (!dragging) return;

					const { offsetX: x, offsetY: y } = e;
					colorPickerPos.set({ x, y });
				}),
				addMeltEventListener(node, 'touchstart', () => {
					dragging = true;
				}),
				addMeltEventListener(node, 'touchend', () => {
					dragging = false;
				}),
				addMeltEventListener(node, 'touchmove', (e) => {
					if (!dragging) return;

					const cc = get(colorCanvasDims);

					if (!cc.node) return;

					e.preventDefault();

					const { clientX: x, clientY: y } = e.touches[0];
					const { width, height, node } = cc;
					const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

					if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
						colorPickerPos.set({ x: x - nodeX, y: y - nodeY });
					} else {
						handleOutsideColorCanvasMovement({ x, y, nodeX, nodeY, width, height });
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const colorPicker = builder(name('color-picker'), {
		stores: [colorPickerPos, colorPickerDims, value],
		returned: ([$colorPickerPos, $colorPickerDims, $value]) => {
			const top = Math.round($colorPickerPos.y - $colorPickerDims.height / 2);
			const left = Math.round($colorPickerPos.x - $colorPickerDims.width / 2);

			return {
				style: styleToString({
					position: 'absolute',
					top: `${top}px`,
					left: `${left}px`,
					'background-color': `${$value}`,
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
			const rect = node.getBoundingClientRect();

			colorPickerDims.set({
				width: rect.width,
				height: rect.height,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'mousedown', () => {
					dragging = true;
				}),
				addMeltEventListener(node, 'mouseup', () => {
					dragging = false;
				}),
				addMeltEventListener(node, 'keyup', (e) => {
					const { key } = e;
					const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

					if (!keys.includes(key)) return;

					keyDurations[<ArrowKeys>key] = null;
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

					if (!keys.includes(e.key)) return;

					const key = <ArrowKeys>e.key;

					e.preventDefault();

					let duration = 0;

					if (!keyDurations[key]) {
						keyDurations[key] = Date.now();
					} else {
						duration = Date.now() - <number>keyDurations[key];
					}

					const step = duration > 1000 ? speedUpStep : 1;

					const { x, y } = get(colorPickerPos);
					const { height: canvasH, width: canvasW } = get(colorCanvasDims);

					// Move the picker button and restrict movement to within the canvas.
					if (key === 'ArrowUp' && y - 1 >= 0) {
						colorPickerPos.set({ x, y: Math.max(y - step, 0) });
					} else if (key === 'ArrowDown' && y + 1 <= canvasH) {
						colorPickerPos.set({ x, y: Math.min(y + step, canvasH) });
					} else if (key === 'ArrowRight' && x + 1 <= canvasW) {
						colorPickerPos.set({ x: Math.min(x + step, canvasW), y });
					} else if (key === 'ArrowLeft' && x - 1 >= 0) {
						colorPickerPos.set({ x: Math.max(x - step, 0), y });
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const hueSlider = builder(name('hue-slider'), {
		returned: () => {
			const orientation =
				argsWithDefaults.hueSliderOrientation === 'horizontal' ? 'right' : 'bottom';

			// Create hue color gradient.
			const hueColors: string[] = [];

			for (let i = 0; i < 360; i++) {
				hueColors.push(`hsl(${i}, 100%, 50%)`);
			}

			return {
				style: styleToString({
					background: `linear-gradient(to ${orientation}, ${hueColors.join(',')})`,
				}),
			};
		},
		action: (node: HTMLCanvasElement) => {
			const rect = node.getBoundingClientRect();

			hueSliderDims.set({
				node,
				width: rect.width,
				height: rect.height,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const { hueSliderOrientation: orientation } = argsWithDefaults;

					const { offsetX: x, offsetY: y } = e;

					const angle =
						orientation === 'horizontal'
							? Math.round((x / get(hueSliderDims).width) * 360)
							: Math.round((y / get(hueSliderDims).height) * 360);

					hueAngle.set(angle);
				}),
				addMeltEventListener(node, 'mousedown', () => {
					hueDragging = true;
				}),
				addMeltEventListener(node, 'mouseup', () => {
					hueDragging = false;
				}),
				addMeltEventListener(node, 'mousemove', (e) => {
					if (!hueDragging) return;

					const { hueSliderOrientation: orientation } = argsWithDefaults;

					const { offsetX: x, offsetY: y } = e;

					const angle =
						orientation === 'horizontal'
							? Math.round((x / get(hueSliderDims).width) * 360)
							: Math.round((y / get(hueSliderDims).height) * 360);

					hueAngle.set(angle);
				}),
				addMeltEventListener(node, 'touchstart', () => {
					hueDragging = true;
				}),
				addMeltEventListener(node, 'touchend', () => {
					hueDragging = false;
				}),
				addMeltEventListener(node, 'touchmove', (e) => {
					if (!hueDragging) return;

					const hs = get(hueSliderDims);

					if (!hs.node) return;

					e.preventDefault();

					const { clientX: x, clientY: y } = e.touches[0];
					const { width, height, node } = hs;
					const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

					if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
						hueAngle.set(Math.round(((x - nodeX) / width) * 359));
					} else {
						handleOutsideSliderMovement({
							x,
							y,
							nodeX,
							nodeY,
							width,
							height,
							store: hueAngle,
							orientation: argsWithDefaults.hueSliderOrientation,
							maxValue: 359,
						});
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const huePicker = builder(name('hue-picker'), {
		stores: [hueAngle, huePickerDims, hueSliderDims],
		returned: ([$hueAngle, $huePickerDims, $hueSliderDims]) => {
			const { hueSliderOrientation: orientation } = argsWithDefaults;

			let left = '';
			let top = '';
			let transform = '';

			if (orientation === 'horizontal') {
				left = `${Math.round(
					($hueAngle / 360) * $hueSliderDims.width - $huePickerDims.width / 2
				)}px`;
				top = '50%';
				transform = 'translateY(-50%)';
			} else {
				left = '50%';
				top = `${Math.round(
					($hueAngle / 360) * $hueSliderDims.height - $huePickerDims.height / 2
				)}px`;
				transform = 'translateX(-50%)';
			}

			return {
				style: styleToString({
					position: 'absolute',
					background: `hsl(${$hueAngle}, 100%, 50%)`,
					left,
					top,
					transform,
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
			const rect = node.getBoundingClientRect();

			huePickerDims.set({
				height: rect.height,
				width: rect.width,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'mousedown', () => {
					hueDragging = true;
				}),
				addMeltEventListener(node, 'mouseup', () => {
					hueDragging = false;
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					const { key } = e;
					const orientation = argsWithDefaults.hueSliderOrientation;

					const keys =
						orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];

					if (!keys.includes(key)) return;

					e.preventDefault();

					const angle = get(hueAngle);

					let increaseArrow = 'ArrowRight';
					let decreaseArrow = 'ArrowLeft';

					if (argsWithDefaults.hueSliderOrientation === 'vertical') {
						increaseArrow = 'ArrowDown';
						decreaseArrow = 'ArrowUp';
					}

					// Move the picker button and restrict movement to within the canvas.
					if (key === increaseArrow && angle + 1 < 360) {
						hueAngle.set(angle + 1);
					} else if (key === decreaseArrow && angle - 1 >= 0) {
						hueAngle.set(angle - 1);
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const alphaSlider = builder(name('alpha-slider'), {
		stores: [value],
		returned: ([$value]) => {
			const orientation =
				argsWithDefaults.hueSliderOrientation === 'horizontal' ? 'right' : 'bottom';

			const rgb = hexToRGB($value);
			const { r, g, b } = rgb;

			const color = `${r}, ${g}, ${b}`;

			return {
				style: styleToString({
					background: `linear-gradient(to ${orientation}, rgba(${color}, 0), ${$value})`,
				}),
			};
		},
		action: (node: HTMLCanvasElement) => {
			const rect = node.getBoundingClientRect();

			alphaSliderDims.set({
				node,
				width: rect.width,
				height: rect.height,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const { offsetX: x, offsetY: y } = e;
					setAlphaValue(x, y);
				}),
				addMeltEventListener(node, 'mousedown', () => {
					alphaDragging = true;
				}),
				addMeltEventListener(node, 'mouseup', () => {
					alphaDragging = false;
				}),
				addMeltEventListener(node, 'mousemove', (e) => {
					if (!alphaDragging) return;

					const { offsetX: x, offsetY: y } = e;
					setAlphaValue(x, y);
				}),
				addMeltEventListener(node, 'touchstart', () => {
					alphaDragging = true;
				}),
				addMeltEventListener(node, 'touchend', () => {
					alphaDragging = false;
				}),
				addMeltEventListener(node, 'touchmove', (e) => {
					if (!alphaDragging) return;

					const as = get(alphaSliderDims);

					if (!as.node) return;

					e.preventDefault();

					const { clientX: x, clientY: y } = e.touches[0];
					const { width, height, node } = as;
					const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

					if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
						alphaValue.set(Math.round(((x - nodeX) / width) * 100));
					} else {
						handleOutsideSliderMovement({
							x,
							y,
							nodeX,
							nodeY,
							width,
							height,
							store: alphaValue,
							orientation: argsWithDefaults.alphaSliderOrientation,
							maxValue: 100,
						});
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const alphaPicker = builder(name('alpha-picker'), {
		stores: [alphaValue, alphaPickerDims, alphaSliderDims, getCurrentColor],
		returned: ([$alphaValue, $alphaPickerDims, $alphaSliderDims, $getCurrentColor]) => {
			const { alphaSliderOrientation: orientation } = argsWithDefaults;

			let left = '';
			let top = '';
			let transform = '';

			if (orientation === 'horizontal') {
				left = `${Math.round(
					($alphaValue / 100) * $alphaSliderDims.width - $alphaPickerDims.width / 2
				)}px`;
				top = '50%';
				transform = 'translateY(-50%)';
			} else {
				left = '50%';
				top = `${Math.round(
					($alphaValue / 100) * $alphaSliderDims.height - $alphaPickerDims.height / 2
				)}px`;
				transform = 'translateX(-50%)';
			}

			const { rgb } = $getCurrentColor();
			const { r, g, b } = rgb;

			return {
				style: styleToString({
					position: 'absolute',
					background: `rgba(${r}, ${g}, ${b}, ${$alphaValue / 100})`,
					left,
					top,
					transform,
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
			const rect = node.getBoundingClientRect();

			alphaPickerDims.set({
				height: rect.height,
				width: rect.width,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'mousedown', () => {
					alphaDragging = true;
				}),
				addMeltEventListener(node, 'mouseup', () => {
					alphaDragging = false;
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					const { key } = e;
					const orientation = argsWithDefaults.alphaSliderOrientation;

					const keys =
						orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];

					if (!keys.includes(key)) return;

					e.preventDefault();

					const alpha = get(alphaValue);

					let increaseArrow = 'ArrowRight';
					let decreaseArrow = 'ArrowLeft';

					if (argsWithDefaults.hueSliderOrientation === 'vertical') {
						increaseArrow = 'ArrowDown';
						decreaseArrow = 'ArrowUp';
					}

					// Move the picker button and restrict movement to within the canvas.
					if (key === increaseArrow && alpha + 1 <= 100) {
						alphaValue.set(alpha + 1);
					} else if (key === decreaseArrow && alpha - 1 >= 0) {
						alphaValue.set(alpha - 1);
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const eyeDropper = builder(name('eye-dropper'), {
		action: (node: HTMLButtonElement) => {
			if (!isEyeDropperSupported()) return;
			const eyeWindow = <EyeDropperWindow>window;

			if (eyeWindow.EyeDropper) {
				eye = new eyeWindow.EyeDropper();
			}

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					if (!eye) return;

					eye.open().then((result) => updateOnColorInput(result.sRGBHex));
					// .catch((e) => console.log(e));
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	const hexInput = builder(name('hex-input'), {
		action: (node: HTMLInputElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== 'Enter') return;

					const { value: hexValue } = node;

					if (!isValidHexColor(hexValue)) {
						value.set(lastValid);
						return;
					}

					value.set(hexValue);
				}),
				addMeltEventListener(node, 'blur', () => {
					const { value: hexValue } = node;

					if (!isValidHexColor(hexValue)) {
						node.value = lastValid;
						return;
					}
				})
			);

			return {
				destroy() {
					unsubEvents();
				},
			};
		},
	});

	// Lifecycle
	onMount(() => {
		if (isBrowser) {
			window.addEventListener('mousemove', handleWindowsMouseMove);
			window.addEventListener('mouseup', handleWindowsMouseUp);
		}

		// Check if the given color is valid and replace it with
		// the default color if not.
		argsWithDefaults.defaultValue = isValidHexColor(argsWithDefaults.defaultValue)
			? argsWithDefaults.defaultValue
			: defaults.defaultColor;

		value.set(argsWithDefaults.defaultValue);

		// Update the color and hue picker button positions to default one.
		updateOnColorInput(argsWithDefaults.defaultValue);

		/**
		 * If the color is updated from outside we do not need to update the color again,
		 * so we check if inputUpdatePickerPos = true.
		 */
		const colorPickerUnsub = colorPickerPos.subscribe(() => {
			if (inputUpdatePickerPos) {
				inputUpdatePickerPos = false;
				return;
			}

			const { hex } = get(getCurrentColor)();
			insideUpdate = true;
			value.set(hex);
		});

		/**
		 * If the hue angle is being updated from outside we need to update the color value,
		 * else we can just return.
		 */
		const hueAngleUnsub = hueAngle.subscribe(() => {
			if (inputUpdateHue) {
				inputUpdateHue = false;
				return;
			}

			const { hex } = get(getCurrentColor)();
			insideUpdate = true;
			value.set(hex);
		});

		/**
		 * Check if the color is updated, and whether it was internally or externally.
		 * If the source is external, we need to update the hue angle and the color
		 * picker position.
		 */
		const colorUnsub = value.subscribe((hex) => {
			if (insideUpdate) {
				insideUpdate = false;
				return;
			}

			if (!isValidHexColor(hex)) return;

			lastValid = hex;

			inputUpdateHue = true;
			inputUpdatePickerPos = true;
			updateOnColorInput(hex);
		});

		return () => {
			window.removeEventListener('mousemove', handleWindowsMouseMove);
			window.removeEventListener('mouseup', handleWindowsMouseUp);
			colorPickerUnsub();
			hueAngleUnsub();
			colorUnsub();
		};
	});

	return {
		elements: {
			colorCanvas,
			colorPicker,
			hueSlider,
			huePicker,
			alphaSlider,
			alphaPicker,
			eyeDropper,
			hexInput,
		},
		states: {
			value,
		},
		helpers: {
			derivedColors,
		},
	};
}
