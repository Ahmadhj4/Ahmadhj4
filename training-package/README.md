# AI Creators Program – Training Package

Funder-facing training package for **AI-Powered Content Creation, Digital Marketing, Automation & Freelancing**, prepared under the Green Circle identity. October 2026.

## Files

| # | File | What it is |
|---|------|------------|
| 1 | `01_Concept_Note_AR.pptx` / `.pdf` | Arabic concept note (18 slides, RTL layout) |
| 2 | `02_Concept_Note_EN.pptx` / `.pdf` | English concept note (18 slides) |
| 3 | `03_Training_Proposal_AR.docx` / `.pdf` | Arabic detailed training proposal (20 pages, 18 sections) |
| 4 | `04_Training_Proposal_EN.docx` / `.pdf` | English detailed training proposal (20 pages, 18 sections) |
| – | `fonts/` | Cairo and IBM Plex Sans Arabic (SIL Open Font License) |
| – | `source/` | Content data and build scripts used to generate all four documents |

Install the fonts in `fonts/` before editing the PPTX or DOCX files. Without them, PowerPoint and Word substitute other fonts and line breaks may shift.

## Program at a glance

- **96 hours:** 32 sessions of 3 hours, three a week over 12 weeks.
- **26 h theory and 70 h hands-on** (73% hands-on), summed from the module hours.
- **11 modules in 7 tracks:**
  - AI foundations: choosing tools and prompting
  - Research & content
  - Build with Claude Code: Claude Code and Skills
  - Design & images
  - Video, motion & audio
  - Automation with n8n
  - Final project
- **10 mini projects**, one per module, plus a **final project** that takes one idea to a complete content package.
- **No pricing** anywhere in the package. Targets and the delivery format are marked "Proposed".

For every session, the proposal shows four things: what participants learn, the tools they use, what they build themselves, and the output they finish with.

## Tool verification (October 2026)

Every tool and feature named in the documents was checked against official product pages or documentation (listed in Section 18 of each proposal):

- **Claude Code** runs in the terminal, VS Code and the desktop app. Skills are folders with a SKILL.md file in `.claude/skills` or `~/.claude/skills`. Plugin marketplaces are reached through `/plugin`.
- **Remotion** offers agent skills for Claude Code.
- **Google Flow** creates video from text, from frames or from reference images ("ingredients"), and has Scenebuilder.
- **Runway** does image to video and supports references.
- **Canva Magic Studio** includes Magic Design, Magic Edit, Background Remover, Magic Expand and Magic Animate.
- **Adobe Firefly** offers text to image and Generative Fill/Expand.
- **Descript** offers text-based editing, filler word removal, Studio Sound and Underlord.
- **CapCut** offers auto captions, text to speech and background removal.
- **ElevenLabs** offers TTS, voice design, sound effects and Eleven Music.
- **Adobe Podcast** offers Enhance Speech.
- **NotebookLM** offers Audio Overviews, Video Overviews and mind maps.
- **Perplexity** gives answers with cited sources.
- **Gemini** offers Deep Research, Gems and image generation and editing.
- **n8n** includes the Form Trigger, AI Agent and Google Sheets nodes.

Tool logos appear only for tools with a published official mark, taken from simple-icons: Claude, Gemini, n8n, ElevenLabs, Perplexity, NotebookLM and Google Sheets. Other tools are shown by name.

## Brand use

- The supplied Green Circle logo is used unmodified, on its original black background.
- Brand colours are sampled from the logo itself: `#4DB449`, `#A6D04B`, `#727274` and black. White and light neutral tints are used for page backgrounds.

## QA performed

- **Content:**
  - Module hours sum to 96, and each module's session count × 3 h matches its hours.
  - The documents contain no references to age groups, no risks section, no decisions list, no TBD notes and no pricing.
  - Arabic and English are written separately, not translated line by line.
- **Files:** all PPTX and DOCX files pass OOXML validation, and the contents page numbers resolve.
- **Visual:** every slide and page was rendered and checked for overflow, overlap, RTL/LTR direction, mixed Arabic/Latin text, table widths and page breaks.

## Rebuilding

From `source/` (Node 18+, LibreOffice, Poppler):

```bash
npm install pptxgenjs docx react react-dom react-icons sharp playwright
node render_diagrams.js en && node render_diagrams.js ar
bash run_decks.sh
bash run_docs.sh
```

`run_decks.sh` and `run_docs.sh` refer to local paths of the validation helpers used during drafting; adjust these paths, or remove the validation lines, before running.
