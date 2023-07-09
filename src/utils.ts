import { ERRORS } from "./constants";
import { _ErrorObj } from "./types";

export function validURL(str: string) {
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i",
	); // fragment locator
	return !!pattern.test(str);
}

export function errorBuilder(
	obj: _ErrorObj[],
	errName: keyof typeof ERRORS,
	tag: string,
	url: string,
) {
	obj.push(ERRORS[errName](tag, url));
}