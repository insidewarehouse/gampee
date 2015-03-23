# gampee

[![Build Status](https://travis-ci.org/insidewarehouse/gampee.svg?branch=master)](https://travis-ci.org/insidewarehouse/gampee)

Converts and validates humanly understandable Enhanced E-commerce params into Measurement Protocol.
Friends with [universal-analytics](https://www.npmjs.com/package/universal-analytics).

## Todo

* Add validation for `type`
* Add validation for value data type
* Add validation to disallow multiple actions in one hit (multiple impressions or combo of impressions + actions is OK)
* Product action: `checkout_option` and action detail `option`
* Custom product dimensions/metrics
* Warn about params that are not acceptable for actions/impressions
* `promo` and `promo_click`

## Usage

`var ecommerceParams = gampee( EcommerceData data | EcommerceData[] dataList )`

`EcommerceData` is an object with a required `type` property. `type` can be either an `impression` or one of [ecommerce 
product actions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pa): 
`click`, `detail`, `add`, `remove`, `purchase`, `refund`, `checkout`, `checkout_option`. Each data item should also 
have a list of `Product[] products`. 

You can send multiple items with impressions (e.g. when there are multiple lists of products on the page), but
only one product action with each analytics hit (event, pageview, etc).

See the table below for required/optional/allowed properties of `EcommerceData` and `Product`.

### Params

This roughly mirrors the ecommerce.js API.

<table>
<tr>
	<td colspan=2 rowspan=2></td>
	<th scope=col colspan=5>`type`</th>
</tr>
<tr>
	<th scope=col>`impression`</th>
	<th scope=col>`click`, `detail`</th>
	<th scope=col>`add`, `remove`</th>
	<th scope=col>`purchase`, `refund`</th>
	<th scope=col>`checkout`, `checkout_option`</th>
</tr>
<tr>
	<th scope=row>`currency`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cu">Currency Code</a></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`list`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pal">Product Action List</a>, <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#il_nm">Product Impression List Name</a></td>
	<td>opt</td>
	<td>opt</td>
	<td></td>
	<td></td>
	<td></td>
</tr>
<tr>
	<th scope=row>`id`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ti">Transaction ID</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td>**req**</td>
	<td></td>
</tr>
<tr>
	<th scope=row>`affiliation`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ta">Transaction Affiliation</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>`revenue`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tr">Transaction Revenue</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>`tax`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tt">Transaction Tax</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>`shipping`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ts">Transaction Shipping</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>`coupon`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tcc">Coupon Code</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>`step`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cos">Checkout Step</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`option`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#col">Checkout Step Option</a></td>
	<td></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
</tr>
<tr>
	<th colspan=7>`products[]`</th>
</tr>
<tr>
	<th scope=row>`id`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_id">Product SKU</a></td>
	<td>**req**</td>
	<td>**req**</td>
	<td>**req**</td>
	<td>**req**</td>
	<td>**req**</td>
</tr>
<tr>
	<th scope=row>`name`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_nm">Product Name</a></td>
	<td>**req**</td>
	<td>**req**</td>
	<td>**req**</td>
	<td>**req**</td>
	<td>**req**</td>
</tr>
<tr>
	<th scope=row>`brand`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_br">Product Brand</a></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`category`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_ca">Product Category</a></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`variant`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_va">Product Variant</a></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`price`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_pr">Product Price</a></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`position`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_ps">Product Position</a></td>
	<td>opt</td>
	<td>opt</td>
	<td></td>
	<td></td>
	<td></td>
</tr>
<tr>
	<th scope=row>`coupon`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_cc">Product Coupon Code</a></td>
	<td></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>`quantity`</th>
	<td><a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_qt">Product Quantity</a></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
</table>

### Example

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

You can then pass `ecommerceParams` into `universal-analytics`:
```js
var ga = require("universal-analytics");

var ua = ga("UA-00000000-0", "5bbb81ff-0757-44e0-8fcb-f263d982b95a", { debug: true });

ua.pageview(_.merge({ dp: "/", cd20: "one", cm20: "two" }, ecommerceParams));
```

## Google's documentation

* [Intro](https://support.google.com/analytics/answer/6014841?hl=en)
* [Enhanced ecommerce via measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
* [Enhanced ecommerce via analytics.js + ecommerce.js plugin](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce)
