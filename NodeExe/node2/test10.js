//외부에서 만들어진 모듈을 사용해보기

/*

**********************************************************
* 외부 모듈 설치하기(npm)
**********************************************************
package.json 파일생성
npm init 실행 (기본 외부모듈 설치-기본값 엔터)

npm install 모듈이름 : 설치
npm uninstall 모듈이름 : 삭제
npm install -g npm : 모든 모듈 업데이트 (잘 실행 안함)

npm install 모듈이름 --save : package.json 파일에 저장
npm install 모듈이름 --g(--global) : 전역 환경에 파일 저장
C:\Users\itwill\AppData\Roaming\npm\node_modules

npm install : package.json 파일에 기록된 모든패키지 설치

npm list : 설치된 패키지 정보
npm list -g : 전역환경에 설치된 정보

**********************************************************
*/
var logger = require('./logger')
var fs = require('fs')

var inName = './output.txt'
var outName = './output4.txt'

fs.exists(outName,function(fileName){

    //파일이 있는지 없는지 검사
    if(fileName){

        //unlink = 기존에 파일이 있으면 삭제시켜주는 명령어
        fs.unlink(outName,function(err){
            if(err){
                throw err
            }
            //logger통해서 파일 삭제!!!!!
            logger.info(outName + "삭제함!!")
        })
        return
    }

    var inFile = fs.createReadStream(inName,{flags:'r'})
    var outFile = fs.createWriteStream(outName,{flags:'w'})
    
    //읽어서 바로 내보냄 = pipe = 파일복사
    inFile.pipe(outFile)

    logger.info(inName + '파일 복사 성공!!!!')
})




