const fetch = require('node-fetch');
const { json } = require('express');

module.exports = {
  fetchToBackend,
}

async function fetchToBackend() {
    const response = await fetch('https://grader.everythink.dev/api/v1/admin/2sacsacmk231/', {
    //const response = await fetch('http://localhost:5000/api/v1/admin/2sacsacmk231/', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    //console.log('json updated!');
    const DATA = (await response.json());
    //console.log(DATA.data)
    for(var i = 0 ; i < DATA.data.length ; i++) {
      var input_split  = DATA.data[i].input.split('$.$');
      var output_split = DATA.data[i].output.split('$.$');
      //console.log(input_split, output_split);
      var newInput  = ''
      var newOutput = ''
      for(var j = 0 ; j < Math.ceil(input_split.length/5) ; j++) {
        if( j != 0) {
          newInput  += '$.$'
          newOutput += '$.$'
        }
        newInput  += input_split[j] 
        newOutput += output_split[j]
      }
      //console.log('input ' ,input_split.length, newInput)
      //console.log('output ' ,output_split.length, newOutput)
      DATA.data[i].input  = newInput;
      DATA.data[i].output = newOutput;
    }
    //console.log(DATA)
    return DATA;
    //return await response.json();
}

fetchToBackend()