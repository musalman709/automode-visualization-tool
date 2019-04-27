/**
 * Utility functions for standard Array objects
 */
"use strict";

/**
 * Return true if the array contains an object obj
 */
Array.prototype.contains = function(obj) {
	for(var i = 0; i < this.length; ++i) {
		if(this[i] == obj) return true;
	}
	return false;
}

/**
 * Push an object obj in the array only if it does not already contains it
 */
Array.prototype.add = function(obj) {
	if(! this.contains(obj)) {
		this.push(obj);
	}
}

/**
 * Remove an object obj from the array (or do nothing if the array doesn't
 * contain it)
 * \return true if the obj was found and removed
 */
Array.prototype.remove = function(obj) {
	for(var i = 0; i < this.length; ++i) {
		if(this[i] == obj) {
			this.splice(i, 1);
			return true;
		}
	}
	return false;
}

