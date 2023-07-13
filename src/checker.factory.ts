import CheckerREST from "@REST/checker.rest";
import { _Checker } from "@REST/types.rest";
import axios from "axios";
import { v4 as uuid } from "uuid";
import {
	APITypes,
	SupportedLibraries,
	_CheckerFactoryOptions,
	_CheckerType,
	_ErrorObj,
} from "./types";
import { errorBuilder, validURL } from "./utils";

interface _CheckerFactory {
	options: _CheckerFactoryOptions;
	storage: Record<string, _Checker<_CheckerType>>; // store for all the api data
	readonly library: SupportedLibraries;
	createChecker<T extends _CheckerType>(type: T, options: APITypes[T]): _Checker<T>; // returns an instance of a checker
	checkAPIStatus(): void; // logs out the status of all the APIs running in the factory, (works only if lazy flag is true)
}

function validateURL(url: string | undefined) {
	if (url && !validURL(url)) {
		const errorObj: _ErrorObj[] = [];
		errorBuilder(errorObj, "ERR_INVALID_URL", "invalid_url", url);
		throw errorObj;
	}
}

export default class CheckerFactory implements _CheckerFactory {
	options: _CheckerFactoryOptions = { url: "", lazy: false, disable: false, log: true };

	storage: Record<string, _Checker<_CheckerType>> = {};

	constructor(
		readonly library: SupportedLibraries,
		options: _CheckerFactoryOptions,
	) {
		validateURL(options?.url);
		this.options = { ...this.options, ...options };
		this.library = library;
	}

	createChecker<T extends _CheckerType>(type: T, options?: APITypes[T]) {
		validateURL(options?.url);
		switch (type) {
			case "REST": {
				const { log, ...remainingOptions } = this.options;
				const newChecker = new CheckerREST(this.library, {
					...remainingOptions,
					...options,
				});

				this.storage[uuid()] = newChecker;
				return newChecker;
			}
			default:
				throw new Error("Invalid api config");
		}
	}

	checkAPIStatus(): Promise<any[]> {
		const apis = Object.keys(this.storage).map(async (key) => {
			const instance = this.storage[key];
			const url = instance.options.url ?? this.options.url;
			return this.storage[key].run(axios, key, { url })({
				baseURL: instance.options.url,
				method: instance.options.method,
				headers: instance.options.headers,
			});
		});
		return Promise.allSettled(apis);
	}
}
