// AI Creators proposal deck in the HIKAYA AI template style (English, 16 slides).
const path = require("path");
const pptxgen = require("pptxgenjs");
const { icon } = require("../build/icons");
const M = require("./v1/data_modules");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const OUT = process.argv[2] || "AI_Creators_Proposal_EN.pptx";
// HIKAYA template palette (sampled from the supplied deck)
const C = { navy: "10233A", teal: "0A8577", orange: "F2A541", light: "F3F6F8", red: "E4572E", ink: "10233A", body: "2B3A4A", muted: "586676", white: "FFFFFF", tealSoft: "E0EFED", orangeSoft: "FCEBD3" };
const HF = "Cambria", BF = "Calibri";
const A = (f) => path.join(__dirname, "assets", f);
const GC_R = 771 / 274;

const THEME = { name: "AI Creators", headFontFace: HF, bodyFontFace: BF, colors: { dk1: "10233A", lt1: "FFFFFF", dk2: "0A8577", lt2: "F3F6F8", accent1: "0A8577", accent2: "F2A541", accent3: "10233A", accent4: "E4572E", accent5: "586676", accent6: "E0EFED", hlink: "0A8577", folHlink: "586676" } };

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in, same as the HIKAYA deck
pres.theme = { headFontFace: HF, bodyFontFace: BF };
pres.title = "AI Creators: Training Proposal";
pres.author = "Green Circle";
pres.company = "Green Circle";

const FOOT = "AI CREATORS  ·  AI skills for content, marketing and automation";
pres.defineSlideMaster({
  title: "CONTENT", background: { color: C.white },
  objects: [
    { image: { path: A("gc-logo-transparent.png"), x: 7.62, y: 0.22, w: 1.25, h: 1.25 / GC_R, altText: "Green Circle logo" } },
    { image: { path: A("jubilee.png"), x: 8.98, y: 0.13, w: 0.56, h: 0.55, altText: "Jubilee Institute logo" } },
    { text: { text: FOOT, options: { x: 0.5, y: 5.2, w: 6, h: 0.25, fontFace: BF, fontSize: 9, color: C.muted, margin: 0 } } },
  ],
  slideNumber: { x: 9.1, y: 5.2, w: 0.4, h: 0.25, fontFace: BF, fontSize: 9, color: C.muted, align: "right" },
});
pres.defineSlideMaster({ title: "COVER", background: { path: A("cover-bg.jpg") } });

const PENDING = [];
const ico = (s, name, color, x, y, w) => PENDING.push(icon(name, "#" + color).then((i) => s.addImage({ data: i.b64, x, y, w, h: w })));
const T = (s, t, o) => s.addText(t, Object.assign({ fontFace: BF, fontSize: 12, color: C.body, margin: 0, valign: "top", isTextBox: true }, o));
const box = (s, x, y, w, h, fill, o = {}) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.06 }, o));
const circ = (s, x, y, d, fill) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
function iconDot(s, name, x, y, d, fill, color = "FFFFFF") { circ(s, x, y, d, fill); ico(s, name, color, x + d * 0.25, y + d * 0.25, d * 0.5); }
function header(s, ch, title) {
  box(s, 0.5, 0.27, 2.3, 0.3, C.navy, { rectRadius: 0.15 });
  T(s, ch, { x: 0.5, y: 0.27, w: 2.3, h: 0.3, fontSize: 10.5, bold: true, color: C.orange, align: "center", valign: "middle" });
  T(s, title, { x: 0.5, y: 0.66, w: 7.1, h: 0.62, fontFace: HF, fontSize: 25, bold: true, color: C.navy, valign: "middle" });
}
const bl = (items, o = {}) => items.map((t, i) => ({ text: t, options: Object.assign({ bullet: { indent: 12 }, breakLine: i < items.length - 1, paraSpaceAfter: 5 }, o) }));
let n = 0;
const slide = (master = "CONTENT") => { n++; return pres.addSlide({ masterName: master }); };

// ---- shared numbers from the official curriculum ----
const TH = M.reduce((a, m) => a + m.T, 0), PR = M.reduce((a, m) => a + m.P, 0), TOT = TH + PR;
const strip = (t) => t.replace(/\s*\((?:18\+ track|trainer demo; hands-on for eligible 18\+)\)/g, "").replace(/\*/g, "").replace(/\s*\(provider TBD\)/g, "");

