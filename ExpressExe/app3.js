
//process안으로 들어감
require('dotenv').config()
var express = require('express')
var http = require('http')

var path = require('path')
//특정폴더를 access할 수 있게 해주는 모듈
var serveStatic = require('serve-static')

//express 객체 생성
var app = express()

//미들웨어를 가진 app -> 3개
//포트 설정 (넣을 땐 set / 가지고 올 땐 get)
app.set('port', process.env.PORT || 3000) 

//post방식을 지원하겠음 
app.use(express.urlencoded({extended:true}))
app.use(serveStatic(path.join(__dirname,'templates')))
app.use(function(req,res,next){

    console.log('POST 미들웨어에서 처리')

    //클라이언트의 브라우저 정보를 얻음
    var paramId = req.body.id || req.query.id //get방식 
    var paramPwd = req.body.pwd || req.query.pwd 

    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
    res.write('<h1>Express 서버에서 응답한 결과입니다</h1>')
    res.write('<div>ID: ' + paramId + '</div>')
    res.write('<div>PWD: ' + paramPwd + '</div>')

})

//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 서버를 시작했습니다: ' + app.get('port'))
})