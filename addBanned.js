const fs = require('fs');

module.exports = function (code) {
    //Read file libraryBanned.BAN
    const libBan = fs.readFileSync('./compile_run/libraryBanned.BAN').toString().split('\r\n');
    for (let i = 0; i < libBan.length; i++) {
        if (code.toString().includes(libBan[i])) {
            return [-1, `sorry_${libBan[i]}_is_a_banned_library`];
        }
    }

    //console.log(code);
    try {
        if (code.lastIndexOf(`#include`) == -1) {
            return [1, `#include\"banned.h\"\r\n` + code];
        }
        let newString = code.substr((code.lastIndexOf(`#include`)));
        let newString2 = newString.substr(newString.indexOf(`>`) + 1);
        return [1, code.substr(0, code.indexOf(newString2)) + `\r\n#include\"banned.h\"\r\n` + newString2];
    } catch (e) {
        //console.log(e);
        return [1, `#include\"banned.h\"\r\n` + code];
    }
};