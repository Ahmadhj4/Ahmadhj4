// Builds the Concept Note deck: node build_deck.js en|ar <out.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const { icon } = require("./icons");
const MODULES = require("./data_modules");

const COPY = require("./copy_deck");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const LANG = process.argv[2] || "en";
const OUT = process.argv[3] || `concept_${LANG}.pptx`;
const AR = LANG === "ar";
const T = COPY[LANG];

// Brand colours: sampled from the supplied Green Circle logo only.
const BR = { green: "4DB449", lime: "A6D04B", gray: "727274", black: "000000" };
// Neutrals (not brand colours): white, ink, light tint for panels.
const N = { white: "FFFFFF", ink: "1A1A1A", soft: "F2F4F1", tint: "EAF5E8", line: "D9DDD8", dim: "C9CCC8", panel: "161816" };

const FONT = AR ? { head: "Cairo", body: "IBM Plex Sans Arabic" } : { head: "Cairo", body: "Calibri" };
const LCODE = AR ? "ar-SA" : "en-US";
const W = 13.333, H = 7.5, M = 0.6;

const THEME = {
  name: "Green Circle Training",
  headFontFace: FONT.head, bodyFontFace: FONT.body,
  colors: { dk1: "000000", lt1: "FFFFFF", dk2: "727274", lt2: "EAF5E8", accent1: "4DB449", accent2: "A6D04B", accent3: "727274", accent4: "1A1A1A", accent5: "4DB449", accent6: "A6D04B", hlink: "4DB449", folHlink: "727274" },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: FONT.head, bodyFontFace: FONT.body };
pres.title = T.cover.title;
pres.author = "Green Circle";
pres.company = "Green Circle";
if (AR) pres.rtlMode = true;

const LOGO = path.join(__dirname, "assets/green-circle-logo.png");
const LOGO_R = 771 / 274;

// ---------- helpers ----------
const X = (x, w) => (AR ? W - x - w : x); // mirror horizontally for RTL
const A = (a) => (a === "center" ? "center" : AR ? (a === "end" ? "left" : "right") : a === "end" ? "right" : "left");
// Keep multi-word Latin names (Claude Code, VS Code…) on one line inside Arabic text.
const nb = (t) => t.replace(/\u200E/g, "").replace(/(^|[\s(«])((?:~\/|\.|\/)[A-Za-z][\w.\/-]*)/g, "$1\u202A$2\u202C").replace(/be aware\.\.be secure/g, "be\u00A0aware..be\u00A0secure").replace(/([A-Za-z.+]+) (?=[A-Z0-9][A-Za-z.]*)/g, "$1\u00A0");
function text(slide, t, o) {
  const opts = {
    x: X(o.x, o.w), y: o.y, w: o.w, h: o.h,
    fontFace: o.font === "head" ? FONT.head : FONT.body,
    fontSize: o.size || 14, bold: !!o.bold, italic: !!o.italic,
    color: o.color || N.ink, align: A(o.align || "start"), valign: o.valign || "top",
    margin: o.margin != null ? o.margin : 0, isTextBox: true, lang: LCODE,
    paraSpaceAfter: o.psa || 0, lineSpacingMultiple: o.lsm || (AR ? 1.0 : 0.95),
    fit: "none",
  };
  if (AR && !o.ltr) opts.rtlMode = true;
  if (o.charSpacing && !AR) opts.charSpacing = o.charSpacing;
  if (o.objectName) opts.objectName = o.objectName;
  if (AR && typeof t === "string") t = nb(t);
  if (Array.isArray(t)) {
    t = t.map((r) => ({ text: AR ? nb(r.text) : r.text, options: Object.assign({ lang: LCODE }, AR ? { rtlMode: true } : {}, r.options || {}) }));
  }
  slide.addText(t, opts);
}
function shape(slide, type, o) {
  const opts = Object.assign({}, o, { x: X(o.x, o.w) });
  if (AR && o.flipForRtl) { opts.flipH = !o.flipH; }
  delete opts.flipForRtl;
  slide.addShape(type, opts);
}
const PENDING = [];
function ico(slide, name, color, o) {
  const p = icon(name, "#" + color).then((i) => slide.addImage({ data: i.b64, x: X(o.x, o.w), y: o.y, w: o.w, h: o.h }));
  PENDING.push(p);
  return p;
}
function bullets(items, o = {}) {
  return items.map((s, i) => ({ text: s, options: { bullet: AR ? { indent: 14 } : { indent: 14 }, breakLine: i < items.length - 1, paraSpaceAfter: o.psa || 6 } }));
}
function kickerTitle(slide, kicker, title, dark) {
  text(slide, kicker, { x: M, y: 0.42, w: 9.8, h: 0.3, size: 11, bold: true, color: dark ? BR.lime : BR.gray, charSpacing: 2, font: "body" });
  text(slide, title, { x: M, y: 0.74, w: 10.3, h: 1.0, size: AR ? 26 : 28, bold: true, color: dark ? N.white : N.ink, font: "head", lsm: AR ? 0.95 : 0.9 });
}
function logoChip(slide) {
  const h = 0.5, w = h * LOGO_R;
  slide.addImage({ path: LOGO, x: AR ? M : W - M - w, y: 0.42, w, h, altText: "Green Circle logo" });
}
function footer(slide, n, dark) {
  text(slide, T.footer, { x: M, y: 7.05, w: 7, h: 0.25, size: 9, color: dark ? "8A8C88" : BR.gray, font: "body" });
  text(slide, String(n), { x: W - M - 0.6, y: 7.05, w: 0.6, h: 0.25, size: 9, color: dark ? "8A8C88" : BR.gray, align: "end", font: "body" });
}
function chip(slide, label, o, style = "light") {
  const fill = style === "dark" ? N.panel : style === "black" ? BR.black : style === "green" ? BR.green : N.soft;
  const color = style === "dark" || style === "black" ? N.white : N.ink;
  shape(slide, pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: fill }, line: { color: style === "dark" ? "3A3D39" : fill, width: 0.75 }, rectRadius: o.h / 2 });
  text(slide, label, { x: o.x + 0.12, y: o.y, w: o.w - 0.24, h: o.h, size: o.size || 12, color, align: "center", valign: "middle", font: "body", bold: !!o.bold });
}
const dot = (slide, x, y, d, color, line) => shape(slide, pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color: line || color, width: line ? 2 : 0.5 } });


