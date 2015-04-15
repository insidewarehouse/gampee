# gampee

[![Build Status](https://travis-ci.org/insidewarehouse/gampee.svg?branch=master)](https://travis-ci.org/insidewarehouse/gampee)

Converts and validates humanly understandable Enhanced E-commerce params into Measurement Protocol.
Friends with [universal-analytics](https://www.npmjs.com/package/universal-analytics).

## Example

```js
var gampee = require("gampee"),
	ga = require("universal-analytics");

var ecommerceParams = gampee({
	"type": "impression",
	"list": "search",
	"products": [
		{ "id": "shirtM", "name": "Nice T-Shirt (M)", "position": 1 },
		{ "id": "shirtXL", "name": "Nice T-Shirt (XL)", "position": 2 }
	],
	"currency": "EUR"
});

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

// send together with a pageview
var ua = ga("UA-00000000-0", "5bbb81ff-0757-44e0-8fcb-f263d982b95a", { debug: true });
ua.pageview(_.merge({ dp: "/search?q=some+product", cd20: "one", cm20: "two" }, ecommerceParams));
```

## Unsupported Measurement Protocol options 

* Custom product dimensions/metrics
* `promo` and `promo_click`

## Usage

```
gampee( EcommerceAction action, [function onValidationError] )
gampee( EcommerceAction[] actionList, [function onValidationError] )
```

`EcommerceAction` is an object with a required `type` property. `type` can be either an `impression` or one of [ecommerce 
product actions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pa): 
`click`, `detail`, `add`, `remove`, `purchase`, `refund`, `checkout`, `checkout_option`. Each data item should also 
have a list of `Product[] products`. 

You can send multiple items with impressions (e.g. when there are multiple lists of products on the page), but
only one product action with each analytics hit (event, pageview, etc).

If `onValidationError` is passed in (default: `void`), it will be called with details of every validation warning, e.g.
`gampee( myParams, console.warn.bind(console));`

See the table below for required/optional/allowed properties of `EcommerceAction` and `Product`.

Note that although documentation says all hit types are allowed, the product information will be discarded if sent with
`transaction` hit type (and probably some others). We have only tried testing full information with `pageview` and 
`event` hit types.

### Params

This roughly mirrors [the ecommerce.js API](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#ecommerce-data).

<table>
<tr>
	<td rowspan=2></td>
	<th scope=col colspan=5><code>type</code></th>
</tr>
<tr>
	<th scope=col><code>impression</code></th>
	<th scope=col><code>click</code>, <code>detail</code></th>
	<th scope=col><code>add</code>, <code>remove</code></th>
	<th scope=col><code>purchase</code>, <code>refund</code></th>
	<th scope=col><code>checkout</code>, <code>checkout_option</code></th>
</tr>
<tr>
	<th scope=row>
		<code>currency</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cu">Currency Code</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>list</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pal">Product Action List</a>, <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#il_nm">Product Impression List Name</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td></td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>id</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ti">Transaction ID</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td><strong>req</strong></td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>affiliation</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ta">Transaction Affiliation</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>revenue</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tr">Transaction Revenue</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>tax</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tt">Transaction Tax</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>shipping</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ts">Transaction Shipping</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>coupon</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tcc">Coupon Code</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>step</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cos">Checkout Step</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>option</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#col">Checkout Step Option</a>
	</th>
	<td></td>
	<td></td>
	<td></td>
	<td></td>
	<td>opt</td>
</tr>
<tr>
	<th colspan=7><code>products[]</code></th>
</tr>
<tr>
	<th scope=row>
		<code>id</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_id">Product SKU</a>
	</th>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
</tr>
<tr>
	<th scope=row>
		<code>name</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_nm">Product Name</a>
	</th>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
	<td><strong>req</strong></td>
</tr>
<tr>
	<th scope=row>
		<code>brand</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_br">Product Brand</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>category</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_ca">Product Category</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>variant</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_va">Product Variant</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>price</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_pr">Product Price</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>position</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_ps">Product Position</a>
	</th>
	<td>opt</td>
	<td>opt</td>
	<td></td>
	<td></td>
	<td></td>
</tr>
<tr>
	<th scope=row>
		<code>coupon</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_cc">Product Coupon Code</a>
	</th>
	<td></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
<tr>
	<th scope=row>
		<code>quantity</code>
		<br/>
		<a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pr_qt">Product Quantity</a>
	</th>
	<td></td>
	<td></td>
	<td>opt</td>
	<td>opt</td>
	<td>opt</td>
</tr>
</table>

## Google's documentation

* [Intro](https://support.google.com/analytics/answer/6014841?hl=en)
* [Enhanced ecommerce via measurement protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm)
* [Enhanced ecommerce via analytics.js + ecommerce.js plugin](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce)
