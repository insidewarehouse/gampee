/*global describe, it */

var expect = require("chai").expect,
	gampee = require("../index");

describe("gampee", function () {

	it("should throw 'Not implemented'", function () {

		expect(gampee).to.throw("Not implemented");

	});

});