const MARKS = require("./assets/marks/map.json");
function markPath(name, dark) { const s = MARKS[name]; return s ? path.join(__dirname, `assets/marks/${s}-${dark ? "white" : "black"}.png`) : null; }
const chipW = (label, hasMark) => label.length * (AR ? 0.085 : 0.088) + 0.42 + (hasMark ? 0.3 : 0);
// Tool chip: official mark (when one exists) + tool name.
function toolChip(slide, name, o, style = "light") {
  const dark = style === "dark" || style === "black";
  const mp = markPath(name, dark);
  const w = o.w || chipW(name, !!mp);
  const fill = style === "dark" ? N.panel : style === "black" ? BR.black : style === "white" ? N.white : N.soft;
  shape(slide, pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w, h: o.h, fill: { color: fill }, line: { color: style === "dark" ? "3A3D39" : style === "white" ? N.line : fill, width: 0.75 }, rectRadius: o.h / 2 });
  const ms = o.h * 0.5;
  if (mp) {
    slide.addImage({ path: mp, x: X(o.x + 0.14, ms), y: o.y + (o.h - ms) / 2, w: ms, h: ms, altText: name + " logo" });
    text(slide, name, { ltr: true, x: o.x + 0.2 + ms, y: o.y, w: w - 0.32 - ms, h: o.h, size: o.size || 12, color: dark ? N.white : N.ink, align: o.center ? "center" : "start", valign: "middle", bold: !!o.bold });
  } else {
    text(slide, name, { ltr: true, x: o.x + 0.1, y: o.y, w: w - 0.2, h: o.h, size: o.size || 12, color: dark ? N.white : N.ink, align: "center", valign: "middle", bold: !!o.bold });
  }
  return w;
}
function chipRow(slide, names, x, y, h, style, maxX, size) {
  let cx = x, cy = y;
  for (const nm of names) {
    const w = chipW(nm, !!markPath(nm));
    if (cx + w > maxX + 0.01) { cx = x; cy += h + 0.1; }
    toolChip(slide, nm, { x: cx, y: cy, h, size }, style); cx += w + 0.1;
  }
  return cy + h;
}
function outBox(slide, label, t, y, dark) {
  shape(slide, pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: W - 2 * M, h: 0.62, fill: { color: dark ? N.panel : BR.black }, line: { color: dark ? "3A3D39" : BR.black, width: 0.75 }, rectRadius: 0.1 });
  text(slide, t, { x: M + 0.3, y, w: W - 2 * M - 0.6, h: 0.62, size: 14, bold: true, color: N.white, valign: "middle" });
}

const trackColor = { foundations: BR.gray, content: BR.green, build: BR.black, design: BR.lime, media: BR.green, automate: BR.lime, final: BR.black };
const trackText = (k) => (["build", "final", "foundations"].includes(k) ? N.white : N.ink);

let n = 0;
function newSlide(dark) { n += 1; return pres.addSlide({ masterName: dark ? "DARK" : "LIGHT" }); }
pres.defineSlideMaster({ title: "LIGHT", background: { color: N.white } });
pres.defineSlideMaster({ title: "DARK", background: { color: BR.black } });
function darkLogo(s) { const lw = 1.55, lh = lw / LOGO_R; s.addImage({ path: LOGO, x: AR ? M : W - M - lw, y: 0.42, w: lw, h: lh, altText: "Green Circle logo" }); }
const hrsTxt = (h) => `${h}${T.hrs}`;

