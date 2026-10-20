// Renders the proposal's diagrams to PNG (one set per language).
// node render_diagrams.js en|ar  -> assets/diagrams/<lang>/*.png
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const MODULES = require("./data_modules");
const DECK = require("./copy_deck");

const LANG = process.argv[2] || "en";
const AR = LANG === "ar";
const T = DECK[LANG];
const OUT = path.join(__dirname, "assets/diagrams", LANG);
fs.mkdirSync(OUT, { recursive: true });

const C = { green: "#4DB449", lime: "#A6D04B", gray: "#727274", black: "#000000", soft: "#F2F4F1", tint: "#EAF5E8", ink: "#1A1A1A", sub: "#3C3E3B", line: "#D9DDD8" };
const trackColor = { foundation: C.gray, create: C.green, produce: C.lime, market: C.black, automate: C.green, launch: C.lime, capstone: C.black };
const onTrack = (k) => (["market", "capstone", "foundation"].includes(k) ? "#fff" : C.ink);
const L = (en, ar) => (AR ? ar : en);
const arrow = AR ? "←" : "→";

const base = `
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:960px;background:#fff;font-family:${AR ? "'IBM Plex Sans Arabic'" : "Calibri, Carlito"},sans-serif;color:${C.ink};direction:${AR ? "rtl" : "ltr"};}
.wrap{padding:22px 24px;}
h4{font-family:Cairo,sans-serif;font-weight:700;font-size:21px;margin-bottom:14px}
.cap{font-size:16px;color:${C.gray}}
.ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
</style>`;

