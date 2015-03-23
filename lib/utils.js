function copyValues(source, keyPrefix, valueMap, target) {
	valueMap.forEach(function (mapItem) {
		var from = mapItem[0], to = mapItem[1];

		if (source[from]) {
			target[keyPrefix + to] = "" + source[from];
		}
	});
}

function throwOnError(e) {
	if (e) {
		throw e;
	}
}

function consoleWarnOnError(e) {
	if (e) {
		console.warn(e);
	}
}

exports.copyValues = copyValues;
exports.throwOnError = throwOnError;
exports.consoleWarnOnError = consoleWarnOnError;
