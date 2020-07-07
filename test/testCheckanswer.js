var test = "ABCDEF \nABCDEF    \n\n\n\n"
var test2 = "ABCDEF\nABCDEF\n"

var ans = test.replace(/\s*$/,'');

/*if(checkAnswer(test,test2)) console.log("Same");
else console.log("Not Same")
*/

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