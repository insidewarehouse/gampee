# gampee

Converts and validates humanly understandable Enhanced E-commerce params into Measurement Protocol.
Friends with [universal-analytics](https://www.npmjs.com/package/universal-analytics).

## Usage

```js

var gampee = require("gampee");

var ecommerceParams = gampee([{
	"type": "impression",
	"list": "search",
	"products": [
		{ "id": "shirtM", "name": "Nice T-Shirt (M)", "position": 1 },
		{ "id": "shirtXL", "name": "Nice T-Shirt (XL)", "position": 2 }
	]
}]);

assert.equal(ecommerceParams, {

	"il0nm": "search",

	"il0pi0id": "shirtM",
	"il0pi0nm": "Nice T-Shirt (M)",
	"il0pi0ps": 1,

	"il0pi1id": "shirtXL",
	"il0pi1nm": "Nice T-Shirt (XL)",
	"il0pi1ps": 2
	
});
```

Product:

```
{ 
	id, 
	name, 
	[brand,] 
	[category,] 
	[variant,] 
	[price,]
	[quantity,]
	[position,]
}
```

E-commerce action/impression:

```
{
	type: [impression,click,detail,add,remove,checkout,checkout_option,purchase,refund,promo_click],

	[id,]

	[Product[] products,]

	[affiliation,]
	[revenue,]
	[tax,]
	[shipping,]

	[coupon,]

	[list,]

	[step,]
	[option,]

	[currency]
}
```

## Google's documentation

* [Intro](https://support.google.com/analytics/answer/6014841?hl=en)
* [Enhanced ecommerce via measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
* [Enhanced ecommerce via analytics.js + ecommerce.js plugin](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce)
