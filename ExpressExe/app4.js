
//process안으로 들어감
require('dotenv').config()

var express = require('express')
var http = require('http')

var path = require('path')
//특정폴더를 access할 수 있게 해주는 모듈
//특정폴더를 패스로 접근할 수 있게 해주는 
var serveStatic = require('serve-static')

var expressErrorHandler = require('express-error-handler')

//express 객체 생성
var app = express()

//미들웨어를 가진 app -> 3개
//포트 설정 (넣을 땐 set / 가지고 올 땐 get)
app.set('port', process.env.PORT || 3000) 

//post방식을 지원하겠음 
app.use(express.urlencoded({extended:true}))
app.use('/public',serveStatic(path.join(__dirname,'templates')))

//라우터 객체 (내장객체를 가지고있기때문에 객체생성 따로 안해도됨)

var router = express.Router();

//라우팅 함수 추가
//action="/process/login" 주소가 왔을 때 반응을 보이게 할거임

//----------------------------------------(1번째 방법)
// router.route('/process/login').post(function(req,res){
    
// })

//----------------------------------------(2번째 방법)
router.post('/process/login',function(req,res){

    //아래께 실행이 됐는지 확인
    console.log('/process/login 처리함')

    var paramId = req.body.id || req.query.id 
    var paramPwd = req.body.pwd || req.query.pwd 

    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
    res.write('<h1>Express 서버에서 응답한 결과입니다</h1>')
    res.write('<div>ID: ' + paramId + '</div>')
    res.write('<div>PWD: ' + paramPwd + '</div>')
    res.write("<br/><br/><a href='/public/login2.html'>로그인</a>")
    res.end();

})

//라우터는 express 서버(app)가 컨트롤하므로 app안에 라우터 넣기
//( = 라우터 객체를 app에 등록 / 항상 맨 마지막에 쓰기)0 
app.use('/',router)



/*
에러처리
어떠한 주소 (*) 오던  에러가 생기면 함수 실행
app.all('*',function(req,res){
    res.status(404).send('<h1>Error - 페이지를 찾을 수 없습니다.</h1>')
})
*/


var errorHandler = expressErrorHandler({
    static:{
        //404에러가 나면 : 여기로 가라
        '404' : './templates/404.html'
    }

})

//만들고 끝이 아니라 app가 알고있어야함

//404에러 캐치 등록
app.use(expressErrorHandler.httpError(404))
//line 72 변수 등록
app.use(errorHandler)



//Express 서버 시작
http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 서버를 시작했습니다: ' + app.get('port'))
})