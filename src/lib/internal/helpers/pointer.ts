import { pointInPolygon, type Polygon } from './index.js';

export function isPointerInGraceArea(
	e: Pick<PointerEvent, 'clientX' | 'clientY'>,
	area?: Polygon
): boolean {
	if (!area) return false;
	return pointInPolygon({ x: e.clientX, y: e.clientY }, area);
}
