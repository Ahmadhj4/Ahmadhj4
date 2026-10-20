// Builds the Detailed Training Proposal: node build_doc.js en|ar out.docx
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const d = require("docx");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, HeadingLevel, BorderStyle, Header, Footer, PageNumber, LevelFormat, PageBreak,
  VerticalAlign, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
  Bookmark, InternalHyperlink, PageReference, TabStopType, LeaderType, TableLayoutType, ExternalHyperlink,
} = d;

const LANG = process.argv[2] || "en";
const OUT = process.argv[3] || `proposal_${LANG}.docx`;
const AR = LANG === "ar";
const T = require(AR ? "./copy_doc_ar" : "./copy_doc_en");
const DECK = require("./copy_deck")[LANG];
const MODULES = require("./data_modules");
const REFS = require("./refs");
const S = T.s;

const BR = { green: "4DB449", lime: "A6D04B", gray: "727274", black: "000000" };
const N = { ink: "1A1A1A", sub: "3C3E3B", soft: "F2F4F1", tint: "EAF5E8", line: "D9DDD8", white: "FFFFFF" };
const F = AR ? { body: "IBM Plex Sans Arabic", head: "Cairo" } : { body: "Calibri", head: "Cairo" };
const SZ = AR ? { body: 21, small: 18, table: 18 } : { body: 21, small: 18, table: 18 }; // half-points
const PAGE_W = 11906, PAGE_H = 16838, MAR = 1134, CW = PAGE_W - 2 * MAR;
const START = AlignmentType.START;
const END = AlignmentType.END;

const font = (f) => ({ ascii: f, hAnsi: f, cs: f, eastAsia: f });
const nb = (t) => t.replace(/\u200E/g, "").replace(/(^|[\s(«])((?:~\/|\.|\/)[A-Za-z][\w.\/-]*)/g, "$1\u202A$2\u202C").replace(/be aware\.\.be secure/g, "be\u00A0aware..be\u00A0secure").replace(/([A-Za-z.+]+) (?=[A-Z0-9][A-Za-z.]*)/g, "$1\u00A0");
function run(text, o = {}) {
  return new TextRun({
    text: AR && !(o.size && o.size <= 17) ? nb(text) : text, bold: o.bold, boldComplexScript: o.bold, italics: o.italic && !AR, color: o.color || N.ink,
    size: o.size || SZ.body, sizeComplexScript: o.size || SZ.body, font: font(o.font || F.body),
    language: AR ? { bidirectional: "ar-SA" } : undefined,
  });
}
function para(content, o = {}) {
  const children = typeof content === "string" ? [run(content, o)] : content;
  return new Paragraph({
    children, bidirectional: AR, alignment: o.align || START, keepNext: o.keepNext, keepLines: o.keepLines,
    spacing: { before: o.before || 0, after: o.after != null ? o.after : 120, line: o.line || (AR ? 300 : 276), lineRule: o.lineRule },
    numbering: o.bullet ? { reference: "bul", level: 0 } : o.num ? { reference: o.num, level: 0 } : undefined,
    heading: o.heading, pageBreakBefore: o.pageBreakBefore, shading: o.shading, indent: o.indent, border: o.border,
  });
}
const bullets = (list, o = {}) => list.map((t) => para(t, Object.assign({ bullet: true, after: 60 }, o)));
let secNo = 0;
const tocItems = [];
function H1(text) {
  secNo += 1;
  const id = `sec${secNo}`;
  tocItems.push({ n: secNo, text, id });
  return [new Paragraph({
    heading: HeadingLevel.HEADING_1, bidirectional: AR, alignment: START, keepNext: true,
    spacing: { before: 360, after: 160 },
    children: [new Bookmark({ id, children: [run(`${secNo}. `, { bold: true, size: 30, font: F.head, color: BR.green }), run(text, { bold: true, size: 30, font: F.head })] })],
  })];
}
const H2 = (text, o = {}) => new Paragraph({ heading: HeadingLevel.HEADING_2, bidirectional: AR, alignment: START, keepNext: true, spacing: { before: o.before || 240, after: 100 }, children: [run(text, { bold: true, size: 24, font: F.head, color: o.color })] });

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NB = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };
const thin = { style: BorderStyle.SINGLE, size: 4, color: N.line };
const TB = { top: thin, bottom: thin, left: thin, right: thin, insideHorizontal: thin, insideVertical: thin };

