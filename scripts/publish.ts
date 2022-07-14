import path from "path";
import { execSync } from "child_process";
import consola from "consola";

const packages = [{ name: "web" }, { name: "admin" }];

async function execScript() {
	for (const { name } of packages) {
		let command = "npm publish --access public";
		execSync(command, {
			stdio: "inherit",
			cwd: path.join("dist", name),
		});
		consola.success(`Published @fireman/${name}`);
	}
}

void execScript();
