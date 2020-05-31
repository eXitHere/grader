const {hello, process_ } = require('./compile_run'); 
const sourceCode1 = `
    #include<stdio.h>
    int main(){
        int a,b,i;
        scanf("%d%d",&a,&b);
        printf("%d",a+b);
        return 0;
    }
`
const sourceCode2 = `
    #include<stdio.h>
    int main(){
        int a,b,i;
        scanf("%d%d",&a,&b);
        printf("%d",a+b);
        while(true);
        return 0;
    }
`
const sourceCode3 = `
    #include<stdio.h>
    int main(){
        int a,b,i;
        scanf("%d%d",&a,&b);
        printf("%d",a-b);
        return 0;
    }
`
const testData1 = {
    data: {
        input: "1 2$.$2 3$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$1000000000 5$.$2 3",
        output: "3$.$5$.$8$.$100$.$100$.$100$.$100$.$100$.$100$.$5",
        scorePerCase: 10,
        sourceCode: sourceCode1,
    }
}
const testData2 = {
    data: {
        input: "1 2$.$2 3$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$1000000000 5$.$2 3",
        output: "3$.$5$.$8$.$100$.$100$.$100$.$100$.$100$.$100$.$5",
        scorePerCase: 10,
        sourceCode: sourceCode2,
    }
}
const testData3 = {
    data: {
        input: "1 2$.$2 3$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$3 5$.$1000000000 5$.$2 3",
        output: "3$.$5$.$8$.$100$.$100$.$100$.$100$.$100$.$100$.$5",
        scorePerCase: 10,
        sourceCode: sourceCode3,
    }
}
//Comment
TEST();

async function TEST() {
    //hello();
    for(let i=0;i<10;i++){
        console.log(await process_(testData1.data.sourceCode,testData1.data.input,testData1.data.output,10));
        console.log(await process_(testData2.data.sourceCode,testData2.data.input,testData2.data.output,10));
        console.log(await process_(testData3.data.sourceCode,testData3.data.input,testData3.data.output,10));
    }
    
}