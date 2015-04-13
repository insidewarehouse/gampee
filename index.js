var mappings = require("./lib/mappings"),
	validate = require("./lib/validate");

function copyValues(source, keyPrefix, valueMap, target) {
	valueMap.forEach(function (mapItem) {
		var from = mapItem[0], to = mapItem[1];

		if (source[from]) {
			target[keyPrefix + to] = "" + source[from];
		}
	});
}

function noop() {
	// void
}

function idx(i) {
	return i + 1;
}

function gampee(actionList, onValidationError) {

	if (!actionList) {
		return {};
	}

	if (!Array.isArray(actionList)) {
		actionList = [actionList];
	}

	onValidationError = onValidationError || noop;

	validate.hit(actionList, onValidationError);

	var ecParams = {};
	actionList.forEach(function (actionItem, diIdx) {

		validate.action(actionItem, onValidationError);

		if (actionItem.type === "impression") {
			copyValues(actionItem, "il" + idx(diIdx), mappings.impression, ecParams);
		}

		if (actionItem.type !== "impression") {
			copyValues(actionItem, "", mappings.action, ecParams);
		}

		if (actionItem.currency) {
			ecParams["cu"] = "" + actionItem.currency;
		}

		if (actionItem.products) {
			actionItem.products.forEach(function (productItem, piIdx) {

				validate.product(productItem, actionItem.type, onValidationError);

				var productKeyPrefix = actionItem.type === "impression" ? ("il" + idx(diIdx) + "pi" + idx(piIdx)) : ("pr" + idx(piIdx));
				copyValues(productItem, productKeyPrefix, mappings.product, ecParams);

			});
		}
	});

	return ecParams;
}

module.exports = gampee;
