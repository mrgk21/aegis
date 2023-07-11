import CheckerREST from "@REST/checker.rest";
import axios from "axios";
import { afterAll, describe, expect, it } from "vitest";
import CheckerFactory from "../../src/check.factory";
import { HTTPMethods, SupportedLibraries, _ErrorObj } from "../../src/types";

describe("Single instance", () => {
	describe("using axios", () => {
		let url = "https://jsonplaceholder.typicode.com/posts/1";
		const options = { url };
		const checkerFactory = new CheckerFactory(SupportedLibraries.axios, options);
		it("should create a new instance of _checker", () => {
			expect(checkerFactory.createChecker("REST")).toBeInstanceOf(CheckerREST);
		});
		it("should initialize checker instance to default values", () => {
			const newChecker = checkerFactory.createChecker("REST");
			expect(newChecker.library).toBe(SupportedLibraries.axios);

			expect(newChecker.options.url).toEqual(url);
			expect(newChecker.options.disable).toBe(false);
			expect(newChecker.options.headers).toStrictEqual({});
			expect(newChecker.options.method).toEqual(HTTPMethods.GET);
		});

		describe("override factory default settings", () => {
			it("should throw error on wrong url", () => {
				try {
					checkerFactory.createChecker("REST", { url: "abcd.xyz.123" });
				} catch (errors: any) {
					expect(errors[0] as _ErrorObj).toContain({ code: 1, tag: "invalid_url" });
				}
			});
			it("should override other init options", () => {
				const newChecker = checkerFactory.createChecker("REST", {
					url: "https://www.google.com",
					disable: true,
					method: HTTPMethods.PATCH,
					headers: { Authorization: "Bearer abcd" },
					showPerformance: null,
				});

				expect(newChecker.options.disable).toBe(true);
				expect(newChecker.options.method).toEqual(HTTPMethods.PATCH);
				expect(newChecker.options.headers).toContain({ Authorization: "Bearer abcd" });
				expect(newChecker.options.showPerformance).toBeNull();
			});
		});
		describe("run method", () => {
			afterAll(() => {
				url = "https://jsonplaceholder.typicode.com/posts/1";
			});
			it("should run checker with parent url", async () => {
				const newChecker = checkerFactory.createChecker("REST");
				try {
					await newChecker.run(axios, "run-test #1")({ baseURL: url });
				} catch (error) {
					expect(true).toBe(false);
				}
			});
			it("should throw error on wrong url", async () => {
				url = "https://jsonplaceholder.typicode.com/posts/abcd";
				try {
					const newChecker = checkerFactory.createChecker("REST", { url });
					await newChecker.run(axios, "run-test#2")({ baseURL: url });
				} catch (errors: any) {
					expect(errors[0] as _ErrorObj).toContain({ code: 2, tag: "run-test#2" });
				}
			});
		});
	});
});
