import { APITypes, HTTPMethods, SupportedLibraries, _ErrorObj, anyFn } from "../types";
import { errorBuilder, validURL } from "../utils";
import { _Checker } from "./types.rest";

export default class CheckerREST implements _Checker<"REST"> {
	options: APITypes["REST"] = {
		url: "",
		disable: false,
		headers: {},
		method: HTTPMethods.GET,
		showPerformance: null,
	};

	constructor(
		readonly library: SupportedLibraries,
		options: APITypes["REST"],
	) {
		this.library = library;
		this.options = { ...this.options, ...options };
	}

	run(instance: (...k: any) => any, tag: string, options?: APITypes["REST"]): anyFn {
		const errObj: _ErrorObj[] = [];
		if (options) this.options = { ...options };
		const url = this.options?.url as string;
		return async (...args) => {
			if (this.options.disable) return instance(...args);
			if (!validURL(url)) {
				errorBuilder(errObj, "ERR_INVALID_URL", tag, url);
				throw errObj;
			}
			try {
				const response = await fetch(url, {
					method: this.options.method,
					headers: this.options.headers,
				});

				if (response.status === 404) {
					errorBuilder(errObj, "ERR_NOT_FOUND", tag, url);
				}
			} catch (error) {
				errorBuilder(errObj, "ERR_UNKNOWN", tag, url);
			}

			if (errObj.length > 0) throw errObj;
			return instance(...args);
		};
	}
}
