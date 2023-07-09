import { HTTPMethods, SupportedLibraries, anyFn } from "../types";

export interface _CheckerPerformance {
	disable: boolean;
	checkerOverheadTime: boolean;
	apiQueryTime: boolean;
	sampleSize: number;
}

export interface _RESTOptions {
	url: string;
	disable: boolean;
	method: HTTPMethods;
	headers: Record<string, string>;
	showPerformance: _CheckerPerformance | null;
	log: boolean;
}

export interface _Checker {
	runChecker(
		instance: (...args: any) => Promise<object>,
		tag: string,
		options: Partial<_RESTOptions>,
	): anyFn;
	library: SupportedLibraries;
	options: Partial<_RESTOptions>;
	// updateLibrary(lib: _SupportedLibraries): void;
}
