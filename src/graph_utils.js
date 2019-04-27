/**
 * Utility functions for graphs
 */

/**
 * Create a new SVG element (in JQuery object)
 */
function createSVGElement(tagname, attrObject) {
	var svgElem = document.createElementNS("http://www.w3.org/2000/svg",
		tagname);
	Object.keys(attrObject).forEach(function(key) {
		svgElem.setAttribute(key, attrObject[key]);
	});
	return $(svgElem);
}

/**
 * Sum two points
 */
function points_sum(p1, p2) {
  p = {
    x:(parseInt(p1.x) + parseInt(p2.x)),
    y:(parseInt(p1.y) + parseInt(p2.y))
  };
  return p;
}

/**
 * Subtract two points
 */
function points_substract(p1, p2) {
  p = {
    x:(parseInt(p1.x) - parseInt(p2.x)),
    y:(parseInt(p1.y) - parseInt(p2.y))
  };
  return p;
}

