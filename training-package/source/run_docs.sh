set -e
export NODE_PATH=$PWD/node_modules:/opt/node22/lib/node_modules
DOCX=/root/.claude/skills/synced/46f2dfe9-e50c-47d9-bdae-b9bd274b79f6_82f46e78-b9b7-46f5-9636-d6a37f04a130/docx
for l in ${LANGS:-en ar}; do
  node build_doc.js $l out/proposal_$l.docx
  python3 fix_bookmarks.py out/proposal_$l.docx
  (cd out && python3 $DOCX/scripts/office/validate.py proposal_$l.docx 2>&1 | tail -1; python3 $DOCX/scripts/office/soffice.py --headless --convert-to pdf proposal_$l.docx >/dev/null 2>&1; rm -f p$l-*.jpg; pdftoppm -jpeg -r ${RES:-45} proposal_$l.pdf p$l; pdfinfo proposal_$l.pdf | grep Pages)
done
