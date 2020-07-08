const fs = require('fs');

function checkAnswer(master, ans) {
    var masterSplit = master.trimEnd().split(/\r?\n/);
    var ansSplit = ans.trimEnd().split(/\r?\n/);
    if (masterSplit.length != ansSplit.length) {
        return false;
    }
    else {
        for(var index = 0; index < masterSplit.length; index++) {
            if (masterSplit[index].trimEnd() != ansSplit[index].trimEnd()) {
                return false;
            }
        }
    }
    return true;
}