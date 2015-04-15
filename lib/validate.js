var allowedParams = {
	"common": ["type", "products", "currency"],
	"impression": ["list"],
	"click": ["list"],
	"detail": ["list"],
	"add": ["list"],
	"remove": ["list"],
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

function validateHit(ecData, onValidationError) {
	var actionCount = ecData.filter(function (dataItem) {
		return dataItem.type !== "impression";
	}).length;

	if (actionCount > 1) {
		onValidationError("Multiple actions not allowed in one request");
	}
}

function validateAction(actionItem, onValidationError) {
	if (!actionItem.type) {
		onValidationError("No type on action item", {
			ecActionItem: actionItem
		});
		return;
	}
	if (Object.keys(allowedParams).indexOf(actionItem.type) < 0) {
		onValidationError("Invalid action type", {
			ecActionItem: actionItem
		});
		return;
	}

	if (actionItem.type === "purchase" || actionItem.type === "refund") {
		if (!actionItem["id"]) {
			onValidationError("Purchase/refund actions need a transaction ID", {
				ecActionItem: actionItem
			});
		}
	}

	var unexpectedParams = Object.keys(actionItem).filter(function (k) {
		return allowedParams["common"].indexOf(k) < 0 && allowedParams[actionItem.type].indexOf(k) < 0;
	});

	if (unexpectedParams.length > 0) {
		onValidationError("Unexpected params for action type", {
			ecActionItem: actionItem,
			unexpectedParams: unexpectedParams
		});
	}
}

function validateProduct(productItem, actionType, onValidationError) {
	if (!productItem["id"]) {
		onValidationError("Product SKU number is required", {
			ecProductItem: productItem
		});
	}
	if (!productItem["name"]) {
		onValidationError("Product name is required", {
			ecProductItem: productItem
		});
	}

	var unexpectedParams = Object.keys(productItem).filter(function (k) {
		return allowedProductParams["common"].indexOf(k) < 0 && allowedProductParams[actionType].indexOf(k) < 0;
	});

	if (unexpectedParams.length > 0) {
		onValidationError("Unexpected product params for action type", {
			actionType: actionType,
			ecProductItem: productItem,
			unexpectedParams: unexpectedParams
		});
	}
}

exports.hit = validateHit;
exports.action = validateAction;
exports.product = validateProduct;