const diagrams = {
  journey() {
    const steps = T.journey.steps, cols = 6;
    const cells = steps.map((s, i) => {
      const r = Math.floor(i / cols), c = i % cols, cc = r % 2 === 0 ? c : cols - 1 - c;
      const last = i === steps.length - 1;
      const col = last ? C.black : i < 4 ? C.gray : i % 2 ? C.lime : C.green;
      const tc = col === C.lime || col === C.green ? C.ink : "#fff";
      return `<div style="grid-row:${r + 1};grid-column:${cc + 1};display:flex;flex-direction:column;align-items:center;position:relative;z-index:1">
        <div style="width:${last ? 58 : 50}px;height:${last ? 58 : 50}px;border-radius:50%;background:${col};${last ? `box-shadow:0 0 0 4px ${C.lime};` : ""}color:${tc};font:700 20px Cairo;display:flex;align-items:center;justify-content:center">${i + 1}</div>
        <div style="margin-top:8px;font-size:18px;text-align:center;${last ? "font-weight:700" : ""}">${s}</div></div>`;
    }).join("");
    return `<div class="wrap" style="position:relative">
      <div style="position:relative;display:grid;grid-template-columns:repeat(6,1fr);row-gap:34px">
        <div style="position:absolute;top:25px;left:8%;right:8%;border-top:3px dashed ${C.line}"></div>
        <div style="position:absolute;top:${25 + 118}px;left:8%;right:8%;border-top:3px dashed ${C.line}"></div>
        <div style="position:absolute;top:${25 + 236}px;${AR ? "right" : "left"}:8%;width:62%;border-top:3px dashed ${C.line}"></div>
        <div style="position:absolute;top:25px;height:118px;${AR ? "left" : "right"}:8.3%;border-${AR ? "left" : "right"}:3px dashed ${C.line}"></div>
        <div style="position:absolute;top:${25 + 118}px;height:118px;${AR ? "right" : "left"}:8.3%;border-${AR ? "right" : "left"}:3px dashed ${C.line}"></div>
        ${cells}
      </div></div>`;
  },
  hours() {
    const max = 12;
    const rows = MODULES.map((m) => {
      const t = m.T, p = m.P;
      return `<div style="display:flex;align-items:center;margin:7px 0">
        <div style="width:300px;font-size:17px;padding-${AR ? "left" : "right"}:12px"><b class="ltr">${m.id}</b> ${m[LANG].short}</div>
        <div style="flex:1;display:flex;gap:2px;height:30px">
          <div style="width:${(t / max) * 100 * 0.86}%;background:${C.gray};border-radius:${AR ? "0 4px 4px 0" : "4px 0 0 4px"};color:#fff;font:700 15px Cairo;display:flex;align-items:center;justify-content:center">${t}</div>
          <div style="width:${(p / max) * 100 * 0.86}%;background:${C.green};border-radius:${AR ? "4px 0 0 4px" : "0 4px 4px 0"};color:${C.ink};font:700 15px Cairo;display:flex;align-items:center;justify-content:center">${p}</div>
          <div style="padding:0 10px;font:700 16px Cairo;align-self:center">${t + p}${L("h", " ساعة")}</div>
        </div></div>`;
    }).join("");
    const th = MODULES.reduce((a, m) => a + m.T, 0), pr = MODULES.reduce((a, m) => a + m.P, 0);
    return `<div class="wrap">
      <div style="display:flex;gap:22px;margin-bottom:10px;font-size:16px">
        <span><span style="display:inline-block;width:14px;height:14px;background:${C.gray};border-radius:3px;vertical-align:middle"></span> ${L("Theory", "نظري")}: ${th}${L(" h", " ساعة")}</span>
        <span><span style="display:inline-block;width:14px;height:14px;background:${C.green};border-radius:3px;vertical-align:middle"></span> ${L("Practice", "عملي")}: ${pr}${L(" h", " ساعة")}</span>
        <span style="color:${C.gray}">${L("Total", "المجموع")}: ${th + pr}${L(" h", " ساعة")} · ${Math.round((th / (th + pr)) * 100)}% / ${Math.round((pr / (th + pr)) * 100)}%</span>
      </div>${rows}</div>`;
  },
  architecture() {
    const hrs = {}; for (const m of MODULES) hrs[m.track] = (hrs[m.track] || 0) + m.T + m.P;
    const cols = T.tracks.items.map((it) => {
      const mods = MODULES.filter((m) => m.track === it.k).map((m) => `<div style="background:#fff;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:15px;line-height:1.25"><b class="ltr">${m.id}</b><br>${m[LANG].short}</div>`).join("");
      return `<div style="flex:${Math.max(hrs[it.k], 12)};min-width:0;background:${C.soft};border-radius:10px;padding:8px">
        <div style="background:${trackColor[it.k]};color:${onTrack(it.k)};border-radius:6px;padding:7px 4px;font:700 15px Cairo;text-align:center;line-height:1.2">${it.name}</div>
        <div style="text-align:center;font:700 15px Cairo;color:${C.gray};margin-top:6px">${hrs[it.k]} ${T.tracks.hoursLabel}</div>${mods}</div>`;
    }).join("");
    return `<div class="wrap"><div style="display:flex;gap:8px;align-items:stretch">${cols}</div>
      <div style="margin-top:12px;background:${C.black};color:#fff;border-radius:10px;padding:10px 16px;font-size:16px;display:flex;align-items:center;gap:12px">
      <span style="background:${C.lime};color:${C.ink};border-radius:20px;padding:3px 12px;font:700 15px Cairo;white-space:nowrap">${L("Capstone thread", "خيط المشروع الختامي")}</span>
      ${L("Brief (M3) → content (M4) → character & voice (M5) → storyboard (M6) → video (M7) → plan (M8) → automation (M9) → landing page (M10) → Demo Day (M11)", "الموجز (M3) ← المحتوى (M4) ← الشخصية والصوت (M5) ← اللوحة المصوّرة (M6) ← الفيديو (M7) ← الخطة (M8) ← الأتمتة (M9) ← صفحة الهبوط (M10) ← يوم العرض (M11)")}</div></div>`;
  },
  n8n() {
    const core = T.n8n.core.map((c, i) => `<div style="flex:1;border:2px solid ${i === 2 ? C.green : C.lime};background:${i === 2 ? C.green : "#161816"};border-radius:10px;padding:10px 12px;color:${i === 2 ? C.ink : "#fff"}">
       <div style="font:700 19px Cairo">${c[0]}</div><div style="font-size:15px;opacity:.9">${c[1]}</div></div>${i < 3 ? `<div style="color:${C.lime};font:700 26px Cairo;align-self:center">${arrow}</div>` : ""}`).join("");
    const flowLabels = T.n8n.flow;
    const nodes = flowLabels.map((f, i) => {
      const isN = i === 2, isAI = i === 3;
      const st = isN ? `background:#161816;border:2px solid #EA4B71;color:#fff` : isAI ? `background:${C.green};color:${C.ink}` : `background:#fff;color:${C.ink}`;
      const inner = isN ? `<img src="file://${path.join(__dirname, "assets/n8n-mark-white.png")}" style="height:26px;vertical-align:middle"> <span class="ltr" style="font:700 17px Cairo">n8n</span>` : f;
      return `<div style="${st};border-radius:8px;padding:10px 10px;font:700 15px ${AR ? "'IBM Plex Sans Arabic'" : "Calibri"};text-align:center;flex:${i === 4 ? 2.2 : 1}">${inner}</div>${i < flowLabels.length - 1 ? `<div style="color:${C.lime};font:700 20px Cairo;align-self:center">${arrow}</div>` : ""}`;
    }).join("");
    const nodeTypes = L(
      [["Form Trigger", "Collects business name, audience, offer, tone"], ["Edit Fields / expressions", "Maps form fields into one clean prompt"], ["IF", "Checks required fields; sends incomplete entries back"], ["AI model node", "Drafts hook, caption, CTA and reel idea"], ["Google Sheets", "Appends one row per request"]],
      [["مُشغِّل النموذج", "يجمع اسم النشاط والجمهور والعرض والنبرة"], ["تعديل الحقول والتعبيرات", "يربط حقول النموذج في أمر واحد مرتّب"], ["IF", "يتحقق من الحقول المطلوبة ويعيد الناقص"], ["عقدة نموذج الذكاء الاصطناعي", "تكتب الافتتاحية والنص وCTA وفكرة الريل"], ["Google Sheets", "يضيف صفاً جديداً لكل طلب"]]
    ).map((n) => `<div style="flex:1;background:#161816;border-radius:8px;padding:8px 10px;color:#fff"><div style="font:700 15px Cairo;color:${C.lime}">${n[0]}</div><div style="font-size:14px;color:#C9CCC8">${n[1]}</div></div>`).join("");
    return `<div style="background:#000;color:#fff" class="wrap">
      <div style="display:flex;gap:10px">${core}</div>
      <div style="font:700 17px Cairo;color:${C.lime};margin:18px 0 10px">${T.n8n.flowTitle}</div>
      <div style="display:flex;gap:6px">${nodes}</div>
      <div style="font:700 15px Cairo;color:#C9CCC8;margin:16px 0 8px">${L("Nodes used and what each does", "العُقد المستخدمة ووظيفة كل منها")}</div>
      <div style="display:flex;gap:8px">${nodeTypes}</div></div>`;
  },
  capstone() {
    let k = 0;
    const ph = T.capstone.phases.map((p, i) => `<div style="flex:1;min-width:0">
      <div style="background:#000;color:${C.lime};border-radius:8px;padding:8px;font:700 17px Cairo;text-align:center">${p[0]}</div>
      <div style="background:${C.soft};border-radius:8px;margin-top:6px;padding:8px 8px 4px">${p[1].map((d) => { k += 1; return `<div style="display:flex;gap:7px;align-items:center;margin-bottom:6px;font-size:15px;line-height:1.2"><span style="flex:none;width:22px;height:22px;border-radius:50%;background:${i % 2 ? C.lime : C.green};font:700 12px Cairo;display:flex;align-items:center;justify-content:center">${k}</span>${d}</div>`; }).join("")}</div></div>`).join(`<div style="align-self:center;color:${C.green};font:700 20px Cairo">${arrow}</div>`);
    return `<div class="wrap"><div style="display:flex;gap:6px;align-items:flex-start">${ph}</div>
      <div style="margin-top:12px;font-size:16px;color:${C.sub}"><b>${T.capstone.roles}</b></div></div>`;
  },
  timeline() {
    const wk = 100 / 12;
    const rows = MODULES.map((m) => {
      const a = m.sessions[0], b = m.sessions[m.sessions.length - 1];
      const xs = (Math.ceil(a / 3) - 1) * wk + ((a - 1) % 3) * wk / 3;
      const xe = (Math.ceil(b / 3) - 1) * wk + (((b - 1) % 3) + 1) * wk / 3;
      return `<div style="display:flex;align-items:center;height:30px">
        <div style="width:270px;font-size:15px"><b class="ltr">${m.id}</b> ${m[LANG].short}</div>
        <div style="flex:1;position:relative;height:100%">
          <div style="position:absolute;${AR ? "right" : "left"}:${xs}%;width:${xe - xs}%;top:6px;height:18px;border-radius:4px;background:${trackColor[m.track]}"></div></div></div>`;
    }).join("");
    const head = Array.from({ length: 12 }, (_, i) => `<div style="flex:1;text-align:center;font:700 14px Cairo;color:${C.gray};background:${i === 11 ? C.tint : i % 2 ? "#fff" : "#F7F8F6"}">${i + 1}</div>`).join("");
    const bg = Array.from({ length: 12 }, (_, i) => `<div style="flex:1;background:${i === 11 ? C.tint : i % 2 ? "#fff" : "#F7F8F6"}"></div>`).join("");
    return `<div class="wrap"><div style="display:flex"><div style="width:270px;font:700 14px Cairo;color:${C.gray}">${L("Module / week", "الوحدة / الأسبوع")}</div><div style="flex:1;display:flex">${head}</div></div>
      <div style="position:relative"><div style="position:absolute;inset:0;${AR ? "left" : "right"}:0;${AR ? "right" : "left"}:270px;display:flex">${bg}</div><div style="position:relative">${rows}</div></div>
      <div style="display:flex;justify-content:flex-end;font-size:14px;color:${C.gray};margin-top:4px">${L("Week 12: buffer for make-ups, holidays and Demo Day logistics", "الأسبوع 12: احتياطي للتعويض والعطل وترتيبات يوم العرض")}</div></div>`;
  },
  agetrack() {
    const box = (title, sub, items, dark) => `<div style="flex:1;background:${dark ? "#000" : C.tint};color:${dark ? "#fff" : C.ink};border-radius:12px;padding:16px">
      <div style="font:700 28px Cairo;color:${dark ? C.lime : C.ink}" class="ltr">${title}</div><div style="font:700 17px Cairo;margin:2px 0 10px">${sub}</div>
      ${items.map((x) => `<div style="display:flex;gap:8px;font-size:16px;margin-bottom:6px"><span style="flex:none;width:10px;height:10px;border-radius:50%;background:${dark ? C.lime : C.green};margin-top:7px"></span>${x}</div>`).join("")}</div>`;
    return `<div class="wrap"><div style="display:flex;gap:14px">
      ${box("15–17", L("Core track", "المسار الأساسي"), L(["All 11 modules and the capstone", "Guardian consent before accounts are created", "ChatGPT, Gemini, Canva, CapCut, n8n (trainer-managed), GitHub Pages", "Google Flow, AI voice and APIs: trainer demo only", "Recorded narration and own footage replace 18+ steps"], ["الوحدات الإحدى عشرة والمشروع الختامي كاملة", "موافقة وليّ الأمر قبل إنشاء الحسابات", "ChatGPT وGemini وCanva وCapCut وGitHub Pages، وn8n بإدارة المدرب", "عرض من المدرب فقط لأدوات Google Flow والصوت المولَّد وواجهات API", "التعليق المسجّل واللقطات الذاتية بديلاً عن خطوات 18+"]), true)}
      <div style="align-self:center;font:700 34px Cairo;color:${C.green}">+</div>
      ${box("18–19", L("Core + 18+ track", "المسار الأساسي + مسار 18+"), L(["Same curriculum and hours", "Hands-on Google Flow and Gemini video where the program provides access (TBD)", "AI voice (ElevenLabs) and Claude as options", "Guidance on freelance platform profiles"], ["المنهاج والساعات نفسها", "تطبيق عملي على Google Flow وفيديو Gemini حين يوفّر البرنامج الوصول (يُحدَّد لاحقاً)", "الصوت المولَّد عبر ElevenLabs، وClaude، خيارات إضافية", "إرشاد حول حسابات منصات العمل الحر"]), false)}
    </div></div>`;
  },
  loop() {
    const loop = T.method.loop.map((l, i) => `<div style="flex:1;background:${i === 2 ? "#000" : C.soft};color:${i === 2 ? "#fff" : C.ink};border-radius:10px;padding:12px">
      <div style="width:34px;height:34px;border-radius:50%;background:${i === 2 ? C.lime : C.green};font:700 17px Cairo;display:flex;align-items:center;justify-content:center;color:${C.ink}">${i + 1}</div>
      <div style="font:700 19px Cairo;margin-top:6px">${l[0]}</div><div style="font-size:15px">${l[1]}</div></div>${i < 3 ? `<div style="align-self:center;color:${C.green};font:700 22px Cairo">${arrow}</div>` : ""}`).join("");
    const seg = [[50, C.gray, "#fff"], [105, C.green, C.ink], [25, C.black, "#fff"]];
    const bar = seg.map((s, i) => `<div style="flex:${s[0]};background:${s[1]};color:${s[2]};padding:8px 6px;text-align:center;font:700 15px Cairo">${T.method.sess[i][1]}<div style="direction:ltr;font:400 13px Calibri">${T.method.sess[i][0]}</div></div>`).join("");
    return `<div class="wrap"><div style="display:flex;gap:8px">${loop}</div>
      <div style="font:700 17px Cairo;margin:16px 0 8px">${T.method.sessTitle}</div><div style="display:flex;gap:2px;border-radius:8px;overflow:hidden">${bar}</div></div>`;
  },
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2.5, viewport: { width: 960, height: 800 } });
  for (const [name, fn] of Object.entries(diagrams)) {
    const html = `<!doctype html><html lang="${AR ? "ar" : "en"}"><head><meta charset="utf-8">${base}</head><body>${fn()}</body></html>`;
    const f = path.join(OUT, name + ".html");
    fs.writeFileSync(f, html);
    await page.goto("file://" + f);
    await page.waitForTimeout(150);
    const el = await page.$("body > *");
    await el.screenshot({ path: path.join(OUT, name + ".png") });
    const box = await el.boundingBox();
    fs.writeFileSync(path.join(OUT, name + ".json"), JSON.stringify({ w: box.width, h: box.height }));
  }
  await browser.close();
  console.log("diagrams", LANG, Object.keys(diagrams).length);
})();
