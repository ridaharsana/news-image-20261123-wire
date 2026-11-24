// THE WIRE — news-image-20261123 entrypoint.
// Copies the committed entry image to the output directory. The output is a
// byte-for-byte copy of assets/entry.png, so repeated runs are identical.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(root, "output");

mkdirSync(outDir, { recursive: true });
copyFileSync(join(root, "assets", "entry.png"), join(outDir, "entry.png"));
console.log(`entry.png -> ${join(outDir, "entry.png")}`);
