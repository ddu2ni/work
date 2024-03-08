var fs = require('fs')

var inName = './output.txt'
var outName = './output3.txt'

fs.exists(outName,function(fileName){

    //파일이 있는지 없는지 검사
    if(fileName){

        //unlink = 기존에 파일이 있으면 삭제시켜주는 명령어
        fs.unlink(outName,function(err){
            if(err){
                throw err
            }
            console.log(outName + "삭제함")
        })
        return
    }

    var inFile = fs.createReadStream(inName,{flags:'r'})
    var outFile = fs.createWriteStream(outName,{flags:'w'})
    
    //읽어서 바로 내보냄 = pipe = 파일복사
    inFile.pipe(outFile)

    console.log('파일 복사 성공!')
})

