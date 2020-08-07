const raw = `
    txt, md, sh, bat, gitignore,
    xml, yml, json, ini, svg,
    html, css, js, scss, sass, less, styl, jsx, vue, dart,
    c, m, cpp, cs, java, php, py, inc
`;

module.exports = {
    extStr: raw,
    exts: raw.split(/\s*,\s*/),
    ignore: /^(node_modules|\.git|\.svn)$/,
};
