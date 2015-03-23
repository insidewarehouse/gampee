/*global describe, it */

var expect = require("chai").expect,
	gampee = require("../index");

describe("gampee", function () {

	it("should throw when called without params", function () {

		expect(gampee).to.throw(TypeError);

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

		it("should accept product brand/category/variant/price/quantity/coupon/position", function () {

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
						"coupon": "SHIRT-SALE",
						"position": 2
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
				"pr0cc": "SHIRT-SALE",
				"pr0ps": "2"

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

	});

	describe("type=click", function () {

		it("should accept click list", function () {

			var ecommerceParams = gampee({
				"type": "click",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "click",
				"pal": "search",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0ps": "3"

			});

		});

	});

	describe("type=detail", function () {

		it("should accept detail list", function () {

			var ecommerceParams = gampee({
				"type": "detail",
				"list": "search",
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)", "position": 3}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "detail",
				"pal": "search",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)",
				"pr0ps": "3"

			});

		});

	});

	describe("type=checkout", function () {

		it("should accept checkout step", function () {

			var ecommerceParams = gampee({
				"type": "checkout",
				"step": 2,
				"products": [
					{"id": "shirtM", "name": "Nice T-Shirt (M)"}
				]
			});

			expect(ecommerceParams).to.eql({

				"pa": "checkout",
				"cos": "2",

				"pr0id": "shirtM",
				"pr0nm": "Nice T-Shirt (M)"

			});

		});
	});

});
