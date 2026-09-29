/* Builds popup.min.js from popup.js.
   Conservative: strips comments, indentation and blank lines only. It never
   renames, reorders or joins statements, so the output cannot change
   behaviour -- it only gets smaller. Run: node build-min.cjs */
var fs = require('fs');
var src = fs.readFileSync('popup.js', 'utf8');

var out = '';
var i = 0, inStr = null, inLine = false, inBlock = false;
while (i < src.length) {
  var c = src[i], n = src[i + 1];
  if (inLine) { if (c === '\n') { inLine = false; out += c; } i++; continue; }
  if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i += 2; } else { i++; } continue; }
  if (inStr) {
    out += c;
    if (c === '\\') { out += src[i + 1]; i += 2; continue; }
    if (c === inStr) { inStr = null; }
    i++; continue;
  }
  if (c === '"' || c === "'") { inStr = c; out += c; i++; continue; }
  if (c === '/' && n === '/') { inLine = true; i += 2; continue; }
  if (c === '/' && n === '*') { inBlock = true; i += 2; continue; }
  out += c; i++;
}

out = out
  .split('\n')
  .map(function (l) { return l.replace(/[ \t]+$/, '').replace(/^[ \t]+/, ''); })
  .filter(function (l) { return l.length; })
  .join('\n');

fs.writeFileSync('popup.min.js', out);
fs.writeFileSync('popup.wrapped.js', '<script>\n' + out + '\n</script>\n');
console.log('popup.min.js      ' + out.length + ' bytes');
console.log('popup.wrapped.js  ' + (out.length + 19) + ' bytes');
