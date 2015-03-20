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

		ecParams[dataKeyPrefix + "nm"] = dataItem.list;
		dataItem.products.forEach(function (productItem, piIdx) {
			var productKeyPrefix = dataKeyPrefix + "pi" + piIdx;

			ecParams[productKeyPrefix + "id"] = productItem.id;
			ecParams[productKeyPrefix + "nm"] = productItem.name;
			ecParams[productKeyPrefix + "ps"] = productItem.position;

		});
	});

	return ecParams;
}

module.exports = gampee;
