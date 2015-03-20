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
			if (dataItem.id) ecParams["ti"] = dataItem.id;
			if (dataItem.list) ecParams["pal"] = "" + dataItem.list;
			if (dataItem.affiliation) ecParams["ta"] = "" + dataItem.affiliation;
			if (dataItem.revenue) ecParams["tr"] = "" + dataItem.revenue;
			if (dataItem.tax) ecParams["tt"] = "" + dataItem.tax;
			if (dataItem.shipping) ecParams["ts"] = "" + dataItem.shipping;
			if (dataItem.coupon) ecParams["tcc"] = "" + dataItem.coupon;
			if (dataItem.step) ecParams["cos"] = "" + dataItem.step;
		}

		if (dataItem.currency) {
			ecParams["cu"] = "" + dataItem.currency;
		}

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
	});

	return ecParams;
}

module.exports = gampee;
