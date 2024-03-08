/*

* 미들웨어 : 하나의 독립된 함수(use 메소드로 설정)
* 로그를 남기는 간단한 기능을 함수로 만들어서
  use()메소드로 미들웨어로 등록 하면 모든 클라이언트 요청에 로그를 남김
  미들웨어가 여러개면 next()메소드로 다음 미들웨어로 넘김

* 클라이언트요청 -> 라우터(요청패턴 /     ) ->  미들웨어 #0 ->  클라이언트응답
* 클라이언트요청 -> 라우터(요청패턴 /users) ->  미들웨어 #1 ->  클라이언트응답
* 클라이언트요청 -> 라우터(요청패턴 /sales) ->  미들웨어 #2 ->  클라이언트응답
* 클라이언트요청 -> 라우터(요청패턴 /account) ->미들웨어 #3 ->  클라이언트응답

*/



//express 서버로 만들기 위해선 모듈을 불러와야함

var express = require('express')
var http = require('http')

//express 객체 생성
var app = express()

//포트 설정 (넣을 땐 set / 가지고 올 땐 get)
//env = 파일의 이름 (중요한 환경설정)
//위 env 파일이 없으면 3000번 포트 번호 써라
app.set('port', process.env.PORT || 3000)

//미들웨어 객체를 만들어서 설정
app.use(function(req,res,next){

    console.log('첫번째 미들웨어에서 처리') //무조건 실행

    //뭘 실행할건지?
    // res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
    // res.end('<h1>Express 서버에서 응답한 결과입니다</h1>')

    //값넘기기
    req.user = 'suzi';

    next();

})


app.use('/',function(req,res,next){

    console.log('두번째 미들웨어에서 처리')

    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
    res.end('<h1>Express 서버에서' + req.user + '가 응답한 결과입니다</h1>')

})

//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 서버를 시작했습니다: ' + app.get('port'))
})