const fs = require('fs');
const path = require('path');

const example = require('./example');
const { exts, ignore } = require('./target-exts');

const findFileRecursively = (dir, exts) => {
    const found = [];
    const skipedExts = {};

    const children = fs.readdirSync(dir);
    const subDirs = [];
    for (const child of children) {
        if (ignore.test(child)) continue;
        const childPath = path.join(dir, child);
        if (fs.statSync(childPath).isDirectory()) {
            subDirs.push(childPath);
        } else {
            const ext = path.extname(child).substr(1).toLocaleLowerCase();
            if (exts.indexOf(ext) < 0) {
                skipedExts[ext] = true;
            } else {
                found.push(childPath);
            }
        }
    }
    for (const subDir of subDirs) {
        const subRes = findFileRecursively(subDir, exts);
        found.push(...subRes.found);
        Object.assign(skipedExts, subRes.skipedExts);
    }
    return {
        found,
        skipedExts,
    };
};

module.exports = {
    showExample() {
        console.log(example);
    },
    process(dir, eol, { only, and, not }) {
        const targets = [];
        if (Array.isArray(only)) {
            targets.push(...only);
        } else {
            targets.push(...exts);
            if (Array.isArray(and)) {
                targets.push(...and);
            }
            if (Array.isArray(not)) {
                not.forEach(ext => {
                    const idx = targets.indexOf(ext);
                    (idx >= 0) && targets.splice(idx, 1);
                });
            }
        }
        const { found, skipedExts } = findFileRecursively(dir, targets);
        const skiped = Object.keys(skipedExts).filter(c => c).join(', ');
        console.log(`找到 ${found.length} 个处理目标` + (skiped ? `，跳过了以下后缀：\n${skiped}` : ''));

        eol = eol.replace(/cr/gi, '\r').replace(/lf/gi, '\n');

        const start = new Date();
        console.log('开始处理……\n\t');
        const UP = '\x1b[1A\x1b[2K';
        found.forEach((filePath, idx) => {
            console.log(`${UP}[${idx + 1}/${found.length}] ${filePath}`);
            const content = fs.readFileSync(filePath).toString();
            let newContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, eol);
            if (newContent === content) return;
            fs.writeFileSync(filePath, newContent);
        });
        const end = new Date();
        console.log(`处理完成，耗时: ${end - start}ms`);
    },
};
