//비동기방식 (함수도 있어야함)
var fs = require('fs')

fs.readFile('../data.json','utf-8',function(err, data){
    console.log(data)
})
console.log('비동기 방식으로 데이터 읽어옴')