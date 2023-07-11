import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"@REST": path.resolve(__dirname, "./src/REST"),
		},
	},
});
