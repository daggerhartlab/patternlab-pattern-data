'use strict';

const pluginName = 'plugin-pattern-data';
const patternData = require('./src/pattern-data');

// Find data that looks like a pattern, load the pattern data.
async function dataMerge(params) {
	const [patternlab, pattern] = params;
	await patternData(patternlab, pattern);
}

function registerHooks(patternlab) {
	patternlab.events.on('patternlab-pattern-before-data-merge', dataMerge);
}

function pluginInit(patternlab) {
	if (!patternlab) {
		console.error('patternlab object not provided to pluginInit');
		process.exit(1);
	}

	if (!patternlab.config.plugins) {
		patternlab.config.plugins = {};
	}

	if (
		patternlab.config.plugins[pluginName] !== undefined &&
		patternlab.config.plugins[pluginName].enabled &&
		!patternlab.config.plugins[pluginName].initialized
	) {
		registerHooks(patternlab);
		patternlab.config.plugins[pluginName].initialized = true;
	}
}

module.exports = pluginInit;
