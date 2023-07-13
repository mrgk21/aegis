import CheckerFactory from "./checker.factory";
import { HTTPMethods, SupportedLibraries } from "./types";

const url = "https://jsonplaceholder.typicode.com/poshhjts/1";

const checkerFactory = new CheckerFactory(SupportedLibraries.axios, {
	url,
});
checkerFactory.createChecker("REST");
checkerFactory.createChecker("REST", {
	url: "https://jsonplaceholder.typicode.com/posts/1",
});
checkerFactory.createChecker("REST", {
	url: "https://jsonplaceholder.typicode.com/posts/1",
	method: HTTPMethods.DELETE,
});
checkerFactory.createChecker("REST", {
	url: "https://jsonplaceholder.typicode.com/posts/1",
	method: HTTPMethods.GET,
	headers: { Authorization: "Bearer abcdfjkdfj" },
});

// (async () => {
//     try {
//         const result = await postChecker.runChecker(axios, "post-checker-69")({ baseURL: url });
//         console.log(result.data);
//     } catch (error: any) {
//         console.log(error.message);
//     }
// })();

(async () => {
	try {
		const res = await checkerFactory.checkAPIStatus();
		// console.log(res);

		res.forEach((item: PromiseSettledResult<any>) => {
			switch (item.status) {
				case "fulfilled": {
					console.log(item.value.data);
					break;
				}
				case "rejected": {
					console.log(item.reason);
					break;
				}
				default: {
					console.error("Something went wrong");
				}
			}
		});
	} catch (error: any) {
		error.message.map((err: PromiseRejectedResult) => err.reason);
	}
})();
