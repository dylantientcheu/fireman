import path from "path";
import { execSync } from "child_process";
import consola from "consola";

const packages = [{ name: "web" }, { name: "admin" }];

async function execScript() {
	for (const { name } of packages) {
		let command = "npm version minor";
		execSync(command, {
			stdio: "inherit",
			cwd: path.join("packages", name),
		});
		consola.success(`Bumped @fireman/${name}`);
	}
}

void execScript();
