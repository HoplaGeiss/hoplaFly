import { readdirSync, statSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const functionsDir = "netlify/functions";

for (const dir of readdirSync(functionsDir)) {
  const full = path.join(functionsDir, dir);
  if (statSync(full).isDirectory()) {
    console.log(`🧩 Installing dependencies in ${dir}...`);
    execSync("pnpm install", { cwd: full, stdio: "inherit" });
  }
}
