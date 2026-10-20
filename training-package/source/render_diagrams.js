// Renders the proposal's diagrams to PNG (one set per language).
// node render_diagrams.js en|ar  -> assets/diagrams/<lang>/*.png
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const MODULES = require("./data_modules");
const DECK = require("./copy_deck");
const MARKS = require("./assets/marks/map.json");

const LANG = process.argv[2] || "en";
const AR = LANG === "ar";
const T = DECK[LANG];
const OUT = path.join(__dirname, "assets/diagrams", LANG);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const C = { green: "#4DB449", lime: "#A6D04B", gray: "#727274", black: "#000000", soft: "#F2F4F1", tint: "#EAF5E8", ink: "#1A1A1A", sub: "#3C3E3B", line: "#D9DDD8", panel: "#161816" };
const trackColor = { foundations: C.gray, content: C.green, build: C.black, design: C.lime, media: C.green, automate: C.lime, final: C.black };
const onTrack = (k) => (["build", "final", "foundations"].includes(k) ? "#fff" : C.ink);
const L = (en, ar) => (AR ? ar : en);
const arrow = AR ? "←" : "→";
const mark = (name, dark) => (MARKS[name] ? `<img src="file://${path.join(__dirname, "assets/marks", MARKS[name] + "-" + (dark ? "white" : "black") + ".png")}" style="height:15px;vertical-align:-2px;margin-${AR ? "left" : "right"}:5px">` : "");
const chip = (name, dark) => `<span style="display:inline-flex;align-items:center;direction:ltr;background:${dark ? C.panel : "#fff"};border:1px solid ${dark ? "#3A3D39" : C.line};color:${dark ? "#fff" : C.ink};border-radius:20px;padding:4px 10px;font:600 13px Calibri, Carlito;margin:3px;white-space:nowrap">${mark(name, dark)}${name}</span>`;

const base = `<style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:960px;background:#fff;font-family:${AR ? "'IBM Plex Sans Arabic'" : "Calibri, Carlito"},sans-serif;color:${C.ink};direction:${AR ? "rtl" : "ltr"};}
.wrap{padding:20px 22px;}
.ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
</style>`;

