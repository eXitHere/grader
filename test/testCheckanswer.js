var test = "ABCDEF \nABCDEF    \n"
var test2 = "ABCDEF\nABCDEF\n"

var ans = test.replace(/\s*$/,'');

if(checkAnswer(test,test2)) console.log("Same");
else console.log("Not Same")

function checkAnswer(master, ans) {
    var masterSplit = master.split(/\r?\n/);
    var ansSplit = ans.split(/\r?\n/);
    if (masterSplit.length != ansSplit.length) {
        return false;
    }
    else {
        for(var index = 0; index < masterSplit.length; index++) {
            if (masterSplit[index].replace(/\s*$/,'') != ansSplit[index].replace(/\s*$/,'')) {
                return false;
            }
        }
    }
    return true;
}