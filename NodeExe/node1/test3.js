//내장 모듈 사용하기
// 외부에서 라이브러리 안받아도 이미 가지고 있는 라이브러리

//불러오는 방법
const { log } = require('console');
var os = require('os');

console.log(os.hostname())
console.log(os.freemem() + " / " + os.totalmem)
console.log(os.cpus())
console.log(os.networkInterfaces()) //RAM카드의 정보

console.log('------------------------------------------------')

var path = require('path')

var dir = ['users','itwill','docs']
var docDir = dir.join(path.sep) //sep = \ 붙여서 path가 가지고 있는걸 join해라
console.log(docDir)

console.log('------------------------------------------------')

var curPath = path.join('/user/itwill','notepad.exe')
console.log(curPath)

var filePath = "c:\\users\\itwill\\notepad.exe"
var dirName = path.dirname(filePath)
var fileName = path.basename(filePath)
var extName = path.extname(filePath)

console.log(dirName)
console.log(fileName)
console.log(extName)