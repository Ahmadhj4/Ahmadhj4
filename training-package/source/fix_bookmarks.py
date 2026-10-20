# docx-js writes the same w:id for every bookmark; renumber start/end pairs.
import sys, re, zipfile, shutil
src = sys.argv[1]; tmp = src + ".tmp"
zin = zipfile.ZipFile(src); zout = zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == "word/document.xml":
        x = data.decode("utf8"); n = [100]
        def rep(m):
            tag = m.group(0)
            if tag.startswith("<w:bookmarkStart"): n[0] += 1
            return re.sub(r'w:id="[^"]*"', f'w:id="{n[0]}"', tag)
        x = re.sub(r'<w:bookmark(?:Start|End)\b[^>]*>', rep, x)
        data = x.encode("utf8")
    zout.writestr(item, data)
zout.close(); shutil.move(tmp, src)
