var fs = require('fs')

//r = read / w = write / w+ = read & write / a[ppend]+(r+w) = 누적
//stream을 통해 파일읽고, 쓰기

//output.txt 파일의 내용을 읽어서 output2.txt 파일로 복사하는 역할
var inFile = fs.createReadStream('./output.txt',{flags:'r'})
var outFile = fs.createWriteStream('./output2.txt',{flags:'w'})

//./output.txt -> 자동으로 시작돼서 str에 넣고, 파일읽기시작하고 outFile에 넣고 str을 내보냄
inFile.on('data',function(str){
    console.log('파일 읽기 시작..')
    outFile.write(str)
})

console.log('---------------------------------------------------------------')


inFile.on("end",function(){
    console.log('파일 읽기 종료..')
    
    outFile.end(function(){
        console.log('파일 쓰기 완료..')
    })
})