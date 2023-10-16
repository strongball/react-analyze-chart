import { Point } from '../../types';

/**
 * y = mx + b
 */
interface LineEquationParams {
  p1: Point;
  p2: Point;
}
export function lineEquation({ p1, p2 }: LineEquationParams) {
  const m = (p2.y - p1.y) / (p2.x - p1.x);
  const b = p1.y - m * p1.x;
  return { m, b };
}

interface DistanceFromPointToLineParams {
  p1: Point;
  p2: Point;
  target: Point;
}
export function distanceFromPointToLine({ p1, p2, target }: DistanceFromPointToLineParams) {
  const { m: a, b: c } = lineEquation({ p1, p2 });
  const b = -1;
  return Math.abs(a * target.x + b * target.y + c) / Math.sqrt(a * a + b * b);
}
interface DistanceFromPointsParams {
  p1: Point;
  p2: Point;
}
export function distanceFromPoints({ p1, p2 }: DistanceFromPointsParams) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

interface IsBetweenParams {
  a: number;
  b: number;
  target: number;
}
export function isBetween({ a, b, target }: IsBetweenParams) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return target >= min && target <= max;
}

/**
 * if points extend in one direction only cross even line. means p is inside the area.
 * ---------     -----
 * | * ->  | ___|    |
 * |                 |
 * ------------------
 */
export function pointInArea(p: Point, area: [Point, Point][]) {
  let isInside = false;
  area.forEach(([p1, p2]) => {
    if ((p1.y < p.y && p2.y < p.y) || !isBetween({ a: p1.x, b: p2.x, target: p.x })) {
      return;
    }
    const { m, b } = lineEquation({ p1, p2 });
    const y = m * p.x + b;
    if (isBetween({ a: p1.y, b: p2.y, target: y })) {
      isInside = !isInside;
    }
  });
  return isInside;
}
