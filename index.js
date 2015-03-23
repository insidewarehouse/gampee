function gampee(ecData) {

	if (!ecData) {
		throw new TypeError();
	}

	if (!Array.isArray(ecData)) {
		ecData = [ecData];
	}

	var ecParams = {};

	ecData.forEach(function (dataItem, diIdx) {
		var dataKeyPrefix = "";

		if (dataItem.type === "impression") {
			dataKeyPrefix = "il" + diIdx;
			if (dataItem.list) ecParams[dataKeyPrefix + "nm"] = "" + dataItem.list;
		}

		if (dataItem.type !== "impression") {
			ecParams["pa"] = dataItem.type;
			if (dataItem.id) ecParams[dataKeyPrefix + "ti"] = dataItem.id;
			if (dataItem.list) ecParams[dataKeyPrefix + "pal"] = "" + dataItem.list;
			if (dataItem.affiliation) ecParams[dataKeyPrefix + "ta"] = "" + dataItem.affiliation;
			if (dataItem.revenue) ecParams[dataKeyPrefix + "tr"] = "" + dataItem.revenue;
			if (dataItem.tax) ecParams[dataKeyPrefix + "tt"] = "" + dataItem.tax;
			if (dataItem.shipping) ecParams[dataKeyPrefix + "ts"] = "" + dataItem.shipping;
			if (dataItem.coupon) ecParams[dataKeyPrefix + "tcc"] = "" + dataItem.coupon;
			if (dataItem.step) ecParams[dataKeyPrefix + "cos"] = "" + dataItem.step;
			if (dataItem.option) ecParams[dataKeyPrefix + "col"] = "" + dataItem.option;
		}

		if (dataItem.currency) {
			ecParams["cu"] = "" + dataItem.currency;
		}

		if (dataItem.products) {
			dataItem.products.forEach(function (productItem, piIdx) {
				var productKeyPrefix = "pr" + piIdx;
				if (dataItem.type === "impression") {
					productKeyPrefix = dataKeyPrefix + "pi" + piIdx;
				}

				ecParams[productKeyPrefix + "id"] = "" + productItem.id;
				ecParams[productKeyPrefix + "nm"] = "" + productItem.name;
				if (productItem.position) ecParams[productKeyPrefix + "ps"] = "" + productItem.position;
				if (productItem.brand) ecParams[productKeyPrefix + "br"] = "" + productItem.brand;
				if (productItem.category) ecParams[productKeyPrefix + "ca"] = "" + productItem.category;
				if (productItem.variant) ecParams[productKeyPrefix + "va"] = "" + productItem.variant;
				if (productItem.price) ecParams[productKeyPrefix + "pr"] = "" + productItem.price;
				if (productItem.quantity) ecParams[productKeyPrefix + "qt"] = "" + productItem.quantity;
				if (productItem.coupon) ecParams[productKeyPrefix + "cc"] = "" + productItem.coupon;
				if (productItem.position) ecParams[productKeyPrefix + "ps"] = "" + productItem.position;
			});
		}
	});

	return ecParams;
}

module.exports = gampee;
