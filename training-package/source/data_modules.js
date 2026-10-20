// Single source of truth for modules and sessions. Hours here drive every
// table and chart in all four documents.
// Each session: [en {title, learn, tools, build, output}, ar {...}]
const S = (en, ar) => ({ en, ar });
const s = (title, learn, tools, build, output) => ({ title, learn, tools, build, output });

module.exports = [
  {
    id: "M1", T: 2, P: 4, track: "foundations",
    en: {
      name: "Choosing the Right AI Tool for the Task",
      short: "Choosing AI Tools",
      purpose: "Participants map the main types of AI tools to real tasks and learn a quick way to choose: what goes in, what must come out, how good it needs to be, and what data is safe to share.",
      outcomes: ["Match everyday work tasks to the right type of AI tool", "Run the same task in three assistants and justify which result is better", "Use a five-question checklist to choose a tool", "Keep accounts and data safe when working with AI tools"],
      project: ["Personal AI toolkit map", "A one-page map of ten real tasks, the tool chosen for each, and why"],
    },
    ar: {
      name: "اختيار أداة الذكاء الاصطناعي المناسبة للمهمة",
      short: "اختيار الأداة المناسبة",
      purpose: "يتعرّف المشاركون على الأنواع الرئيسية لأدوات الذكاء الاصطناعي ويربطونها بمهام حقيقية، ويتعلّمون طريقة سريعة للاختيار: ما المدخلات، وما المخرجات المطلوبة، وما مستوى الجودة اللازم، وما البيانات التي يجوز مشاركتها.",
      outcomes: ["يربط مهام العمل اليومية بالنوع المناسب من أدوات الذكاء الاصطناعي", "ينفّذ المهمة نفسها في ثلاثة مساعدات ويبرّر أي النتائج أفضل", "يستخدم قائمة من خمسة أسئلة لاختيار الأداة", "يحمي حساباته وبياناته عند العمل بأدوات الذكاء الاصطناعي"],
      project: ["خريطة الأدوات الشخصية", "صفحة واحدة تضم عشر مهام حقيقية، والأداة المختارة لكل منها، وسبب الاختيار"],
    },
    sessions: [
      S(s("The AI toolkit: what each type of tool does well", "Assistants, research tools, image, video and audio generators, design tools, coding agents and automation platforms, and where each one falls short", ["ChatGPT", "Claude", "Gemini", "Perplexity"], "Run one real task (summarise a report, then draft a reply email) in three assistants and score the results", "Assistant comparison scorecard"),
        s("صندوق الأدوات: ما الذي تجيده كل أداة", "المساعدات الذكية، وأدوات البحث، ومولّدات الصور والفيديو والصوت، وأدوات التصميم، ووكلاء البرمجة، ومنصات الأتمتة، وحدود كل منها", ["ChatGPT", "Claude", "Gemini", "Perplexity"], "تنفيذ مهمة حقيقية واحدة (تلخيص تقرير ثم كتابة رد بريدي) في ثلاثة مساعدات وتقييم النتائج", "بطاقة مقارنة بين المساعدات")),
      S(s("Choosing a tool, and using it safely", "A five-question checklist: input, output, quality bar, data sensitivity, plan limits; account security, privacy and labelling AI-made content", ["ChatGPT", "Claude", "Gemini", "Perplexity"], "Map ten tasks from their own work or studies to the right tool", "Personal AI toolkit map (Mini project 1)"),
        s("اختيار الأداة واستخدامها بأمان", "قائمة من خمسة أسئلة: المدخلات، المخرجات، مستوى الجودة، حساسية البيانات، حدود الخطة؛ إضافة إلى أمان الحسابات والخصوصية والإفصاح عن المحتوى المولَّد", ["ChatGPT", "Claude", "Gemini", "Perplexity"], "ربط عشر مهام من عمل المشارك أو دراسته بالأداة المناسبة", "خريطة الأدوات الشخصية (المشروع المصغّر 1)")),
    ],
  },
  {
    id: "M2", T: 2.5, P: 6.5, track: "foundations",
    en: {
      name: "Prompting: Writing Instructions AI Can Follow",
      short: "Prompting",
      purpose: "The quality of AI output depends on the quality of the instruction. Participants learn to write prompts that get usable results quickly, and to save them so they can be reused.",
      outcomes: ["Write prompts that state role, task, context, examples, format and constraints", "Improve a result through deliberate rounds of feedback", "Ask for structured output such as tables and checklists", "Set up a saved assistant with standing instructions and reference files"],
      project: ["Brand-voice assistant", "A configured ChatGPT Project, Claude Project or Gemini Gem that writes in a sample organisation's voice, plus a library of 15 tested prompts"],
    },
    ar: {
      name: "كتابة الأوامر: تعليمات تفهمها أدوات الذكاء الاصطناعي",
      short: "كتابة الأوامر",
      purpose: "جودة ما ينتجه الذكاء الاصطناعي من جودة التعليمات التي يتلقّاها. يتعلّم المشاركون كتابة أوامر تعطي نتائج صالحة بسرعة، وحفظها لإعادة استخدامها.",
      outcomes: ["يكتب أوامر تحدّد الدور والمهمة والسياق والأمثلة وشكل المخرجات والقيود", "يحسّن النتيجة عبر جولات ملاحظات مقصودة", "يطلب مخرجات منظّمة مثل الجداول وقوائم التحقق", "يُعدّ مساعداً محفوظاً بتعليمات دائمة وملفات مرجعية"],
      project: ["مساعد بصوت العلامة", "مشروع في ChatGPT أو Claude، أو Gem في Gemini، يكتب بأسلوب منظمة نموذجية، مع مكتبة من 15 أمراً مجرّباً"],
    },
    sessions: [
      S(s("The anatomy of a prompt that works", "Six parts of a strong prompt and the common reasons prompts fail", ["ChatGPT", "Claude", "Gemini"], "Rewrite five weak prompts and compare outputs side by side", "Before-and-after prompt sheet"),
        s("مكوّنات الأمر الناجح", "الأجزاء الستة للأمر القوي، والأسباب الشائعة لفشل الأوامر", ["ChatGPT", "Claude", "Gemini"], "إعادة كتابة خمسة أوامر ضعيفة ومقارنة النتائج جنباً إلى جنب", "ورقة الأوامر قبل التحسين وبعده")),
      S(s("Context, examples and iteration", "Giving files and background, showing examples, asking for structured output, and a critique-and-revise loop", ["ChatGPT", "Claude", "Gemini"], "Produce a one-page brief through three rounds of revision", "Final brief and iteration log"),
        s("السياق والأمثلة والتحسين المتكرر", "تزويد الأداة بالملفات والخلفية، وعرض الأمثلة، وطلب مخرجات منظّمة، وحلقة النقد والتعديل", ["ChatGPT", "Claude", "Gemini"], "إنتاج موجز من صفحة واحدة عبر ثلاث جولات تعديل", "الموجز النهائي وسجل التعديلات")),
      S(s("Reusable prompts and saved assistants", "Prompt templates with variables; Projects and Gems with standing instructions and reference files", ["ChatGPT Projects", "Claude Projects", "Gemini Gems"], "Set up a brand-voice assistant for a sample organisation and test it on three tasks", "Brand-voice assistant and 15-prompt library (Mini project 2)"),
        s("أوامر قابلة لإعادة الاستخدام ومساعدات محفوظة", "قوالب أوامر بمتغيرات؛ ومساحات Projects وGems بتعليمات دائمة وملفات مرجعية", ["ChatGPT Projects", "Claude Projects", "Gemini Gems"], "إعداد مساعد بصوت منظمة نموذجية واختباره في ثلاث مهام", "مساعد بصوت العلامة ومكتبة من 15 أمراً (المشروع المصغّر 2)")),
    ],
  },
  {
    id: "M3", T: 2.5, P: 6.5, track: "content",
    en: {
      name: "AI for Research and Content Writing",
      short: "Research & Content",
      purpose: "Participants use AI research tools to gather and check information, then turn it into finished written content and a publishing plan.",
      outcomes: ["Run a research task with cited sources and verify key claims", "Build a source-grounded notebook and generate summaries from it", "Turn research into an article, social posts and a newsletter that sound human", "Build a four-week content calendar and a simple campaign plan"],
      project: ["Research-to-content pack", "A verified research brief, one article, five social posts and a four-week content calendar"],
    },
    ar: {
      name: "الذكاء الاصطناعي في البحث وكتابة المحتوى",
      short: "البحث وكتابة المحتوى",
      purpose: "يستخدم المشاركون أدوات البحث بالذكاء الاصطناعي لجمع المعلومات والتحقق منها، ثم يحوّلونها إلى محتوى مكتوب جاهز وخطة نشر.",
      outcomes: ["ينفّذ مهمة بحث بمصادر موثّقة ويتحقق من المعلومات الأساسية", "يبني دفتراً مستنداً إلى المصادر ويولّد منه ملخصات", "يحوّل البحث إلى مقال ومنشورات ونشرة بريدية بأسلوب بشري", "يُعدّ تقويم محتوى لأربعة أسابيع وخطة حملة بسيطة"],
      project: ["حزمة من البحث إلى المحتوى", "موجز بحثي مُتحقَّق منه، ومقال، وخمسة منشورات، وتقويم محتوى لأربعة أسابيع"],
    },
    sessions: [
      S(s("Research faster, then verify", "Deep research modes, answers with citations, source-grounded notebooks, and checking claims against the original source", ["Perplexity", "Gemini Deep Research", "NotebookLM"], "Research a topic, verify five claims, and build a NotebookLM notebook with an Audio Overview", "Verified research brief with sources"),
        s("بحث أسرع ثم تحقّق", "أنماط البحث المعمّق، والإجابات المدعومة بمصادر، والدفاتر المستندة إلى المصادر، ومطابقة المعلومات مع مصدرها الأصلي", ["Perplexity", "Gemini Deep Research", "NotebookLM"], "بحث موضوع، والتحقق من خمس معلومات، وبناء دفتر في NotebookLM مع ملخص صوتي (Audio Overview)", "موجز بحثي مُتحقَّق منه مع المصادر")),
      S(s("From research to written content", "Turning research into an article, posts and a newsletter; hooks and calls to action; editing AI drafts so they sound human", ["ChatGPT", "Claude", "Gemini"], "Write one article and five social posts from the research brief", "Content pack, first version"),
        s("من البحث إلى المحتوى المكتوب", "تحويل البحث إلى مقال ومنشورات ونشرة بريدية؛ الافتتاحيات الجاذبة والدعوة لاتخاذ إجراء؛ تحرير مسودات الذكاء الاصطناعي لتبدو بشرية", ["ChatGPT", "Claude", "Gemini"], "كتابة مقال وخمسة منشورات انطلاقاً من الموجز البحثي", "حزمة المحتوى، النسخة الأولى")),
      S(s("Planning content that gets published", "Content pillars, audience, a four-week calendar and the structure of a small campaign", ["ChatGPT", "Claude", "Google Sheets"], "Build a four-week calendar with post ideas, formats and channels", "Content calendar and campaign one-pager (Mini project 3)"),
        s("تخطيط محتوى يُنشر فعلاً", "ركائز المحتوى، والجمهور، وتقويم لأربعة أسابيع، وبنية حملة صغيرة", ["ChatGPT", "Claude", "Google Sheets"], "إعداد تقويم لأربعة أسابيع بأفكار المنشورات وأشكالها وقنواتها", "تقويم المحتوى وملخص الحملة (المشروع المصغّر 3)")),
    ],
  },
  {
    id: "M4", T: 3.5, P: 8.5, track: "build",
    en: {
      name: "Building with Claude Code",
      short: "Claude Code in Practice",
      purpose: "Claude Code is Anthropic's agentic coding tool: it reads a project, plans changes, edits files and runs commands with the user's permission. Participants use it to build and publish real things by describing what they want, and learn to review what it produces.",
      outcomes: ["Start Claude Code in the terminal, VS Code or the desktop app and work inside a project folder", "Write a CLAUDE.md file that tells Claude how the project works", "Give clear multi-step tasks and review changes before accepting them", "Build and publish a landing page to GitHub Pages", "Use Claude Code for everyday file and data tasks"],
      project: ["Published landing page and data report", "A live landing page built with Claude Code, plus a clean report generated from a messy spreadsheet"],
    },
    ar: {
      name: "البناء باستخدام Claude Code",
      short: "Claude Code عملياً",
      purpose: "Claude Code أداة برمجة وكيلة من Anthropic: تقرأ المشروع، وتخطّط للتعديلات، وتعدّل الملفات، وتنفّذ الأوامر بإذن المستخدم. يستخدمها المشاركون لبناء أشياء حقيقية ونشرها عبر وصف ما يريدونه، ويتعلّمون مراجعة ما تنتجه.",
      outcomes: ["يشغّل Claude Code من الطرفية أو VS Code أو تطبيق سطح المكتب ويعمل داخل مجلد مشروع", "يكتب ملف CLAUDE.md يشرح لـ Claude طريقة عمل المشروع", "يعطي مهام واضحة متعددة الخطوات ويراجع التعديلات قبل قبولها", "يبني صفحة هبوط وينشرها على GitHub Pages", "يستخدم Claude Code في مهام الملفات والبيانات اليومية"],
      project: ["صفحة هبوط منشورة وتقرير بيانات", "صفحة هبوط حيّة مبنية بـ Claude Code، وتقرير منظّم مولَّد من جدول بيانات غير مرتّب"],
    },
    sessions: [
      S(s("Getting started with Claude Code", "What an agentic coding tool does; how Claude Code reads files, plans, edits and asks permission before running commands", ["Claude Code (terminal, VS Code, desktop app)"], "Create a project folder, write a CLAUDE.md file and complete three first tasks", "Project folder with CLAUDE.md"),
        s("البداية مع Claude Code", "ما الذي تفعله أداة البرمجة الوكيلة؛ وكيف يقرأ Claude Code الملفات ويخطّط ويعدّل ويطلب الإذن قبل تنفيذ الأوامر", ["Claude Code (الطرفية، VS Code، تطبيق سطح المكتب)"], "إنشاء مجلد مشروع، وكتابة ملف CLAUDE.md، وإنجاز ثلاث مهام أولى", "مجلد مشروع يحتوي CLAUDE.md")),
      S(s("Building a landing page by describing it", "Writing a build brief, previewing in the browser and asking for changes in plain language", ["Claude Code", "Web browser"], "Build a landing page for the sample organisation from a written brief", "Working landing page"),
        s("بناء صفحة هبوط بوصفها", "كتابة موجز للبناء، والمعاينة في المتصفح، وطلب التعديلات بلغة عادية", ["Claude Code", "متصفح الويب"], "بناء صفحة هبوط للمنظمة النموذجية انطلاقاً من موجز مكتوب", "صفحة هبوط تعمل")),
      S(s("Reviewing, fixing and publishing", "Reading the changes Claude proposes, asking it to explain code, saving versions with Git, and publishing a static site", ["Claude Code", "Git", "GitHub Pages"], "Fix two deliberate problems, commit the work and publish the page", "Published page with a public link"),
        s("المراجعة والإصلاح والنشر", "قراءة التعديلات التي يقترحها Claude، وطلب شرح الكود، وحفظ النسخ بـ Git، ونشر موقع ثابت", ["Claude Code", "Git", "GitHub Pages"], "إصلاح مشكلتين متعمّدتين، وحفظ العمل، ونشر الصفحة", "صفحة منشورة برابط عام")),
      S(s("Everyday work tasks with Claude Code", "Bulk file tasks, cleaning data and generating reports and charts from spreadsheets", ["Claude Code", "CSV / Excel files"], "Turn a messy spreadsheet into a clean summary report with a chart", "Data report and a reusable script (Mini project 4)"),
        s("مهام العمل اليومية مع Claude Code", "مهام الملفات بالجملة، وتنظيف البيانات، وتوليد التقارير والرسوم من الجداول", ["Claude Code", "ملفات CSV وExcel"], "تحويل جدول بيانات غير مرتّب إلى تقرير ملخّص مع رسم بياني", "تقرير بيانات وسكربت قابل لإعادة الاستخدام (المشروع المصغّر 4)")),
    ],
  },
  {
    id: "M5", T: 2, P: 4, track: "build",
    en: {
      name: "Extending Claude Code with Skills",
      short: "Claude Code Skills",
      purpose: "Skills teach Claude Code a repeatable way of working. A skill is a folder with a SKILL.md file of instructions, and optional templates or scripts, that Claude loads when a task needs it. Participants install ready-made skills and write one of their own.",
      outcomes: ["Explain what a skill is and where it lives: .claude/skills in a project, ~/.claude/skills for personal use", "Install skills from a plugin marketplace with the /plugin command", "Write a skill with a clear description, step-by-step instructions and a template", "Run a skill by name or let Claude pick it up from the task"],
      project: ["Custom content skill", "A working skill that turns a short brief into a post, a caption and an image prompt in the organisation's house style"],
    },
    ar: {
      name: "توسيع Claude Code باستخدام Skills",
      short: "مهارات Claude Code",
      purpose: "تعلّم المهارات (Skills) أداة Claude Code طريقة عمل قابلة للتكرار. والمهارة مجلد يحتوي ملف SKILL.md بالتعليمات، ومعه قوالب أو سكربتات اختيارية، يحمّله Claude عندما تحتاجه المهمة. يثبّت المشاركون مهارات جاهزة ويكتبون مهارة خاصة بهم.",
      outcomes: ["يشرح ما هي المهارة (Skill) وأين توضع: في مجلد المشروع لتخدم المشروع كله، أو في المجلد الشخصي للمستخدم", "يثبّت مهارات جاهزة من سوق الإضافات (Plugin Marketplace) داخل Claude Code", "يكتب مهارة بوصف واضح وتعليمات متسلسلة وقالب", "يشغّل المهارة باسمها أو يترك Claude يستدعيها حسب المهمة"],
      project: ["مهارة مخصّصة للمحتوى", "مهارة تعمل فعلياً تحوّل موجزاً قصيراً إلى منشور ونص مرافق وأمر لتوليد صورة بأسلوب المنظمة"],
    },
    sessions: [
      S(s("Using ready-made skills", "How skills are structured and discovered; plugins and marketplaces; an example skill set from Remotion", ["Claude Code", "/plugin marketplace"], "Install a skill set and use it to complete a task", "Installed skill used in a real task"),
        s("استخدام مهارات جاهزة", "بنية المهارات وطريقة اكتشافها؛ الإضافات والأسواق؛ مثال من مهارات Remotion", ["Claude Code", "سوق الإضافات"], "تثبيت مجموعة مهارات واستخدامها لإنجاز مهمة", "مهارة مثبّتة ومستخدمة في مهمة حقيقية")),
      S(s("Writing your own skill", "The SKILL.md format: name and description, instructions, examples and supporting files; testing and improving a skill", ["Claude Code"], "Write a brand-content skill, test it on three briefs and refine it", "Custom skill in the project folder (Mini project 5)"),
        s("كتابة مهارة خاصة بك", "صيغة SKILL.md: الاسم والوصف، والتعليمات، والأمثلة، والملفات المساندة؛ واختبار المهارة وتحسينها", ["Claude Code"], "كتابة مهارة لمحتوى العلامة واختبارها على ثلاثة موجزات وتحسينها", "مهارة مخصّصة داخل مجلد المشروع (المشروع المصغّر 5)")),
    ],
  },
  {
    id: "M6", T: 2.5, P: 6.5, track: "design",
    en: {
      name: "AI for Design and Image Creation",
      short: "Design & Images",
      purpose: "Participants generate and edit images with AI, keep a character or product consistent across scenes, and turn the results into finished designs.",
      outcomes: ["Write image prompts that control subject, style, composition, lighting and format", "Edit images through conversation and keep faces and objects consistent", "Use AI editing tools: background removal, generative fill and expand", "Build a brand visual kit of social templates, a poster and a carousel"],
      project: ["Brand visual kit", "A character sheet, eight campaign images and a set of social media templates"],
    },
    ar: {
      name: "الذكاء الاصطناعي في التصميم وإنشاء الصور",
      short: "التصميم والصور",
      purpose: "يولّد المشاركون الصور ويعدّلونها بالذكاء الاصطناعي، ويحافظون على ثبات شخصية أو منتج عبر المشاهد، ثم يحوّلون النتائج إلى تصاميم مكتملة.",
      outcomes: ["يكتب أوامر صور تتحكم في الموضوع والأسلوب والتكوين والإضاءة والمقاس", "يعدّل الصور عبر المحادثة ويحافظ على ثبات الوجوه والعناصر", "يستخدم أدوات التحرير الذكية: إزالة الخلفية والتعبئة والتوسيع التوليديان", "يبني حزمة بصرية للعلامة تضم قوالب للتواصل وملصقاً وكاروسيل"],
      project: ["الحزمة البصرية للعلامة", "بطاقة شخصية، وثماني صور للحملة، ومجموعة قوالب لمنصات التواصل"],
    },
    sessions: [
      S(s("Image prompting and generation", "Subject, style, composition, lighting and aspect ratio; editing an image by describing changes", ["ChatGPT image generation", "Gemini", "Adobe Firefly"], "Generate a set of campaign images from one brief", "Eight images with a prompt log"),
        s("كتابة أوامر الصور وتوليدها", "الموضوع والأسلوب والتكوين والإضاءة ونسبة الأبعاد؛ وتعديل الصورة بوصف التغيير المطلوب", ["توليد الصور في ChatGPT", "Gemini", "Adobe Firefly"], "توليد مجموعة صور للحملة من موجز واحد", "ثماني صور مع سجل الأوامر")),
      S(s("Consistent characters and brand visuals", "Reference images, fixed descriptions and multi-turn editing to keep a character or product the same across scenes", ["Gemini", "ChatGPT image generation", "Adobe Firefly"], "Create a brand character and place it in four scenes", "Character sheet and four consistent scenes"),
        s("شخصيات ثابتة وصور متسقة للعلامة", "الصور المرجعية والأوصاف الثابتة والتعديل على عدة جولات للحفاظ على الشخصية أو المنتج نفسه عبر المشاهد", ["Gemini", "توليد الصور في ChatGPT", "Adobe Firefly"], "إنشاء شخصية للعلامة ووضعها في أربعة مشاهد", "بطاقة الشخصية وأربعة مشاهد متسقة")),
      S(s("Designing with AI in Canva", "Canva Magic Studio: Magic Design, Magic Edit, Background Remover and Magic Expand; brand kits and layouts; Generative Fill in Firefly", ["Canva (Magic Studio)", "Adobe Firefly"], "Design social templates, a poster and a carousel from the generated images", "Brand visual kit (Mini project 6)"),
        s("التصميم بالذكاء الاصطناعي في Canva", "أدوات Magic Studio في Canva: Magic Design وMagic Edit وإزالة الخلفية وMagic Expand؛ وحزم العلامة والتخطيطات؛ والتعبئة التوليدية في Firefly", ["Canva (Magic Studio)", "Adobe Firefly"], "تصميم قوالب للتواصل وملصق وكاروسيل من الصور المولَّدة", "الحزمة البصرية للعلامة (المشروع المصغّر 6)")),
    ],
  },
  {
    id: "M7", T: 2.5, P: 6.5, track: "media",
    en: {
      name: "Creating Video with AI",
      short: "AI Video",
      purpose: "Participants plan a short video with AI, then generate the shots with AI video tools while keeping characters, places and lighting consistent.",
      outcomes: ["Write a 30–45 second script and turn it into a storyboard and shot list", "Generate shots from text, from start and end frames, and from reference images", "Direct camera movement and pacing through prompts", "Keep a character and scene consistent across consecutive shots"],
      project: ["AI-generated shot sequence", "A script, a six-frame storyboard and a sequence of consistent generated shots ready for editing"],
    },
    ar: {
      name: "إنشاء الفيديو بالذكاء الاصطناعي",
      short: "إنشاء الفيديو",
      purpose: "يخطّط المشاركون لفيديو قصير بمساعدة الذكاء الاصطناعي، ثم يولّدون لقطاته بأدوات الفيديو الذكية مع الحفاظ على ثبات الشخصيات والأماكن والإضاءة.",
      outcomes: ["يكتب سيناريو مدته من 30 إلى 45 ثانية ويحوّله إلى لوحة مصوّرة وقائمة لقطات", "يولّد اللقطات من نص، أو من إطار بداية ونهاية، أو من صور مرجعية", "يوجّه حركة الكاميرا والإيقاع عبر الأوامر", "يحافظ على ثبات الشخصية والمشهد عبر لقطات متتالية"],
      project: ["سلسلة لقطات مولَّدة", "سيناريو ولوحة مصوّرة من ست لقطات وسلسلة لقطات متسقة جاهزة للمونتاج"],
    },
    sessions: [
      S(s("Script and storyboard with AI", "Short-video structures, storyboards and shot lists; generating storyboard frames as images", ["ChatGPT", "Claude", "Gemini"], "Write a 30–45 second script and build a six-frame storyboard", "Script and storyboard"),
        s("السيناريو واللوحة المصوّرة بمساعدة الذكاء الاصطناعي", "بنى الفيديو القصير، واللوحات المصوّرة وقوائم اللقطات؛ وتوليد إطارات اللوحة كصور", ["ChatGPT", "Claude", "Gemini"], "كتابة سيناريو مدته من 30 إلى 45 ثانية وبناء لوحة مصوّرة من ست لقطات", "السيناريو واللوحة المصوّرة")),
      S(s("Generating shots", "Text-to-video, frames-to-video and reference images; describing camera moves, framing and pacing", ["Google Flow", "Runway"], "Generate four to six shots from the storyboard", "Generated shot set"),
        s("توليد اللقطات", "تحويل النص إلى فيديو، والإطارات إلى فيديو، واستخدام الصور المرجعية؛ ووصف حركة الكاميرا والتأطير والإيقاع", ["Google Flow", "Runway"], "توليد من أربع إلى ست لقطات من اللوحة المصوّرة", "مجموعة اللقطات المولَّدة")),
      S(s("Continuity and extending scenes", "Building scenes shot by shot, extending clips, and keeping characters and lighting consistent", ["Google Flow (Scenebuilder)", "Runway"], "Produce three consecutive shots that match", "Shot sequence ready to edit (Mini project 7)"),
        s("الاستمرارية وتمديد المشاهد", "بناء المشهد لقطة بعد لقطة، وتمديد المقاطع، والحفاظ على ثبات الشخصيات والإضاءة", ["Google Flow (Scenebuilder)", "Runway"], "إنتاج ثلاث لقطات متتالية متطابقة", "سلسلة لقطات جاهزة للمونتاج (المشروع المصغّر 7)")),
    ],
  },
  {
    id: "M8", T: 2.5, P: 6.5, track: "media",
    en: {
      name: "AI-Assisted Editing, Animation and Motion",
      short: "Editing & Motion",
      purpose: "Participants edit footage with AI-assisted tools, animate their designs, and build a motion graphics video from code with Claude Code and Remotion.",
      outcomes: ["Edit video by editing its transcript and remove filler words and silences", "Add automatic captions, remove backgrounds and tighten pacing", "Animate static designs and turn images into short motion clips", "Generate and render a motion graphics video with Remotion through Claude Code"],
      project: ["Edited video and motion pieces", "A captioned 45–60 second video, an animated title and a rendered motion graphics clip"],
    },
    ar: {
      name: "المونتاج والتحريك (Animation وMotion) بمساعدة الذكاء الاصطناعي",
      short: "المونتاج والتحريك",
      purpose: "يُجري المشاركون المونتاج بأدوات مدعومة بالذكاء الاصطناعي، ويحرّكون تصاميمهم، ويبنون فيديو موشن جرافيك من الكود باستخدام Claude Code وRemotion.",
      outcomes: ["يحرّر الفيديو بتحرير النص المفرّغ منه، ويزيل الكلمات الحشوية وفترات الصمت", "يضيف نصوصاً تلقائية ويزيل الخلفيات ويضبط الإيقاع", "يحرّك التصاميم الثابتة ويحوّل الصور إلى مقاطع حركة قصيرة", "يولّد فيديو موشن جرافيك ويصدّره عبر Remotion من داخل Claude Code"],
      project: ["فيديو بعد المونتاج ومقاطع حركة", "فيديو مدته من 45 إلى 60 ثانية مع نصوص، وعنوان متحرك، ومقطع موشن جرافيك مُصدَّر"],
    },
    sessions: [
      S(s("Fast editing with AI", "Text-based editing, removing filler words and silences, automatic captions and background removal", ["Descript", "CapCut"], "Cut the generated shots and a recorded clip into a 45–60 second video", "Rough cut with captions"),
        s("مونتاج سريع بالذكاء الاصطناعي", "التحرير عبر النص، وإزالة الكلمات الحشوية والصمت، والنصوص التلقائية، وإزالة الخلفية", ["Descript", "CapCut"], "تجميع اللقطات المولَّدة ومقطع مسجّل في فيديو مدته من 45 إلى 60 ثانية", "نسخة أولية مع النصوص")),
      S(s("Animation and motion content", "Animating designs, turning images into motion clips, and motion templates for social media", ["Canva (Magic Animate)", "Runway", "CapCut"], "Animate a title card and produce a 10-second motion post", "Animated title and motion post"),
        s("التحريك ومحتوى الموشن", "تحريك التصاميم، وتحويل الصور إلى مقاطع حركة، وقوالب الحركة لمنصات التواصل", ["Canva (Magic Animate)", "Runway", "CapCut"], "تحريك بطاقة عنوان وإنتاج منشور متحرك مدته 10 ثوانٍ", "عنوان متحرك ومنشور متحرك")),
      S(s("Motion graphics from code: Remotion with Claude Code", "How Remotion builds videos with React; using Remotion's skills in Claude Code to create, preview and render a composition", ["Claude Code", "Remotion"], "Describe an animated quote or data video, refine it in the preview and render it to MP4", "Rendered motion graphics video (Mini project 8)"),
        s("موشن جرافيك من الكود: Remotion مع Claude Code", "كيف يبني Remotion الفيديو باستخدام React؛ واستخدام مهارات Remotion داخل Claude Code لإنشاء التكوين ومعاينته وتصديره", ["Claude Code", "Remotion"], "وصف فيديو متحرك لاقتباس أو بيانات، وتحسينه في المعاينة، وتصديره بصيغة MP4", "فيديو موشن جرافيك مُصدَّر (المشروع المصغّر 8)")),
    ],
  },
  {
    id: "M9", T: 2, P: 4, track: "media",
    en: {
      name: "Voiceover and Audio with AI",
      short: "Voice & Audio",
      purpose: "Participants give their video a voice and a soundtrack: AI narration, sound effects and music, and clean recorded speech, mixed into a finished piece.",
      outcomes: ["Produce natural narration with text to speech and control pacing through the script", "Design a voice that fits the brand, and follow consent rules for real voices", "Generate sound effects and music from text descriptions", "Clean recorded speech and mix voice, music and effects at the right levels"],
      project: ["Fully voiced and mixed video", "The project video with narration, music, sound effects and clean audio"],
    },
    ar: {
      name: "التعليق الصوتي والصوتيات بالذكاء الاصطناعي",
      short: "التعليق الصوتي والصوت",
      purpose: "يمنح المشاركون الفيديو صوتاً وموسيقى: تعليقاً صوتياً مولَّداً، ومؤثرات صوتية وموسيقى، وتنقية للكلام المسجّل، ثم مزجها في عمل مكتمل.",
      outcomes: ["يُنتج تعليقاً صوتياً طبيعياً بتحويل النص إلى كلام ويضبط الإيقاع عبر النص", "يصمّم صوتاً يناسب العلامة، ويلتزم بقواعد الموافقة عند استخدام أصوات حقيقية", "يولّد مؤثرات صوتية وموسيقى من وصف نصي", "ينقّي الكلام المسجّل ويمزج الصوت والموسيقى والمؤثرات بمستويات مناسبة"],
      project: ["فيديو بصوت ومزج كامل", "فيديو المشروع مع تعليق صوتي وموسيقى ومؤثرات وصوت نقي"],
    },
    sessions: [
      S(s("AI voiceover", "Text to speech, voice design, pacing and emphasis through the script, and rules for using real people's voices", ["ElevenLabs", "CapCut (text to speech)"], "Produce the video narration in Arabic and English", "Narration tracks"),
        s("التعليق الصوتي بالذكاء الاصطناعي", "تحويل النص إلى كلام، وتصميم الصوت، والتحكم في الإيقاع والتشديد عبر النص، وقواعد استخدام أصوات أشخاص حقيقيين", ["ElevenLabs", "CapCut (تحويل النص إلى كلام)"], "إنتاج التعليق الصوتي للفيديو بالعربية والإنجليزية", "مسارات التعليق الصوتي")),
      S(s("Sound design and clean audio", "Sound effects and music from text, cleaning recorded speech, and mixing levels", ["ElevenLabs (Sound Effects, Music)", "Adobe Podcast Enhance Speech", "Descript (Studio Sound)", "CapCut"], "Build the full soundtrack and mix it into the video", "Final voiced and mixed video (Mini project 9)"),
        s("تصميم الصوت وتنقيته", "المؤثرات والموسيقى من وصف نصي، وتنقية الكلام المسجّل، وضبط مستويات المزج", ["ElevenLabs (Sound Effects وMusic)", "Adobe Podcast Enhance Speech", "Descript (Studio Sound)", "CapCut"], "بناء المسار الصوتي الكامل ومزجه مع الفيديو", "الفيديو النهائي بالصوت والمزج (المشروع المصغّر 9)")),
    ],
  },
  {
    id: "M10", T: 3, P: 6, track: "automate",
    en: {
      name: "Automation: Connecting AI Tools with n8n",
      short: "Automation with n8n",
      purpose: "Participants connect tools into workflows that run on their own, starting with simple data flows and ending with an AI-powered content pipeline. The level stays practical: no servers or advanced programming.",
      outcomes: ["Explain triggers, nodes and how data moves through a workflow", "Build workflows with form, manual and schedule triggers", "Map data between steps with expressions and IF conditions", "Add an AI step that drafts content inside a workflow", "Handle credentials safely and decide when a task is worth automating"],
      project: ["Content automation workflow", "A working n8n pipeline that collects an idea through a form, drafts a hook, caption, CTA and image prompt with AI, and saves them to Google Sheets for review"],
    },
    ar: {
      name: "الأتمتة: ربط أدوات الذكاء الاصطناعي باستخدام n8n",
      short: "أتمتة n8n",
      purpose: "يربط المشاركون الأدوات في مسارات عمل تعمل تلقائياً، بدءاً من تدفقات بيانات بسيطة وصولاً إلى خط إنتاج محتوى مدعوم بالذكاء الاصطناعي. يبقى المستوى عملياً: دون خوادم أو برمجة متقدمة.",
      outcomes: ["يشرح المُشغِّلات (Triggers) والعُقد (Nodes) وكيف تنتقل البيانات في سير العمل", "يبني مسارات عمل بمُشغِّل نموذج ومُشغِّل يدوي ومُشغِّل مجدول", "يربط البيانات بين الخطوات بالتعبيرات (Expressions) وشروط IF", "يضيف خطوة ذكاء اصطناعي تكتب المحتوى داخل سير العمل", "يتعامل مع بيانات الاعتماد بأمان ويقرّر متى تستحق المهمة الأتمتة"],
      project: ["سير عمل لأتمتة المحتوى", "خط عمل في n8n يجمع الفكرة عبر نموذج، ويكتب بالذكاء الاصطناعي افتتاحية ونصاً ودعوة لاتخاذ إجراء وأمراً لصورة، ثم يحفظها في Google Sheets للمراجعة"],
    },
    sessions: [
      S(s("Automation basics", "Triggers, nodes, inputs and outputs, data flow, credentials and keeping them secure", ["n8n", "Google Sheets"], "Build a workflow that sends form entries to a spreadsheet", "First working workflow"),
        s("أساسيات الأتمتة", "المُشغِّلات والعُقد والمدخلات والمخرجات وتدفق البيانات، وبيانات الاعتماد وحمايتها", ["n8n", "Google Sheets"], "بناء سير عمل ينقل مدخلات نموذج إلى جدول بيانات", "أول سير عمل يعمل")),
      S(s("Adding AI to a workflow", "The AI Agent node, prompts inside workflows, expressions and IF conditions", ["n8n (AI Agent node)", "Google Sheets"], "Build the Content Idea Generator: form → AI → hook, caption, CTA, image prompt → Sheets", "Working AI workflow"),
        s("إضافة الذكاء الاصطناعي إلى سير العمل", "عقدة AI Agent، والأوامر داخل سير العمل، والتعبيرات وشروط IF", ["n8n (عقدة AI Agent)", "Google Sheets"], "بناء مولّد أفكار المحتوى: نموذج ← ذكاء اصطناعي ← افتتاحية ونص وCTA وأمر صورة ← Sheets", "سير عمل بالذكاء الاصطناعي يعمل")),
      S(s("A weekly content pipeline", "Schedule triggers, webhooks (concept), review steps and notifications; knowing when not to automate", ["n8n", "Google Sheets", "Gmail"], "Build a scheduled pipeline that reads the content calendar, drafts the week's posts and emails them for review", "Scheduled pipeline and workflow diagram (Mini project 10)"),
        s("خط محتوى أسبوعي", "المُشغِّل المجدول، وWebhook (مفهوم)، وخطوات المراجعة والإشعارات؛ ومعرفة متى لا نؤتمت", ["n8n", "Google Sheets", "Gmail"], "بناء خط مجدول يقرأ تقويم المحتوى ويكتب منشورات الأسبوع ويرسلها بالبريد للمراجعة", "خط عمل مجدول ومخطط له (المشروع المصغّر 10)")),
    ],
  },
  {
    id: "M11", T: 1, P: 11, track: "final",
    en: {
      name: "Final Project: From Idea to Complete Content",
      short: "Final Project",
      purpose: "Teams take one idea for a real organisation or cause and turn it into a complete content package using several AI tools together, then present it on Demo Day.",
      outcomes: ["Plan a multi-tool production from a single brief", "Combine research, writing, design, video, audio, code and automation in one project", "Check quality and accuracy before publishing", "Present the work and explain the choices behind it"],
      project: ["Complete content package", "Research brief, content pack and calendar, visual kit, edited and voiced video, motion piece, landing page, custom skill, automation and a portfolio case study"],
    },
    ar: {
      name: "المشروع النهائي: من الفكرة إلى محتوى متكامل",
      short: "المشروع النهائي",
      purpose: "تأخذ كل فريق فكرة واحدة لمنظمة حقيقية أو قضية، وتحوّلها إلى حزمة محتوى متكاملة باستخدام عدة أدوات ذكاء اصطناعي معاً، ثم تعرضها في يوم العرض.",
      outcomes: ["يخطّط لإنتاج متعدد الأدوات انطلاقاً من موجز واحد", "يجمع البحث والكتابة والتصميم والفيديو والصوت والكود والأتمتة في مشروع واحد", "يراجع الجودة والدقة قبل النشر", "يعرض العمل ويشرح الخيارات التي بُني عليها"],
      project: ["حزمة محتوى متكاملة", "موجز بحثي، وحزمة محتوى وتقويم، وحزمة بصرية، وفيديو بعد المونتاج والتعليق، ومقطع حركة، وصفحة هبوط، ومهارة مخصّصة، وأتمتة، ودراسة حالة للملف المهني"],
    },
    sessions: [
      S(s("Project brief and production plan", "Choosing the idea, writing the brief, and planning which tool does which part", ["Claude", "ChatGPT", "Gemini", "Google Sheets"], "Write the brief and a tool-by-tool production plan", "Approved brief and production plan"),
        s("موجز المشروع وخطة الإنتاج", "اختيار الفكرة، وكتابة الموجز، وتحديد الأداة المناسبة لكل جزء", ["Claude", "ChatGPT", "Gemini", "Google Sheets"], "كتابة الموجز وخطة إنتاج تحدّد الأداة لكل مرحلة", "موجز معتمد وخطة إنتاج")),
      S(s("Production sprint 1: content, visuals and video", "Running research, writing, image and video work in parallel inside a team", ["All program tools"], "Produce the content pack, visual kit and generated shots", "Mid-point review of core assets"),
        s("مرحلة الإنتاج 1: المحتوى والصور والفيديو", "تنفيذ البحث والكتابة والصور والفيديو بالتوازي داخل الفريق", ["جميع أدوات البرنامج"], "إنتاج حزمة المحتوى والحزمة البصرية واللقطات المولَّدة", "مراجعة منتصف المشروع للمواد الأساسية")),
      S(s("Production sprint 2: edit, voice, build and automate", "Finishing the video, publishing the landing page, connecting the automation, and writing the case study", ["All program tools"], "Complete the edit and audio, publish the page, run the workflow and write the case study", "Complete content package"),
        s("مرحلة الإنتاج 2: المونتاج والصوت والبناء والأتمتة", "إنهاء الفيديو، ونشر صفحة الهبوط، وربط الأتمتة، وكتابة دراسة الحالة", ["جميع أدوات البرنامج"], "إكمال المونتاج والصوت، ونشر الصفحة، وتشغيل سير العمل، وكتابة دراسة الحالة", "حزمة المحتوى المتكاملة")),
      S(s("Demo Day", "Presenting a project clearly: the problem, the process, the tools and the result", ["Presentation tools"], "Present the project and take questions; complete the final skills assessment", "Final presentation and portfolio"),
        s("يوم العرض", "عرض المشروع بوضوح: المشكلة، والطريقة، والأدوات، والنتيجة", ["أدوات العرض"], "عرض المشروع والإجابة عن الأسئلة؛ وإكمال تقييم المهارات النهائي", "العرض النهائي والملف المهني")),
    ],
  },
];
// Number sessions and weeks (3 sessions per week).
let n = 0;
for (const m of module.exports) {
  m.sessionNos = m.sessions.map(() => ++n);
  m.sessions.forEach((se, i) => { se.n = m.sessionNos[i]; se.week = Math.ceil(se.n / 3); });
}
