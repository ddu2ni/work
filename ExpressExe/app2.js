/*
(=request.getParameter)
* Get방식 : req.query.name
* Post방식 : req.body.name
* Get/Post : req.param('name')

*/


//express 서버로 만들기 위해선 모듈을 불러와야함
//넘어오는 데이터 받아서 출력하기

var express = require('express')
var http = require('http')

//express 객체 생성
var app = express()

//포트 설정 (넣을 땐 set / 가지고 올 땐 get)
//env = 파일의 이름 (중요한 환경설정)
//위 env 파일이 없으면 3000번 포트 번호 써라
app.set('port', process.env.PORT || 3000)

app.use(function(req,res,next){

    console.log('첫번째 미들웨어에서 처리')

    //클라이언트의 브라우저 정보를 얻음
    var userAgent = req.header('User-Agent')
    var paramName = req.query.name //get방식 , name = 변수 

    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
    res.write('<h1>Express 서버에서 응답한 결과입니다</h1>')
    res.write('<div>User-Agent: ' + userAgent + '</div>')
    res.write('<div>paramName: ' + paramName + '</div>')

})

//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 서버를 시작했습니다: ' + app.get('port'))
})