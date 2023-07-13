import axios, { AxiosError, AxiosResponse } from "axios";
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

	run(instance: (...k: any) => any, tag: string): anyFn {
		const errObj: _ErrorObj[] = [];
		const { url, method, headers, disable } = this.options;
		return async (...args) => {
			if (disable) return instance(...args);
			if (!validURL(url)) {
				errorBuilder(errObj, "ERR_INVALID_URL", tag, url);
				throw errObj;
			}
			try {
				let response: Response | AxiosResponse;
				switch (this.library) {
					case SupportedLibraries.axios: {
						try {
							response = await axios({ baseURL: url, method, headers });
						} catch (error: unknown) {
							if (error instanceof AxiosError) {
								if (error.response?.status === 404) {
									errorBuilder(errObj, "ERR_NOT_FOUND", tag, url);
								}
							}
						}
						break;
					}
					case SupportedLibraries.fetch: {
						response = await fetch(url, { method, headers });
						if (response.status === 404) {
							errorBuilder(errObj, "ERR_NOT_FOUND", tag, url);
						}
						break;
					}
					default: {
						errorBuilder(errObj, "ERR_UNKNOWN", "unsupported_library");
						throw errObj;
					}
				}
			} catch (error) {
				errorBuilder(errObj, "ERR_UNKNOWN", tag, url);
			}

			if (errObj.length > 0) throw errObj;
			return instance(...args);
		};
	}
}
