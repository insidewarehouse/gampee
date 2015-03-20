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
				"products": [ {"id": "shirtM", "name": "Nice T-Shirt (M)"} ]
			});

			expect(ecommerceParams).to.eql({

				"il0pi0id": "shirtM",
				"il0pi0nm": "Nice T-Shirt (M)"

			});
		});

	});

});
