var mappings = require("./lib/mappings"),
	validate = require("./lib/validate"),
	utils = require("./lib/utils");

function gampee(actionList, strict) {

	if (!actionList) {
		throw new TypeError("actionList is required");
	}

	if (!Array.isArray(actionList)) {
		actionList = [actionList];
	}

	var validationCallback = strict ? utils.throwOnError : utils.consoleWarnOnError;

	validate.hit(actionList, validationCallback);

	var ecParams = {};
	actionList.forEach(function (actionItem, diIdx) {

		validate.action(actionItem, validationCallback);

		if (actionItem.type === "impression") {
			utils.copyValues(actionItem, "il" + diIdx, mappings.impression, ecParams);
		}

		if (actionItem.type !== "impression") {
			utils.copyValues(actionItem, "", mappings.action, ecParams);
		}

		if (actionItem.currency) {
			ecParams["cu"] = "" + actionItem.currency;
		}

		if (actionItem.products) {
			actionItem.products.forEach(function (productItem, piIdx) {

				validate.product(productItem, actionItem.type, validationCallback);

				var productKeyPrefix = actionItem.type === "impression" ? ("il" + diIdx + "pi" + piIdx) : ("pr" + piIdx);
				utils.copyValues(productItem, productKeyPrefix, mappings.product, ecParams);

			});
		}
	});

	return ecParams;
}

module.exports = gampee;
