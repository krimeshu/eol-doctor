const processArgs = process.argv.slice(2);

function analyseArgs(args = processArgs) {
    const argMap = {};
    for (let i = 0, len = args.length; i < len; i++) {
        const arg = args[i];
        const setArg = (key, value) => {
            argMap[key] = value;
        };

        let key;
        if (/^--.+=/.test(arg)) {
            const spPos = arg.indexOf('=');
            key = arg.substr(2, spPos - 2);
            const value = arg.substr(spPos + 1);
            setArg(key, value);
        } else if (/^--no-.+/.test(arg)) {
            key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false);
        } else if (/^--.+/.test(arg)) {
            key = arg.match(/^--(.+)/)[1];
            const next = args[i + 1];
            if (next !== undefined && !/^-/.test(next)) {
                setArg(key, next);
                i++;
            } else if (/^(true|false)$/.test(next)) {
                setArg(key, next === 'true');
                i++;
            } else {
                setArg(key, true);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split('');

            let broken = false;
            for (let j = 0, len = letters.length; j < len; j++) {
                const next = arg.slice(j + 2);

                if (next === '-') {
                    setArg(letters[j], next);
                    continue;
                }

                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split('=')[1]);
                    broken = true;
                    break;
                }

                if (/[A-Za-z]/.test(letters[j])
                    && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next);
                    broken = true;
                    break;
                }

                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j], true);
                }
            }

            key = arg.slice(-1)[0];
            if (!broken && key !== '-') {
                if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1])) {
                    setArg(key, args[i + 1]);
                    i++;
                } else if (args[i + 1] && /true|false/.test(args[i + 1])) {
                    setArg(key, args[i + 1] === 'true');
                    i++;
                } else {
                    setArg(key, true);
                }
            }
        } else {
            setArg('_', args.slice(i + 1));
            break;
        }
    }
    return argMap;
}
module.exports = {
    get processArgs() {
        return analyseArgs();
    },
    analyseArgs,
};
