import { APITypes, HTTPMethods, SupportedLibraries, _CheckerType, anyFn } from "../types";

export interface _CheckerPerformance {
	disable: boolean;
	checkerOverheadTime: boolean;
	apiQueryTime: boolean;
	sampleSize: number;
}

export interface _RESTOptions {
	url: string; // store local url (required)
	disable: boolean; // disable local test (default: false)
	method: HTTPMethods; // set method (default: GET)
	headers: Record<string, string>; // http req headers
	showPerformance: _CheckerPerformance | null; // show performance stats (default: false)
}

export interface _Checker<T extends _CheckerType> {
	run(instance: (...args: any) => Promise<object>, tag: string, options: APITypes[T]): anyFn;
	library: SupportedLibraries;
	options: APITypes[T];
	// updateLibrary(lib: _SupportedLibraries): void;
}
