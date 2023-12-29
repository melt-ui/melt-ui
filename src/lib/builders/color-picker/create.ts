import {
	addEventListener,
	addMeltEventListener,
	builder,
	clamp,
	convertColor,
	createElHelpers,
	effect,
	executeCallbacks,
	getChannelValue,
	getColorFormat,
	isBrowser,
	isColorChannel,
	isNumberString,
	isValidColor,
	omit,
	overridable,
	styleToString,
	toWritableStores,
	ultimateColor,
	type ColorChannel,
} from '$lib/internal/helpers';
import { colord } from 'colord';

import type { Defaults, Orientation } from '$lib/internal/types';

import { safeOnMount } from '$lib/internal/helpers/lifecycle';
import { get, writable, type Writable } from 'svelte/store';
import type {
	ArrowKeys,
	ColorPickerParts,
	CreateColorPickerProps,
	EyeDropperType,
	EyeDropperWindow,
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

	const valueWritable = argsWithDefaults.value ?? writable(argsWithDefaults.defaultValue);
	const value = overridable(valueWritable, argsWithDefaults?.onValueChange);
	value.update((p) => (isValidColor(p) ? p : defaults.defaultValue));

	const uc = writable(ultimateColor(get(value)));

	let colorCanvasEl: HTMLCanvasElement | null = null;
	const colorCanvasThumbPos = writable({ x: 0, y: 0 });

	const hueSliderDimensions: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});

	const alphaSliderDimensions: Writable<NodeElement<HTMLCanvasElement>> = writable({
		height: 1,
		width: 1,
	});

	let eye: EyeDropperType | null = null;

	function isEyeDropperSupported() {
		return typeof window !== 'undefined' && 'EyeDropper' in window;
	}

	// Setters
	const _setAlphaValue = (x: number, y: number) => {
		if (argsWithDefaults.alphaSliderOrientation === 'horizontal') {
			setAlpha(Math.round((x / get(alphaSliderDimensions).width) * 100));
		} else {
			setAlpha(Math.round((y / get(alphaSliderDimensions).height) * 100));
		}
	};

	function setAlpha(value: number) {
		uc.update((p) => p.updateChannel(value / 100, 'alpha'));
	}

	function setHueAngle(value: number) {
		uc.update((p) => p.updateChannel(value, 'hue'));
	}

	function setColorCanvasThumbPos(pos: { x: number; y: number }) {
		uc.update((p) => p.updateChannel(pos.x, 'saturation').updateChannel(100 - pos.y, 'lightness'));
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

	function handleOutsideColorCanvasMovement(args: HandleMovementArgs) {
		const { x, y, nodeX, nodeY, width, height } = args;

		const xPercent = clamp(0, (x - nodeX) / width, 1);
		const yPercent = clamp(0, (y - nodeY) / height, 1);

		setColorCanvasThumbPos({ x: xPercent * 100, y: yPercent * 100 });
	}

	type HandleSliderMovementArgs = HandleMovementArgs & {
		set: (v: number) => void;
		orientation: Orientation;
		maxValue: number;
	};

	/**
	 * Allows values to be changed when dragging is going on where the mouse or touch event
	 * is outside of the slider's boundaries.
	 *
	 * @param args - slider movement arguments
	 */
	function handleOutsideSliderMovement(args: HandleSliderMovementArgs) {
		const { x, y, nodeX, nodeY, width, height, set, orientation, maxValue } = args;

		if (orientation === 'horizontal') {
			if (x <= nodeX) {
				set(0);
			} else if (x <= nodeX + width && (y <= nodeY || y >= nodeY + height)) {
				set(Math.round(((x - nodeX) / width) * maxValue));
			} else if (x >= nodeX + width) {
				set(maxValue);
			}
		} else {
			if (y <= nodeY) {
				set(0);
			} else if (y <= nodeY + height && (x <= nodeX || x >= nodeX + width)) {
				set(Math.round(((y - nodeY) / height) * maxValue));
			} else if (y >= nodeY + height) {
				set(maxValue);
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
			if (!colorCanvasEl) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;

			const { x: nodeX, y: nodeY, width, height } = colorCanvasEl.getBoundingClientRect();

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
				set: setHueAngle,
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
				set: setAlpha,
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
			if (!colorCanvasEl) return;

			e.preventDefault();

			const { clientX: x, clientY: y } = e;

			const { x: nodeX, y: nodeY, width, height } = colorCanvasEl.getBoundingClientRect();

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
		stores: uc,
		returned: ($uc) => {
			return {
				style: styleToString({
					background: `linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0) 50%, rgb(255, 255, 255) 100%),
					linear-gradient(to right,rgb(128, 128, 128), rgba(128,128,128,0)), hsl(${$uc.hue}, 100%, 50%)`,
				}),
			};
		},
		action: (node: HTMLCanvasElement) => {
			const rect = node.getBoundingClientRect();

			colorCanvasEl = node;

			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'click', (e) => {
					const { offsetX: x, offsetY: y } = e;
					const xPercent = x / rect.width;
					const yPercent = y / rect.height;
					setColorCanvasThumbPos({ x: xPercent * 100, y: yPercent * 100 });
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
					const xPercent = x / rect.width;
					const yPercent = y / rect.height;
					setColorCanvasThumbPos({ x: xPercent * 100, y: yPercent * 100 });
				}),
				addMeltEventListener(node, 'touchstart', () => {
					dragging = true;
				}),
				addMeltEventListener(node, 'touchend', () => {
					dragging = false;
				}),
				addMeltEventListener(node, 'touchmove', (e) => {
					if (!dragging) return;

					if (!colorCanvasEl) return;

					e.preventDefault();

					const { clientX: x, clientY: y } = e.touches[0];
					const { x: nodeX, y: nodeY, width, height } = node.getBoundingClientRect();

					if (x > nodeX && x < nodeX + width && y > nodeY && y < nodeY + height) {
						setColorCanvasThumbPos({ x: x - nodeX, y: y - nodeY });
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
		stores: uc,
		returned: ($uc) => {
			return {
				style: styleToString({
					position: 'absolute',
					top: `${100 - $uc.lightness}%`,
					left: `${$uc.saturation}%`,
					transform: 'translate(-50%, -50%)',
					'background-color': `${$uc.toString()}`,
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
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
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

					if (!keys.includes(e.key)) return;

					const key = <ArrowKeys>e.key;

					e.preventDefault();

					const step = e.shiftKey ? 10 : 1;

					const { x, y } = get(colorCanvasThumbPos);
					if (!colorCanvasEl) return;
					const { width: canvasW, height: canvasH } = colorCanvasEl.getBoundingClientRect();

					// Move the picker button and restrict movement to within the canvas.
					if (key === 'ArrowUp' && y - 1 >= 0) {
						setColorCanvasThumbPos({ x, y: Math.max(y - step, 0) });
					} else if (key === 'ArrowDown' && y + 1 <= canvasH) {
						setColorCanvasThumbPos({ x, y: Math.min(y + step, canvasH) });
					} else if (key === 'ArrowRight' && x + 1 <= canvasW) {
						setColorCanvasThumbPos({ x: Math.min(x + step, canvasW), y });
					} else if (key === 'ArrowLeft' && x - 1 >= 0) {
						setColorCanvasThumbPos({ x: Math.max(x - step, 0), y });
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

					setHueAngle(angle);
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

					setHueAngle(angle);
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
						setHueAngle(Math.round(((x - nodeX) / width) * 359));
					} else {
						handleOutsideSliderMovement({
							x,
							y,
							nodeX,
							nodeY,
							width,
							height,
							set: setHueAngle,
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
		stores: uc,
		returned: ($uc) => {
			const { hueSliderOrientation: orientation } = argsWithDefaults;

			return {
				style: styleToString({
					position: 'absolute',
					background: `hsl(${$uc.hue}, 100%, 50%)`,
					left: orientation === 'horizontal' ? `${($uc.hue * 100) / 360}%` : '50%',
					top: orientation === 'horizontal' ? '50%' : `${($uc.hue * 100) / 360}%`,
					transform: 'translateX(-50%) translateY(-50%)',
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
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

					const angle = get(uc).hue;

					let increaseArrow = 'ArrowRight';
					let decreaseArrow = 'ArrowLeft';

					if (argsWithDefaults.hueSliderOrientation === 'vertical') {
						increaseArrow = 'ArrowDown';
						decreaseArrow = 'ArrowUp';
					}

					// Move the picker button and restrict movement to within the canvas.
					if (key === increaseArrow && angle + 1 < 360) {
						setHueAngle(angle + 1);
					} else if (key === decreaseArrow && angle - 1 >= 0) {
						setHueAngle(angle - 1);
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
		stores: [uc],
		returned: ([$uc]) => {
			const orientation =
				argsWithDefaults.hueSliderOrientation === 'horizontal' ? 'right' : 'bottom';

			const { red, green, blue } = $uc;
			const color = `${red}, ${green}, ${blue}`;

			return {
				style: styleToString({
					background: `linear-gradient(to ${orientation}, rgba(${color}, 0), rgb(${color}))`,
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
					_setAlphaValue(x, y);
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
					_setAlphaValue(x, y);
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
						setAlpha(Math.round(((x - nodeX) / width) * 100));
					} else {
						handleOutsideSliderMovement({
							x,
							y,
							nodeX,
							nodeY,
							width,
							height,
							set: setAlpha,
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
		stores: uc,
		returned: ($uc) => {
			const { alphaSliderOrientation: orientation } = argsWithDefaults;

			return {
				style: styleToString({
					position: 'absolute',
					// background: `rgba(${r}, ${g}, ${b}, ${$alphaValue / 100})`,
					left: orientation === 'horizontal' ? `${$uc.alpha * 100}%` : '50%',
					top: orientation === 'horizontal' ? '50%' : `${$uc.alpha * 100}%`,
					transform: 'translateX(-50%) translateY(-50%)',
				}),
			};
		},
		action: (node: HTMLButtonElement) => {
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

					const alpha = get(uc).alpha;

					let increaseArrow = 'ArrowRight';
					let decreaseArrow = 'ArrowLeft';

					if (argsWithDefaults.hueSliderOrientation === 'vertical') {
						increaseArrow = 'ArrowDown';
						decreaseArrow = 'ArrowUp';
					}

					// Move the picker button and restrict movement to within the canvas.
					if (key === increaseArrow && alpha + 1 <= 100) {
						setAlpha(alpha + 1);
					} else if (key === decreaseArrow && alpha - 1 >= 0) {
						setAlpha(alpha - 1);
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
		stores: [uc],
		returned: ([$uc]) => {
			return {
				value: $uc.toString(),
			};
		},
		action: (node: HTMLInputElement) => {
			const unsubEvents = executeCallbacks(
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== 'Enter') return;

					if (isValidColor(node.value)) {
						uc.set(ultimateColor(node.value));
					} else {
						node.value = lastValid;
					}
				}),
				addMeltEventListener(node, 'blur', () => {
					if (isValidColor(node.value)) {
						uc.set(ultimateColor(node.value));
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

	effect(uc, ($uc) => {
		lastValid = $uc.toString();
		value.set($uc.toString());
	});

	effect(value, ($value) => {
		uc.update((p) => {
			if ($value !== p.toString()) return ultimateColor($value);
			return p;
		});
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
