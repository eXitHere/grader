module.exports = function (code) {
    let newString = code.substr((code.lastIndexOf(`#include`)));
    let newString2 = newString.substr(newString.indexOf(`>`) + 1);
    return code.substr(0, code.indexOf(newString2)) + `\r\n#include\"banned.h\"\r\n` + newString2;
};