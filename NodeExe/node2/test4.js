//fs : (내장모듈)
var fs = require('fs')

//파일을 동기식으로 읽음 (동기식: 위에서부터 한줄 한줄 다 읽는 것)
var data = fs.readFileSync('../data.json','utf-8')

console.log(data)

console.log('동기화 방식으로 데이터 읽음')