function cell(content, o = {}) {
  const kids = Array.isArray(content) ? content : [para(String(content), { size: o.size || SZ.table, bold: o.bold, color: o.color, after: 0, align: o.align, font: o.font, line: AR ? 264 : 252, keepNext: o.keepNext })];
  return new TableCell({
    children: kids, width: { size: o.w, type: WidthType.DXA }, verticalAlign: o.valign || VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    margins: { top: o.mt != null ? o.mt : 70, bottom: o.mb != null ? o.mb : 70, left: 110, right: 110 }, columnSpan: o.span,
  });
}
function table(head, rows, widths, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const trs = [];
  if (head) trs.push(new TableRow({ tableHeader: true, cantSplit: true, children: head.map((h, i) => cell(h, { w: widths[i], fill: BR.black, color: N.white, bold: true, font: F.head })) }));
  rows.forEach((r, ri) => trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, { w: widths[i], fill: o.zebra === false ? undefined : ri % 2 ? N.white : N.soft, bold: o.boldFirst && i === 0, color: o.boldFirst && i === 0 ? N.ink : undefined })) })));
  return new Table({ rows: trs, width: { size: total, type: WidthType.DXA }, columnWidths: widths, borders: o.borders || TB, visuallyRightToLeft: AR, layout: TableLayoutType.FIXED });
}
function img(name, widthIn) {
  const p = path.join(__dirname, "assets/diagrams", LANG, name + ".png");
  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "assets/diagrams", LANG, name + ".json")));
  const w = widthIn * 96, h = (w * meta.h) / meta.w;
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 }, keepLines: true, keepNext: true, children: [new ImageRun({ type: "png", data: fs.readFileSync(p), transformation: { width: w, height: h }, altText: { title: name, description: name, name } })] });
}
const caption = (t) => para(t, { size: SZ.small, color: BR.gray, italic: true, after: 200 });
const note = (t) => new Table({
  rows: [new TableRow({ children: [cell([para(t, { size: SZ.small + 1, after: 0, color: N.ink })], { w: CW, fill: N.tint, mt: 120, mb: 120 })] })],
  width: { size: CW, type: WidthType.DXA }, columnWidths: [CW], borders: NB, visuallyRightToLeft: AR,
});
const spacer = (after = 120) => new Paragraph({ children: [], spacing: { after, before: 0 } });

