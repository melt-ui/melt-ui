export * from './hull.js';

import { makeHull, type Point, type Polygon } from './hull.js';

export function getPointsFromEl(el: HTMLElement): Array<Point> {
	const rect = el.getBoundingClientRect();
	return [
		{ x: rect.left, y: rect.top },
		{ x: rect.right, y: rect.top },
		{ x: rect.right, y: rect.bottom },
		{ x: rect.left, y: rect.bottom },
	];
}

export function makeHullFromElements(els: Array<HTMLElement>): Array<Point> {
	const points = els.flatMap((el) => getPointsFromEl(el));
	return makeHull(points);
}

export function pointInPolygon(point: Point, polygon: Polygon) {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;

		const intersect =
			yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}
