import path from "path";
import { execSync } from "child_process";
import consola from "consola";

const packages = [{ name: "web" }, { name: "admin" }];

async function execScript() {
	if (process.argv.length < 3) {
		consola.error("You must provide a valid release type: major, minor or patch");
		return;
	}
	if (!["minor", "major", "patch"].includes(process.argv[2])) {
		consola.error("Please provide a valid release type: pnpm run bump <major|minor|patch>");
		return;
	}

	for (const { name } of packages) {
		let command = `npm version ${process.argv[2]}`;
		execSync(command, {
			stdio: "inherit",
			cwd: path.join("packages", name),
		});
		consola.success(`Bump @fireman/${name}`);
	}
}

void execScript();