async function build() {
  // 1. Cover
  {
    const s = newSlide(true);
    const lw = 4.3, lh = lw / LOGO_R;
    s.addImage({ path: LOGO, x: AR ? W - M - lw : M - 0.12, y: 0.55, w: lw, h: lh, altText: "Green Circle logo" });
    text(s, T.cover.kicker, { x: M, y: 2.45, w: 6.9, h: 0.3, size: 12, bold: true, color: BR.lime, charSpacing: 2 });
    text(s, T.cover.title, { x: M, y: 2.85, w: 6.9, h: 2.2, size: AR ? 32 : 34, bold: true, color: N.white, font: "head", lsm: AR ? 1.0 : 0.92 });
    text(s, T.cover.sub, { x: M, y: 5.15, w: 6.7, h: 1.2, size: 16, color: "D6D8D4", lsm: 1.05 });
    const cx = AR ? 3.25 : W - 3.25, cy = 4.0, R = 2.15;
    s.addShape(pres.shapes.OVAL, { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, fill: { color: BR.black, transparency: 100 }, line: { color: "2F332E", width: 1.25, dashType: "dash" } });
    T.cover.ring.forEach((st, i) => {
      const ang = (-90 + (AR ? -1 : 1) * i * 45) * Math.PI / 180;
      const px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang), d = 0.34, c = i % 2 ? BR.lime : BR.green;
      s.addShape(pres.shapes.OVAL, { x: px - d / 2, y: py - d / 2, w: d, h: d, fill: { color: c }, line: { color: c, width: 0.5 } });
      const lx = Math.cos(ang) >= 0.2 ? px + 0.28 : Math.cos(ang) <= -0.2 ? px - 0.28 - 1.6 : px - 0.8;
      const ly = Math.abs(Math.cos(ang)) < 0.2 ? (Math.sin(ang) < 0 ? py - 0.62 : py + 0.26) : py - 0.18;
      const al = Math.cos(ang) >= 0.2 ? "left" : Math.cos(ang) <= -0.2 ? "right" : "center";
      s.addText(st, { x: lx, y: ly, w: 1.6, h: 0.36, fontFace: FONT.body, fontSize: 13, color: N.white, align: al, valign: "middle", margin: 0, isTextBox: true, lang: LCODE, rtlMode: AR });
    });
    s.addShape(pres.shapes.OVAL, { x: cx - 0.98, y: cy - 0.98, w: 1.96, h: 1.96, fill: { color: BR.green }, line: { color: BR.green } });
    s.addText(T.cover.center, { x: cx - 0.85, y: cy - 0.6, w: 1.7, h: 1.2, fontFace: FONT.head, fontSize: 15, bold: true, color: BR.black, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LCODE, rtlMode: AR });
    s.addNotes("Open with the promise: in 96 hours participants learn to use AI tools in practice and leave with finished work. The ring shows the eight production stages they learn to combine.");
  }

  // 2. Program at a glance
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.glance.kicker, T.glance.title);
    const icons = ["LuWandSparkles", "LuLayers", "LuAward"];
    T.glance.points.forEach((p, i) => {
      const y = 2.0 + i * 1.55;
      dot(s, M, y, 0.62, BR.green);
      ico(s, icons[i], "000000", { x: M + 0.15, y: y + 0.15, w: 0.32, h: 0.32 });
      text(s, p[0], { x: M + 0.85, y: y - 0.02, w: 5.6, h: 0.42, size: 18, bold: true, font: "head" });
      text(s, p[1], { x: M + 0.85, y: y + 0.42, w: 5.6, h: 0.95, size: 14, color: "3C3E3B", lsm: 1.02 });
    });
    const px = 7.35, pw = W - M - px;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 1.95, w: pw, h: 4.85, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.14 });
    T.glance.stats.forEach((st, i) => {
      const c = i % 2, r = Math.floor(i / 2), cw = (pw - 0.6) / 2;
      const x = px + 0.35 + c * cw, y = 2.2 + r * 1.5;
      text(s, st[0], { x, y, w: cw - 0.1, h: 0.85, size: 44, bold: true, color: (i + r) % 2 ? BR.green : BR.lime, font: "head", valign: "bottom" });
      text(s, st[1], { x, y: y + 0.85, w: cw - 0.1, h: 0.4, size: 14, color: N.white });
    });
    s.addNotes("Three ideas carry the program: tools used by hand, several tools combined, and a portfolio of finished work as proof. Hours: 26 theory and 70 hands-on.");
  }

  // 3. Can-do
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.cando.kicker, T.cando.title);
    const icons = ["LuCompass", "LuPenLine", "LuSearch", "LuTerminal", "LuPuzzle", "LuPalette", "LuClapperboard", "LuWorkflow"];
    const cw = (W - 2 * M - 3 * 0.25) / 4, ch = 2.15;
    for (let i = 0; i < 8; i++) {
      const c = i % 4, r = Math.floor(i / 4), x = M + c * (cw + 0.25), y = 1.95 + r * (ch + 0.25);
      const hi = i === 3 || i === 6;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: hi ? BR.black : N.tint }, line: { color: hi ? BR.black : N.tint }, rectRadius: 0.12 });
      dot(s, x + 0.3, y + 0.3, 0.68, hi ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: x + 0.47, y: y + 0.47, w: 0.34, h: 0.34 });
      text(s, T.cando.items[i][0], { x: x + 0.3, y: y + 1.1, w: cw - 0.55, h: 0.55, size: 16, bold: true, font: "head", color: hi ? N.white : N.ink, lsm: 0.95 });
      text(s, T.cando.items[i][1], { x: x + 0.3, y: y + 1.62, w: cw - 0.55, h: 0.45, size: 13, color: hi ? "D6D8D4" : "3C3E3B" });
    }
    s.addNotes("These eight statements are the program's learning outcomes in plain words. Each one is backed by a mini project the participant completes.");
  }

  // 4. Pipeline
  {
    const s = newSlide(true); footer(s, n, true); darkLogo(s);
    kickerTitle(s, T.pipeline.kicker, T.pipeline.title, true);
    const st = T.pipeline.stages, cw = (W - 2 * M) / st.length, y0 = 2.2, d = 0.8;
    s.addShape(pres.shapes.LINE, { x: M + cw / 2, y: y0 + d / 2, w: W - 2 * M - cw, h: 0, line: { color: "3A3D39", width: 2 } });
    const icons = ["LuSearch", "LuPenLine", "LuPalette", "LuImage", "LuClapperboard", "LuScissors", "LuMic", "LuWorkflow"];
    for (let i = 0; i < st.length; i++) {
      const x = M + i * cw, cx = x + cw / 2;
      shape(s, pres.shapes.OVAL, { x: cx - d / 2, y: y0, w: d, h: d, fill: { color: i % 2 ? BR.lime : BR.green }, line: { color: BR.black, width: 3 } });
      await ico(s, icons[i], "000000", { x: cx - 0.2, y: y0 + 0.2, w: 0.4, h: 0.4 });
      text(s, String(i + 1).padStart(2, "0"), { x: cx - 0.6, y: y0 + d + 0.12, w: 1.2, h: 0.28, size: 11, bold: true, color: BR.lime, align: "center" });
      text(s, st[i][0], { x: x + 0.04, y: y0 + d + 0.4, w: cw - 0.08, h: 0.62, size: 15, bold: true, color: N.white, align: "center", font: "head", lsm: 0.9 });
      st[i][1].forEach((tl, j) => toolChip(s, tl, { x: x + 0.07, y: y0 + d + 1.15 + j * 0.47, w: cw - 0.14, h: 0.38, size: AR ? 10 : 11, center: true }, "dark"));
    }
    text(s, T.pipeline.note, { x: M, y: 6.25, w: W - 2 * M, h: 0.5, size: 14, color: "C9CCC8" });
    s.addNotes("Read left to right: one idea moves through eight stages. Under each stage are the tools participants use for it. Logos appear only for tools with an official published mark.");
  }

  // 5. Tracks
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.tracks.kicker, T.tracks.title);
    const hrs = {}; for (const m of MODULES) hrs[m.track] = (hrs[m.track] || 0) + m.T + m.P;
    const total = Object.values(hrs).reduce((a, b) => a + b, 0);
    let x = M; const bw = W - 2 * M, by = 1.95;
    for (const it of T.tracks.items) {
      const w = bw * hrs[it.k] / total;
      shape(s, pres.shapes.RECTANGLE, { x, y: by, w: w - 0.04, h: 0.55, fill: { color: trackColor[it.k] }, line: { color: trackColor[it.k] } });
      text(s, hrsTxt(hrs[it.k]), { x, y: by, w: w - 0.04, h: 0.55, size: 13, bold: true, color: trackText(it.k), align: "center", valign: "middle", font: "head" });
      x += w;
    }
    const cw = (bw - 3 * 0.25) / 4, ch = 1.85;
    T.tracks.items.forEach((it, i) => {
      const c = i % 4, r = Math.floor(i / 4), cx = M + c * (cw + 0.25), cy = 2.8 + r * (ch + 0.22);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: cw, h: ch, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.1 });
      dot(s, cx + 0.22, cy + 0.27, 0.26, trackColor[it.k]);
      text(s, it.name, { x: cx + 0.62, y: cy + 0.12, w: cw - 0.75, h: 0.56, size: 15, bold: true, font: "head", lsm: 0.85, valign: "middle" });
      text(s, AR ? `${hrs[it.k]} ${T.tracks.hoursLabel} · ${it.mods}` : `${it.mods} · ${hrs[it.k]} ${T.tracks.hoursLabel}`, { x: cx + 0.22, y: cy + 0.74, w: cw - 0.4, h: 0.3, size: 12, bold: true, color: BR.gray });
      text(s, it.desc, { x: cx + 0.22, y: cy + 1.04, w: cw - 0.4, h: 0.82, size: 13, color: "3C3E3B", lsm: 1.0 });
    });
    const tx = M + 3 * (cw + 0.25), ty = 2.8 + ch + 0.22;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: tx, y: ty, w: cw, h: ch, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.1 });
    text(s, String(total), { x: tx + 0.25, y: ty + 0.2, w: cw - 0.5, h: 0.95, size: 54, bold: true, color: BR.lime, font: "head" });
    text(s, T.tracks.total, { x: tx + 0.25, y: ty + 1.2, w: cw - 0.5, h: 0.4, size: 15, color: N.white });
    s.addNotes("The bar is to scale. Video, motion and audio is the largest track because production work needs the most hands-on time.");
  }

  // 6. Choosing tools
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.choose.kicker, T.choose.title);
    const lw = 5.0;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.95, w: lw, h: 4.85, fill: { color: N.tint }, line: { color: N.tint }, rectRadius: 0.12 });
    text(s, T.choose.qTitle, { x: M + 0.3, y: 2.15, w: lw - 0.6, h: 0.45, size: 17, bold: true, font: "head" });
    T.choose.q.forEach((q, i) => {
      const y = 2.8 + i * 0.78;
      dot(s, M + 0.3, y, 0.48, i === 3 ? BR.black : BR.green);
      text(s, String(i + 1), { x: M + 0.3, y, w: 0.48, h: 0.48, size: 15, bold: true, align: "center", valign: "middle", color: i === 3 ? BR.lime : BR.black, font: "head" });
      text(s, q, { x: M + 0.95, y: y - 0.04, w: lw - 1.2, h: 0.6, size: 14, valign: "middle", lsm: 1.0 });
    });
    const rx = M + lw + 0.4, rw = W - M - rx;
    text(s, T.choose.mTitle, { x: rx, y: 1.95, w: rw, h: 0.45, size: 17, bold: true, font: "head" });
    T.choose.rows.forEach((r, i) => {
      const y = 2.55 + i * 0.6;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: rx, y, w: 3.1, h: 0.48, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.08 });
      text(s, r[0], { x: rx + 0.18, y, w: 2.85, h: 0.48, size: 13.5, valign: "middle" });
      ico(s, AR ? "LuArrowLeft" : "LuArrowRight", BR.green, { x: rx + 3.2, y: y + 0.09, w: 0.3, h: 0.3 });
      let cx = rx + 3.62;
      r[1].split(" · ").forEach((tl) => { cx += toolChip(s, tl, { x: cx, y: y + 0.04, h: 0.4, size: 12 }, "black") + 0.1; });
    });
    s.addNotes("Tool choice is taught as a habit: start from the task and the data, not from the newest tool. Question 4 is where Green Circle's security focus comes in: what is safe to share.");
  }

  // 7. Prompting
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.prompt.kicker, T.prompt.title);
    const pw = (W - 2 * M - 5 * 0.18) / 6;
    T.prompt.parts.forEach((p, i) => {
      const x = M + i * (pw + 0.18);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.95, w: pw, h: 1.35, fill: { color: i % 2 ? N.tint : N.soft }, line: { color: i % 2 ? N.tint : N.soft }, rectRadius: 0.1 });
      text(s, String(i + 1), { x: x + 0.18, y: 2.05, w: 0.5, h: 0.42, size: 20, bold: true, color: BR.green, font: "head" });
      text(s, p[0], { x: x + 0.18, y: 2.45, w: pw - 0.3, h: 0.38, size: 16, bold: true, font: "head" });
      text(s, p[1], { x: x + 0.18, y: 2.83, w: pw - 0.3, h: 0.45, size: 12, color: "3C3E3B", lsm: 0.95 });
    });
    const by = 3.55, bh = 2.25;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: by, w: 3.6, h: bh, fill: { color: N.soft }, line: { color: N.line, width: 0.75 }, rectRadius: 0.1 });
    text(s, T.prompt.beforeL, { x: M + 0.25, y: by + 0.18, w: 3, h: 0.35, size: 13, bold: true, color: BR.gray });
    text(s, `“${T.prompt.before}”`, { x: M + 0.25, y: by + 0.6, w: 3.1, h: 1.4, size: 16, color: "4A4C49", italic: !AR });
    await ico(s, AR ? "LuArrowLeft" : "LuArrowRight", BR.green, { x: M + 3.75, y: by + bh / 2 - 0.25, w: 0.5, h: 0.5 });
    const ax = M + 4.4, aw = W - M - ax;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: ax, y: by, w: aw, h: bh, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.1 });
    text(s, T.prompt.afterL, { x: ax + 0.3, y: by + 0.18, w: 3, h: 0.35, size: 13, bold: true, color: BR.lime });
    text(s, `“${T.prompt.after}”`, { x: ax + 0.3, y: by + 0.55, w: aw - 0.6, h: 1.6, size: 14.5, color: N.white, lsm: 1.05 });
    text(s, T.prompt.out, { x: M, y: 6.0, w: W - 2 * M, h: 0.6, size: 14, bold: true, color: N.ink });
    s.addNotes("The six parts are the checklist participants use all program long. The before-and-after example shows the difference in one glance.");
  }

  // 8. Claude Code
  {
    const s = newSlide(true); footer(s, n, true); darkLogo(s);
    kickerTitle(s, T.cc.kicker, T.cc.title, true);
    s.addImage({ path: markPath("Claude", true), x: X(M, 0.55), y: 1.95, w: 0.55, h: 0.55, altText: "Claude logo" });
    text(s, T.cc.intro, { x: M + 0.8, y: 1.88, w: W - 2 * M - 0.8, h: 0.8, size: 15, color: "D6D8D4", lsm: 1.05 });
    const sw = (W - 2 * M - 3 * 0.35) / 4, icons = ["LuFileText", "LuListChecks", "LuEye", "LuUpload"];
    for (let i = 0; i < 4; i++) {
      const x = M + i * (sw + 0.35), y = 2.95;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: sw, h: 1.3, fill: { color: i === 2 ? BR.green : N.panel }, line: { color: i === 2 ? BR.green : BR.lime, width: 1.25 }, rectRadius: 0.12 });
      await ico(s, icons[i], i === 2 ? "000000" : BR.lime, { x: x + 0.22, y: y + 0.25, w: 0.42, h: 0.42 });
      text(s, T.cc.steps[i][0], { x: x + 0.8, y: y + 0.17, w: sw - 0.95, h: 0.42, size: 18, bold: true, font: "head", color: i === 2 ? BR.black : N.white });
      text(s, T.cc.steps[i][1], { x: x + 0.8, y: y + 0.6, w: sw - 0.95, h: 0.65, size: 13, color: i === 2 ? BR.black : "C9CCC8", lsm: 1.0 });
      if (i < 3) await ico(s, AR ? "LuChevronLeft" : "LuChevronRight", BR.lime, { x: x + sw + 0.05, y: y + 0.5, w: 0.26, h: 0.26 });
    }
    text(s, T.cc.buildTitle, { x: M, y: 4.55, w: 8, h: 0.4, size: 16, bold: true, color: BR.lime, font: "head" });
    T.cc.builds.forEach((b, i) => {
      const c = i % 2, r = Math.floor(i / 2), x = M + c * 6.15, y = 5.1 + r * 0.72;
      ico(s, "LuSquareCheck", BR.lime, { x, y: y + 0.04, w: 0.34, h: 0.34 });
      text(s, b, { x: x + 0.5, y, w: 5.5, h: 0.62, size: 14, color: N.white, lsm: 1.0 });
    });
    s.addNotes("Claude Code works in the terminal, VS Code and the desktop app, and is included with Claude Pro and Max plans. No prior programming is required; participants learn to describe, review and approve.");
  }

  // 9. Skills
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.skills.kicker, T.skills.title);
    text(s, T.skills.intro, { x: M, y: 1.75, w: W - 2 * M, h: 0.7, size: 15, color: "3C3E3B", lsm: 1.05 });
    const tw = 4.6, ty = 2.65;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: ty, w: tw, h: 3.2, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.12 });
    T.skills.tree.forEach((l, i) => {
      const isSkill = l.includes("SKILL.md");
      s.addText(l, { x: X(M + 0.35, tw - 0.6), y: ty + 0.3 + i * 0.44, w: tw - 0.6, h: 0.4, fontFace: "JetBrains Mono", fontSize: 15, bold: isSkill, color: isSkill ? BR.lime : l.trim().endsWith("/") ? N.white : "C9CCC8", align: "left", valign: "middle", margin: 0, isTextBox: true });
    });
    const rx = M + tw + 0.4, rw = W - M - rx, icons = ["LuPackage", "LuPenLine", "LuZap", "LuRocket"];
    T.skills.steps.forEach((st, i) => {
      const y = ty + i * 0.82;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: rx, y, w: rw, h: 0.7, fill: { color: i % 2 ? N.soft : N.tint }, line: { color: i % 2 ? N.soft : N.tint }, rectRadius: 0.1 });
      dot(s, rx + 0.18, y + 0.12, 0.46, BR.green);
      ico(s, icons[i], "000000", { x: rx + 0.29, y: y + 0.23, w: 0.24, h: 0.24 });
      text(s, st[0], { x: rx + 0.8, y, w: 1.6, h: 0.7, size: 16, bold: true, font: "head", valign: "middle" });
      text(s, st[1], { x: rx + 2.4, y, w: rw - 2.6, h: 0.7, size: 13.5, valign: "middle", color: "3C3E3B" });
    });
    outBox(s, "", T.skills.out, 6.12);
    s.addNotes("Skill locations follow Claude Code's documentation: .claude/skills in the project, ~/.claude/skills for personal skills. Ready-made skills come from plugin marketplaces via the /plugin command.");
  }

  // 10. Research & content
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.research.kicker, T.research.title);
    const cw = (W - 2 * M - 2 * 0.3) / 3, icons = ["LuSearch", "LuPenLine", "LuCalendarDays"];
    for (let i = 0; i < 3; i++) {
      const c = T.research.cols[i], x = M + i * (cw + 0.3), y = 1.95, h = 3.95;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, fill: { color: i === 1 ? BR.black : N.soft }, line: { color: i === 1 ? BR.black : N.soft }, rectRadius: 0.12 });
      dot(s, x + 0.3, y + 0.3, 0.7, i === 1 ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: x + 0.47, y: y + 0.47, w: 0.36, h: 0.36 });
      if (i < 2) await ico(s, AR ? "LuChevronLeft" : "LuChevronRight", BR.green, { x: x + cw + 0.02, y: y + h / 2 - 0.13, w: 0.26, h: 0.26 });
      text(s, c[0], { x: x + 1.15, y: y + 0.38, w: cw - 1.4, h: 0.55, size: 20, bold: true, font: "head", color: i === 1 ? N.white : N.ink });
      const ey = chipRow(s, c[1], x + 0.3, y + 1.25, 0.4, i === 1 ? "dark" : "white", x + cw - 0.3, 12);
      text(s, c[2], { x: x + 0.3, y: ey + 0.25, w: cw - 0.6, h: 1.4, size: 14, color: i === 1 ? "D6D8D4" : "3C3E3B", lsm: 1.03 });
    }
    outBox(s, "", T.research.out, 6.12);
    s.addNotes("Research tools return sources; participants are taught to open and check them. NotebookLM works only from the sources the participant adds.");
  }

  // 11. Design & images
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.design.kicker, T.design.title);
    const cw = (W - 2 * M - 3 * 0.3) / 4, icons = ["LuSparkles", "LuUserRound", "LuWandSparkles", "LuPalette"];
    for (let i = 0; i < 4; i++) {
      const st = T.design.steps[i], x = M + i * (cw + 0.3), y = 1.95, h = 3.95;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, fill: { color: i === 3 ? BR.black : N.tint }, line: { color: i === 3 ? BR.black : N.tint }, rectRadius: 0.12 });
      text(s, String(i + 1).padStart(2, "0"), { x: x + 0.3, y: y + 0.25, w: 1, h: 0.5, size: 26, bold: true, font: "head", color: i === 3 ? BR.lime : BR.green });
      await ico(s, icons[i], i === 3 ? BR.lime : "000000", { x: x + cw - 0.75, y: y + 0.3, w: 0.42, h: 0.42 });
      text(s, st[0], { x: x + 0.3, y: y + 0.95, w: cw - 0.6, h: 0.45, size: 19, bold: true, font: "head", color: i === 3 ? N.white : N.ink });
      text(s, st[1], { x: x + 0.3, y: y + 1.45, w: cw - 0.6, h: 0.8, size: 14, color: i === 3 ? "D6D8D4" : "3C3E3B" });
      st[2].forEach((tl, j) => toolChip(s, tl, { x: x + 0.3, y: y + 2.35 + j * 0.48, w: cw - 0.6, h: 0.4, size: 12, center: true }, i === 3 ? "dark" : "white"));
    }
    outBox(s, "", T.design.out, 6.12);
    s.addNotes("Image tools change fast; the program teaches the prompting and consistency techniques that carry across tools.");
  }

  // 12. Video, editing & motion
  {
    const s = newSlide(true); footer(s, n, true); darkLogo(s);
    kickerTitle(s, T.video.kicker, T.video.title, true);
    const icons = ["LuFileText", "LuClapperboard", "LuScissors", "LuSparkles", "LuFileCode"];
    const k = T.video.steps.length, sw = (W - 2 * M) / k;
    for (let i = 0; i < k; i++) {
      const x = M + i * sw, cx = x + sw / 2, d = 1.0, y = 2.05;
      if (i < k - 1) await ico(s, AR ? "LuChevronLeft" : "LuChevronRight", BR.gray, { x: x + sw - 0.2, y: y + d / 2 - 0.2, w: 0.4, h: 0.4 });
      shape(s, pres.shapes.OVAL, { x: cx - d / 2, y, w: d, h: d, fill: { color: i % 2 ? BR.lime : BR.green }, line: { color: i % 2 ? BR.lime : BR.green } });
      await ico(s, icons[i], "000000", { x: cx - 0.25, y: y + 0.25, w: 0.5, h: 0.5 });
      text(s, T.video.steps[i][0], { x: x + 0.1, y: y + d + 0.2, w: sw - 0.2, h: 0.42, size: 17, bold: true, color: N.white, align: "center", font: "head" });
      text(s, T.video.steps[i][1], { x: x + 0.12, y: y + d + 0.65, w: sw - 0.24, h: 0.85, size: 13, color: "C9CCC8", align: "center", lsm: 1.0 });
      text(s, T.video.steps[i][2], { ltr: true, x: x + 0.1, y: y + d + 1.6, w: sw - 0.2, h: 0.5, size: 12, bold: true, color: BR.lime, align: "center" });
    }
    outBox(s, "", T.video.out, 5.75, true);
    s.addNotes("Generated shots are only the raw material. Most of the hands-on time goes to planning, editing and finishing, where judgment matters.");
  }

  // 13. Voice & audio
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.audio.kicker, T.audio.title);
    const icons = ["LuMic", "LuAudioLines", "LuMusic", "LuWaves"];
    const cw = (W - 2 * M - 0.3) / 2, ch = 1.85;
    for (let i = 0; i < 4; i++) {
      const it = T.audio.items[i], c = i % 2, r = Math.floor(i / 2), x = M + c * (cw + 0.3), y = 1.95 + r * (ch + 0.22);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: i === 0 ? BR.black : N.soft }, line: { color: i === 0 ? BR.black : N.soft }, rectRadius: 0.12 });
      dot(s, x + 0.3, y + 0.32, 0.72, i === 0 ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: x + 0.48, y: y + 0.5, w: 0.36, h: 0.36 });
      text(s, it[0], { x: x + 1.25, y: y + 0.25, w: cw - 1.5, h: 0.45, size: 19, bold: true, font: "head", color: i === 0 ? N.white : N.ink });
      text(s, it[1], { x: x + 1.25, y: y + 0.72, w: cw - 1.5, h: 0.65, size: 14, color: i === 0 ? "D6D8D4" : "3C3E3B", lsm: 1.0 });
      let cx = x + 1.25; it[2].split(" · ").forEach((tl) => { cx += toolChip(s, tl, { x: cx, y: y + 1.38, h: 0.36, size: 11.5 }, i === 0 ? "dark" : "white") + 0.1; });
    }
    outBox(s, "", T.audio.out, 6.12);
    s.addNotes("ElevenLabs covers text to speech, voice design, sound effects and music. Participants clone or imitate no real person's voice without consent.");
  }

  // 14. n8n
  {
    const s = newSlide(true); footer(s, n, true); darkLogo(s);
    kickerTitle(s, T.n8n.kicker, T.n8n.title, true);
    const icons = ["LuZap", "LuCog", "LuSparkles", "LuSave"], bw = (W - 2 * M - 3 * 0.45) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (bw + 0.45), y = 1.95;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: 1.15, fill: { color: i === 2 ? BR.green : N.panel }, line: { color: i === 2 ? BR.green : BR.lime, width: 1.25 }, rectRadius: 0.12 });
      await ico(s, icons[i], i === 2 ? "000000" : BR.lime, { x: x + 0.25, y: y + 0.32, w: 0.5, h: 0.5 });
      text(s, T.n8n.core[i][0], { x: x + 0.9, y: y + 0.17, w: bw - 1.0, h: 0.45, size: AR ? 16 : 18, bold: true, color: i === 2 ? BR.black : N.white, font: "head" });
      text(s, T.n8n.core[i][1], { x: x + 0.9, y: y + 0.62, w: bw - 1.0, h: 0.45, size: 12.5, color: i === 2 ? BR.black : "C9CCC8" });
      if (i < 3) await ico(s, AR ? "LuArrowLeft" : "LuArrowRight", BR.lime, { x: x + bw + 0.06, y: y + 0.4, w: 0.33, h: 0.33 });
    }
    text(s, T.n8n.flowTitle, { x: M, y: 3.42, w: 9, h: 0.4, size: 15, bold: true, color: BR.lime, font: "head" });
    const fl = T.n8n.flow, fw = [1.3, 1.3, 1.55, 3.3, 2.0, 1.75];
    const gap = (W - 2 * M - fw.reduce((a, b) => a + b, 0)) / (fl.length - 1);
    let fx = M;
    for (let i = 0; i < fl.length; i++) {
      const isN = i === 1, isAI = i === 2, isS = i === 4;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: fx, y: 3.92, w: fw[i], h: 0.8, fill: { color: isN ? N.panel : isAI ? BR.green : N.white }, line: { color: isN ? "EA4B71" : isAI ? BR.green : N.white, width: 1.25 }, rectRadius: 0.1 });
      if (isN || isS) {
        const mp = markPath(isN ? "n8n" : "Google Sheets", isN);
        s.addImage({ path: mp, x: X(fx + 0.14, 0.42), y: 4.11, w: 0.42, h: 0.42, altText: fl[i] + " logo" });
        text(s, fl[i], { ltr: true, x: fx + 0.62, y: 3.92, w: fw[i] - 0.7, h: 0.8, size: 13.5, bold: true, color: isN ? N.white : BR.black, valign: "middle" });
      } else text(s, fl[i], { ltr: i === 2, x: fx + 0.08, y: 3.92, w: fw[i] - 0.16, h: 0.8, size: 13.5, bold: true, color: BR.black, align: "center", valign: "middle" });
      if (i < fl.length - 1) await ico(s, AR ? "LuChevronLeft" : "LuChevronRight", BR.lime, { x: fx + fw[i] + gap / 2 - 0.13, y: 4.19, w: 0.26, h: 0.26 });
      fx += fw[i] + gap;
    }
    let cx = M, cy = 5.1;
    for (const c of T.n8n.concepts) { const w = c.length * (AR ? 0.09 : 0.095) + 0.45; if (cx + w > W - M) { cx = M; cy += 0.55; } chip(s, c, { x: cx, y: cy, w, h: 0.42, size: 12 }, "dark"); cx += w + 0.15; }
    text(s, T.n8n.note, { x: M, y: 6.25, w: W - 2 * M, h: 0.5, size: 14, color: "C9CCC8" });
    s.addNotes("n8n's Form Trigger, AI Agent and Google Sheets nodes are standard nodes. Trainers set up the credentials; participants learn what API keys and OAuth are and why they stay private.");
  }

  // 15. Mini projects
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.mini.kicker, T.mini.title);
    const mods = MODULES.slice(0, 10), cw = (W - 2 * M - 4 * 0.2) / 5, ch = 1.85;
    mods.forEach((m, i) => {
      const c = i % 5, r = Math.floor(i / 5), x = M + c * (cw + 0.2), y = 1.95 + r * (ch + 0.2);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: (c + r) % 2 ? N.soft : N.tint }, line: { color: (c + r) % 2 ? N.soft : N.tint }, rectRadius: 0.1 });
      text(s, String(i + 1).padStart(2, "0"), { x: x + 0.22, y: y + 0.15, w: 0.9, h: 0.5, size: 24, bold: true, color: BR.green, font: "head" });
      text(s, `${m.id} · ${m[LANG].short}`, { x: x + 0.22, y: y + 0.65, w: cw - 0.4, h: 0.32, size: 11, bold: true, color: BR.gray });
      text(s, m[LANG].project[0], { x: x + 0.22, y: y + 0.98, w: cw - 0.4, h: 0.8, size: 15, bold: true, font: "head", lsm: 0.95 });
    });
    const fy = 1.95 + 2 * (ch + 0.2);
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: fy, w: W - 2 * M, h: 0.75, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.1 });
    await ico(s, "LuAward", BR.lime, { x: M + 0.3, y: fy + 0.19, w: 0.38, h: 0.38 });
    text(s, T.mini.final, { x: M + 0.85, y: fy, w: 3, h: 0.75, size: 17, bold: true, color: BR.lime, valign: "middle", font: "head" });
    text(s, T.mini.finalD, { x: M + 3.6, y: fy, w: W - 2 * M - 3.9, h: 0.75, size: 14, color: N.white, valign: "middle" });
    s.addNotes("Every module ends with a mini project the participant completes and keeps. Theory is never more than about a third of any session.");
  }

  // 16. Final project
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.final.kicker, T.final.title);
    const lw = 4.0;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.95, w: lw, h: 4.85, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.12 });
    await ico(s, "LuRocket", BR.lime, { x: M + 0.35, y: 2.25, w: 0.6, h: 0.6 });
    text(s, T.final.intro, { x: M + 0.35, y: 3.05, w: lw - 0.7, h: 2.0, size: 16, color: N.white, lsm: 1.05 });
    const m11 = MODULES[10];
    const facts = AR ? ["فرق من 3 إلى 4 مشاركين", `${m11.sessions.length} جلسات · ${m11.T + m11.P} ساعة`, "يُعرض في يوم العرض"] : ["Teams of 3–4 participants", `${m11.sessions.length} sessions · ${m11.T + m11.P} hours`, "Presented on Demo Day"];
    facts.forEach((f, i) => { ico(s, "LuCheck", BR.lime, { x: M + 0.35, y: 5.05 + i * 0.5 + 0.06, w: 0.28, h: 0.28 }); text(s, f, { x: M + 0.8, y: 5.05 + i * 0.5, w: lw - 1.1, h: 0.4, size: 14, bold: true, color: N.white, valign: "middle" }); });
    const icons = ["LuSearch", "LuFileText", "LuPalette", "LuFilm", "LuSparkles", "LuGlobe", "LuPuzzle", "LuWorkflow", "LuBriefcase", "LuPresentation"];
    const gx = M + lw + 0.35, cw = (W - M - gx - 0.25) / 2;
    T.final.items.forEach((it, i) => {
      const c = Math.floor(i / 5), r = i % 5, x = gx + c * (cw + 0.25), y = 1.95 + r * 0.99;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: 0.85, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.1 });
      dot(s, x + 0.18, y + 0.15, 0.55, i % 2 ? BR.lime : BR.green);
      ico(s, icons[i], "000000", { x: x + 0.31, y: y + 0.28, w: 0.29, h: 0.29 });
      text(s, it, { x: x + 0.95, y, w: cw - 1.1, h: 0.85, size: 15, bold: true, valign: "middle", font: "head" });
    });
    s.addNotes("The final project is the proof point for funders: each team shows one idea turned into a complete, published content package using the tools from every module.");
  }

  // 17. Format & results
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.format.kicker, T.format.title);
    const icons = ["LuCalendarDays", "LuClock", "LuUsers", "LuLaptop", "LuGraduationCap", "LuBadgeCheck"];
    T.format.facts.forEach((f, i) => {
      const y = 2.0 + i * 0.78;
      dot(s, M, y, 0.52, BR.green);
      ico(s, icons[i], "000000", { x: M + 0.13, y: y + 0.13, w: 0.26, h: 0.26 });
      text(s, f[0], { x: M + 0.7, y: y - 0.04, w: 4.6, h: 0.3, size: 13, bold: true, color: BR.gray });
      text(s, f[1], { x: M + 0.7, y: y + 0.25, w: 4.8, h: 0.35, size: 15, bold: true, font: "head" });
    });
    const rx = 6.6, rw = W - M - rx;
    text(s, T.format.resTitle, { x: rx, y: 1.95, w: rw, h: 0.4, size: 16, bold: true, font: "head" });
    const cw = (rw - 0.25) / 2, ch = 2.0;
    T.format.res.forEach((r, i) => {
      const c = i % 2, rr = Math.floor(i / 2), x = rx + c * (cw + 0.25), y = 2.5 + rr * (ch + 0.25);
      const hi = i === 2;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: hi ? BR.black : N.tint }, line: { color: hi ? BR.black : N.tint }, rectRadius: 0.12 });
      text(s, r[0], { ltr: true, x: x + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.95, size: 46, bold: true, color: hi ? BR.lime : BR.black, font: "head", valign: "bottom" });
      text(s, r[1], { x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: 0.7, size: 14, color: hi ? N.white : "3C3E3B", lsm: 1.0 });
    });
    s.addNotes("All targets are proposals for agreement with the funder. The skills assessment is the same practical test at the start and end of the program.");
  }

  // 18. Closing
  {
    const s = newSlide(true); footer(s, n, true);
    const lw = 3.0, lh = lw / LOGO_R;
    s.addImage({ path: LOGO, x: AR ? W - M - lw : M - 0.08, y: 0.5, w: lw, h: lh, altText: "Green Circle logo" });
    text(s, T.close.kicker, { x: M, y: 1.9, w: 9, h: 0.3, size: 12, bold: true, color: BR.lime, charSpacing: 2 });
    text(s, T.close.title, { x: M, y: 2.25, w: 10, h: 0.8, size: 32, bold: true, color: N.white, font: "head" });
    const cw = (W - 2 * M - 2 * 0.35) / 3, icons = ["LuBriefcase", "LuCompass", "LuShieldCheck"];
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.35), y = 3.5, v = T.close.values[i];
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: 2.75, fill: { color: N.panel }, line: { color: "3A3D39", width: 0.75 }, rectRadius: 0.12 });
      await ico(s, icons[i], i % 2 ? BR.green : BR.lime, { x: x + 0.35, y: y + 0.35, w: 0.55, h: 0.55 });
      text(s, v[0], { x: x + 0.35, y: y + 1.05, w: cw - 0.7, h: 0.5, size: 22, bold: true, color: i % 2 ? BR.green : BR.lime, font: "head" });
      text(s, v[1], { x: x + 0.35, y: y + 1.6, w: cw - 0.7, h: 1.0, size: 15, color: "D6D8D4", lsm: 1.05 });
    }
    s.addNotes("Close on what participants keep: a portfolio, a working toolkit and secure habits.");
  }

  await Promise.all(PENDING);
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, "slides:", n);
}
build().catch((e) => { console.error(e); process.exit(1); });
