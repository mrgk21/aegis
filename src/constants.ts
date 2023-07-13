import { _ErrorObj } from "./types";

export const ERRORS = {
	ERR_UNKNOWN: (tag: string, url: string) => ({
		code: -1,
		tag,
		url,
		error: new Error(`Unknown error: ${tag}`),
	}),
	ERR_INVALID_URL: (tag: string, url: string) => ({
		code: 1,
		tag,
		url,
		error: new Error(`Invalid URL: ${tag}`),
	}),
	ERR_NOT_FOUND: (tag: string, url: string) => ({
		code: 2,
		tag,
		url,
		error: new Error(`API not found: ${tag}`),
	}),
} satisfies Record<string, (tag: string, url: string) => _ErrorObj>;
