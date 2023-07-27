import { _RESTOptions } from "@REST/types.rest";

export type _CheckerType = "REST";

export type voidFn = () => void | Promise<void>;
export type anyFn = (...args: any[]) => any | Promise<any> | Promise<object>;
export type PartialPick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>;

export interface _ErrorObj {
	code: number;
	tag: string;
	url: string;
	error: Error;
}

export interface _CheckerFactoryOptions {
	disable?: boolean; // globally disables apis, if true
	lazy?: boolean; // tbd
	log?: boolean; // globally logs out all the apis, if true
	url: string; // store global url
}

export enum SupportedLibraries {
	fetch = "fetch",
	axios = "axios",
}

export enum HTTPMethods {
	CONNECT = "CONNECT",
	DELETE = "DELETE",
	GET = "GET",
	HEAD = "HEAD",
	OPTIONS = "OPTIONS",
	PATCH = "PATCH",
	POST = "POST",
	PUT = "PUT",
	TRACE = "TRACE",
}

export type APITypes = {
	[key in _CheckerType]: PartialPick<
		_RESTOptions,
		"disable" | "headers" | "method" | "showPerformance"
	>;
};
