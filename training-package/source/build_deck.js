// Builds the Concept Note deck: node build_deck.js en|ar <out.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const { icon } = require("./icons");
const MODULES = require("./data_modules");
const SESSIONS = require("./data_sessions");
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
  if (Array.isArray(t)) {
    t = t.map((r) => ({ text: r.text, options: Object.assign({ lang: LCODE }, AR ? { rtlMode: true } : {}, r.options || {}) }));
  }
  slide.addText(t, opts);
}
function shape(slide, type, o) {
  const opts = Object.assign({}, o, { x: X(o.x, o.w) });
  if (AR && o.flipForRtl) { opts.flipH = !o.flipH; }
  delete opts.flipForRtl;
  slide.addShape(type, opts);
}
async function ico(slide, name, color, o) {
  const i = await icon(name, "#" + color);
  slide.addImage({ data: i.b64, x: X(o.x, o.w), y: o.y, w: o.w, h: o.h });
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

const trackColor = { foundation: BR.gray, create: BR.green, produce: BR.lime, market: BR.black, automate: BR.green, launch: BR.lime, capstone: BR.black };
const trackText = (k) => (["market", "capstone", "foundation"].includes(k) ? N.white : N.ink);

let n = 0;
function newSlide(dark) {
  n += 1;
  const s = pres.addSlide({ masterName: dark ? "DARK" : "LIGHT" });
  return s;
}

pres.defineSlideMaster({ title: "LIGHT", background: { color: N.white } });
pres.defineSlideMaster({ title: "DARK", background: { color: BR.black } });

async function build() {
  // ---------- 1. Cover ----------
  {
    const s = newSlide(true);
    const lw = 4.3, lh = lw / LOGO_R;
    s.addImage({ path: LOGO, x: AR ? W - M - lw : M - 0.12, y: 0.55, w: lw, h: lh, altText: "Green Circle logo" });
    text(s, T.cover.kicker, { x: M, y: 2.45, w: 6.9, h: 0.3, size: 12, bold: true, color: BR.lime, charSpacing: 2 });
    text(s, T.cover.title, { x: M, y: 2.85, w: 6.9, h: 2.2, size: AR ? 32 : 34, bold: true, color: N.white, font: "head", lsm: AR ? 1.0 : 0.92 });
    text(s, T.cover.sub, { x: M, y: 5.15, w: 6.6, h: 0.9, size: 16, color: "D6D8D4", lsm: 1.05 });
    text(s, T.cover.note, { x: M, y: 6.55, w: 6.6, h: 0.3, size: 11, italic: !AR, color: "8A8C88" });
    // Journey ring: eight stages around the capstone
    const cx = AR ? 3.25 : W - 3.25, cy = 4.0, R = 2.15;
    s.addShape(pres.shapes.OVAL, { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, fill: { color: BR.black, transparency: 100 }, line: { color: "2F332E", width: 1.25, dashType: "dash" } });
    const stages = T.cover.ring;
    for (let i = 0; i < stages.length; i++) {
      const ang = (-90 + (AR ? -1 : 1) * i * 45) * Math.PI / 180;
      const px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang);
      const d = 0.34;
      const c = i % 2 ? BR.lime : BR.green;
      s.addShape(pres.shapes.OVAL, { x: px - d / 2, y: py - d / 2, w: d, h: d, fill: { color: c }, line: { color: c, width: 0.5 } });
      const lx = Math.cos(ang) >= 0.2 ? px + 0.28 : Math.cos(ang) <= -0.2 ? px - 0.28 - 1.6 : px - 0.8;
      const ly = Math.abs(Math.cos(ang)) < 0.2 ? (Math.sin(ang) < 0 ? py - 0.62 : py + 0.26) : py - 0.18;
      const al = Math.cos(ang) >= 0.2 ? "left" : Math.cos(ang) <= -0.2 ? "right" : "center";
      s.addText(stages[i], { x: lx, y: ly, w: 1.6, h: 0.36, fontFace: FONT.body, fontSize: 13, color: N.white, align: al, valign: "middle", margin: 0, isTextBox: true, lang: LCODE, rtlMode: AR });
    }
    s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: cy - 0.95, w: 1.9, h: 1.9, fill: { color: BR.green }, line: { color: BR.green } });
    s.addText(T.cover.center, { x: cx - 0.9, y: cy - 0.5, w: 1.8, h: 1.0, fontFace: FONT.head, fontSize: AR ? 15 : 16, bold: true, color: BR.black, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LCODE, rtlMode: AR });
    s.addNotes("Open with the one-sentence promise: in 96 hours, students go from a client's idea to a published, measured campaign. The ring shows the stages they will pass through; the capstone ties them together.");
  }

  // ---------- 2. Why ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.why.kicker, T.why.title);
    const cA = { x: M, w: 5.45 }, cB = { x: 6.88, w: 5.85 }, y0 = 2.05;
    text(s, T.why.left, { x: cA.x, y: y0, w: cA.w, h: 0.4, size: 15, bold: true, color: BR.gray, font: "head" });
    text(s, T.why.right, { x: cB.x, y: y0, w: cB.w, h: 0.4, size: 15, bold: true, color: N.ink, font: "head" });
    for (let i = 0; i < T.why.rows.length; i++) {
      const y = 2.58 + i * 0.95, h = 0.8;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: cA.x, y, w: cA.w, h, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.08 });
      text(s, T.why.rows[i][0], { x: cA.x + 0.25, y, w: cA.w - 0.5, h, size: 15, color: "4A4C49", valign: "middle" });
      await ico(s, AR ? "LuArrowLeft" : "LuArrowRight", BR.green, { x: 6.18, y: y + 0.2, w: 0.42, h: 0.42 });
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: cB.x, y, w: cB.w, h, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.08 });
      dot(s, cB.x + 0.25, y + 0.31, 0.18, BR.lime);
      text(s, T.why.rows[i][1], { x: cB.x + 0.6, y, w: cB.w - 0.85, h, size: 15, color: N.white, valign: "middle", bold: true });
    }
    text(s, T.why.foot, { x: M, y: 6.48, w: 12.1, h: 0.35, size: 11, italic: !AR, color: BR.gray });
    s.addNotes("Frame the gap without statistics: the starting point is our working assumption and the pre-assessment will confirm it. The right-hand column is the program's promise, and every row maps to a module and a deliverable.");
  }

  // ---------- 3. Audience ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.audience.kicker, T.audience.title);
    const g = T.audience.groups;
    for (let i = 0; i < 2; i++) {
      const x = M + i * 4.3, y = 2.05, w = 4.05, h = 4.75;
      const dark = i === 0;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: dark ? BR.black : N.tint }, line: { color: dark ? BR.black : N.tint }, rectRadius: 0.12 });
      text(s, g[i].age, { ltr: true, x: x + 0.35, y: y + 0.3, w: 3.4, h: 0.9, size: 46, bold: true, color: dark ? BR.lime : N.ink, font: "head" });
      text(s, g[i].label, { x: x + 0.35, y: y + 1.2, w: 3.4, h: 0.4, size: 15, bold: true, color: dark ? N.white : "3C3E3B" });
      text(s, bullets(g[i].pts, { psa: 8 }), { x: x + 0.35, y: y + 1.8, w: 3.4, h: 2.8, size: 14, color: dark ? "E4E6E2" : N.ink, lsm: 1.0 });
    }
    const sx = 9.3, sw = 3.43;
    const icons = ["LuGraduationCap", "LuUsers", "LuMessagesSquare"];
    for (let i = 0; i < T.audience.side.length; i++) {
      const y = 2.15 + i * 1.6;
      dot(s, sx, y, 0.62, BR.green);
      await ico(s, icons[i], "000000", { x: sx + 0.14, y: y + 0.14, w: 0.34, h: 0.34 });
      text(s, T.audience.side[i][0], { x: sx + 0.8, y: y - 0.02, w: sw - 0.8, h: 0.35, size: 15, bold: true, font: "head" });
      text(s, T.audience.side[i][1], { x: sx + 0.8, y: y + 0.36, w: sw - 0.8, h: 1.0, size: 14, color: "3C3E3B" });
    }
    s.addNotes("Same curriculum for everyone. The difference between the two groups is tool access, set by each tool's own age rules, and how real-client practice is arranged.");
  }

  // ---------- 4. At a glance ----------
  {
    const s = newSlide(true); footer(s, n, true);
    const lw = 1.55, lh = lw / LOGO_R; s.addImage({ path: LOGO, x: AR ? M : W - M - lw, y: 0.42, w: lw, h: lh });
    kickerTitle(s, T.glance.kicker, T.glance.title, true);
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = M + col * 4.1, y = 2.2 + row * 2.1;
      text(s, T.glance.stats[i][0], { x, y, w: 3.8, h: 1.15, size: 64, bold: true, color: i % 2 ? BR.green : BR.lime, font: "head", valign: "bottom" });
      text(s, T.glance.stats[i][1], { x, y: y + 1.2, w: 3.8, h: 0.45, size: 17, color: N.white });
    }
    text(s, T.glance.foot, { x: M, y: 6.55, w: 12, h: 0.3, size: 11, italic: !AR, color: "8A8C88" });
    s.addNotes("96 hours = 32 sessions of 3 hours, three sessions a week for 11 weeks, plus one buffer week for make-ups and Demo Day logistics. Theory is 28.5 hours and practice 67.5 hours, roughly 30/70.");
  }

  // ---------- 5. Journey ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.journey.kicker, T.journey.title);
    text(s, T.journey.note, { x: M, y: 1.55, w: 10, h: 0.4, size: 15, color: "3C3E3B" });
    const steps = T.journey.steps, d = 0.6, cols = 6, gx = (W - 2 * M - d) / (cols - 1);
    const rows = [2.3, 3.95, 5.6];
    const pos = steps.map((_, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const cc = r % 2 === 0 ? c : cols - 1 - c;
      return { x: M + cc * gx, y: rows[r] };
    });
    for (let i = 0; i < steps.length - 1; i++) {
      const a = pos[i], b = pos[i + 1];
      if (a.y === b.y) shape(s, pres.shapes.LINE, { x: Math.min(a.x, b.x) + d, y: a.y + d / 2, w: Math.abs(b.x - a.x) - d, h: 0, line: { color: N.dim, width: 2, dashType: "dash" } });
      else shape(s, pres.shapes.LINE, { x: a.x + d / 2, y: a.y + d + 0.5, w: 0, h: b.y - a.y - d - 0.55, line: { color: N.dim, width: 2, dashType: "dash" } });
    }
    for (let i = 0; i < steps.length; i++) {
      const p = pos[i], last = i === steps.length - 1;
      const c = last ? BR.black : i < 4 ? BR.gray : i % 2 ? BR.lime : BR.green;
      const dd = last ? 0.74 : d, off = last ? -0.07 : 0;
      shape(s, pres.shapes.OVAL, { x: p.x + off, y: p.y + off, w: dd, h: dd, fill: { color: c }, line: { color: last ? BR.lime : c, width: last ? 2.5 : 0.5 } });
      text(s, String(i + 1), { x: p.x + off, y: p.y + off, w: dd, h: dd, size: 15, bold: true, color: c === BR.lime || c === BR.green ? BR.black : N.white, align: "center", valign: "middle", font: "head" });
      // labels: below the dot (inner rows) – the gap between rows is fixed
      text(s, steps[i], { x: p.x + d / 2 - 1.05, y: p.y + d + 0.08, w: 2.1, h: 0.38, size: 14, bold: last, color: N.ink, align: "center", lsm: 0.95 });
    }
    s.addNotes("Walk the path left to right, then back. The first four grey steps are the foundation; everything after is production, marketing, automation and launch, ending in the capstone.");
  }

  // ---------- 6. Tracks ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.tracks.kicker, T.tracks.title);
    const hrs = {};
    for (const m of MODULES) hrs[m.track] = (hrs[m.track] || 0) + m.T + m.P;
    const total = Object.values(hrs).reduce((a, b) => a + b, 0);
    let x = M; const bw = W - 2 * M, by = 1.95;
    for (const it of T.tracks.items) {
      const w = bw * hrs[it.k] / total;
      shape(s, pres.shapes.RECTANGLE, { x, y: by, w: w - 0.04, h: 0.55, fill: { color: trackColor[it.k] }, line: { color: trackColor[it.k] } });
      text(s, `${hrs[it.k]}${AR ? "" : "h"}`, { x, y: by, w: w - 0.04, h: 0.55, size: 14, bold: true, color: trackText(it.k), align: "center", valign: "middle", font: "head" });
      x += w;
    }
    const cw = (bw - 3 * 0.25) / 4, ch = 1.85;
    T.tracks.items.forEach((it, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const cx = M + col * (cw + 0.25), cy = 2.8 + row * (ch + 0.22);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w: cw, h: ch, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.1 });
      dot(s, cx + 0.22, cy + 0.27, 0.26, trackColor[it.k]);
      text(s, it.name, { x: cx + 0.62, y: cy + 0.16, w: cw - 0.8, h: 0.45, size: 17, bold: true, font: "head" });
      text(s, AR ? `${hrs[it.k]} ${T.tracks.hoursLabel} · ${it.mods}` : `${it.mods} · ${hrs[it.k]} ${T.tracks.hoursLabel}`, { x: cx + 0.22, y: cy + 0.62, w: cw - 0.4, h: 0.3, size: 12, bold: true, color: BR.gray });
      text(s, it.desc, { x: cx + 0.22, y: cy + 0.95, w: cw - 0.4, h: 0.85, size: 13, color: "3C3E3B", lsm: 1.0 });
    });
    const tx = M + 3 * (cw + 0.25), ty = 2.8 + ch + 0.22;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: tx, y: ty, w: cw, h: ch, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.1 });
    text(s, String(total), { x: tx + 0.25, y: ty + 0.2, w: cw - 0.5, h: 0.95, size: 54, bold: true, color: BR.lime, font: "head" });
    text(s, AR ? "ساعة تدريبية في المجموع" : "training hours in total", { x: tx + 0.25, y: ty + 1.2, w: cw - 0.5, h: 0.4, size: 15, color: N.white });
    s.addNotes("The bar is drawn to scale. Production (characters, voice, video) is the largest block because it is the most hands-on and tool-heavy part of the program.");
  }

  // ---------- 7. Content ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.content.kicker, T.content.title);
    text(s, T.content.body, { x: M, y: 2.0, w: 5.6, h: 1.45, size: 16, color: "2E302D", lsm: 1.05 });
    const sk = T.content.skills;
    for (let i = 0; i < sk.length; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      chip(s, sk[i], { x: M + col * 2.85, y: 3.65 + row * 0.62, w: 2.7, h: 0.48, size: 13 }, row === 0 ? "black" : "light");
    }
    text(s, T.content.tools, { x: M, y: 5.7, w: 5.6, h: 0.35, size: 13, bold: true, color: BR.gray });
    // one idea -> three outputs
    const ix = 6.75, iy = 3.25, idd = 1.7;
    shape(s, pres.shapes.OVAL, { x: ix, y: iy, w: idd, h: idd, fill: { color: BR.black }, line: { color: BR.black } });
    await ico(s, "LuLightbulb", BR.lime, { x: ix + idd / 2 - 0.25, y: iy + 0.3, w: 0.5, h: 0.5 });
    text(s, T.content.idea, { x: ix + 0.1, y: iy + 0.85, w: idd - 0.2, h: 0.5, size: 16, bold: true, color: N.white, align: "center", font: "head" });
    const outIcons = ["LuMonitorPlay", "LuLayers", "LuMessageSquare"];
    for (let i = 0; i < 3; i++) {
      const oy = 2.1 + i * 1.45, ox = 9.4, ow = 3.33, oh = 1.2;
      shape(s, pres.shapes.LINE, { x: ix + idd, y: Math.min(iy + idd / 2, oy + oh / 2), w: ox - ix - idd, h: Math.abs(oy + oh / 2 - (iy + idd / 2)), line: { color: BR.green, width: 2 }, flipV: oy + oh / 2 < iy + idd / 2, flipForRtl: true });
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: ox, y: oy, w: ow, h: oh, fill: { color: N.tint }, line: { color: N.tint }, rectRadius: 0.1 });
      await ico(s, outIcons[i], "000000", { x: ox + 0.22, y: oy + 0.22, w: 0.4, h: 0.4 });
      text(s, T.content.outs[i][0], { x: ox + 0.75, y: oy + 0.15, w: ow - 0.95, h: 0.45, size: 16, bold: true, font: "head" });
      text(s, T.content.outs[i][1], { x: ox + 0.75, y: oy + 0.6, w: ow - 0.95, h: 0.5, size: 13, color: "3C3E3B" });
    }
    s.addNotes("The diagram shows the core habit we teach: one well-briefed idea becomes several formats. Students edit every AI draft; nothing is published as generated.");
  }

  // ---------- 8. Video ----------
  {
    const s = newSlide(true); footer(s, n, true);
    const lw = 1.55, lh = lw / LOGO_R; s.addImage({ path: LOGO, x: AR ? M : W - M - lw, y: 0.42, w: lw, h: lh });
    kickerTitle(s, T.video.kicker, T.video.title, true);
    const icons = ["LuUserRound", "LuMic", "LuFileText", "LuLayoutPanelTop", "LuClapperboard", "LuScissors"];
    const n6 = 6, sw = (W - 2 * M) / n6;
    for (let i = 0; i < n6; i++) {
      const x = M + i * sw, cx = x + sw / 2, d = 1.05, y = 2.2;
      if (i < n6 - 1) await ico(s, AR ? "LuChevronLeft" : "LuChevronRight", BR.gray, { x: x + sw - 0.2, y: y + d / 2 - 0.2, w: 0.4, h: 0.4 });
      shape(s, pres.shapes.OVAL, { x: cx - d / 2, y, w: d, h: d, fill: { color: i % 2 ? BR.lime : BR.green }, line: { color: i % 2 ? BR.lime : BR.green } });
      await ico(s, icons[i], "000000", { x: cx - 0.26, y: y + d / 2 - 0.26, w: 0.52, h: 0.52 });
      text(s, String(i + 1).padStart(2, "0"), { x: cx - 0.8, y: y + d + 0.15, w: 1.6, h: 0.3, size: 11, bold: true, color: BR.lime, align: "center" });
      text(s, T.video.steps[i][0], { x: cx - 1.0, y: y + d + 0.45, w: 2.0, h: 0.42, size: 17, bold: true, color: N.white, align: "center", font: "head" });
      text(s, T.video.steps[i][1], { x: cx - 0.98, y: y + d + 0.92, w: 1.96, h: 0.8, size: 13, color: "C9CCC8", align: "center", lsm: 1.0 });
    }
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.25, w: W - 2 * M, h: 1.05, fill: { color: N.panel }, line: { color: "3A3D39", width: 0.75 }, rectRadius: 0.1 });
    await ico(s, "LuShieldCheck", BR.lime, { x: M + 0.3, y: 5.53, w: 0.48, h: 0.48 });
    text(s, T.video.note, { x: M + 1.0, y: 5.25, w: W - 2 * M - 1.3, h: 1.05, size: 14, color: N.white, valign: "middle", lsm: 1.0 });
    text(s, T.video.tools, { x: M, y: 6.48, w: W - 2 * M, h: 0.35, size: 12, bold: true, color: BR.lime });
    s.addNotes("Google Flow requires users to be 18+ with age verification, a supported region and an eligible Google AI plan (Flow Help Center). Video generation in the Gemini app is also 18+. Under-18s still complete every step; only the generation step is demonstrated by the trainer.");
  }

  // ---------- 9. Marketing ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.marketing.kicker, T.marketing.title);
    const icons = ["LuUserRound", "LuTarget", "LuCalendarDays", "LuMegaphone"];
    for (let i = 0; i < 4; i++) {
      const y = 2.0 + i * 1.17;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 5.3, h: 0.95, fill: { color: i === 3 ? BR.black : N.soft }, line: { color: i === 3 ? BR.black : N.soft }, rectRadius: 0.1 });
      dot(s, M + 0.2, y + 0.18, 0.6, i === 3 ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: M + 0.33, y: y + 0.31, w: 0.34, h: 0.34 });
      text(s, T.marketing.blocks[i][0], { x: M + 1.0, y: y + 0.1, w: 4.1, h: 0.4, size: 17, bold: true, font: "head", color: i === 3 ? N.white : N.ink });
      text(s, T.marketing.blocks[i][1], { x: M + 1.0, y: y + 0.5, w: 4.15, h: 0.4, size: 13.5, color: i === 3 ? "D6D8D4" : "3C3E3B" });
    }
    // calendar
    const gx = 6.4, gw = W - M - gx, cols = 7, labW = 0.55, cw = (gw - labW) / cols, chh = 0.62, gy = 2.5;
    text(s, T.marketing.calTitle, { x: gx, y: 1.98, w: gw, h: 0.4, size: 15, bold: true, font: "head" });
    const days = T.marketing.days;
    for (let c = 0; c < cols; c++) text(s, AR ? days[c] : days[c], { x: gx + labW + c * cw, y: gy, w: cw, h: 0.3, size: AR ? 10.5 : 12, bold: true, color: BR.gray, align: "center" });
    const pal = [BR.green, BR.lime, BR.black, BR.gray];
    const pattern = ["0-1--3-", "-2-0--1", "1--3-2-", "-0-1--2"];
    for (let r = 0; r < 4; r++) {
      text(s, T.marketing.weeks[r], { x: gx, y: gy + 0.4 + r * (chh + 0.08), w: labW, h: chh, size: 12, bold: true, color: BR.gray, valign: "middle" });
      for (let c = 0; c < cols; c++) {
        const p = pattern[r][c];
        const fill = p === "-" ? N.soft : pal[+p];
        shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: gx + labW + c * cw + 0.04, y: gy + 0.4 + r * (chh + 0.08), w: cw - 0.08, h: chh, fill: { color: fill }, line: { color: fill }, rectRadius: 0.06 });
      }
    }
    const ly = gy + 0.4 + 4 * (chh + 0.08) + 0.2;
    let lgx = gx + labW + 0.04;
    T.marketing.legend.forEach((lg, i) => {
      const lw = lg.length * (AR ? 0.08 : 0.078) + 0.1;
      dot(s, lgx, ly + 0.07, 0.22, pal[i]);
      text(s, lg, { x: lgx + 0.3, y: ly, w: lw, h: 0.36, size: 12, color: "3C3E3B", valign: "middle" });
      lgx += 0.3 + lw + 0.12;
    });
    s.addNotes("Left: the four planning steps students complete for their capstone client. Right: an illustrative calendar where each colour is a content pillar. The pattern is a sample, not real data.");
  }

  // ---------- 10. n8n ----------
  {
    const s = newSlide(true); footer(s, n, true);
    const lw = 1.55, lh = lw / LOGO_R; s.addImage({ path: LOGO, x: AR ? M : W - M - lw, y: 0.42, w: lw, h: lh });
    kickerTitle(s, T.n8n.kicker, T.n8n.title, true);
    const icons = ["LuZap", "LuCog", "LuSparkles", "LuSave"];
    const bw = (W - 2 * M - 3 * 0.45) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (bw + 0.45), y = 1.95;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: 1.15, fill: { color: i === 2 ? BR.green : N.panel }, line: { color: i === 2 ? BR.green : BR.lime, width: 1.25 }, rectRadius: 0.12 });
      await ico(s, icons[i], i === 2 ? "000000" : BR.lime, { x: x + 0.25, y: y + 0.32, w: 0.5, h: 0.5 });
      text(s, T.n8n.core[i][0], { x: x + 0.9, y: y + 0.17, w: bw - 1.0, h: 0.45, size: AR ? 17 : 18, bold: true, color: i === 2 ? BR.black : N.white, font: "head" });
      text(s, T.n8n.core[i][1], { x: x + 0.9, y: y + 0.62, w: bw - 1.0, h: 0.45, size: 13, color: i === 2 ? BR.black : "C9CCC8" });
      if (i < 3) await ico(s, AR ? "LuArrowLeft" : "LuArrowRight", BR.lime, { x: x + bw + 0.06, y: y + 0.4, w: 0.33, h: 0.33 });
    }
    text(s, T.n8n.flowTitle, { x: M, y: 3.42, w: 8, h: 0.4, size: 15, bold: true, color: BR.lime, font: "head" });
    const fl = T.n8n.flow, fw = [1.3, 1.85, 1.3, 1.5, 3.1, 1.85];
    const gap = (W - 2 * M - fw.reduce((a, b) => a + b, 0)) / (fl.length - 1);
    let fx = M;
    for (let i = 0; i < fl.length; i++) {
      const isN = i === 2, isAI = i === 3;
      const fill = isN ? "EA4B71" : isAI ? BR.green : N.white;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: fx, y: 3.92, w: fw[i], h: 0.8, fill: { color: isN ? N.panel : fill }, line: { color: isN ? "EA4B71" : fill, width: 1.25 }, rectRadius: 0.1 });
      if (isN) {
        s.addImage({ path: path.join(__dirname, "assets/n8n-mark-white.png"), x: X(fx + 0.14, 0.5), y: 4.07, w: 0.5, h: 0.5, altText: "n8n logo" });
        text(s, "n8n", { x: fx + 0.66, y: 3.92, w: fw[i] - 0.72, h: 0.8, size: 15, bold: true, color: N.white, valign: "middle" });
      } else {
        text(s, fl[i], { x: fx + 0.08, y: 3.92, w: fw[i] - 0.16, h: 0.8, size: 13.5, bold: true, color: BR.black, align: "center", valign: "middle" });
      }
      if (i < fl.length - 1) await ico(s, AR ? "LuChevronLeft" : "LuChevronRight", BR.lime, { x: fx + fw[i] + gap / 2 - 0.15, y: 4.17, w: 0.3, h: 0.3 });
      fx += fw[i] + gap;
    }
    const cc = T.n8n.concepts; let cx = M, cy = 5.1;
    for (let i = 0; i < cc.length; i++) {
      const w = Math.max(1.5, cc[i].length * (AR ? 0.095 : 0.098) + 0.45);
      if (cx + w > W - M + 0.01) { cx = M; cy += 0.55; }
      chip(s, cc[i], { x: cx, y: cy, w, h: 0.42, size: 12 }, "dark");
      cx += w + 0.15;
    }
    text(s, T.n8n.note, { x: M, y: 6.25, w: W - 2 * M, h: 0.6, size: 13, color: "C9CCC8", lsm: 1.0 });
    s.addNotes("The goal is understanding Trigger, Process, AI, Action, not engineering. Each team builds the Content Idea Generator. Credentials live on the program's n8n instance; students learn what API keys, OAuth and tokens are and why they must stay private.");
  }

  // ---------- 11. Freelance ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.freelance.kicker, T.freelance.title);
    const icons = ["LuLaptop", "LuPackage", "LuHandshake"];
    const cw = (W - 2 * M - 2 * 0.3) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.3), y = 2.0, h = 3.3;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, fill: { color: i === 1 ? BR.black : N.soft }, line: { color: i === 1 ? BR.black : N.soft }, rectRadius: 0.12 });
      dot(s, x + 0.35, y + 0.35, 0.85, i === 1 ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: x + 0.55, y: y + 0.55, w: 0.45, h: 0.45 });
      text(s, T.freelance.cols[i][0], { x: x + 0.35, y: y + 1.4, w: cw - 0.7, h: 0.5, size: 20, bold: true, font: "head", color: i === 1 ? N.white : N.ink });
      text(s, T.freelance.cols[i][1], { x: x + 0.35, y: y + 1.95, w: cw - 0.7, h: 1.25, size: 14, color: i === 1 ? "D6D8D4" : "3C3E3B", lsm: 1.02 });
    }
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.6, w: W - 2 * M, h: 1.15, fill: { color: N.tint }, line: { color: N.tint }, rectRadius: 0.1 });
    await ico(s, "LuInfo", "000000", { x: M + 0.3, y: 5.95, w: 0.42, h: 0.42 });
    text(s, T.freelance.note, { x: M + 0.95, y: 5.6, w: W - 2 * M - 1.2, h: 1.15, size: 13.5, color: N.ink, valign: "middle", lsm: 1.0 });
    s.addNotes("No pricing is taught as a figure; students define scope and deliverables. Fiverr's minors policy is cited from its Help Center. Other platforms' rules should be checked before advising students.");
  }

  // ---------- 12. Method ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.method.kicker, T.method.title);
    const th = MODULES.reduce((a, m) => a + m.T, 0), pr = MODULES.reduce((a, m) => a + m.P, 0);
    s.addChart(pres.charts.DOUGHNUT, [{ name: "Hours", labels: [T.method.theory, T.method.practice], values: [th, pr] }], {
      x: X(M, 3.4), y: 1.95, w: 3.4, h: 3.4, holeSize: 68, chartColors: [BR.gray, BR.green], showLegend: false, showValue: false, showPercent: false, showLabel: false, dataBorder: { pt: 2, color: "FFFFFF" },
    });
    text(s, `${Math.round((pr / (th + pr)) * 100)}%`, { x: M + 0.7, y: 3.05, w: 2.0, h: 0.75, size: 38, bold: true, align: "center", font: "head" });
    text(s, T.method.practice, { x: M + 0.7, y: 3.75, w: 2.0, h: 0.35, size: 14, color: BR.gray, align: "center" });
    const legend = [[BR.green, `${T.method.practice}: ${pr} ${AR ? "ساعة" : "h"}`], [BR.gray, `${T.method.theory}: ${th} ${AR ? "ساعة" : "h"}`]];
    legend.forEach((l, i) => { dot(s, M + 0.35, 5.5 + i * 0.4 + 0.07, 0.2, l[0]); text(s, l[1], { x: M + 0.65, y: 5.5 + i * 0.4, w: 2.9, h: 0.34, size: 13, color: "3C3E3B", valign: "middle" }); });
    // 2x2 learning loop
    const icons = ["LuEye", "LuSquarePen", "LuHammer", "LuPresentation"];
    const lx0 = 4.65, cw = 3.9, chh = 1.25;
    for (let i = 0; i < 4; i++) {
      const col = [0, 1, 1, 0][i], row = [0, 0, 1, 1][i];
      const x = lx0 + col * (cw + 0.3), y = 1.95 + row * (chh + 0.3);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: chh, fill: { color: i === 2 ? BR.black : N.soft }, line: { color: i === 2 ? BR.black : N.soft }, rectRadius: 0.1 });
      dot(s, x + 0.25, y + 0.3, 0.65, i === 2 ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: x + 0.39, y: y + 0.44, w: 0.37, h: 0.37 });
      text(s, `${i + 1}. ${T.method.loop[i][0]}`, { x: x + 1.1, y: y + 0.2, w: cw - 1.3, h: 0.45, size: 18, bold: true, font: "head", color: i === 2 ? N.white : N.ink });
      text(s, T.method.loop[i][1], { x: x + 1.1, y: y + 0.66, w: cw - 1.3, h: 0.45, size: 13.5, color: i === 2 ? "D6D8D4" : "3C3E3B" });
    }
    await ico(s, "LuRefreshCw", BR.green, { x: lx0 + cw + 0.15 - 0.27 + 0.0, y: 1.95 + chh + 0.15 - 0.27, w: 0.54, h: 0.54 });
    // session timeline
    const ty = 5.25, tx = 4.65, tw = W - M - tx;
    text(s, T.method.sessTitle, { x: tx, y: ty - 0.02, w: tw, h: 0.4, size: 15, bold: true, font: "head" });
    const seg = [50, 105, 25], cols = [BR.gray, BR.green, BR.black];
    let sx = tx;
    for (let i = 0; i < 3; i++) {
      const w = tw * seg[i] / 180;
      shape(s, pres.shapes.RECTANGLE, { x: sx, y: ty + 0.48, w: w - 0.04, h: 0.5, fill: { color: cols[i] }, line: { color: cols[i] } });
      text(s, T.method.sess[i][1], { x: sx + 0.05, y: ty + 0.48, w: w - 0.14, h: 0.5, size: i === 2 ? 11 : 13, bold: true, color: i === 1 ? BR.black : N.white, align: "center", valign: "middle" });
      text(s, T.method.sess[i][0], { ltr: true, x: sx, y: ty + 1.03, w: w - 0.04, h: 0.3, size: 11, color: BR.gray, align: "center" });
      sx += w;
    }
    s.addNotes("Hours by module sum to 28.5 theory and 67.5 hands-on. In each session the trainer talks for under an hour; the rest is building, then showing work for feedback.");
  }

  // ---------- 13. Capstone ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.capstone.kicker, T.capstone.title);
    text(s, T.capstone.intro, { x: M, y: 1.5, w: 10.3, h: 0.4, size: 15, color: "3C3E3B" });
    let cx = M;
    for (const c of T.capstone.clients) {
      const w = c.length * (AR ? 0.088 : 0.088) + 0.36;
      chip(s, c, { x: cx, y: 2.08, w, h: 0.4, size: 12 }, "light"); cx += w + 0.12;
    }
    const ph = T.capstone.phases, pw = (W - 2 * M - 4 * 0.2) / 5;
    let k = 0;
    for (let i = 0; i < 5; i++) {
      const x = M + i * (pw + 0.2), y = 2.75;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: pw, h: 0.5, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.1 });
      text(s, ph[i][0], { x: x + 0.15, y, w: pw - 0.3, h: 0.5, size: 15, bold: true, color: BR.lime, align: "center", valign: "middle", font: "head" });
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y: y + 0.6, w: pw, h: 3.0, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.1 });
      ph[i][1].forEach((d, j) => {
        k += 1;
        const iy = y + 0.72 + j * 0.355;
        dot(s, x + 0.12, iy + 0.04, 0.27, i % 2 ? BR.lime : BR.green);
        text(s, String(k), { x: x + 0.12, y: iy + 0.04, w: 0.27, h: 0.27, size: 9, bold: true, color: BR.black, align: "center", valign: "middle" });
        text(s, d, { x: x + 0.47, y: iy, w: pw - 0.55, h: 0.35, size: 12.5, color: N.ink, valign: "middle" });
      });
    }
    await ico(s, "LuUsers", BR.green, { x: M, y: 6.47, w: 0.36, h: 0.36 });
    text(s, T.capstone.roles, { x: M + 0.5, y: 6.45, w: 11.5, h: 0.4, size: 13, bold: true, color: "3C3E3B", valign: "middle" });
    s.addNotes("Nineteen deliverables in five phases. Each phase is started inside the matching module (brief in M3, video in M7, automation in M9), so the final studio sessions are for finishing and polishing, not starting from zero.");
  }

  // ---------- 14. Deliverables ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.deliver.kicker, T.deliver.title);
    const icons = ["LuBookOpen", "LuClipboardList", "LuLayers", "LuUserRound", "LuFilm", "LuMegaphone", "LuWorkflow", "LuGlobe"];
    const cw = (W - 2 * M - 3 * 0.25) / 4, ch = 2.15;
    for (let i = 0; i < 8; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const x = M + col * (cw + 0.25), y = 1.95 + row * (ch + 0.25);
      const hi = i === 4 || i === 6;
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: hi ? BR.black : N.tint }, line: { color: hi ? BR.black : N.tint }, rectRadius: 0.12 });
      dot(s, x + 0.3, y + 0.3, 0.7, hi ? BR.lime : BR.green);
      await ico(s, icons[i], "000000", { x: x + 0.47, y: y + 0.47, w: 0.36, h: 0.36 });
      text(s, String(i + 1).padStart(2, "0"), { x: x + cw - 0.9, y: y + 0.35, w: 0.6, h: 0.4, size: 14, bold: true, color: hi ? BR.lime : BR.gray, align: "end" });
      text(s, T.deliver.items[i][0], { x: x + 0.3, y: y + 1.12, w: cw - 0.6, h: 0.42, size: 17, bold: true, font: "head", color: hi ? N.white : N.ink });
      text(s, T.deliver.items[i][1], { x: x + 0.3, y: y + 1.52, w: cw - 0.6, h: 0.55, size: 13, color: hi ? "D6D8D4" : "3C3E3B", lsm: 1.0 });
    }
    s.addNotes("These eight pieces form each student's portfolio. Highlighted tiles (video and automation) are the two items stakeholders most often ask to see in a demo.");
  }

  // ---------- 15. KPIs ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.kpi.kicker, T.kpi.title);
    const cw = [3.6, 5.13, 3.4];
    const order = AR ? [2, 1, 0] : [0, 1, 2];
    const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: FONT.body, fontSize: 13.5, color: N.ink, valign: "middle", align: AR ? "right" : "left", margin: [0.04, 0.15, 0.04, 0.15], lang: LCODE }, AR ? { rtlMode: true } : {}, o) });
    const rows = [order.map((c) => cell(T.kpi.head[c], { bold: true, color: BR.lime, fill: { color: BR.black }, fontFace: FONT.head, fontSize: 14 }))];
    T.kpi.rows.forEach((r, i) => {
      const fill = { color: i % 2 ? N.white : N.soft };
      const cells = [cell(r[0], { bold: true, fill }), cell(r[1], { fill, color: "3C3E3B" }), cell(r[2], { bold: true, fill, color: N.ink })];
      rows.push(order.map((c) => cells[c]));
    });
    s.addTable(rows, { x: M, y: 1.95, w: W - 2 * M, colW: order.map((c) => cw[c]), rowH: 0.47, border: { type: "solid", pt: 0.5, color: N.line } });
    // proposed tag markers in target column
    const tagX = AR ? M + 0.12 : W - M - 1.25;
    for (let i = 0; i < T.kpi.rows.length; i++) {
      const y = 1.95 + 0.47 * (i + 1) + 0.11;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: tagX, y, w: 1.13, h: 0.26, fill: { color: N.tint }, line: { color: BR.green, width: 0.75 }, rectRadius: 0.13 });
      s.addText(AR ? "مقترح" : "Proposed", { x: tagX, y, w: 1.13, h: 0.26, fontFace: FONT.body, fontSize: 9.5, bold: true, color: N.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LCODE, rtlMode: AR });
    }
    text(s, T.kpi.foot, { x: M, y: 6.3, w: W - 2 * M, h: 0.35, size: 11, italic: !AR, color: BR.gray });
    s.addNotes("Income is deliberately not a headline KPI: many students are under 18 and cannot contract independently. Every target is a proposal to be agreed with the program team.");
  }

  // ---------- 16. Delivery ----------
  {
    const s = newSlide(false); logoChip(s); footer(s, n);
    kickerTitle(s, T.delivery.kicker, T.delivery.title);
    const lx = M, lw = 2.55, gx = lx + lw + 0.1, gw = 5.75, wk = gw / 12, y0 = 2.0, rh = 0.36;
    for (let w = 0; w < 12; w++) {
      text(s, String(w + 1), { x: gx + w * wk, y: y0, w: wk, h: 0.3, size: 11, bold: true, color: BR.gray, align: "center" });
      shape(s, pres.shapes.RECTANGLE, { x: gx + w * wk + 0.01, y: y0 + 0.35, w: wk - 0.02, h: rh * 11 + 0.1, fill: { color: w === 11 ? N.tint : w % 2 ? N.white : "F7F8F6" }, line: { color: w === 11 ? N.tint : w % 2 ? N.white : "F7F8F6" } });
    }
    text(s, T.delivery.buffer, { x: gx + 11 * wk - 0.2, y: y0 + 0.35 + rh * 11 + 0.15, w: wk + 0.4, h: 0.3, size: 10, color: BR.gray, align: "center" });
    text(s, T.delivery.weekLabel, { x: lx, y: y0, w: lw, h: 0.3, size: 11, bold: true, color: BR.gray });
    MODULES.forEach((m, i) => {
      const y = y0 + 0.4 + i * rh;
      const a = m.sessions[0], b = m.sessions[m.sessions.length - 1];
      const xs = gx + (Math.ceil(a / 3) - 1) * wk + ((a - 1) % 3) * wk / 3;
      const xe = gx + (Math.ceil(b / 3) - 1) * wk + (((b - 1) % 3) + 1) * wk / 3;
      text(s, `${m.id} ${m[LANG].short}`, { x: lx, y, w: lw, h: rh - 0.04, size: 11, color: N.ink, valign: "middle" });
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: xs + 0.02, y: y + 0.05, w: xe - xs - 0.04, h: rh - 0.12, fill: { color: trackColor[m.track] }, line: { color: trackColor[m.track] }, rectRadius: 0.05 });
    });
    const fx = 9.05, fw = W - M - fx;
    const icons = ["LuMapPin", "LuClock", "LuUsers", "LuGraduationCap", "LuLaptop", "LuCalendarDays"];
    for (let i = 0; i < T.delivery.facts.length; i++) {
      const y = 2.0 + i * 0.78;
      dot(s, fx, y + 0.02, 0.5, i === 5 ? BR.black : BR.green);
      await ico(s, icons[i], i === 5 ? BR.lime : "000000", { x: fx + 0.12, y: y + 0.14, w: 0.26, h: 0.26 });
      text(s, T.delivery.facts[i][0], { x: fx + 0.65, y: y - 0.04, w: fw - 0.65, h: 0.3, size: 13, bold: true, font: "head" });
      text(s, T.delivery.facts[i][1], { x: fx + 0.65, y: y + 0.27, w: fw - 0.65, h: 0.45, size: 12, color: "3C3E3B", lsm: 0.95 });
    }
    s.addNotes("Bars are placed by session: three sessions per week, so modules start and end mid-week. Week 12 is held in reserve for make-up sessions, public holidays or exam clashes.");
  }

  // ---------- 17. Safety ----------
  {
    const s = newSlide(false); footer(s, n);
    kickerTitle(s, T.safety.kicker, T.safety.title);
    const px = M, pw = 3.3;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 1.95, w: pw, h: 4.8, fill: { color: BR.black }, line: { color: BR.black }, rectRadius: 0.12 });
    const lw = pw - 0.5, lh = lw / LOGO_R;
    s.addImage({ path: LOGO, x: X(px + 0.25, lw), y: 2.25, w: lw, h: lh, altText: "Green Circle logo" });
    text(s, "be aware..be secure", { ltr: true, x: px + 0.3, y: 3.45, w: pw - 0.6, h: 0.4, size: 17, bold: true, color: BR.lime, font: "head" });
    text(s, AR ? "عبارة Green Circle هذه تتحوّل هنا إلى قواعد عمل داخل قاعة التدريب." : "Green Circle's line becomes a set of working rules in the training room.", { x: px + 0.3, y: 3.95, w: pw - 0.6, h: 1.0, size: 15, color: N.white, lsm: 1.05 });
    text(s, AR ? "أين تظهر هذه القواعد" : "Where the rules live", { x: px + 0.3, y: 5.05, w: pw - 0.6, h: 0.35, size: 12, bold: true, color: BR.lime });
    text(s, bullets(AR ? ["ميثاق السلوك", "نموذج موافقة وليّ الأمر", "قائمة تحقق في كل وحدة"] : ["Code of conduct", "Guardian consent form", "Checklist in every module"], { psa: 4 }), { x: px + 0.3, y: 5.42, w: pw - 0.6, h: 1.15, size: 13.5, color: "D6D8D4" });
    const icons = ["LuBadgeCheck", "LuSignature", "LuScanFace", "LuKeyRound", "LuCircleCheck", "LuLock"];
    const gx = px + pw + 0.3, cw = (W - M - gx - 0.25) / 2, ch = 1.45;
    for (let i = 0; i < 6; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = gx + col * (cw + 0.25), y = 1.95 + row * (ch + 0.22);
      shape(s, pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: N.soft }, line: { color: N.soft }, rectRadius: 0.1 });
      dot(s, x + 0.22, y + 0.25, 0.55, BR.black);
      await ico(s, icons[i], BR.lime, { x: x + 0.34, y: y + 0.37, w: 0.31, h: 0.31 });
      text(s, T.safety.items[i][0], { x: x + 0.95, y: y + 0.18, w: cw - 1.15, h: 0.4, size: 16, bold: true, font: "head" });
      text(s, T.safety.items[i][1], { x: x + 0.95, y: y + 0.58, w: cw - 1.15, h: 0.82, size: 13, color: "3C3E3B", lsm: 1.0 });
    }
    s.addNotes("This slide connects the program to Green Circle's awareness focus. Each safeguard is an operating rule, not a slogan: it appears in the code of conduct, the consent form and the module checklists.");
  }

  // ---------- 18. Closing ----------
  {
    const s = newSlide(true); footer(s, n, true);
    const lw = 3.0, lh = lw / LOGO_R;
    s.addImage({ path: LOGO, x: AR ? W - M - lw : M - 0.08, y: 0.5, w: lw, h: lh, altText: "Green Circle logo" });
    text(s, T.close.kicker, { x: M, y: 1.75, w: 6.5, h: 0.3, size: 12, bold: true, color: BR.lime, charSpacing: 2 });
    text(s, T.close.title, { x: M, y: 2.1, w: 6.5, h: 0.75, size: 30, bold: true, color: N.white, font: "head" });
    T.close.values.forEach((v, i) => {
      const y = 3.15 + i * 1.12;
      text(s, v[0], { x: M, y, w: 6.4, h: 0.5, size: 24, bold: true, color: i % 2 ? BR.green : BR.lime, font: "head" });
      text(s, v[1], { x: M, y: y + 0.5, w: 6.4, h: 0.45, size: 15, color: "D6D8D4" });
    });
    const px = 7.6, pw = W - M - px;
    shape(s, pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 1.75, w: pw, h: 4.95, fill: { color: N.panel }, line: { color: "3A3D39", width: 0.75 }, rectRadius: 0.12 });
    text(s, T.close.decTitle, { x: px + 0.35, y: 2.0, w: pw - 0.7, h: 0.5, size: 18, bold: true, color: N.white, font: "head" });
    for (let i = 0; i < T.close.decisions.length; i++) {
      const y = 2.7 + i * 0.75;
      await ico(s, "LuSquareCheck", BR.lime, { x: px + 0.35, y: y + 0.04, w: 0.36, h: 0.36 });
      text(s, T.close.decisions[i], { x: px + 0.9, y, w: pw - 1.25, h: 0.6, size: 14.5, color: N.white, lsm: 1.0 });
    }
    s.addNotes("Close on what remains after the 12 weeks, then turn to the decisions the team needs to make so delivery can be scheduled. Every item on the right is marked TBD in the detailed proposal.");
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, "slides:", n);
}
build().catch((e) => { console.error(e); process.exit(1); });
