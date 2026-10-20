// Renders react-icons (Lucide set) to PNG data URIs for pptx and docx.
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");

const cache = {};
async function icon(name, color = "#000000", size = 256) {
  const key = name + color + size;
  if (cache[key]) return cache[key];
  const Comp = lu[name];
  if (!Comp) throw new Error("Missing icon " + name);
  const svg = renderToStaticMarkup(React.createElement(Comp, { color, size }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  cache[key] = { b64: "image/png;base64," + buf.toString("base64"), buf };
  return cache[key];
}
module.exports = { icon };
