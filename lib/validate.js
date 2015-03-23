var allowedParams = {
	"common": ["type", "products", "currency"],
	"impression": ["list"],
	"click": ["list"],
	"detail": ["list"],
	"add": [],
	"remove": [],
	"purchase": ["id", "affiliation", "revenue", "tax", "shipping", "coupon"],
	"refund": ["id", "affiliation", "revenue", "tax", "shipping", "coupon"],
	"checkout": ["step", "option"],
	"checkout_option": ["step", "option"]
};

var allowedProductParams = {
	"common": ["id", "name", "brand", "category", "variant", "price"],
	"impression": ["position"],
	"click": ["position", "coupon"],
	"detail": ["position", "coupon"],
	"add": ["quantity", "coupon"],
	"remove": ["quantity", "coupon"],
	"purchase": ["quantity", "coupon"],
	"refund": ["quantity", "coupon"],
	"checkout": ["quantity", "coupon"],
	"checkout_option": ["quantity", "coupon"]
};

function validateHit(ecData, cb) {
	var actionCount = ecData.filter(function (dataItem) {
		return dataItem.type !== "impression";
	}).length;

	if (actionCount > 1) {
		cb(new TypeError("Multiple actions not allowed in one request"));
		return;
	}

	cb(null);
}

function validateAction(dataItem, cb) {
	if (!dataItem.type) {
		cb(new TypeError("No type on ecData item"));
		return;
	}
	if (Object.keys(allowedParams).indexOf(dataItem.type) < 0) {
		cb(new TypeError("Invalid type '" + dataItem.type + "' on ecommerce data item"));
		return;
	}
	if (dataItem.type === "purchase" || dataItem.type === "refund") {
		if (!dataItem["id"]) {
			cb(new TypeError("purchase/refund actions need a transaction ID"));
			return;
		}
	}

	var unknownParams = Object.keys(dataItem).filter(function (k) {
		return allowedParams["common"].indexOf(k) < 0 && allowedParams[dataItem.type].indexOf(k) < 0;
	});

	if (unknownParams.length > 0) {
		cb(new TypeError("Unexpected params for '" + dataItem.type + "': " + unknownParams.join(",")));
	}

	cb(null);
}

function validateProduct(productItem, actionType, cb) {
	if (!productItem["id"]) {
		cb(new TypeError("Product SKU number is required"));
		return;
	}
	if (!productItem["name"]) {
		cb(new TypeError("Product name is required"));
		return;
	}

	var unknownParams = Object.keys(productItem).filter(function (k) {
		return allowedProductParams["common"].indexOf(k) < 0 && allowedProductParams[actionType].indexOf(k) < 0;
	});

	if (unknownParams.length > 0) {
		cb(new TypeError("Unexpected product params for '" + actionType + "': " + unknownParams.join(",")));
	}

	cb(null);
}

exports.hit = validateHit;
exports.action = validateAction;
exports.product = validateProduct;
