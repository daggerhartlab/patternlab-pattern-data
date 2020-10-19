'use strict';

const loadPattern = require('@pattern-lab/core/src/lib/loadPattern');

let activePatterns = [];

/**
 * Loop through all patterns to locate the given relative path for the pattern data we're trying to import.
 *
 * @param referencedPatternPath
 * @param patternlab
 * @returns {boolean|*}
 */
function getReferencedPattern(referencedPatternPath, patternlab) {
	for (let k in patternlab.patterns) {
		let pattern = patternlab.patterns[k];
		if (pattern.verbosePartial === referencedPatternPath) {
			return patternlab.patterns[k];
		}
		if (pattern.relPath.replace(pattern.engine.engineFileExtension, '') === referencedPatternPath) {
			return pattern;
		}
		if (pattern.patternPartial === referencedPatternPath) {
			return pattern;
		}
	}
	return false;
}

/**
 *
 * @param patternlab
 * @param componentData
 * @returns {*}
 */
function replaceData(patternlab, componentData) {
	for (let [key, value] of Object.entries(componentData)) {
		// Normalize strings to objects.
		if (typeof value === 'string' || value instanceof String) {
			if (value.substr(0, 12) === 'patternData@') {
				value = {patternData: value.substr(12)};
			}
			else {
				// If we've made it here, we want to ignore this value.
				continue;
			}
		}

		// Ignore anything that's not a object.
		if (!value || typeof value !== 'object') {
			continue;
		}

		// If this is an object but not defined as patternData, recurse.
		if (!'patternData' in value || !value.patternData) {
			componentData[key] = replaceData(patternlab, componentData[key]);
			continue;
		}

		// Find the pattern, get its data, set it in here.
		let referencedPattern = getReferencedPattern(value.patternData, patternlab);
		if (!referencedPattern) {
			throw 'Unable to locate referenced pattern ' + value.patternData;
		}

		// @TODO: allow "extending" data in original pattern source.
		// Prevent infinite loops/network cycles.
		if (activePatterns.indexOf(referencedPattern.relPath) !== -1) {
			throw 'Recursion detected for referenced pattern ' + referencedPattern.relPath;
		}
		activePatterns.push(referencedPattern.relPath);
		componentData[key] = replaceData(patternlab, referencedPattern.jsonFileData);
		activePatterns = activePatterns.filter(function (item) {
			return item !== referencedPattern.relPath;
		});
	}

	return componentData;
}

function runTask(patternlab, pattern) {
	return new Promise((resolve, reject) => {
		pattern.jsonFileData = replaceData(patternlab, pattern.jsonFileData);
		if (!pattern.jsonFileData) {
			reject();
		}
		resolve();
	});
}

module.exports = function(patternlab, pattern) {
	try {
		runTask(patternlab, pattern).then(result => {
			// Nothing to do at the moment
		}).catch(error => console.log(error));
	} catch (e) {
		console.log(e);
	}
};
