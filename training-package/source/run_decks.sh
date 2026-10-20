set -e
export PPTX_SKILL=/root/.claude/skills/synced/46f2dfe9-e50c-47d9-bdae-b9bd274b79f6_82f46e78-b9b7-46f5-9636-d6a37f04a130/pptx
export NODE_PATH=$PWD/node_modules
mkdir -p out
for l in ${LANGS:-en ar}; do
  node build_deck.js $l out/concept_$l.pptx
  (cd out && python3 $PPTX_SKILL/scripts/office/validate.py concept_$l.pptx | tail -1 && python3 $PPTX_SKILL/scripts/office/soffice.py --headless --convert-to pdf concept_$l.pptx >/dev/null 2>&1 && rm -f $l-*.jpg && pdftoppm -jpeg -r ${RES:-70} concept_$l.pdf $l)
done
