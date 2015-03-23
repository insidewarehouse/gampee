# gampee

[![Build Status](https://travis-ci.org/insidewarehouse/gampee.svg?branch=master)](https://travis-ci.org/insidewarehouse/gampee)

Converts and validates humanly understandable Enhanced E-commerce params into Measurement Protocol.
Friends with [universal-analytics](https://www.npmjs.com/package/universal-analytics).

## Note: unsupported options

Due to lack of know-how/MVP-ness, these are not supported (feel free to PR):

* Product action: `checkout_option` and action detail `option`
* `promo` and `promo_click`
* Custom product dimensions/metrics

## Todo

* Add validation for `type`
* Add validation for value data type
* Add validation to disallow multiple actions in one hit (multiple impressions or combo of impressions + actions is OK)
* Discard params that are not acceptable for actions/impressions

## Usage

```js
var gampee = require("gampee");

var ecommerceParams = gampee([{
	"type": "impression",
	"list": "search",
	"products": [
		{ "id": "shirtM", "name": "Nice T-Shirt (M)", "position": 1 },
		{ "id": "shirtXL", "name": "Nice T-Shirt (XL)", "position": 2 }
	],
	"currency": "EUR"
}]);

assert.equal(ecommerceParams, {

	"il0nm": "search",

	"il0pi0id": "shirtM",
	"il0pi0nm": "Nice T-Shirt (M)",
	"il0pi0ps": 1,

	"il0pi1id": "shirtXL",
	"il0pi1nm": "Nice T-Shirt (XL)",
	"il0pi1ps": 2,
	
	"cu": "EUR"
	
});
```

Product:
```
{ 
	id, 
	name, 
	[brand, category, variant, price] 
	[quantity, coupon, position]
}
```

E-commerce impression:
```
{
	type: "impression",
	Product[] products (with position (opt)),
	[currency]
	[list]
}
```

E-commerce action (`click`, `detail`):
```
{
	type: "click" | "detail",
	Product[] products (with position (opt), coupon (opt)),
	[currency]
	[affiliation, list]
}
```

E-commerce action (`add`, `remove`):
```
{
	type: "add" | "remove",
	Product[] products (with quantity (opt), coupon (opt))
	[currency]
}
```

E-commerce action (`purchase`, `refund`):
```
{
	type: "purchase" | "refund",
	id,
	Product[] products (with quantity (req), coupon (opt))
	[currency]
	[affiliation, revenue, tax, shipping, coupon]
}
```

E-commerce action (`checkout`)
```
	type: "checkout",
	Product[] products (with quantity (req), coupon (opt)),
	[currency]
	[step]
```

## Google's documentation

* [Intro](https://support.google.com/analytics/answer/6014841?hl=en)
* [Enhanced ecommerce via measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
* [Enhanced ecommerce via analytics.js + ecommerce.js plugin](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce)
