/*
 * A very simple script to merge the minified JS and HTML.
 */
const fs = require("fs").promises;
const path = require("path");

const SCRIPT_PLACEHOLDER = `<script src="index.js"></script>`;
const OUTPUT_FILE = path.join(__dirname, "build/index.html");

function bold(str) {
  return `\x1b[1m${str}\x1b[0m`;
}

async function embedJsInHtml() {
  try {
    const js = await fs.readFile(
      path.join(__dirname, "index.min.reg.js"),
      "utf-8"
    );
    const html = await fs.readFile(
      path.join(__dirname, "index.min.html"),
      "utf-8"
    );

    let result;

    if (html.includes(SCRIPT_PLACEHOLDER)) {
      result = html.replace(SCRIPT_PLACEHOLDER, `<script>${js.replace('\n', '')}</script>`);
    }

    await fs.writeFile(OUTPUT_FILE, result, "utf-8");

    const stats = await fs.stat(OUTPUT_FILE);

    console.log(`***`);
    console.log(
      bold(
        `merged: ${stats.size}B (${((stats.size / 1024) * 100).toFixed(2)}%))`
      )
    );
    console.log(`***`);
  } catch (err) {
    console.error("Error:", err);
  }
}

embedJsInHtml();
