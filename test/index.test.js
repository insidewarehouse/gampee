/*global describe, it */

var expect = require("chai").expect,
	gampee = require("../index");

describe("gampee", function () {

	var callGampeeWith = function () {
		var args = Array.prototype.slice.apply(arguments);
		return function () {
			gampee.apply(gampee, args);
		};
	};

	describe("validation", function () {

		it("should throw when called without params", function () {

			expect(callGampeeWith()).to.throw(TypeError);

		});

		it("should throw when no type set", function () {

			expect(callGampeeWith({}, true)).to.throw(TypeError);

		});

		it("should throw when bolix type set", function () {

			expect(callGampeeWith({type: "bolix"}, true)).to.throw(TypeError);

		});

		it("should throw when sending multiple actions", function () {

			expect(callGampeeWith([{type: "click"}, {type: "detail"}], true)).to.throw(TypeError);

		});

		it("should throw when no transaction ID for purchase", function () {

			expect(callGampeeWith({type: "purchase"}, true)).to.throw(TypeError);

		});

		it("should throw when no transaction ID for refund", function () {

			expect(callGampeeWith({type: "refund"}, true)).to.throw(TypeError);

		});

		it("should throw when product has no ID", function () {
			var product = {
				name: "o hai"
			};
			expect(callGampeeWith({type: "impression", products: [ product ]}, true)).to.throw(TypeError);
		});

		it("should throw when product has no name", function () {
			var product = {
				id: "o-hai-123"
			};
			expect(callGampeeWith({type: "impression", products: [ product ]}, true)).to.throw(TypeError);
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

				"il0nm": "search",

				"il0pi0id": "shirtM",
				"il0pi0nm": "Nice T-Shirt (M)",
				"il0pi0ps": "1",

				"il0pi1id": "shirtXL",
				"il0pi1nm": "Nice T-Shirt (XL)",
				"il0pi1ps": "2",

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

				"il0nm": "search",

				"il0pi0id": "shirtM",
				"il0pi0nm": "Nice T-Shirt (M)",
				"il0pi0ps": "1",

				"il0pi1id": "shirtXL",
				"il0pi1nm": "Nice T-Shirt (XL)",
				"il0pi1ps": "2",

				"il1nm": "promo",

				"il1pi0id": "pants",
				"il1pi0nm": "Baggy Pants",
				"il1pi0ps": "1"

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

				"il0nm": "search",

				"il0pi0id": "shirtM",
				"il0pi0nm": "Nice T-Shirt (M)",
				"il0pi0br": "TeeShart co.",
				"il0pi0ca": "Men",
				"il0pi0va": "Black",
				"il0pi0pr": "12.95"

			});
		});

		it("should accept empty list name", function () {
			var ecommerceParams = gampee({
				"type": "impression",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			});

			expect(ecommerceParams).to.eql({

				"il0pi0id": "shirtM",
				"il0pi0nm": "Nice T-Shirt (M)"

			});
		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "impression",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "impression",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3}]
			}, true)).to.throw(TypeError);
		});

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",

				"pr1id": "shirtXL",
				"pr1nm": "Nice T-Shirt (XL)"

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0br": "TeeShart co.",
				"pr0ca": "Men",
				"pr0va": "Black",
				"pr0pr": "12.95",
				"pr0qt": "3",
				"pr0cc": "SHIRT-SALE"

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "purchase",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "purchase",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			}, true)).to.throw(TypeError);
		});

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",

				"pr1id": "shirtXL",
				"pr1nm": "Nice T-Shirt (XL)"

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0br": "TeeShart co.",
				"pr0ca": "Men",
				"pr0va": "Black",
				"pr0pr": "12.95",
				"pr0qt": "3",
				"pr0cc": "SHIRT-SALE"

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "refund",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "refund",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			}, true)).to.throw(TypeError);
		});

	});

	describe("type=click", function () {

		it("should accept click list", function () {

			var ecommerceParams = gampee({
				"type": "click",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3, "coupon":"SUMMER"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "click",
				"pal": "search",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0ps": "3",
				"pr0cc": "SUMMER"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "click",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "click",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3}]
			}, true)).to.throw(TypeError);
		});

	});

	describe("type=add", function () {

		it("should convert add", function () {

			var ecommerceParams = gampee({
				"type": "add",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3, "coupon":"SUMMER"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "add",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0qt": "3",
				"pr0cc": "SUMMER"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "add",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "add",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			}, true)).to.throw(TypeError);
		});

	});

	describe("type=remove", function () {

		it("should convert remove", function () {

			var ecommerceParams = gampee({
				"type": "remove",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3, "coupon":"SUMMER"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "remove",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0qt": "3",
				"pr0cc": "SUMMER"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "remove",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "remove",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			}, true)).to.throw(TypeError);
		});

	});

	describe("type=detail", function () {

		it("should accept detail list", function () {

			var ecommerceParams = gampee({
				"type": "detail",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3, "coupon":"SUMMER"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "detail",
				"pal": "search",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0ps": "3",
				"pr0cc": "SUMMER"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "detail",
				"step": 2,
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "detail",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "quantity": 3}]
			}, true)).to.throw(TypeError);
		});

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0qt": "5",
				"pr0cc": "SUMMER"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "checkout",
				"list": "search",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "checkout",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			}, true)).to.throw(TypeError);
		});

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

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0qt": "5",
				"pr0cc": "SUMMER"

			});

		});

		it("should throw on unexpected action params", function () {
			expect(callGampeeWith({
				"type": "checkout_option",
				"list": "search",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)"}]
			}, true)).to.throw(TypeError);
		});

		it("should throw on unexpected product params", function () {
			expect(callGampeeWith({
				"type": "checkout_option",
				"products": [{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}]
			}, true)).to.throw(TypeError);
		});

	});

});
