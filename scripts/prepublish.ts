import path from "path";
import assert from "assert";
import fs from "fs-extra";
import fg from "fast-glob";

import { version } from "../package.json";
const rootDir = path.resolve(__dirname, "..");

const FILES_COPY_ROOT = ["LICENSE"];

const FILES_COPY_LOCAL = ["README.md", "*.js", "package.json", "*.d.ts"];

const packages = [{ name: "web" }, { name: "admin" }];

assert(process.cwd() !== __dirname);

async function execScript() {
	for (const { name } of packages) {
		const packageRoot = path.resolve(__dirname, "..", "packages", name);
		const packageDist = path.resolve(__dirname, "..", "dist", name);

		for (const file of FILES_COPY_ROOT)
			await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file));

		const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot });

		// copy all local files into dist folder
		for (const file of files)
			await fs.copyFile(
				path.join(packageRoot, file),
				path.join(packageDist, file)
			);

		// publish dist folders
	}
}

void execScript();