const diagrams = {
  pipeline() {
    const st = T.pipeline.stages;
    const cols = st.map((s, i) => `<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center">
      <div style="width:54px;height:54px;border-radius:50%;background:${i % 2 ? C.lime : C.green};border:4px solid #000;display:flex;align-items:center;justify-content:center;font:700 20px Cairo;color:#000;position:relative;z-index:1">${i + 1}</div>
      <div style="font:700 17px Cairo;color:#fff;margin:8px 0 6px;line-height:1.15;min-height:40px">${s[0]}</div>
      <div style="display:flex;flex-direction:column;align-items:center">${s[1].map((t) => chip(t, true)).join("")}</div></div>`).join("");
    return `<div class="wrap" style="background:#000"><div style="position:relative;display:flex;gap:4px">
      <div style="position:absolute;top:27px;left:6%;right:6%;border-top:2px solid #3A3D39"></div>${cols}</div></div>`;
  },
  hours() {
    const max = 12;
    const rows = MODULES.map((m) => `<div style="display:flex;align-items:center;margin:7px 0">
        <div style="width:290px;font-size:16px;padding-${AR ? "left" : "right"}:10px"><b class="ltr">${m.id}</b> ${m[LANG].short}</div>
        <div style="flex:1;display:flex;gap:2px;height:28px">
          <div style="width:${(m.T / max) * 86}%;background:${C.gray};border-radius:${AR ? "0 4px 4px 0" : "4px 0 0 4px"};color:#fff;font:700 14px Cairo;display:flex;align-items:center;justify-content:center">${m.T}</div>
          <div style="width:${(m.P / max) * 86}%;background:${C.green};border-radius:${AR ? "4px 0 0 4px" : "0 4px 4px 0"};color:${C.ink};font:700 14px Cairo;display:flex;align-items:center;justify-content:center">${m.P}</div>
          <div style="padding:0 10px;font:700 15px Cairo;align-self:center">${m.T + m.P}${L("h", " ساعة")}</div></div></div>`).join("");
    const th = MODULES.reduce((a, m) => a + m.T, 0), pr = MODULES.reduce((a, m) => a + m.P, 0);
    const sw = (c) => `<span style="display:inline-block;width:14px;height:14px;background:${c};border-radius:3px;vertical-align:middle"></span>`;
    return `<div class="wrap"><div style="display:flex;gap:22px;margin-bottom:10px;font-size:15px">
      <span>${sw(C.gray)} ${L("Theory", "نظري")}: ${th}${L(" h", " ساعة")}</span><span>${sw(C.green)} ${L("Hands-on", "عملي")}: ${pr}${L(" h", " ساعة")}</span>
      <span style="color:${C.gray}">${L("Total", "المجموع")}: ${th + pr}${L(" h", " ساعة")} · <span class="ltr">${Math.round((pr / (th + pr)) * 100)}%</span> ${L("hands-on", "عملي")}</span></div>${rows}</div>`;
  },
  timeline() {
    const wk = 100 / 12;
    const rows = MODULES.map((m) => {
      const a = m.sessionNos[0], b = m.sessionNos[m.sessionNos.length - 1];
      const xs = (Math.ceil(a / 3) - 1) * wk + ((a - 1) % 3) * wk / 3;
      const xe = (Math.ceil(b / 3) - 1) * wk + (((b - 1) % 3) + 1) * wk / 3;
      return `<div style="display:flex;align-items:center;height:30px"><div style="width:260px;font-size:15px"><b class="ltr">${m.id}</b> ${m[LANG].short}</div>
        <div style="flex:1;position:relative;height:100%"><div style="position:absolute;${AR ? "right" : "left"}:${xs}%;width:${xe - xs}%;top:6px;height:18px;border-radius:4px;background:${trackColor[m.track]}"></div></div></div>`;
    }).join("");
    const cells = (lab) => Array.from({ length: 12 }, (_, i) => `<div style="flex:1;${lab ? `text-align:center;font:700 13px Cairo;color:${C.gray};` : ""}background:${i === 11 ? C.tint : i % 2 ? "#fff" : "#F7F8F6"}">${lab ? i + 1 : ""}</div>`).join("");
    return `<div class="wrap"><div style="display:flex"><div style="width:260px;font:700 13px Cairo;color:${C.gray}">${L("Module / week", "الوحدة / الأسبوع")}</div><div style="flex:1;display:flex">${cells(true)}</div></div>
      <div style="position:relative"><div style="position:absolute;top:0;bottom:0;${AR ? "left" : "right"}:0;${AR ? "right" : "left"}:260px;display:flex">${cells(false)}</div><div style="position:relative">${rows}</div></div>
      <div style="text-align:${AR ? "left" : "right"};font-size:13px;color:${C.gray};margin-top:4px">${L("Week 12: flexible week for make-up sessions and Demo Day", "الأسبوع 12: أسبوع مرن لجلسات التعويض ويوم العرض")}</div></div>`;
  },
  architecture() {
    const hrs = {}; for (const m of MODULES) hrs[m.track] = (hrs[m.track] || 0) + m.T + m.P;
    const cols = T.tracks.items.map((it) => {
      const mods = MODULES.filter((m) => m.track === it.k).map((m) => `<div style="background:#fff;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:14px;line-height:1.25"><b class="ltr">${m.id}</b><br>${m[LANG].short}</div>`).join("");
      return `<div style="flex:${Math.max(hrs[it.k], 12)};min-width:0;background:${C.soft};border-radius:10px;padding:8px">
        <div style="background:${trackColor[it.k]};color:${onTrack(it.k)};border-radius:6px;padding:7px 4px;font:700 14px Cairo;text-align:center;line-height:1.2;min-height:52px;display:flex;align-items:center;justify-content:center">${it.name}</div>
        <div style="text-align:center;font:700 14px Cairo;color:${C.gray};margin-top:6px">${hrs[it.k]} ${T.tracks.hoursLabel}</div>${mods}</div>`;
    }).join("");
    return `<div class="wrap"><div style="display:flex;gap:8px;align-items:stretch">${cols}</div></div>`;
  },
  loop() {
    const steps = (AR ? [["شاهِد", "شرح قصير وعرض مباشر"], ["جرِّب", "تمرين موجّه ضمن ثنائيات"], ["ابنِ", "تطبيق على المشروع المصغّر"], ["اعرض", "مشاركة وملاحظات وتحسين"]] : [["See it", "Short explanation and live demo"], ["Try it", "Guided exercise in pairs"], ["Build it", "Apply it to the mini project"], ["Show it", "Share, get feedback, improve"]]);
    const cards = steps.map((l, i) => `<div style="flex:1;background:${i === 2 ? "#000" : C.soft};color:${i === 2 ? "#fff" : C.ink};border-radius:10px;padding:12px">
      <div style="width:32px;height:32px;border-radius:50%;background:${i === 2 ? C.lime : C.green};font:700 16px Cairo;display:flex;align-items:center;justify-content:center;color:${C.ink}">${i + 1}</div>
      <div style="font:700 18px Cairo;margin-top:6px">${l[0]}</div><div style="font-size:14px">${l[1]}</div></div>${i < 3 ? `<div style="align-self:center;color:${C.green};font:700 22px Cairo">${arrow}</div>` : ""}`).join("");
    const seg = [[45, C.gray, "#fff", L("Concept & demo", "المفهوم والعرض"), "0:00–0:45"], [110, C.green, C.ink, L("Hands-on build", "تطبيق عملي"), "0:45–2:35"], [25, C.black, "#fff", L("Show & feedback", "العرض والملاحظات"), "2:35–3:00"]];
    const bar = seg.map((s) => `<div style="flex:${s[0]};background:${s[1]};color:${s[2]};padding:8px 6px;text-align:center;font:700 14px Cairo">${s[3]}<div style="direction:ltr;font:400 12px Calibri">${s[4]}</div></div>`).join("");
    return `<div class="wrap"><div style="display:flex;gap:8px">${cards}</div>
      <div style="font:700 16px Cairo;margin:14px 0 8px">${L("A typical 3-hour session", "جلسة نموذجية مدتها 3 ساعات")}</div><div style="display:flex;gap:2px;border-radius:8px;overflow:hidden">${bar}</div></div>`;
  },
  final() {
    const items = T.final.items;
    const cells = items.map((it, i) => `<div style="display:flex;align-items:center;gap:10px;background:${i % 2 ? C.soft : C.tint};border-radius:8px;padding:9px 12px">
      <span style="flex:none;width:28px;height:28px;border-radius:50%;background:${i % 2 ? C.lime : C.green};font:700 14px Cairo;display:flex;align-items:center;justify-content:center">${i + 1}</span>
      <span style="font:700 15px Cairo">${it}</span></div>`).join("");
    return `<div class="wrap"><div style="display:flex;gap:14px;align-items:stretch">
      <div style="flex:0 0 250px;background:#000;color:#fff;border-radius:12px;padding:18px;display:flex;flex-direction:column;justify-content:center">
        <div style="font:700 13px Cairo;color:${C.lime}">${L("ONE IDEA", "فكرة واحدة")}</div>
        <div style="font:700 22px Cairo;margin:6px 0 10px;line-height:1.25">${T.final.title}</div>
        <div style="font-size:14px;color:#D6D8D4">${L("4 sessions · 12 hours · teams of 3–4", "4 جلسات · 12 ساعة · فرق من 3 إلى 4")}</div></div>
      <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:8px">${cells}</div></div></div>`;
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
