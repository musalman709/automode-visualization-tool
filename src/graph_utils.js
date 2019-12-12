/**
 * Utility functions for graphs
 */

/**
 * Sum two points
 */
export function points_sum(p1, p2) {
    const p = {
        x:(parseInt(p1.x) + parseInt(p2.x)),
        y:(parseInt(p1.y) + parseInt(p2.y))
    };
    return p;
}

/**
 * Subtract two points
 */
export function points_substract(p1, p2) {
    const p = {
        x:(parseInt(p1.x) - parseInt(p2.x)),
        y:(parseInt(p1.y) - parseInt(p2.y))
    };
    return p;
}

/**
 * Return the middle of a segment
 */
export function middle(p1, p2) {
    return {x: (p1.x+p2.x) / 2, y: (p1.y+p2.y) / 2};
}

export function getDirection(p1, p2) {
    let x = p2.x - p1.x;
    let y = p2.y - p1.y;
    let norm = Math.sqrt(x**2 + y**2);
    x /= norm;
    y /= norm;
    return {x, y};
}

export function getConnectPoint(connectType, rx, ry, direction) {
    switch (connectType) {
    case "N":
        return {x: 0, y: -ry};
    case "S":
        return {x: 0, y: ry};
    case "E":
        return {x: rx, y: 0};
    case "W":
        return {x: -rx, y: 0};
    case "oval":
        return {x: rx*direction.x, y: ry*direction.y};
    default:
        return {x: 0, y: 0};
    }
}