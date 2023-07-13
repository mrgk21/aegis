import { validate as validateUUID } from "uuid";
import { describe, expect, it } from "vitest";
import CheckerREST from "../src/REST/checker.rest";
import CheckerFactory from "../src/checker.factory";
import { HTTPMethods, SupportedLibraries, _ErrorObj } from "../src/types";

describe("Checker factory", () => {
	const url = "https://jsonplaceholder.typicode.com/posts/1";

	describe("init", () => {
		const checkerFactory = new CheckerFactory(SupportedLibraries.axios, { url });

		it("should create a new instance of _checker", () => {
			expect(checkerFactory.createChecker("REST")).toBeInstanceOf(CheckerREST);
		});

		it("should throw an error on invalid url", () => {
			try {
				expect(
					new CheckerFactory(SupportedLibraries.axios, {
						url: "httpdfdfs://jsonplaceholder.typicode.com/posts/1",
					}),
				);
				expect(true).toBe(false);
			} catch (errors) {
				expect(errors[0] as _ErrorObj).toContain({ code: 1, tag: "invalid_url" });
			}
		});

		it("should initialize to a default state", () => {
			expect(checkerFactory.options.disable).toBe(false);
			expect(checkerFactory.options.lazy).toBe(false);
			expect(checkerFactory.options.log).toBe(true);
			expect(checkerFactory.options.url).toEqual(url);
		});

		it("should store new checkers in storage", () => {
			checkerFactory.createChecker("REST");
			checkerFactory.createChecker("REST");
			checkerFactory.createChecker("REST");

			Object.keys(checkerFactory.storage).forEach((key) => {
				expect(validateUUID(key)).toBe(true);
				expect(checkerFactory.storage[key]).toEqual({
					library: SupportedLibraries.axios,
					options: {
						url,
						disable: false,
						headers: {},
						lazy: false,
						method: HTTPMethods.GET,
						showPerformance: null,
					},
				});
			});
		});
	});
});
