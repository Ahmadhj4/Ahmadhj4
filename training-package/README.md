# AI Creators Program – Training Package

Training package for **AI-Powered Content Creation, Digital Marketing, Automation & Freelancing**, a program for young people aged 15–19. Prepared under the Green Circle identity. October 2026.

## Files

| # | File | What it is |
|---|------|------------|
| 1 | `01_Concept_Note_AR.pptx` / `.pdf` | Arabic concept note (18 slides, RTL layout) |
| 2 | `02_Concept_Note_EN.pptx` / `.pdf` | English concept note (18 slides) |
| 3 | `03_Training_Proposal_AR.docx` / `.pdf` | Arabic detailed training proposal (24 pages, 29 sections) |
| 4 | `04_Training_Proposal_EN.docx` / `.pdf` | English detailed training proposal (23 pages, 29 sections) |
| – | `fonts/` | Cairo and IBM Plex Sans Arabic (SIL Open Font License) |
| – | `source/` | Content data and build scripts used to generate all four documents |

The PPTX and DOCX files are fully editable. The PDFs are the presentation-safe versions.

**Before editing:** install the fonts in `fonts/`. The decks and documents use Cairo for headings and IBM Plex Sans Arabic for Arabic body text (English body text is Calibri). Without these fonts installed, PowerPoint and Word substitute other fonts and line breaks may shift.

## Program design at a glance

- **96 hours** = 32 sessions × 3 hours, three sessions a week for 11 weeks, plus one buffer week (12 weeks in total, under three months).
- **28.5 h theory / 67.5 h practice** (about 30/70), summed from the module hours.
- **11 modules in 7 tracks:** Foundation, Create, Produce, Market, Automate (n8n), Launch, Capstone.
- **Capstone:** AI-Powered Mini Digital Agency, 19 deliverables, built step by step inside the modules.
- **Two age tracks:** the 15–17 core track and the 18+ track. Both cover the same curriculum and hours. Tools restricted to 18+ users are shown by the trainer to under-18s.
- **No pricing** anywhere in the package.

All hour figures come from one data file (`source/data_modules.js`), so every table and chart in all four documents uses the same numbers.

## Fact-check log (tool rules, verified October 2026)

| Tool | Verified rule | Source |
|------|---------------|--------|
| ChatGPT | 13+ (or local minimum); under 18 needs parent/guardian permission; teen protections for under-18s | OpenAI Terms of Use; OpenAI Help Center (parental controls) |
| Gemini app | 13+ (or local age) with a personal or school account; 18+ with a work account | Gemini Apps Help |
| Gemini video generation | 18+; Google AI Pro/Ultra for personal accounts | Gemini Apps Help |
| Google Flow | 18+ with age verification, supported region, eligible Google AI plan | Flow Help Center |
| Claude | 18+ | Anthropic Consumer Terms (effective 8 Oct 2025) |
| ElevenLabs | 18+ | ElevenLabs Terms |
| Canva | Under-13s only through Canva Education | Canva Terms of Use |
| CapCut | 13+ in most countries, higher in some regions | CapCut Help Center |
| n8n | Community Edition free to self-host; sharing and projects excluded | n8n Docs |
| Gemini API / AI Studio | 18+; not for apps directed to under-18s | Gemini API Additional Terms (18 Dec 2025) |
| Google account | 13 default, varies by country | Google Account Help |
| GitHub Pages | 13+ | GitHub Terms of Service |
| Fiverr | Sellers 18+; 13–17 only via a parent's account | Fiverr Help Center |

Full URLs are listed in Section 29 of each proposal. Direct access to some official pages was blocked in the drafting environment, so those pages were read through search-engine excerpts. **Re-check all of these rules 2–4 weeks before launch.**

**Not verified, marked TBD in the documents:** the age terms for n8n Cloud, Upwork's age rule, and teen access to image generation in ChatGPT and Gemini.

## Brand use

- Only the supplied Green Circle logo is used, unmodified, on its original black background.
- Brand colours were sampled from the logo itself: green `#4DB449`, lime `#A6D04B`, grey `#727274`, black `#000000`. White and light neutral tints are used for page backgrounds.
- No official Green Circle brand guidelines were supplied. Fonts and neutral tints were therefore chosen for this package; they are not presented as official brand assets.
- The only tool logo is the n8n mark, used on the n8n slide (source: simple-icons, which cites n8n.io/press). The icons are generic Lucide icons and are not presented as official.

## Open items (TBD)

Delivery location, dates and schedule · cohort size and selection criteria · n8n hosting model and AI provider · access plan for 18+ tools · community partners and Demo Day guests · certificate format and issuing body · safeguarding procedure of the host organisation · delivery language and scope of bilingual materials.

Every target percentage (KPIs, assessment weights, rubric weights) is marked **Proposed**.

## QA performed

- **Content:** module hours sum to 96, and each module's session count × 3 h matches its hours. KPIs, hours and names are the same across all four files. The files contain no pricing and no leftover placeholder text.
- **Files:** all PPTX and DOCX files pass OOXML validation. Bookmark IDs in the DOCX are renumbered so that the contents page numbers resolve.
- **Visual:** every slide and page was rendered to PDF and checked for overflow, overlap, RTL/LTR direction, mixed Arabic/Latin bidi issues, logo placement, table widths and page breaks, then fixed and re-rendered.

## Rebuilding

From `source/` (Node 18+, LibreOffice, Poppler):

```bash
npm install pptxgenjs docx react react-dom react-icons sharp playwright
node render_diagrams.js en && node render_diagrams.js ar   # proposal diagrams
bash run_decks.sh                                            # concept notes
bash run_docs.sh                                             # proposals
```

`run_decks.sh` and `run_docs.sh` refer to local paths of the validation helpers used during drafting; adjust these paths, or remove the validation lines, before running.