async function build() {
  // 1 COVER
  {
    const s = slide("COVER");
    T(s, "TRAINING PROPOSAL  ·  96 HOURS  ·  12 WEEKS", { x: 0.6, y: 0.95, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.orange });
    T(s, "AI CREATORS", { x: 0.6, y: 1.3, w: 6.2, h: 0.95, fontFace: HF, fontSize: 50, bold: true, color: C.white, valign: "middle" });
    T(s, "صُنّاع المحتوى", { x: 0.6, y: 2.2, w: 4, h: 0.5, fontFace: "Arial", fontSize: 24, bold: true, color: C.orange, rtlMode: true, align: "left", lang: "ar-SA" });
    T(s, "AI-powered content creation, digital marketing, automation and freelancing: from a client's idea to a finished, published campaign", { x: 0.6, y: 2.85, w: 5.6, h: 0.9, fontSize: 16, color: "D9E1EA", lsm: 1.05 });
    s.addImage({ path: A("gc-logo-transparent.png"), x: 0.62, y: 4.05, w: 1.75, h: 1.75 / GC_R, altText: "Green Circle logo" });
    s.addShape(pres.shapes.LINE, { x: 2.75, y: 3.95, w: 0, h: 0.85, line: { color: "AAB1B9", width: 1 } });
    s.addImage({ path: A("jubilee-cover.png"), x: 3.05, y: 3.93, w: 0.98, h: 0.98 * 142 / 178, altText: "Jubilee Institute logo" });
    T(s, "*Proposed host, subject to mutual agreement. AI Creators is a working title.", { x: 0.6, y: 5.18, w: 6, h: 0.25, fontSize: 9, color: "C9D1DA" });
    // centre emblem on the network, as in the template
    s.addShape(pres.shapes.OVAL, { x: 7.0, y: 1.98, w: 1.65, h: 1.65, fill: { color: C.teal }, line: { color: C.orange, width: 3 } });
    ico(s, "LuWandSparkles", "FFFFFF", 7.45, 2.43, 0.75);
  }

  // 2 PROGRAM AT A GLANCE
  {
    const s = slide(); header(s, "CH 1  ·  THE PROGRAM", "The program at a glance");
    const stats = [["LuClock", String(TOT), "training hours"], ["LuCalendarDays", "32", "sessions of 3 hours"], ["LuHammer", "70%", "hands-on practice"], ["LuFlag", "12", "weeks, including 1 buffer week"]];
    stats.forEach((st, i) => {
      const x = 0.5 + i * 2.29, fill = i % 2 ? C.teal : C.navy;
      box(s, x, 1.45, 2.11, 2.0, fill);
      iconDot(s, st[0], x + 0.86, 1.6, 0.4, C.orange, C.navy);
      T(s, st[1], { x, y: 2.08, w: 2.11, h: 0.62, fontFace: HF, fontSize: 32, bold: true, color: C.orange, align: "center", valign: "middle" });
      T(s, st[2], { x: x + 0.12, y: 2.72, w: 1.87, h: 0.6, fontSize: 13, color: C.white, align: "center" });
    });
    box(s, 0.5, 3.7, 4.4, 1.35, C.light);
    iconDot(s, "LuCircleCheck", 0.65, 3.83, 0.4, C.teal);
    T(s, "What success looks like", { x: 1.15, y: 3.83, w: 3.6, h: 0.4, fontSize: 15, bold: true, color: C.teal, valign: "middle" });
    T(s, "85% complete · +25-point average skills gain · every participant leaves with a portfolio of 8 pieces of work (proposed targets)", { x: 0.65, y: 4.3, w: 4.15, h: 0.7, fontSize: 12.5, color: C.body });
    box(s, 5.1, 3.7, 4.4, 1.35, C.light);
    T(s, "The partnership", { x: 5.25, y: 3.8, w: 4, h: 0.35, fontSize: 15, bold: true, color: C.teal });
    [["LEAD", "Green Circle"], ["PROPOSED HOST*", "Jubilee Institute"], ["PARTICIPANTS", "20 per cohort"]].forEach((p, i) => {
      const x = 5.25 + i * 1.4;
      box(s, x, 4.22, 1.3, 0.72, C.navy);
      T(s, p[0], { x, y: 4.27, w: 1.3, h: 0.25, fontSize: 8.5, bold: true, color: C.orange, align: "center" });
      T(s, p[1], { x, y: 4.52, w: 1.3, h: 0.38, fontSize: 11.5, bold: true, color: C.white, align: "center", valign: "middle" });
    });
    s.addNotes("All figures are design parameters. Cohort size and hosting are proposals, subject to mutual agreement.");
  }

  // 3 WHY GREEN CIRCLE
  {
    const s = slide(); header(s, "CH 2  ·  WHY GREEN CIRCLE", "What Green Circle adds to the partnership");
    const rows = [["LuBrain", "AI expertise", "Designs and leads all AI content, labs and coaching"], ["LuBookOpen", "A ready program", "11 modules, 96 hours, sessions, tools and a capstone, already designed"], ["LuUserCheck", "Program leadership", "One accountable lead for delivery, quality and reporting"], ["LuAward", "Delivery record", "References: USAID, CFYE, MoDEE, Q2 Impact"], ["LuShieldCheck", "Secure by default", "“be aware..be secure”: privacy, credential safety and honest AI labelling in every module"]];
    rows.forEach((r, i) => {
      const y = 1.42 + i * 0.73;
      box(s, 0.5, y, 5.35, 0.64, C.light);
      iconDot(s, r[0], 0.62, y + 0.11, 0.42, C.teal);
      T(s, r[1], { x: 1.15, y, w: 1.65, h: 0.64, fontSize: 13, bold: true, color: C.teal, valign: "middle" });
      T(s, r[2], { x: 2.85, y, w: 2.9, h: 0.64, fontSize: 11, color: C.body, valign: "middle" });
    });
    box(s, 6.05, 1.42, 3.45, 3.57, C.navy);
    iconDot(s, "LuLandmark", 6.2, 1.57, 0.42, C.orange, C.navy);
    T(s, "Value for Jubilee Institute", { x: 6.72, y: 1.57, w: 2.7, h: 0.42, fontSize: 14, bold: true, color: C.orange, valign: "middle" });
    T(s, bl(["A complete, hands-on AI content program on its site, with no design burden", "Participants who leave with finished work and portfolios", "A Demo Day the Institute can host and showcase", "Measured, reported results it can cite", "A curriculum that can run again with new cohorts, if agreed"], { color: C.white }), { x: 6.22, y: 2.15, w: 3.15, h: 2.75, fontSize: 11.5, color: C.white });
  }

  // 4 OUTCOMES
  {
    const s = slide(); header(s, "CH 3  ·  OUTCOMES", "What participants will be able to do");
    box(s, 0.5, 1.4, 3.55, 3.65, C.navy);
    iconDot(s, "LuTarget", 0.65, 1.53, 0.42, C.orange, C.navy);
    T(s, "Program objectives", { x: 1.17, y: 1.53, w: 2.8, h: 0.42, fontSize: 14, bold: true, color: C.orange, valign: "middle" });
    T(s, bl(["Practical AI literacy: how AI tools work, where they fail, how to use them safely and honestly", "A repeatable process from client request to published content", "Core content skills: copy, hooks and CTAs, characters, voice, visuals, scripts, storyboards, video", "Digital marketing planning: personas, objectives, calendars, campaigns", "Hands-on automation with n8n", "Presenting work and approaching freelance opportunities responsibly"], { color: C.white }), { x: 0.67, y: 2.05, w: 3.28, h: 2.95, fontSize: 10.5, color: C.white });
    box(s, 4.25, 1.4, 5.25, 3.65, C.light);
    iconDot(s, "LuGraduationCap", 4.4, 1.53, 0.42, C.teal);
    T(s, "Learning outcomes: by the end, each participant can", { x: 4.92, y: 1.53, w: 4.5, h: 0.42, fontSize: 14, bold: true, color: C.teal, valign: "middle" });
    const lo = ["Turn a vague request into a one-page brief backed by verified research", "Write structured prompts and reusable context packs", "Produce a carousel, captions with CTAs and consistent brand visuals", "Design an AI character with a character sheet and voice profile", "Script, storyboard, produce and edit a 30–45 second captioned video", "Build a persona, a four-week content calendar and a campaign plan", "Build an n8n workflow (form → AI → Google Sheets) and explain each step", "Publish a one-page portfolio and describe three service offers", "Present a team capstone and the decisions behind it"];
    lo.forEach((t, i) => {
      const y = 2.06 + i * 0.33;
      circ(s, 4.42, y + 0.03, 0.24, C.teal);
      T(s, String(i + 1), { x: 4.42, y: y + 0.03, w: 0.24, h: 0.24, fontSize: 9, bold: true, color: C.white, align: "center", valign: "middle" });
      T(s, t, { x: 4.78, y, w: 4.6, h: 0.3, fontSize: 10.5, color: C.body, valign: "middle" });
    });
  }

  // 5 THE JOURNEY
  {
    const s = slide(); header(s, "CH 4  ·  THE JOURNEY", "From a client's idea to a published campaign");
    const st = [["LuSearch", "Research & Client Brief"], ["LuPenLine", "Prompting & Content"], ["LuUserRound", "Characters, Voice & Visuals"], ["LuLayoutPanelTop", "Script & Storyboard"], ["LuClapperboard", "AI Video & Editing"], ["LuMegaphone", "Digital Marketing"], ["LuWorkflow", "n8n Automation"], ["LuBriefcase", "Portfolio & Capstone"]];
    st.forEach((t, i) => {
      const r = Math.floor(i / 4), c = i % 4, x = 0.5 + c * 2.29, y = 1.38 + r * 1.36, dark = r === 1;
      box(s, x, y, 2.11, 1.24, dark ? C.navy : C.light);
      iconDot(s, t[0], x + 0.13, y + 0.12, 0.48, dark ? C.orange : C.teal, dark ? C.navy : C.white);
      T(s, t[1], { x: x + 0.13, y: y + 0.66, w: 1.9, h: 0.52, fontSize: 13, bold: true, color: dark ? C.white : C.navy, valign: "middle" });
      T(s, String(i + 1).padStart(2, "0"), { x: x + 1.5, y: y + 0.12, w: 0.5, h: 0.3, fontSize: 11, bold: true, color: dark ? C.orange : C.teal, align: "right" });
    });
    box(s, 0.5, 4.1, 9.0, 0.98, C.navy);
    T(s, [{ text: "Why this focus: ", options: { bold: true, color: C.orange } }, { text: "many people already use AI for quick answers, but few use it to produce work a client can use. Small businesses, NGOs and community initiatives need steady content and often lack the time or skills to make it. AI Creators trains participants to deliver that work with AI tools, step by step, the way a small agency works with a real client.", options: { color: C.white } }], { x: 0.68, y: 4.1, w: 8.65, h: 0.98, fontSize: 11.5, valign: "middle" });
  }

  // 6 LEARN (chart)
  {
    const s = slide(); header(s, "CH 5  ·  LEARN", `Eleven modules, ${TOT} hours per participant`);
    const labels = M.map((m) => `${m.id} ${m.en.short}`);
    s.addChart(pres.charts.BAR, [{ name: "Hours", labels, values: M.map((m) => m.T + m.P) }], {
      x: 0.4, y: 1.3, w: 5.6, h: 3.8, barDir: "bar", chartColors: [C.teal], catAxisOrientation: "maxMin",
      catAxisLabelFontFace: BF, catAxisLabelFontSize: 10, catAxisLabelColor: C.navy, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: BF, dataLabelFontSize: 10, dataLabelColor: C.navy, showLegend: false, barGapWidthPct: 45,
    });
    box(s, 6.2, 1.42, 3.3, 3.62, C.light);
    iconDot(s, "LuMonitorPlay", 6.35, 1.55, 0.42, C.teal);
    T(s, "How it is delivered", { x: 6.87, y: 1.55, w: 2.5, h: 0.42, fontSize: 15, bold: true, color: C.teal, valign: "middle" });
    T(s, [
      { text: "32 sessions × 3 hours, three a week", options: { breakLine: true } },
      { text: `${TH} h concept and demo`, options: { breakLine: true } },
      { text: `${PR} h hands-on practice`, options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 6 } },
      { text: "Every session follows the same loop: see it, try it, build it, show it.", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 6 } },
      { text: "Completion = 80% attendance + capstone. Certificate of completion (proposed)." },
    ], { x: 6.37, y: 2.1, w: 3.0, h: 2.85, fontSize: 12, color: C.body, paraSpaceAfter: 3 });
  }

  // 7 MODULES (single table)
  {
    const s = slide(); header(s, "CH 6  ·  MODULES", "Eleven modules at a glance");
    const head = ["Module", "h", "Key tools", "Participants produce"].map((h) => ({ text: h, options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 9.5 } }));
    const rows = [head, ...M.map((m, i) => {
      const fill = { color: i % 2 ? C.white : C.light };
      return [
        { text: [{ text: m.id + "  ", options: { bold: true, color: C.teal } }, { text: m.en.short, options: { bold: true, color: C.navy } }], options: { fill } },
        { text: String(m.T + m.P), options: { fill, align: "center", bold: true, color: C.navy } },
        { text: m.en.tools.map(strip).join(", ").replace("Recorded narration (phone or USB mic)", "recorded narration"), options: { fill } },
        { text: m.en.deliverable.replace(/\s*\(Capstone milestone(?: 1)?\)/, ""), options: { fill } },
      ];
    })];
    s.addTable(rows, { x: 0.5, y: 1.35, w: 9.0, colW: [2.1, 0.35, 2.85, 3.7], fontFace: BF, fontSize: 8.5, color: C.body, valign: "middle", margin: [0.02, 0.06, 0.02, 0.06], border: { type: "solid", pt: 0.5, color: "DDE3E9" }, rowH: 0.3 });
    s.addNotes("Google Flow and AI voice tools are used where account access allows; otherwise the trainer demonstrates them and participants use recorded narration and their own footage.");
  }

  // 9 THE PLAN
  {
    const s = slide(); header(s, "CH 7  ·  THE PLAN", "Twelve weeks, three sessions a week");
    const ph = [["Foundations", "M1–M3", "Weeks 1–2"], ["Create & produce", "M4–M7", "Weeks 3–7"], ["Market", "M8", "Weeks 7–8"], ["Automate & launch", "M9–M10", "Weeks 8–10"], ["Capstone", "M11", "Weeks 10–11"]];
    ph.forEach((p, i) => {
      const x = 0.5 + i * 1.83, fill = i % 2 ? C.teal : C.navy;
      box(s, x, 1.42, 1.68, 1.3, fill);
      T(s, p[0], { x, y: 1.5, w: 1.68, h: 0.32, fontSize: 12, bold: true, color: C.white, align: "center" });
      T(s, p[1], { x, y: 1.83, w: 1.68, h: 0.5, fontFace: HF, fontSize: 22, bold: true, color: C.orange, align: "center", valign: "middle" });
      T(s, p[2], { x, y: 2.35, w: 1.68, h: 0.3, fontSize: 11, color: "D9E1EA", align: "center" });
    });
    s.addShape(pres.shapes.LINE, { x: 0.8, y: 3.35, w: 8.4, h: 0, line: { color: C.teal, width: 3 } });
    const ms = [["W1", "Orientation and pre-assessment"], ["W2", "Client brief approved"], ["W7", "Edited video"], ["W9", "Working automation"], ["W11", "Post-assessment and Demo Day"], ["W12", "Buffer for make-ups"]];
    ms.forEach((m, i) => {
      const cx = 1.0 + i * 1.6;
      circ(s, cx - 0.25, 3.1, 0.5, i % 2 ? C.teal : C.navy);
      T(s, String(i + 1), { x: cx - 0.25, y: 3.1, w: 0.5, h: 0.5, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle" });
      T(s, m[0], { x: cx - 0.75, y: 3.72, w: 1.5, h: 0.25, fontSize: 12, bold: true, color: C.navy, align: "center" });
      T(s, m[1], { x: cx - 0.75, y: 3.98, w: 1.5, h: 0.5, fontSize: 11, color: C.body, align: "center" });
    });
    T(s, "Sessions run three times a week (proposed). Each module's output feeds the team's capstone, so the final weeks are for finishing, not starting.", { x: 0.5, y: 4.7, w: 9, h: 0.35, fontSize: 10.5, italic: true, color: C.muted });
  }

  // 10 PRACTICE
  {
    const s = slide(); header(s, "CH 8  ·  PRACTICE", "Every session ends with something made");
    const loop = [["LuEye", "See it", "Short concept and live demo"], ["LuSquarePen", "Try it", "Guided exercise in pairs"], ["LuHammer", "Build it", "Apply it to the capstone client"], ["LuPresentation", "Show it", "Share, get feedback, improve"]];
    loop.forEach((l, i) => {
      const x = 0.5 + i * 2.29, dark = i === 2;
      box(s, x, 1.38, 2.11, 0.82, dark ? C.navy : C.light);
      iconDot(s, l[0], x + 0.12, 1.5, 0.4, dark ? C.orange : C.teal, dark ? C.navy : C.white);
      T(s, `${i + 1}. ${l[1]}`, { x: x + 0.6, y: 1.44, w: 1.45, h: 0.3, fontSize: 12.5, bold: true, color: dark ? C.orange : C.teal });
      T(s, l[2], { x: x + 0.6, y: 1.74, w: 1.45, h: 0.42, fontSize: 9.5, color: dark ? C.white : C.body });
    });
    const seg = [[50, C.muted, "Concept & demo  0:00–0:50"], [105, C.teal, "Hands-on build  0:50–2:35"], [25, C.navy, "Show  2:35–3:00"]];
    let x = 0.5;
    seg.forEach((g) => { const w = 9.0 * g[0] / 180; s.addShape(pres.shapes.RECTANGLE, { x, y: 2.32, w: w - 0.03, h: 0.36, fill: { color: g[1] }, line: { color: g[1] } }); T(s, g[2], { x, y: 2.32, w: w - 0.03, h: 0.36, fontSize: g[0] < 30 ? 8.5 : 10.5, bold: true, color: C.white, align: "center", valign: "middle" }); x += w; });
    T(s, "Twelve structured exercises", { x: 0.5, y: 2.82, w: 5, h: 0.3, fontSize: 13, bold: true, color: C.navy });
    const ex = [["M1", "Spot the error", "Fix five AI answers with sources"], ["M2", "Prompt upgrade", "One prompt, three versions, scored"], ["M3", "Fact-check race", "Verify six claims with sources"], ["M3", "Client role-play", "Interview a vague client, write the brief"], ["M4", "Hook clinic", "Ten hooks, peers shortlist three"], ["M5", "One character, four scenes", "Keep a character consistent"], ["M6", "60 to 30", "Halve a script, keep the message"], ["M7", "Continuity challenge", "Three matching consecutive shots"], ["M8", "Campaign sprint", "Two-week campaign in 60 minutes"], ["M9", "Content Idea Generator", "Form → AI → Sheets in n8n"], ["M10", "Client inbox", "Reply to three client messages"], ["M11", "Demo Day dry run", "Rehearse with peer feedback"]];
    ex.forEach((e, i) => {
      const c = i % 4, r = Math.floor(i / 4), ex0 = 0.5 + c * 2.27, ey = 3.18 + r * 0.62;
      box(s, ex0, ey, 2.17, 0.55, i % 2 ? C.light : C.tealSoft);
      T(s, e[0], { x: ex0 + 0.08, y: ey + 0.05, w: 0.42, h: 0.22, fontSize: 8.5, bold: true, color: C.teal });
      T(s, e[1], { x: ex0 + 0.5, y: ey + 0.04, w: 1.62, h: 0.24, fontSize: 10, bold: true, color: C.navy });
      T(s, e[2], { x: ex0 + 0.08, y: ey + 0.28, w: 2.05, h: 0.24, fontSize: 8.5, color: C.body });
    });
  }

  // 10b PRACTICE IN ACTION
  {
    const s = slide(); header(s, "CH 9  ·  IN ACTION", "What participants actually do, step by step");
    const flows = [["LuPenLine", "Content", ["One idea", "Reel hook", "Carousel", "Caption + CTA"], "Carousel and 5 captions"], ["LuClapperboard", "Video", ["Character", "Voice", "Script", "Storyboard", "AI video", "Edit & publish"], "30–45 second video"], ["LuMegaphone", "Marketing", ["Persona", "SMART objective", "4-week calendar", "Campaign"], "Campaign one-pager"], ["LuWorkflow", "Automation (n8n)", ["Form", "n8n", "AI step", "Hook · caption · CTA", "Google Sheets"], "Working workflow"], ["LuBriefcase", "Freelancing", ["Build a page", "Package 3 services", "Client messages"], "Portfolio and offers"]];
    flows.forEach((f, i) => {
      const y = 1.38 + i * 0.74, dark = i === 3;
      box(s, 0.5, y, 1.75, 0.62, dark ? C.navy : C.teal);
      ico(s, f[0], dark ? C.orange : "FFFFFF", 0.62, y + 0.17, 0.28);
      T(s, f[1], { x: 0.98, y, w: 1.25, h: 0.62, fontSize: 11.5, bold: true, color: C.white, valign: "middle" });
      const steps = f[2], cw = 5.45, gap = 0.17, w = (cw - gap * (steps.length - 1)) / steps.length;
      steps.forEach((st, j) => {
        const sx = 2.38 + j * (w + gap);
        box(s, sx, y + 0.08, w, 0.46, C.light);
        T(s, st, { x: sx + 0.04, y: y + 0.08, w: w - 0.08, h: 0.46, fontSize: steps.length > 5 ? 9 : 10, bold: true, color: C.navy, align: "center", valign: "middle" });
        if (j < steps.length - 1) ico(s, "LuChevronRight", C.orange, sx + w + 0.015, y + 0.24, 0.14);
      });
      box(s, 7.95, y + 0.08, 1.55, 0.46, C.orangeSoft);
      T(s, f[3], { x: 7.99, y: y + 0.08, w: 1.47, h: 0.46, fontSize: 9.5, bold: true, color: C.navy, align: "center", valign: "middle" });
    });
    T(s, "Each workflow is practised on the team's capstone client, so every output also becomes part of the final package.", { x: 0.5, y: 5.0, w: 9, h: 0.2, fontSize: 9.5, italic: true, color: C.muted });
  }

  // 11 TOOLS
  {
    const s = slide(); header(s, "CH 10  ·  TOOLS", "The AI tools participants learn to use");
    const cards = [["LuMessageSquare", "AI assistants", "ChatGPT · Gemini", "Research, prompting, writing and editing"], ["LuPalette", "Design & images", "Canva · ChatGPT / Gemini images", "Carousels, characters, brand visuals"], ["LuClapperboard", "Video", "Google Flow · CapCut", "Generated shots, editing, captions"], ["LuMic", "Voice", "ElevenLabs · recorded narration", "Voice profiles and 30-second narration"], ["LuWorkflow", "Automation", "n8n · Google Sheets", "Form → AI → Sheets content workflow"], ["LuGlobe", "Web & portfolio", "AI canvas · GitHub Pages", "A published one-page portfolio"]];
    cards.forEach((c, i) => {
      const r = Math.floor(i / 3), col = i % 3, x = 0.5 + col * 3.05, y = 1.42 + r * 1.78;
      const dark = i === 4;
      box(s, x, y, 2.9, 1.62, dark ? C.navy : C.light);
      iconDot(s, c[0], x + 0.15, y + 0.15, 0.46, dark ? C.orange : C.teal, dark ? C.navy : C.white);
      T(s, c[1], { x: x + 0.72, y: y + 0.15, w: 2.1, h: 0.46, fontSize: 14, bold: true, color: dark ? C.orange : C.teal, valign: "middle" });
      T(s, c[2], { x: x + 0.15, y: y + 0.72, w: 2.65, h: 0.32, fontSize: 12, bold: true, color: dark ? C.white : C.navy });
      T(s, c[3], { x: x + 0.15, y: y + 1.05, w: 2.65, h: 0.45, fontSize: 11, color: dark ? "D9E1EA" : C.body });
    });
  }

  // 12 CAPSTONE
  {
    const s = slide(); header(s, "CH 11  ·  CAPSTONE", "Capstone: an AI-powered mini digital agency");
    T(s, "Teams of 3–4 choose a real or realistic client (a small business, NGO, local shop or community initiative) and deliver a complete campaign package.", { x: 0.5, y: 1.35, w: 9, h: 0.45, fontSize: 12, color: C.body });
    const ph = [["Discover", ["Research", "Client brief", "Audience persona", "Marketing objective"]], ["Plan", ["Content strategy", "Content calendar", "Marketing campaign"]], ["Create", ["AI character", "Voice profile", "Visual assets", "Video scripts", "Storyboard", "AI video", "Edited final video", "Social posts"]], ["Automate & launch", ["n8n automation", "Landing page"]], ["Present", ["Portfolio case study", "Final presentation"]]];
    let k = 0;
    ph.forEach((p, i) => {
      const x = 0.5 + i * 1.83, dark = i === 2;
      box(s, x, 1.88, 1.7, 0.4, dark ? C.orange : C.navy);
      T(s, p[0], { x, y: 1.88, w: 1.7, h: 0.4, fontSize: 11.5, bold: true, color: dark ? C.navy : C.white, align: "center", valign: "middle" });
      box(s, x, 2.35, 1.7, 2.35, C.light);
      p[1].forEach((d, j) => {
        k++;
        const y = 2.43 + j * 0.28;
        circ(s, x + 0.08, y + 0.03, 0.2, dark ? C.orange : C.teal);
        T(s, String(k), { x: x + 0.08, y: y + 0.03, w: 0.2, h: 0.2, fontSize: 7.5, bold: true, color: dark ? C.navy : C.white, align: "center", valign: "middle" });
        T(s, d, { x: x + 0.34, y, w: 1.34, h: 0.26, fontSize: 10, color: C.body, valign: "middle" });
      });
    });
    T(s, "19 deliverables. Team roles rotate: strategist · content lead · visual & video lead · automation lead.", { x: 0.5, y: 4.78, w: 9, h: 0.3, fontSize: 11.5, bold: true, color: C.navy });
  }

  // 13 ASSESSMENT
  {
    const s = slide(); header(s, "CH 12  ·  ASSESSMENT", "How progress and work are assessed");
    const cards = [[C.navy, "BEFORE · Session 1", "Knowledge check (50) + practical task (50). Baseline, not graded."], [C.teal, "DURING · Every module", "Deliverable checklists; week-6 mid-point review."], [C.navy, "AFTER · Session 32", "Same test, parallel questions. Gain = post − pre."], [C.red, "LATER · 3 months", "Follow-up survey on skills use (proposed)."]];
    cards.forEach((c, i) => {
      const x = 0.5 + i * 2.29;
      box(s, x, 1.38, 2.11, 1.12, c[0]);
      T(s, c[1], { x: x + 0.12, y: 1.45, w: 1.9, h: 0.28, fontSize: 10.5, bold: true, color: i === 3 ? C.white : C.orange });
      T(s, c[2], { x: x + 0.12, y: 1.75, w: 1.9, h: 0.7, fontSize: 9.5, color: C.white });
    });
    box(s, 0.5, 2.65, 3.6, 2.4, C.light);
    T(s, "Final grade (proposed)", { x: 0.65, y: 2.73, w: 3.3, h: 0.32, fontSize: 13, bold: true, color: C.teal });
    [["Module deliverables", 40], ["Capstone package", 35], ["Demo Day presentation", 15], ["Participation & reflection", 10]].forEach((w, i) => {
      const y = 3.08 + i * 0.4;
      T(s, w[0], { x: 0.65, y, w: 2.2, h: 0.22, fontSize: 10, color: C.navy, bold: true });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.65, y: y + 0.23, w: 2.75 * w[1] / 40, h: 0.13, fill: { color: i === 0 ? C.teal : i === 1 ? C.navy : C.orange }, line: { color: i === 0 ? C.teal : i === 1 ? C.navy : C.orange } });
      T(s, `${w[1]}%`, { x: 3.45, y: y + 0.12, w: 0.55, h: 0.3, fontSize: 11, bold: true, color: C.navy });
    });
    T(s, "Completion: 80% attendance + capstone submitted.", { x: 0.65, y: 4.78, w: 3.35, h: 0.22, fontSize: 9, italic: true, color: C.muted });
    box(s, 4.3, 2.65, 5.2, 2.4, C.light);
    T(s, "Capstone rubric (proposed): “meets standard” = 3 of 4", { x: 4.45, y: 2.73, w: 5, h: 0.32, fontSize: 13, bold: true, color: C.teal });
    [["Brief and research", "15%", "Clear objective; claims verified"], ["Content quality", "20%", "On-brand copy, strong hooks and CTAs"], ["Visual and video", "20%", "Consistent visuals; captioned, clean audio"], ["Marketing plan", "15%", "Persona, SMART objective, realistic calendar"], ["Automation", "10%", "Workflow runs; team can explain it"], ["Responsible AI", "10%", "AI content labelled; no misuse of data"], ["Presentation", "10%", "Clear story of decisions and results"]].forEach((r, i) => {
      const y = 3.1 + i * 0.27;
      T(s, r[0], { x: 4.45, y, w: 1.55, h: 0.26, fontSize: 9.5, bold: true, color: C.navy, valign: "middle" });
      T(s, r[1], { x: 6.0, y, w: 0.45, h: 0.26, fontSize: 9.5, bold: true, color: C.orange, valign: "middle" });
      T(s, r[2], { x: 6.45, y, w: 2.95, h: 0.26, fontSize: 9.5, color: C.body, valign: "middle" });
    });
  }

  // 14 RESULTS FRAMEWORK
  {
    const s = slide(); header(s, "CH 13  ·  EVIDENCE", "Results framework: what will be reported");
    const rows = [["Program completion", "Attendance 80%+", "85%", C.light], ["Pre/post improvement", "Same test, start and end", "+25 pts", C.light], ["Practical assignments", "Deliverables submitted", "90%", C.light], ["Video project", "Meets the rubric", "85%", C.tealSoft], ["Automation project", "Runs end to end", "80%", C.tealSoft], ["Capstone & presentation", "Rubric 3/4 or higher", "80% teams", C.tealSoft], ["Portfolio completion", "Page with 3+ pieces", "80%", C.orangeSoft], ["Freelance readiness", "Checklist completed", "75%", C.orangeSoft]];
    T(s, "Indicator", { x: 0.65, y: 1.33, w: 2, h: 0.22, fontSize: 9, bold: true, color: C.muted });
    T(s, "How it is measured", { x: 2.85, y: 1.33, w: 2, h: 0.22, fontSize: 9, bold: true, color: C.muted });
    T(s, "Proposed target", { x: 4.85, y: 1.33, w: 1.1, h: 0.22, fontSize: 9, bold: true, color: C.muted, align: "right" });
    rows.forEach((r, i) => {
      const y = 1.58 + i * 0.43;
      box(s, 0.5, y, 5.55, 0.37, r[3]);
      T(s, r[0], { x: 0.65, y, w: 2.2, h: 0.37, fontSize: 11, bold: true, color: C.navy, valign: "middle" });
      T(s, r[1], { x: 2.85, y, w: 2.0, h: 0.37, fontSize: 10, color: C.body, valign: "middle" });
      T(s, r[2], { x: 4.85, y, w: 1.1, h: 0.37, fontSize: 11, bold: true, color: C.teal, align: "right", valign: "middle" });
    });
    box(s, 6.25, 1.38, 3.25, 3.67, C.navy);
    iconDot(s, "LuBadgeCheck", 6.4, 1.51, 0.42, C.orange, C.navy);
    T(s, "Freelance readiness checklist", { x: 6.92, y: 1.51, w: 2.5, h: 0.42, fontSize: 13, bold: true, color: C.orange, valign: "middle" });
    T(s, bl(["Published portfolio page with at least three pieces", "Three written service packages with scope and deliverables", "A reusable creative brief template", "Client message templates: first contact, scope, revisions, delivery", "Knows the rules of the platforms they may use", "Has presented work to an audience"], { color: C.white }), { x: 6.42, y: 2.05, w: 2.98, h: 2.6, fontSize: 10.5, color: C.white });
    T(s, "Income is not used as a headline indicator.", { x: 6.42, y: 4.68, w: 3, h: 0.3, fontSize: 9.5, italic: true, color: "C9D1DA" });
  }

  // 15 SAFE BY DESIGN
  {
    const s = slide(); header(s, "CH 14  ·  RESPONSIBLE AI", "Responsible AI, built into every module");
    const it = [["LuBadgeCheck", "Checked tools", "Every tool is checked against its terms before each cohort"], ["LuScanFace", "No real likeness", "No real person's face or voice is generated without consent"], ["LuKeyRound", "Protected credentials", "API keys and logins are owned and managed by the program"], ["LuCircleCheck", "Verify before publishing", "Facts are checked against sources; AI content is labelled"], ["LuLock", "Privacy first", "No personal data of participants or clients goes into AI tools"], ["LuCopyright", "Respect copyright", "Licensed or self-made assets only, with sources credited"]];
    it.forEach((t, i) => {
      const r = Math.floor(i / 3), c = i % 3, x = 0.5 + c * 3.05, y = 1.42 + r * 1.45;
      box(s, x, y, 2.9, 1.3, C.light);
      iconDot(s, t[0], x + 0.15, y + 0.15, 0.44, C.teal);
      T(s, t[1], { x: x + 0.7, y: y + 0.15, w: 2.1, h: 0.44, fontSize: 13, bold: true, color: C.teal, valign: "middle" });
      T(s, t[2], { x: x + 0.15, y: y + 0.7, w: 2.62, h: 0.55, fontSize: 11, color: C.body });
    });
    box(s, 0.5, 4.38, 9, 0.67, C.navy);
    T(s, [{ text: "be aware..be secure  ", options: { bold: true, color: C.orange } }, { text: "Green Circle's principle becomes working rules: a code of conduct, a consent form and a checklist in every module.", options: { color: C.white } }], { x: 0.68, y: 4.38, w: 8.7, h: 0.67, fontSize: 12, valign: "middle" });
  }

  // 16 DELIVERY & OUTCOMES
  {
    const s = slide(); header(s, "CH 15  ·  DELIVERY", "Delivery and what participants keep");
    const f = [["LuMapPin", "Venue", "In person, computer lab at Jubilee Institute*"], ["LuClock", "Rhythm", "3 sessions × 3 hours per week, 12 weeks"], ["LuUsers", "Team", "Lead trainer (hands-on content, marketing, AI and n8n) + assistant"], ["LuGraduationCap", "Cohort", "20 participants (proposed)"], ["LuLaptop", "Set-up", "Laptop per participant, stable internet, headsets, recording corner"]];
    f.forEach((r, i) => {
      const y = 1.42 + i * 0.73;
      box(s, 0.5, y, 4.6, 0.64, C.light);
      iconDot(s, r[0], 0.62, y + 0.11, 0.42, C.teal);
      T(s, r[1], { x: 1.15, y, w: 0.95, h: 0.64, fontSize: 12.5, bold: true, color: C.teal, valign: "middle" });
      T(s, r[2], { x: 2.1, y, w: 2.9, h: 0.64, fontSize: 11, color: C.body, valign: "middle" });
    });
    box(s, 5.3, 1.42, 4.2, 3.57, C.navy);
    iconDot(s, "LuBriefcase", 5.45, 1.57, 0.42, C.orange, C.navy);
    T(s, "Each participant leaves with", { x: 5.97, y: 1.57, w: 3.4, h: 0.42, fontSize: 14, bold: true, color: C.orange, valign: "middle" });
    T(s, bl(["A prompt library and context pack", "A one-page creative brief", "A carousel and five captions with CTAs", "A character sheet and six-image set", "An edited 30–45 second video", "A persona, calendar and campaign", "A working n8n content workflow", "A published portfolio page and case study"], { color: C.white }), { x: 5.47, y: 2.12, w: 3.95, h: 2.8, fontSize: 11.5, color: C.white });
    T(s, "*Proposed host, subject to mutual agreement.", { x: 0.5, y: 4.98, w: 4.6, h: 0.2, fontSize: 9, italic: true, color: C.muted });
  }

  await Promise.all(PENDING);
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, n, "slides");
}
build().catch((e) => { console.error(e); process.exit(1); });
