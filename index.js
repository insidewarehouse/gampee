function gampee(ecData) {

	if (!ecData) {
		throw new TypeError();
	}

	if (!Array.isArray(ecData)) {
		ecData = [ecData];
	}

	var ecParams = {};

	ecData.forEach(function (dataItem, diIdx) {
		var dataKeyPrefix = "il" + diIdx;

		if (dataItem.list) ecParams[dataKeyPrefix + "nm"] = "" + dataItem.list;
		if (dataItem.currency) ecParams["cu"] = "" + dataItem.currency;

		dataItem.products.forEach(function (productItem, piIdx) {
			var productKeyPrefix = dataKeyPrefix + "pi" + piIdx;

			ecParams[productKeyPrefix + "id"] = "" + productItem.id;
			ecParams[productKeyPrefix + "nm"] = "" + productItem.name;
			if (productItem.position) ecParams[productKeyPrefix + "ps"] = "" + productItem.position;
			if (productItem.brand) ecParams[productKeyPrefix + "br"] = "" + productItem.brand;
			if (productItem.category) ecParams[productKeyPrefix + "ca"] = "" + productItem.category;
			if (productItem.variant) ecParams[productKeyPrefix + "va"] = "" + productItem.variant;
			if (productItem.price) ecParams[productKeyPrefix + "pr"] = "" + productItem.price;
		});
	});

	return ecParams;
}

module.exports = gampee;
