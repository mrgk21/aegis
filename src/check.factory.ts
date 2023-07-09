import CheckerREST from "@REST/checker.rest";
import { _Checker } from "@REST/types.rest";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { APITypes, SupportedLibraries, _CheckerType } from "./types";

interface _CheckerFactoryOptions {
	disable: boolean; // globally disables apis, if true
	lazy: boolean; // runs all the apis when they are called, if true
	log: boolean; // globally logs out all the apis, if true
	url: string; // store global url
}

interface _CheckerFactory {
	options: Partial<_CheckerFactoryOptions>;
	storage: Record<string, _Checker>; // store for all the api data
	readonly library: SupportedLibraries;
	createChecker<T extends _CheckerType>(type: T, options: APITypes[T]): _Checker; // returns an instance of a checker
	checkAPIStatus(): void; // logs out the status of all the APIs running in the factory, (works only if lazy flag is true)
}

export default class CheckerFactory implements _CheckerFactory {
	options: Partial<_CheckerFactoryOptions> = { url: "", lazy: false, disable: false, log: true };

	storage: Record<string, _Checker> = {};

	constructor(
		readonly library: SupportedLibraries,
		options: Partial<_CheckerFactoryOptions>,
	) {
		this.options = { ...options };
		this.library = library;
	}

	createChecker<T extends _CheckerType>(type: T, options?: APITypes[T]) {
		switch (type) {
			case "REST": {
				const newChecker = new CheckerREST(this.library, { ...this.options, ...options });
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
			return this.storage[key].runChecker(axios, key, { url })({
				baseURL: instance.options.url,
				method: instance.options.method,
				headers: instance.options.headers,
			});
		});
		return Promise.allSettled(apis);
	}
}
