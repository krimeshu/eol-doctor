const { extStr } = require('./target-exts');

module.exports = `
EOL Doctor

usage: 
    eol-doctor . lf                     # convert eol into LF recursively
    eol-doctor . crlf                   # convert eol into CRLF recursively
    eol-doctor . lf --only txt|md       # just process them
    eol-doctor . lf --and srt|ass       # and process them
    eol-doctor . lf --not gitignore     # do not process them

default text files:
    ${extStr}
`;
