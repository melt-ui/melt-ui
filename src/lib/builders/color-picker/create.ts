import {
	addEventListener,
	addMeltEventListener,
	builder,
	createElHelpers,
	effect,
	executeCallbacks,
	isBrowser,
	isNumberString,
	omit,
	overridable,
	styleToString,
	toWritableStores,
} from '$lib/internal/helpers';
import { colord } from 'colord';

import type { Defaults, Orientation } from '$lib/internal/types';

import {
	convertColor,
	getChannelValue,
	getColorFormat,
	isColorChannel,
	isValidColor,
	type ColorChannel,
} from '$lib/internal/helpers/color';
import { safeOnMount } from '$lib/internal/helpers/lifecycle';
import { derived, get, writable, type Writable } from 'svelte/store';
import type {
	ArrowKeys,
	ColorPickerParts,
	CreateColorPickerProps,
	EyeDropperType,
	EyeDropperWindow,
	KeyDurations,
	NodeElement,
	NodeSize,
} from './types';

const defaults = {
	defaultValue: '#ff0000',
	hueSliderOrientation: 'horizontal',
	alphaSliderOrientation: 'horizontal',
} satisfies Defaults<CreateColorPickerProps>;

const { name } = createElHelpers<ColorPickerParts>('color-picker');

export function createColorPicker(args?: CreateColorPickerProps) {
	const argsWithDefaults = { ...defaults, ...args };
	const options = toWritableStores(omit(argsWithDefaults, 'value', 'defaultValue'));

	let dragging = false;
	let hueDragging = false;
	let alphaDragging = false;
	let lastValid: string = defaults.defaultValue;
	const speedUpStep = 5;

	const keyDurations: KeyDurations = {
		ArrowDown: null,
		ArrowLeft: null,
		ArrowUp: null,
		ArrowRight: null,
	};

	const valueWritable = argsWithDefaults.value ?? writable(argsWithDefaults.defaultValue);
	const value = overridable(valueWritable, argsWithDefaults?.onValueChange);
	value.update((p) => (isValidColor(p) ? p : defaults.defaultValue));

	const colorCanvasDimensions: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});
	const colorCanvasThumbPos = writable({ x: 0, y: 0 });
	const colorCanvasThumbDimensions: Writable<NodeSize> = writable({ height: 1, width: 1 });

	const hueSliderDimensions: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});
	const huePickerDimensions: Writable<NodeSize> = writable({ height: 1, width: 1 });
	const hueAngle: Writable<number> = argsWithDefaults.hueAngle ?? writable(0);

	const alphaSliderDimensions: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});
	const alphaPickerDimensions: Writable<NodeSize> = writable({ height: 1, width: 1 });
	const alphaValue: Writable<number> = argsWithDefaults.alphaValue ?? writable(100);

	let eye: EyeDropperType | null = null;

	const setAlphaValue = (x: number, y: number) => {
		if (argsWithDefaults.alphaSliderOrientation === 'horizontal') {
			alphaValue.set(Math.round((x / get(alphaSliderDimensions).width) * 100));
		} else {
			alphaValue.set(Math.round((y / get(alphaSliderDimensions).height) * 100));
		}
	};

	const getColorFromPos = derived(
		[colorCanvasDimensions, hueAngle, value],
		([$colorCanvasDimensions, $hueAngle, $value]) => {
			return (pos: { x: number; y: number }) => {
				const x = pos.x / $colorCanvasDimensions.width;
				const y = 1 - pos.y / $colorCanvasDimensions.height;

				const c = colord({
					h: $hueAngle,
					s: x * 100,
					v: y * 100,
					a: getChannelValue('alpha', $value),
				});

				return convertColor(c, getColorFormat($value) ?? 'hex', true);
			};
		}
	);

	const getColorPos = derived([colorCanvasDimensions], ([$colorCanvasDimensions]) => {
		return (color: string) => {
			const c = colord(color);

			const { s, v } = c.toHsv();

			return {
				x: (s / 100) * $colorCanvasDimensions.width,
				y: (1 - v / 100) * $colorCanvasDimensions.height,
			};
		};
	});

	/**
	 * Returns the current color of the color picker.
	 * This function is used in some builder return parameters,
	 * as well as the subscribe methods, since we sometimes need to
	 * update the $colors value when the hue angle is changed.
	 */
	const updateByPos = derived(getColorFromPos, ($colorFromPos) => {
		return (pos: { x: number; y: number }) => {
			colorCanvasThumbPos.set(pos);

			value.set($colorFromPos(pos));
		};
	});

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
			get(updateByPos)({ x: 0, y: 0 });
		} else if (x <= nodeX && y <= nodeY + height) {
			get(updateByPos)({ x: 0, y: y - nodeY });
		} else if (x <= nodeX && y > nodeY + height) {
			get(updateByPos)({ x: 0, y: height });
		} else if (x <= nodeX + width && y <= nodeY) {
			get(updateByPos)({ x: x - nodeX, y: 0 });
		} else if (x <= nodeX + width && y > nodeY + height) {
			get(updateByPos)({ x: x - nodeX, y: height });
		} else if (x > nodeX + width && y <= nodeY) {
			get(updateByPos)({ x: width, y: 0 });
		} else if (x > nodeX + width && y <= nodeY + height) {
			get(updateByPos)({ x: width, y: y - nodeY });
		} else if (x > nodeX + width && y > nodeY + height) {
			get(updateByPos)({ x: width, y: height });
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
			const cc = get(colorCanvasDimensions);

			if (!cc.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = cc;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			handleOutsideColorCanvasMovement({ x, y, nodeX, nodeY, width, height });
		} else if (hueDragging) {
			const hs = get(hueSliderDimensions);

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
			const as = get(alphaSliderDimensions);

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
			const cc = get(colorCanvasDimensions);

			if (!cc.node) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;
			const { width, height, node } = cc;
			const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

			if (x < nodeX || x > nodeX + width || y < nodeY || y > nodeY + height) {
				dragging = false;
			}
		} else if (hueDragging || alphaDragging) {
			const dims = hueDragging ? get(hueSliderDimensions) : get(alphaSliderDimensions);

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

	function updateChannel(v: number, channel: ColorChannel) {
		value.update((p) => {
			const c = colord(p);
			const format = getColorFormat(p);
			if (!format) return p;
			switch (channel) {
				case 'hue':
					return convertColor(c.hue(v), format, true);
				case 'saturation':
					return convertColor(colord({ ...c.toHsl(), s: v }), format, true);
				case 'lightness':
					return convertColor(colord({ ...c.toHsl(), l: v }), format, true);
				case 'alpha':
					return convertColor(c.alpha(v), format, true);
				case 'red':
					return convertColor(colord({ ...c.toRgb(), r: v }), format, true);
				case 'green':
					return convertColor(colord({ ...c.toRgb(), g: v }), format, true);
				case 'blue':
					return convertColor(colord({ ...c.toRgb(), b: v }), format, true);
				default:
					return p;
			}
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

			colorCanvasDimensions.set({
				node,
				width: rect.width,
				height: rect.height,
			});

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const { offsetX: x, offsetY: y } = e;
					get(updateByPos)({ x, y });
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
					get(updateByPos)({ x, y });
				}),
				addMeltEventListener(node, 'touchstart', () => {
					dragging = true;
				}),
				addMeltEventListener(node, 'touchend', () => {
					dragging = false;
				}),
				addMeltEventListener(node, 'touchmove', (e) => {
					if (!dragging) return;

					const cc = get(colorCanvasDimensions);

					if (!cc.node) return;

					e.preventDefault();

					const { clientX: x, clientY: y } = e.touches[0];
					const { width, height, node } = cc;
					const { x: nodeX, y: nodeY } = node.getBoundingClientRect();

					if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
						get(updateByPos)({ x: x - nodeX, y: y - nodeY });
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

	const colorCanvasThumb = builder(name('color-canvas-thumb'), {
		stores: [colorCanvasThumbPos, colorCanvasThumbDimensions, value],
		returned: ([$colorPickerPos, $colorPickerDimensions, $value]) => {
			const top = Math.round($colorPickerPos.y - $colorPickerDimensions.height / 2);
			const left = Math.round($colorPickerPos.x - $colorPickerDimensions.width / 2);

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

			colorCanvasThumbDimensions.set({
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

					const { x, y } = get(colorCanvasThumbPos);
					const { height: canvasH, width: canvasW } = get(colorCanvasDimensions);

					// Move the picker button and restrict movement to within the canvas.
					if (key === 'ArrowUp' && y - 1 >= 0) {
						get(updateByPos)({ x, y: Math.max(y - step, 0) });
					} else if (key === 'ArrowDown' && y + 1 <= canvasH) {
						get(updateByPos)({ x, y: Math.min(y + step, canvasH) });
					} else if (key === 'ArrowRight' && x + 1 <= canvasW) {
						get(updateByPos)({ x: Math.min(x + step, canvasW), y });
					} else if (key === 'ArrowLeft' && x - 1 >= 0) {
						get(updateByPos)({ x: Math.max(x - step, 0), y });
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

			hueSliderDimensions.set({
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
							? Math.round((x / get(hueSliderDimensions).width) * 360)
							: Math.round((y / get(hueSliderDimensions).height) * 360);

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
							? Math.round((x / get(hueSliderDimensions).width) * 360)
							: Math.round((y / get(hueSliderDimensions).height) * 360);

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

					const hs = get(hueSliderDimensions);

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
		stores: [hueAngle, huePickerDimensions, hueSliderDimensions],
		returned: ([$hueAngle, $huePickerDimensions, $hueSliderDimensions]) => {
			const { hueSliderOrientation: orientation } = argsWithDefaults;

			let left = '';
			let top = '';
			let transform = '';

			if (orientation === 'horizontal') {
				left = `${Math.round(
					($hueAngle / 360) * $hueSliderDimensions.width - $huePickerDimensions.width / 2
				)}px`;
				top = '50%';
				transform = 'translateY(-50%)';
			} else {
				left = '50%';
				top = `${Math.round(
					($hueAngle / 360) * $hueSliderDimensions.height - $huePickerDimensions.height / 2
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

			huePickerDimensions.set({
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

			const rgb = convertColor($value, 'rgb');
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

			alphaSliderDimensions.set({
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

					const as = get(alphaSliderDimensions);

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
		stores: [alphaValue, alphaPickerDimensions, alphaSliderDimensions],
		returned: ([$alphaValue, $alphaPickerDimensions, $alphaSliderDimensions]) => {
			const { alphaSliderOrientation: orientation } = argsWithDefaults;

			let left = '';
			let top = '';
			let transform = '';

			if (orientation === 'horizontal') {
				left = `${Math.round(
					($alphaValue / 100) * $alphaSliderDimensions.width - $alphaPickerDimensions.width / 2
				)}px`;
				top = '50%';
				transform = 'translateY(-50%)';
			} else {
				left = '50%';
				top = `${Math.round(
					($alphaValue / 100) * $alphaSliderDimensions.height - $alphaPickerDimensions.height / 2
				)}px`;
				transform = 'translateX(-50%)';
			}

			// const { rgb } = $getCurrentColor();
			// const { r, g, b } = rgb;

			return {
				style: styleToString({
					position: 'absolute',
					// background: `rgba(${r}, ${g}, ${b}, ${$alphaValue / 100})`,
					left,
					top,
					transform,
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
			const rect = node.getBoundingClientRect();

			alphaPickerDimensions.set({
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

	const channelInput = builder(name('channel-input'), {
		stores: value,
		returned: ($value) => {
			return (channel: ColorChannel) => {
				return {
					'data-channel': channel,
					value: getChannelValue(channel, $value),
					type: 'number',
					step: channel === 'alpha' ? 0.01 : 1,
					min: 0,
					max: channel === 'alpha' ? 1 : undefined,
				};
			};
		},
		action: (node: HTMLInputElement) => {
			const destroy = addMeltEventListener(node, 'input', () => {
				const { value: v } = node;
				const channel = node.dataset.channel;

				if (!isColorChannel(channel) || !isNumberString(v)) return;

				updateChannel(Number(v), channel);
			});

			return { destroy };
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

					// eye.open().then((result) => updateOnColorInput(result.sRGBHex));
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

	const input = builder(name('input'), {
		stores: [value],
		returned: ([$value]) => {
			return {
				value: $value,
			};
		},
		action: (node: HTMLInputElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== 'Enter') return;

					if (isValidColor(node.value)) {
						value.set(node.value);
					} else {
						node.value = lastValid;
					}
				}),
				addMeltEventListener(node, 'blur', () => {
					if (isValidColor(node.value)) {
						value.set(node.value);
					} else {
						node.value = lastValid;
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
	safeOnMount(() => {
		if (!isBrowser) return;

		return executeCallbacks(
			addEventListener(window, 'mousemove', handleWindowsMouseMove),
			addEventListener(window, 'mouseup', handleWindowsMouseUp)
		);
	});

	effect([value, getColorFromPos, getColorPos], ([$value, $getColorFromPos, $getColorPos]) => {
		colorCanvasThumbPos.update((pos) => {
			const colorFromPos = $getColorFromPos(pos);
			if (colorFromPos === $value) return pos;
			return $getColorPos($value);
		});
	});

	effect(hueAngle, ($hueAngle) => {
		updateChannel($hueAngle, 'hue');
	});

	effect(value, ($value) => {
		hueAngle.set(colord($value).hue());
		lastValid = $value;
		alphaValue.set(colord($value).alpha() * 100);
	});

	effect(alphaValue, ($alphaValue) => {
		updateChannel($alphaValue / 100, 'alpha');
	});

	return {
		elements: {
			colorCanvas,
			colorCanvasThumb,
			hueSlider,
			huePicker,
			alphaSlider,
			alphaPicker,
			channelInput,
			eyeDropper,
			input,
		},
		states: {
			value,
		},
		helpers: {
			convertColor,
			isEyeDropperSupported,
		},
	};
}
