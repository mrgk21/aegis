import { beforeEach, describe, expect, it } from "vitest";
import { _ErrorObj } from "../src/types";
import { errorBuilder, validURL } from "../src/utils";

describe("#validURL", () => {
	it("should return false on empty string", () => {
		expect(validURL("")).toBe(false);
	});
	it("should return false on bad protocol", () => {
		expect(validURL("abcd://google.com")).toBe(false);
	});
	it("should return false on bad domain name string", () => {
		expect(validURL("https://googl*&(DFdfjk*(&^e.com")).toBe(false);
	});
	it("should return false on invalid port", () => {
		expect(validURL("https://google.com:38473df9847")).toBe(false);
	});
	it("should return false on missing 'www'", () => {
		expect(validURL("https://www.google.com")).toBe(true);
	});
});

describe("#errorBuilder", () => {
	let error: _ErrorObj[] = [];
	const tag = "test-tag";
	const url = "www.google.com";
	beforeEach(() => {
		error = [];
	});
	it("should add a new error to existing object", () => {
		const errName = "ERR_UNKNOWN";
		errorBuilder(error, errName, `${tag}#1`, url);
		expect(error).toMatchObject([
			{
				code: -1,
				tag: `${tag}#1`,
				url,
				error: new Error(`Unknown error: ${tag}#1`),
			},
		]);
	});
});
