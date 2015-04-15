/*global describe, it */

var expect = require("chai").expect,
	gampee = require("../index");

function testValidation(input, expectedError) {
	return function () {

		var log = [];
		gampee(input, function (msg) {
			log.push(msg);
			// note: discarding other params
		});

		expect(log).to.eql([expectedError]);
	};
}

function throwErrors(e) {
	throw new Error(e);
}

describe("gampee", function () {

	it("should return empty object when called without params", function () {
		expect(gampee()).to.eql({});
	});

	describe("validation", function () {


		it("should log when no type set", testValidation(
			{},
			"No type on action item"
		));

		it("should log when bolix type set", testValidation(
			{type: "bolix"},
			"Invalid action type"
		));

		it("should log when sending multiple actions", testValidation(
			[{type: "click"}, {type: "detail"}],
			"Multiple actions not allowed in one request"
		));

		it("should log when no transaction ID for purchase", testValidation(
			{type: "purchase"},
			"Purchase/refund actions need a transaction ID"
		));

		it("should log when no transaction ID for refund", testValidation(
			{type: "refund"},
			"Purchase/refund actions need a transaction ID"
		));

		it("should log when product has no ID", testValidation(
			{
				type: "impression",
				products: [{
					name: "o hai"
				}]
			},
			"Product SKU number is required"
		));

		it("should log when product has no name", testValidation(
			{
				type: "impression",
				products: [{
					id: "o-hai-123"
				}]
			},
			"Product name is required"
		));

		it("should log multiple errors", function () {

			var namelessProduct = {"id": "shirtM", "quantity": 3};
			var badImpression = {
				"type": "impression",
				"step": 2, // `step` not allowed on impression
				"products": [namelessProduct],
				"currency": "EUR"
			};

			var log = [];
			var result = gampee(badImpression, function (msg, data) {
				log.push([msg, data]);
			});

			expect(log).to.eql([

				[
					"Unexpected params for action type",
					{ecActionItem: badImpression, unexpectedParams: ["step"]}
				],

				[
					"Product name is required",
					{ecProductItem: namelessProduct}
				],

				[
					"Unexpected product params for action type",
					{ecProductItem: namelessProduct, actionType: "impression", unexpectedParams: ["quantity"]}
				]

			]);

			expect(result).to.eql({
				"cu": "EUR",
				"il1pi1id": "shirtM",
				"il1pi1qt": "3"
			}, "Should still product an attempt at a result.");
		});

	});

	describe("type=impression", function () {

		it("should convert one impression", function () {
			var ecommerceParams = gampee({
				"type": "impression",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 1},
					{"id": "shirtXL", "name": "Nice T-Shirt (XL)", "position": 2}
				],
				"currency": "EUR"
			});

			expect(ecommerceParams).to.eql({

				"il1nm": "search",

				"il1pi1id": "shirtM",
				"il1pi1nm": "Nice T-Shirt (M)",
				"il1pi1ps": "1",

				"il1pi2id": "shirtXL",
				"il1pi2nm": "Nice T-Shirt (XL)",
				"il1pi2ps": "2",

				"cu": "EUR"

			});

		});

		it("should convert multiple impressions", function () {
			var ecommerceParams = gampee([
				{
					"type": "impression",
					"list": "search",
					"products": [
						{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 1},
						{"id": "shirtXL", "name": "Nice T-Shirt (XL)", "position": 2}
					]
				},
				{
					"type": "impression",
					"list": "promo",
					"products": [
						{"id": "pants", "name": "Baggy Pants", "position": 1}
					]
				}
			]);

			expect(ecommerceParams).to.eql({

				"il1nm": "search",

				"il1pi1id": "shirtM",
				"il1pi1nm": "Nice T-Shirt (M)",
				"il1pi1ps": "1",

				"il1pi2id": "shirtXL",
				"il1pi2nm": "Nice T-Shirt (XL)",
				"il1pi2ps": "2",

				"il2nm": "promo",

				"il2pi1id": "pants",
				"il2pi1nm": "Baggy Pants",
				"il2pi1ps": "1"

			});

		});

		it("should accept product brand/category/variant/price", function () {
			var ecommerceParams = gampee({
				"type": "impression",
				"list": "search",
				"products": [
					{
						"id": "shirtM",
						"name": "Nice T-Shirt (M)",
						"brand": "TeeShart co.",
						"category": "Men",
						"variant": "Black",
						"price": 12.95
					}
				]
			});

			expect(ecommerceParams).to.eql({

				"il1nm": "search",

				"il1pi1id": "shirtM",
				"il1pi1nm": "Nice T-Shirt (M)",
				"il1pi1br": "TeeShart co.",
				"il1pi1ca": "Men",
				"il1pi1va": "Black",
				"il1pi1pr": "12.95"

			});
		});

		it("should accept empty list name", function () {
			var ecommerceParams = gampee({
				"type": "impression",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			});

			expect(ecommerceParams).to.eql({

				"il1pi1id": "shirtM",
				"il1pi1nm": "Nice T-Shirt (M)"

			});
		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "impression",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "impression",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=purchase", function () {

		it("should convert purchase", function () {

			var ecommerceParams = gampee({
				"type": "purchase",
				"id": "T1234",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)"},
					{"id": "shirtXL", "name": "Nice T-Shirt (XL)"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "purchase",
				"ti": "T1234",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",

				"pr2id": "shirtXL",
				"pr2nm": "Nice T-Shirt (XL)"

			});

		});

		it("should accept product brand/category/variant/price/quantity/coupon", function () {

			var ecommerceParams = gampee({
				"type": "purchase",
				"id": "T1234",
				"products": [
					{
						"id": "shirtM",
						"name": "Nice T-Shirt (M)",
						"brand": "TeeShart co.",
						"category": "Men",
						"variant": "Black",
						"price": 12.95,
						"quantity": 3,
						"coupon": "SHIRT-SALE"
					}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "purchase",
				"ti": "T1234",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1br": "TeeShart co.",
				"pr1ca": "Men",
				"pr1va": "Black",
				"pr1pr": "12.95",
				"pr1qt": "3",
				"pr1cc": "SHIRT-SALE"

			});

		});

		it("should accept purchase affiliation/revenue/tax/shipping/coupon", function () {

			var ecommerceParams = gampee({
				"type": "purchase",
				"id": "T1234",
				"affiliation": "cj",
				"revenue": 12.95,
				"tax": 0.95,
				"shipping": 1.5,
				"coupon": "15OFF",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "purchase",
				"ti": "T1234",

				"ta": "cj",
				"tr": "12.95",
				"tt": "0.95",
				"ts": "1.5",
				"tcc": "15OFF",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "purchase",
				"step": 2,
				"id": "T1",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "purchase",
				"id": "T1",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=refund", function () {

		it("should convert refund", function () {

			var ecommerceParams = gampee({
				"type": "refund",
				"id": "T1234",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)"},
					{"id": "shirtXL", "name": "Nice T-Shirt (XL)"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "refund",
				"ti": "T1234",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",

				"pr2id": "shirtXL",
				"pr2nm": "Nice T-Shirt (XL)"

			});

		});

		it("should accept product brand/category/variant/price/quantity/coupon", function () {

			var ecommerceParams = gampee({
				"type": "refund",
				"id": "T1234",
				"products": [
					{
						"id": "shirtM",
						"name": "Nice T-Shirt (M)",
						"brand": "TeeShart co.",
						"category": "Men",
						"variant": "Black",
						"price": 12.95,
						"quantity": 3,
						"coupon": "SHIRT-SALE"
					}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "refund",
				"ti": "T1234",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1br": "TeeShart co.",
				"pr1ca": "Men",
				"pr1va": "Black",
				"pr1pr": "12.95",
				"pr1qt": "3",
				"pr1cc": "SHIRT-SALE"

			});

		});

		it("should accept purchase affiliation/revenue/tax/shipping/coupon", function () {

			var ecommerceParams = gampee({
				"type": "refund",
				"id": "T1234",
				"affiliation": "cj",
				"revenue": 12.95,
				"tax": 0.95,
				"shipping": 1.5,
				"coupon": "15OFF",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "refund",
				"ti": "T1234",

				"ta": "cj",
				"tr": "12.95",
				"tt": "0.95",
				"ts": "1.5",
				"tcc": "15OFF",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "refund",
				"id": "T1",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "refund",
				"id": "T1",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=click", function () {

		it("should accept click list", function () {

			var ecommerceParams = gampee({
				"type": "click",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3, "coupon": "SUMMER"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "click",
				"pal": "search",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1ps": "3",
				"pr1cc": "SUMMER"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "click",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "click",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=add", function () {

		it("should convert add", function () {

			var ecommerceParams = gampee({
				"type": "add",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3, "coupon": "SUMMER"}
				]
			}, throwErrors);

			expect(ecommerceParams).to.eql({

				"pa": "add",
				"pal": "search",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1qt": "3",
				"pr1cc": "SUMMER"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "add",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "add",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=remove", function () {

		it("should convert remove", function () {

			var ecommerceParams = gampee({
				"type": "remove",
				"list": "cart",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3, "coupon": "SUMMER"}
				]
			}, throwErrors);

			expect(ecommerceParams).to.eql({

				"pa": "remove",
				"pal": "cart",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1qt": "3",
				"pr1cc": "SUMMER"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "remove",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "remove",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=detail", function () {

		it("should accept detail list", function () {

			var ecommerceParams = gampee({
				"type": "detail",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3, "coupon": "SUMMER"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "detail",
				"pal": "search",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1ps": "3",
				"pr1cc": "SUMMER"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "detail",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "detail",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=checkout", function () {

		it("should accept checkout step", function () {

			var ecommerceParams = gampee({
				"type": "checkout",
				"step": 2,
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "coupon": "SUMMER", "quantity": 5}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "checkout",
				"cos": "2",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1qt": "5",
				"pr1cc": "SUMMER"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "checkout",
				"list": "search",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "checkout",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			},
			"Unexpected product params for action type"
		));

	});

	describe("type=checkout_option", function () {

		it("should accept checkout step", function () {

			var ecommerceParams = gampee({
				"type": "checkout_option",
				"option": "Visa",
				"step": 2,
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "coupon": "SUMMER", "quantity": 5}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "checkout_option",
				"col": "Visa",
				"cos": "2",

				"pr1id": "shirtM",
				"pr1nm": "Nice T-Shirt (M)",
				"pr1qt": "5",
				"pr1cc": "SUMMER"

			});

		});

		it("should log on unexpected action params", testValidation(
			{
				"type": "checkout_option",
				"list": "search",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			},
			"Unexpected params for action type"
		));

		it("should log on unexpected product params", testValidation(
			{
				"type": "checkout_option",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			},
			"Unexpected product params for action type"
		));

	});

});
