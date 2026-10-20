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
const SESSIONS = require("./data_sessions");
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
function run(text, o = {}) {
  return new TextRun({
    text, bold: o.bold, boldComplexScript: o.bold, italics: o.italic && !AR, color: o.color || N.ink,
    size: o.size || SZ.body, sizeComplexScript: o.size || SZ.body, font: font(o.font || F.body), rightToLeft: AR,
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
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 }, keepLines: true, children: [new ImageRun({ type: "png", data: fs.readFileSync(p), transformation: { width: w, height: h }, altText: { title: name, description: name, name } })] });
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

  // ---------- Contents + legend ----------
  const sectionsOrder = ["exec", "background", "audience", "objectives", "outcomes", "method", "duration", "hours", "arch", "modules", "sessions", "tools", "activities", "assess", "pre", "post", "capstone", "deliverables", "trainers", "tech", "infra", "devices", "age", "rai", "kpis", "measure", "risks", "impl", "refs"];
  const tocList = sectionsOrder.map((k, i) => new Paragraph({
    bidirectional: AR, alignment: START, spacing: { after: 40, line: 264 },
    tabStops: [{ type: TabStopType.RIGHT, position: CW, leader: LeaderType.DOT }],
    children: [new InternalHyperlink({ anchor: `sec${i + 1}`, children: [run(`${i + 1}.  `, { bold: true, color: BR.green, size: 20 }), run(S[k].h, { size: 20 })] }), run("\t", { size: 20 }), new PageReference(`sec${i + 1}`)],
  }));
  const contents = [
    para(T.toc, { bold: true, size: 34, font: F.head, after: 240, before: 160 }),
    ...tocList,
    spacer(240),
    note(T.tbdLegend),
  ];

  // ---------- Body ----------
  const body = [];
  const push = (...x) => body.push(...x.flat());
  const ps = (arr, o) => arr.map((t) => para(t, o));

  // 1 exec
  push(new Paragraph({ children: [new PageBreak()] }), H1(S.exec.h), ps(S.exec.p));
  const box = S.exec.box;
  const half = CW / 2;
  push(new Table({
    rows: [0, 2, 4].map((i) => new TableRow({ children: [i, i + 1].map((j) => cell([para(box[j][0], { size: 17, color: BR.lime, bold: true, after: 20 }), para(box[j][1], { size: 22, color: N.white, bold: true, font: F.head, after: 0 })], { w: half, fill: BR.black, mt: 110, mb: 110 })) })),
    width: { size: CW, type: WidthType.DXA }, columnWidths: [half, half], borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "333333" }, insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "333333" } }, visuallyRightToLeft: AR,
  }));
  push(spacer(160), img("journey", 6.6), caption(AR ? "الشكل 1: رحلة الطالب من طلب العميل حتى المشروع الختامي" : "Figure 1. The student journey, from client request to capstone"));
  // 2 background
  push(H1(S.background.h), ps(S.background.p));
  // 3 audience
  push(H1(S.audience.h), ps(S.audience.p), table(S.audience.tableHead, S.audience.table, [2300, (CW - 2300) / 2, (CW - 2300) / 2], { boldFirst: true }), spacer(), img("agetrack", 6.6), caption(AR ? "الشكل 2: المسار الأساسي ومسار 18+" : "Figure 2. Core track and 18+ track"), para(S.audience.note, { italic: true, color: BR.gray, size: SZ.small }));
  // 4 objectives
  push(H1(S.objectives.h), bullets(S.objectives.list));
  // 5 outcomes
  push(H1(S.outcomes.h), ps(S.outcomes.p), S.outcomes.list.map((t) => para(t, { num: "outc", after: 60 })));
  // 6 method
  push(H1(S.method.h), ps(S.method.p), img("loop", 6.6), caption(AR ? "الشكل 3: حلقة التعلّم وبنية الجلسة النموذجية" : "Figure 3. The learning loop and a typical session"), ps(S.method.p2));
  // 7 duration
  push(H1(S.duration.h), ps(S.duration.p), img("timeline", 6.6), caption(AR ? "الشكل 4: الخطة الزمنية لاثني عشر أسبوعاً" : "Figure 4. Twelve-week delivery timeline"));
  // 8 hours
  const hRows = MODULES.map((m) => [`${m.id}  ${m[LANG].name}`, AR ? `${m.sessions[0]} إلى ${m.sessions[m.sessions.length - 1]}` : `${m.sessions[0]}–${m.sessions[m.sessions.length - 1]}`, String(m.T), String(m.P), String(m.T + m.P)]);
  const th = MODULES.reduce((a, m) => a + m.T, 0), pr = MODULES.reduce((a, m) => a + m.P, 0);
  hRows.push([S.hours.total, "32", String(th), String(pr), String(th + pr)]);
  push(H1(S.hours.h), ps(S.hours.p));
  const hw = [CW - 4 * 1300, 1300, 1300, 1300, 1300];
  const hTable = new Table({
    rows: [new TableRow({ tableHeader: true, children: S.hours.head.map((h, i) => cell(h, { w: hw[i], fill: BR.black, color: N.white, bold: true, font: F.head, align: i ? AlignmentType.CENTER : START })) }),
      ...hRows.map((r, ri) => { const last = ri === hRows.length - 1; return new TableRow({ cantSplit: true, children: r.map((c, i) => cell(c, { w: hw[i], fill: last ? N.tint : ri % 2 ? N.white : N.soft, bold: last || i === 0, align: i ? AlignmentType.CENTER : START })) }); })],
    width: { size: CW, type: WidthType.DXA }, columnWidths: hw, borders: TB, visuallyRightToLeft: AR, layout: TableLayoutType.FIXED,
  });
  push(hTable, spacer(), img("hours", 6.6), caption(AR ? "الشكل 5: الساعات النظرية والعملية لكل وحدة" : "Figure 5. Theory and practice hours per module"));
  // 9 architecture
  const hrsByTrack = {}; MODULES.forEach((m) => (hrsByTrack[m.track] = (hrsByTrack[m.track] || 0) + m.T + m.P));
  const trackKeys = ["foundation", "create", "produce", "market", "automate", "launch", "capstone"];
  push(H1(S.arch.h), ps(S.arch.p), img("architecture", 6.6), caption(AR ? "الشكل 6: المسارات والوحدات وخيط المشروع الختامي" : "Figure 6. Tracks, modules and the capstone thread"),
    table(S.arch.mapHead, S.arch.map.map((r, i) => [r[0], r[1], String(hrsByTrack[trackKeys[i]]), r[2]]), [1900, 1300, 1100, CW - 4300], { boldFirst: true }));
  // 10 modules
  push(H1(S.modules.h), ps(S.modules.p));
  const L = S.modules.labels;
  MODULES.forEach((m, mi) => {
    const t = m[LANG];
    const lw = 2100, vw = CW - lw;
    const sess = AR ? `${L.sessions} ${m.sessions[0]} إلى ${m.sessions[m.sessions.length - 1]}` : `${L.sessions} ${m.sessions[0]}–${m.sessions[m.sessions.length - 1]}`;
    const band = new Table({
      rows: [new TableRow({ children: [
        cell([para([run(m.id + "  ", { bold: true, color: BR.lime, size: 26, font: F.head }), run(t.name, { bold: true, color: N.white, size: 26, font: F.head })], { after: 30, keepNext: true }), para(`${sess}  ·  ${L.hours}: ${m.T + m.P}  ·  ${L.theory} ${m.T} / ${L.practice} ${m.P}`, { color: "D6D8D4", size: 18, after: 0, keepNext: true })], { w: CW, fill: BR.black, mt: 130, mb: 130 }),
      ] })], width: { size: CW, type: WidthType.DXA }, columnWidths: [CW], borders: NB, visuallyRightToLeft: AR,
    });
    const lab = (k, kn) => cell(L[k], { w: lw, fill: N.tint, bold: true, valign: VerticalAlign.TOP, keepNext: kn });
    const val = (v, kn) => cell(Array.isArray(v) ? v.map((x) => para(x, { bullet: true, size: SZ.table, after: 20, line: AR ? 264 : 252, keepNext: kn })) : v, { w: vw, valign: VerticalAlign.TOP, keepNext: kn });
    const rows = [["purpose", t.purpose], ["outcomes", t.outcomes], ["topics", t.topics.join(AR ? "، " : "; ")], ["tools", t.tools.join(AR ? "، " : ", ")], ["trainer", t.trainer], ["student", t.student], ["exercise", t.exercise], ["deliverable", t.deliverable], ["assessment", t.assessment]];
    const tbl = new Table({ rows: rows.map((r, ri) => new TableRow({ cantSplit: true, children: [lab(r[0], ri < 2), val(r[1], ri < 2)] })), width: { size: CW, type: WidthType.DXA }, columnWidths: [lw, vw], borders: TB, visuallyRightToLeft: AR, layout: TableLayoutType.FIXED });
    push(new Paragraph({ children: [], spacing: { before: mi ? 260 : 120, after: 0 }, keepNext: true }), band, tbl);
    if (m.id === "M5") push(para(S.modules.toolNote, { size: 17, color: BR.gray, italic: true, before: 60 }));
  });
  // 11 sessions
  push(H1(S.sessions.h), ps(S.sessions.p, { keepNext: true }));
  const sw = [480, 900, 950, 3100, CW - 5430];
  push(table(S.sessions.head, SESSIONS.map((s) => [String(s.n), String(s.week), s.m, s[LANG].title, s[LANG].hands]), sw));
  // 12 tools
  push(H1(S.tools.h), ps(S.tools.p, { keepNext: true }));
  push(table(S.tools.head, S.tools.rows, [1500, 1850, 2650, CW - 6750, 750], { boldFirst: true }));
  // 13 activities
  push(H1(S.activities.h), ps(S.activities.p, { keepNext: true }), table(S.activities.head, S.activities.rows, [2100, 950, CW - 5350, 2300], { boldFirst: true }));
  // 14 assessments
  push(H1(S.assess.h), ps(S.assess.p, { keepNext: true }), table(S.assess.head, S.assess.rows, [3200, 1600, CW - 4800], { boldFirst: true }), spacer(), ps(S.assess.p2));
  // 15 pre
  push(H1(S.pre.h), ps(S.pre.p), bullets(S.pre.list));
  // 16 post
  push(H1(S.post.h), ps(S.post.p));
  // 17 capstone
  push(H1(S.capstone.h), ps(S.capstone.p), img("capstone", 6.6), caption(AR ? "الشكل 7: مراحل المشروع الختامي ومخرجاته التسعة عشر" : "Figure 7. Capstone phases and its 19 deliverables"), ps(S.capstone.p2),
    table(S.capstone.head, S.capstone.rows.map((r, i) => [String(i + 1), r[0], r[1], r[2]]), [600, CW - 4200, 1400, 2200]), H2(S.capstone.rubricH), table(S.capstone.rubricHead, S.capstone.rubric, [2300, 1000, CW - 3300], { boldFirst: true }));
  // 18 deliverables
  push(H1(S.deliverables.h), ps(S.deliverables.p), S.deliverables.list.map((t) => para(t, { num: "deliv", after: 60 })));
  // 19 trainers
  push(H1(S.trainers.h), ps(S.trainers.p), bullets(S.trainers.list));
  // 20 tech
  push(H1(S.tech.h), bullets(S.tech.list));
  // 21 infra
  push(H1(S.infra.h), bullets(S.infra.list));
  // 22 devices
  push(H1(S.devices.h), bullets(S.devices.list));
  // 23 age
  push(H1(S.age.h), ps(S.age.p), table(S.age.head, S.age.rows, [2200, (CW - 2200) / 2, (CW - 2200) / 2], { boldFirst: true }));
  // 24 RAI
  push(H1(S.rai.h), ps(S.rai.p), bullets(S.rai.list), spacer(60), ps(S.rai.p2));
  // 25 KPIs
  push(H1(S.kpis.h), ps(S.kpis.p, { keepNext: true }), table(S.kpis.head, DECK.kpi.rows.map((r, i) => [r[0], r[1], r[2] + (AR ? " (مقترح)" : " (Proposed)"), S.kpis.src[i]]), [2300, 2900, 2300, CW - 7500], { boldFirst: true }), spacer(60), para(DECK.kpi.foot, { italic: true, size: SZ.small, color: BR.gray }));
  // 26 measurement
  push(H1(S.measure.h), ps(S.measure.p, { keepNext: true }), table(S.measure.head, S.measure.rows, [2300, 3400, CW - 5700], { boldFirst: true }), spacer(), ps(S.measure.p2), H2(S.measure.freeH), bullets(S.measure.free));
  // 27 risks
  push(H1(S.risks.h), table(S.risks.head, S.risks.rows, [2900, 1150, 1050, CW - 5100], { boldFirst: true }));
  // 28 implementation
  push(H1(S.impl.h));
  S.impl.phases.forEach((p) => push(H2(p[0], { before: 160 }), bullets(p[1])));
  push(H2(S.impl.decH, { before: 200 }), bullets(S.impl.dec));
  // 29 refs
  push(H1(S.refs.h), ps(S.refs.p, { size: SZ.small, color: N.sub }));
  REFS.forEach((r, i) => push(new Paragraph({
    bidirectional: false, alignment: AlignmentType.LEFT, spacing: { after: 60 }, indent: { left: 400, hanging: 400 },
    children: [new TextRun({ text: `[${i + 1}]  ${r[0]}. `, size: 18, font: font(F.body === "Calibri" ? "Calibri" : "IBM Plex Sans Arabic"), color: N.ink }), new ExternalHyperlink({ link: r[1], children: [new TextRun({ text: r[1], size: 17, color: "2E7D32", underline: {}, font: font("Calibri") })] })],
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
      default: { document: { run: { font: font(F.body), size: SZ.body, rightToLeft: AR }, paragraph: { bidirectional: AR } } },
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