async function build() {
  const logo = fs.readFileSync(path.join(__dirname, "assets/green-circle-logo.png"));
  const LR = 771 / 274;
  const blackBg = await sharp({ create: { width: 20, height: 28, channels: 3, background: "#000000" } }).png().toBuffer();

  // ---------- Cover ----------
  const cover = [
    new Paragraph({ children: [new ImageRun({ type: "png", data: blackBg, transformation: { width: 794, height: 1123 }, floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 }, behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } }, altText: { title: "background", description: "", name: "bg" } })] }),
    new Paragraph({ bidirectional: AR, alignment: START, spacing: { before: 200, after: 2600 }, children: [new ImageRun({ type: "png", data: logo, transformation: { width: 300, height: 300 / LR }, altText: { title: "Green Circle logo", description: "Green Circle logo", name: "logo" } })] }),
    para(T.docTitle.toUpperCase ? (AR ? T.docTitle : T.docTitle.toUpperCase()) : T.docTitle, { bold: true, color: BR.lime, size: 22, font: F.head, after: 200 }),
    para(T.progTitle, { bold: true, color: N.white, size: AR ? 50 : 52, font: F.head, after: 360, line: 780, lineRule: d.LineRuleType.AT_LEAST }),
    para(T.coverSub, { color: "D6D8D4", size: 26, after: 1600 }),
    new Table({
      rows: T.coverMeta.map((m) => new TableRow({ children: [cell(m[0], { w: 2200, color: BR.lime, bold: true, size: 19, mt: 50, mb: 50 }), cell(m[1], { w: CW - 2200, color: N.white, size: 19, mt: 50, mb: 50 })] })),
      width: { size: CW, type: WidthType.DXA }, columnWidths: [2200, CW - 2200], borders: NB, visuallyRightToLeft: AR,
    }),
  ];

  // ---------- Contents ----------
  const order = ["exec", "overview", "objectives", "outcomes", "approach", "structure", "tracks", "modules", "schedule", "tools", "mini", "final", "portfolio", "assess", "results", "delivery", "rai", "refs"];
  const tocList = order.map((k, i) => new Paragraph({
    bidirectional: AR, alignment: START, spacing: { after: 50, line: 276 },
    tabStops: [{ type: TabStopType.RIGHT, position: CW, leader: LeaderType.DOT }],
    children: [new InternalHyperlink({ anchor: `sec${i + 1}`, children: [run(`${i + 1}.  `, { bold: true, color: BR.green, size: 21 }), run(S[k].h, { size: 21 })] }), run("\t", { size: 21 }), new PageReference(`sec${i + 1}`)],
  }));
  const contents = [para(T.toc, { bold: true, size: 34, font: F.head, after: 240, before: 320 }), ...tocList];

  // ---------- Body ----------
  const body = [];
  const push = (...x) => body.push(...x.flat());
  const ps = (arr, o) => arr.map((t) => para(t, o));
  let figN = 0;
  const fig = (name, cap) => { figN += 1; return [img(name, 6.6), caption(`${T.fig} ${figN}: ${cap}`)]; };
  const th = MODULES.reduce((a, m) => a + m.T, 0), pr = MODULES.reduce((a, m) => a + m.P, 0);
  const rng = (a, b2) => (AR ? `${a} إلى ${b2}` : `${a}–${b2}`);

  // 1 exec
  push(new Paragraph({ children: [new PageBreak()] }), H1(S.exec.h), ps(S.exec.p));
  const box = S.exec.box, half = CW / 2;
  push(new Table({
    rows: [0, 2, 4].map((i) => new TableRow({ children: [i, i + 1].map((j) => cell([para(box[j][0], { size: 17, color: BR.lime, bold: true, after: 20 }), para(box[j][1], { size: 22, color: N.white, bold: true, font: F.head, after: 0 })], { w: half, fill: BR.black, mt: 110, mb: 110 })) })),
    width: { size: CW, type: WidthType.DXA }, columnWidths: [half, half], borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "333333" }, insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "333333" } }, visuallyRightToLeft: AR,
  }));
  // 2 overview
  push(H1(S.overview.h), ps(S.overview.p), fig("pipeline", S.overview.figCap));
  // 3 objectives
  push(H1(S.objectives.h), bullets(S.objectives.list));
  // 4 outcomes
  push(H1(S.outcomes.h), ps(S.outcomes.p), S.outcomes.list.map((t) => para(t, { num: "outc", after: 60 })));
  // 5 approach
  push(H1(S.approach.h), ps(S.approach.p), fig("loop", S.approach.figCap), ps(S.approach.p2));
  // 6 structure
  push(H1(S.structure.h), ps(S.structure.p, { keepNext: true }));
  const hRows = MODULES.map((m) => [`${m.id}  ${m[LANG].name}`, rng(m.sessionNos[0], m.sessionNos[m.sessionNos.length - 1]), String(m.T), String(m.P), String(m.T + m.P)]);
  hRows.push([S.structure.total, "32", String(th), String(pr), String(th + pr)]);
  const hw = [CW - 4 * 1250, 1250, 1250, 1250, 1250];
  push(new Table({
    rows: [new TableRow({ tableHeader: true, children: S.structure.head.map((h, i) => cell(h, { w: hw[i], fill: BR.black, color: N.white, bold: true, font: F.head, align: i ? AlignmentType.CENTER : START })) }),
      ...hRows.map((r, ri) => { const last = ri === hRows.length - 1; return new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, { w: hw[i], fill: last ? N.tint : ri % 2 ? N.white : N.soft, bold: last || i === 0, align: i ? AlignmentType.CENTER : START })) }); })],
    width: { size: CW, type: WidthType.DXA }, columnWidths: hw, borders: TB, visuallyRightToLeft: AR, layout: TableLayoutType.FIXED,
  }), spacer(), fig("hours", S.structure.figHours), fig("timeline", S.structure.figTime));
  // 7 tracks
  const trackKeys = ["foundations", "content", "build", "design", "media", "automate", "final"];
  const hrsByTrack = {}; MODULES.forEach((m) => (hrsByTrack[m.track] = (hrsByTrack[m.track] || 0) + m.T + m.P));
  push(H1(S.tracks.h), ps(S.tracks.p), fig("architecture", S.tracks.figCap),
    table(S.tracks.head, S.tracks.rows.map((r, i) => [r[0], r[1], String(hrsByTrack[trackKeys[i]]), r[2]]), [2500, 1100, 900, CW - 4500], { boldFirst: true }));
  // 8 modules
  push(H1(S.modules.h), ps(S.modules.p));
  const L = S.modules.labels;
  MODULES.forEach((m, mi) => {
    const t = m[LANG], lw = 2000, vw = CW - lw;
    const band = new Table({
      rows: [new TableRow({ children: [
        cell([para([run(m.id + "  ", { bold: true, color: BR.lime, size: 26, font: F.head }), run(t.name, { bold: true, color: N.white, size: 26, font: F.head })], { after: 30, keepNext: true }), para(`${L.sessions} ${rng(m.sessionNos[0], m.sessionNos[m.sessionNos.length - 1])}  ·  ${L.hours}: ${m.T + m.P}  ·  ${L.theory} ${m.T} / ${L.practice} ${m.P}`, { color: "D6D8D4", size: 18, after: 0, keepNext: true })], { w: CW, fill: BR.black, mt: 130, mb: 130 }),
      ] })], width: { size: CW, type: WidthType.DXA }, columnWidths: [CW], borders: NB, visuallyRightToLeft: AR,
    });
    const lab = (k, kn) => cell(L[k], { w: lw, fill: N.tint, bold: true, valign: VerticalAlign.TOP, keepNext: kn });
    const val = (v, kn) => cell(Array.isArray(v) ? v.map((x) => para(x, { bullet: true, size: SZ.table, after: 20, line: AR ? 264 : 252, keepNext: kn })) : v, { w: vw, valign: VerticalAlign.TOP, keepNext: kn });
    const projCell = cell([para(t.project[0], { bold: true, size: SZ.table + 1, after: 20, font: F.head }), para(t.project[1], { size: SZ.table, after: 0 })], { w: vw, valign: VerticalAlign.TOP, fill: N.soft });
    const info = new Table({ rows: [
      new TableRow({ cantSplit: true, children: [lab("purpose", true), val(t.purpose, true)] }),
      new TableRow({ cantSplit: true, children: [lab("outcomes"), val(t.outcomes)] }),
      new TableRow({ cantSplit: true, children: [lab(m.id === "M11" ? "final" : "project"), projCell] }),
    ], width: { size: CW, type: WidthType.DXA }, columnWidths: [lw, vw], borders: TB, visuallyRightToLeft: AR, layout: TableLayoutType.FIXED });
    const sw = AR ? [560, 2100, 2050, 1400, 1850, CW - 7960] : [420, 1650, 2250, 1500, 2050, CW - 7870];
    const sTable = new Table({
      rows: [new TableRow({ tableHeader: true, cantSplit: true, children: S.modules.sHead.map((h, i) => cell(h, { w: sw[i], fill: BR.gray, color: N.white, bold: true, size: 16, font: F.head })) }),
        ...m.sessions.map((se, ri) => { const x = se[LANG]; return new TableRow({ cantSplit: true, children: [
          cell(String(se.n), { w: sw[0], bold: true, size: 17, color: BR.green, fill: ri % 2 ? N.white : N.soft }),
          cell(x.title, { w: sw[1], bold: true, size: 17, fill: ri % 2 ? N.white : N.soft }),
          cell(x.learn, { w: sw[2], size: 16, fill: ri % 2 ? N.white : N.soft }),
          cell(x.tools.join(AR ? "، " : ", "), { w: sw[3], size: 16, fill: ri % 2 ? N.white : N.soft }),
          cell(x.build, { w: sw[4], size: 16, fill: ri % 2 ? N.white : N.soft }),
          cell(x.output, { w: sw[5], size: 16, bold: true, fill: ri % 2 ? N.white : N.soft }),
        ] }); })],
      width: { size: CW, type: WidthType.DXA }, columnWidths: sw, borders: TB, visuallyRightToLeft: AR, layout: TableLayoutType.FIXED,
    });
    push(new Paragraph({ children: [], spacing: { before: mi ? 280 : 120, after: 0 }, keepNext: true }), band, info, new Paragraph({ children: [], spacing: { before: 0, after: 80 }, keepNext: true }), sTable);
  });
  // 9 schedule
  push(H1(S.schedule.h), ps(S.schedule.p, { keepNext: true }));
  const all = MODULES.flatMap((m) => m.sessions.map((se) => [String(se.n), String(se.week), m.id, se[LANG].title, se[LANG].output]));
  push(table(S.schedule.head, all, [480, 850, 850, 4000, CW - 6180]));
  // 10 tools
  push(H1(S.tools.h), ps(S.tools.p, { keepNext: true }), table(S.tools.head, S.tools.rows, [1700, 2100, CW - 5500, 1700], { boldFirst: true }));
  // 11 mini projects
  push(H1(S.mini.h), ps(S.mini.p, { keepNext: true }), table(S.mini.head, MODULES.slice(0, 10).map((m, i) => [String(i + 1), `${m.id} ${m[LANG].short}`, m[LANG].project[0], m[LANG].project[1]]), [480, 2300, 2300, CW - 5080]));
  // 12 final project
  push(H1(S.final.h), ps(S.final.p), fig("final", S.final.figCap),
    table(S.final.head, S.final.rows.map((r, i) => [String(i + 1), r[0], r[1], r[2]]), [480, 3400, CW - 5080, 1200]),
    H2(S.final.rubricH), table(S.final.rubricHead, S.final.rubric, [2600, 1000, CW - 3600], { boldFirst: true }));
  // 13 portfolio
  push(H1(S.portfolio.h), ps(S.portfolio.p), S.portfolio.list.map((t) => para(t, { num: "deliv", after: 60 })));
  // 14 assessment
  push(H1(S.assess.h), ps(S.assess.p, { keepNext: true }), table(S.assess.head, S.assess.rows, [2700, 1700, CW - 4400], { boldFirst: true }), spacer(), ps(S.assess.p2));
  // 15 results
  push(H1(S.results.h), ps(S.results.p, { keepNext: true }), table(S.results.head, S.results.rows, [2700, 3700, CW - 6400], { boldFirst: true }), spacer(), ps(S.results.p2));
  // 16 delivery
  push(H1(S.delivery.h), table(S.delivery.head, S.delivery.rows, [2300, CW - 2300], { boldFirst: true }));
  // 17 responsible use
  push(H1(S.rai.h), ps(S.rai.p), bullets(S.rai.list));
  // 18 references
  push(H1(S.refs.h), ps(S.refs.p, { size: SZ.small, color: N.sub }));
  REFS.forEach((r, i) => push(new Paragraph({
    bidirectional: false, alignment: AlignmentType.LEFT, spacing: { after: 60 }, indent: { left: 400, hanging: 400 },
    children: [new TextRun({ text: `[${i + 1}]  ${r[0]}: `, size: 18, font: font("Calibri"), color: N.ink }), new ExternalHyperlink({ link: r[1], children: [new TextRun({ text: r[1], size: 17, color: "2E7D32", underline: {}, font: font("Calibri") })] })],
  })));

  // ---------- Header / footer ----------
  const hw2 = 1700;
  const header = new Header({ children: [new Table({
    rows: [new TableRow({ children: [
      cell([new Paragraph({ bidirectional: AR, alignment: START, children: [new ImageRun({ type: "png", data: logo, transformation: { width: 96, height: 96 / LR }, altText: { title: "Green Circle logo", description: "Green Circle logo", name: "hlogo" } })] })], { w: hw2, mt: 0, mb: 0 }),
      cell([para(T.headerTitle, { size: 16, color: BR.gray, align: END, after: 0 })], { w: CW - hw2, mt: 0, mb: 0 }),
    ] })], width: { size: CW, type: WidthType.DXA }, columnWidths: [hw2, CW - hw2], borders: NB, visuallyRightToLeft: AR,
  }), new Paragraph({ children: [], spacing: { after: 0 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: N.line, space: 4 } } })] });
  const footer = new Footer({ children: [new Paragraph({ bidirectional: AR, alignment: END, children: [run(`${T.page} `, { size: 16, color: BR.gray }), new TextRun({ children: [PageNumber.CURRENT], size: 16, font: font(F.body), color: BR.gray })] })] });

  const doc = new Document({
    creator: "Green Circle", title: `${T.docTitle} · ${T.progTitle}`, description: T.coverSub,
    styles: {
      default: { document: { run: { font: font(F.body), size: SZ.body }, paragraph: { bidirectional: AR } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 30, bold: true, font: font(F.head) }, paragraph: { outlineLevel: 0, spacing: { before: 360, after: 160 } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: font(F.head) }, paragraph: { outlineLevel: 1, spacing: { before: 240, after: 100 } } },
      ],
    },
    numbering: { config: [
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: START, style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { color: BR.green } } }] },
      { reference: "outc", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: START, style: { paragraph: { indent: { left: 400, hanging: 340 } }, run: { color: BR.green, bold: true } } }] },
      { reference: "deliv", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: START, style: { paragraph: { indent: { left: 400, hanging: 340 } }, run: { color: BR.green, bold: true } } }] },
    ] },
    features: { updateFields: true },
    sections: [
      { properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MAR, bottom: MAR, left: MAR, right: MAR } } }, children: cover },
      { properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: 1300, bottom: 1100, left: MAR, right: MAR, header: 500, footer: 500 } } }, headers: { default: header }, footers: { default: footer }, children: [...contents, ...body] },
    ],
  });
  fs.writeFileSync(OUT, await Packer.toBuffer(doc));
  console.log("wrote", OUT, "sections:", secNo);
}
build().catch((e) => { console.error(e); process.exit(1); });
