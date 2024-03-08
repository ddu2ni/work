//Cookie
//쿠키 모듈 만들기


//process안으로 들어감
require('dotenv').config()

var express = require('express')
var http = require('http')

var path = require('path')
//특정폴더를 access할 수 있게 해주는 모듈
//특정폴더를 패스로 접근할 수 있게 해주는 
var serveStatic = require('serve-static')

var expressErrorHandler = require('express-error-handler')
var cookieParser = require('cookie-parser') //얘 자체가 함수임

//express 객체 생성
var app = express()

//미들웨어를 가진 app -> 3개
//포트 설정 (넣을 땐 set / 가지고 올 땐 get)
app.set('port', process.env.PORT || 3000) 

//post방식을 지원하겠음 
app.use(express.urlencoded({extended:true}))
app.use('/public',serveStatic(path.join(__dirname,'templates')))


//쿠키추가
app.use(cookieParser()) //line 17번에 의해 쿠키함수 불러옴


//라우터 객체 (내장객체를 가지고있기때문에 객체생성 따로 안해도됨)
var router = express.Router();

//라우팅 함수 추가
//process/showCookie명령을 get방식으로 주게 되면
router.route('/process/showCookie').get(function(req,res){

    console.log('/process/showCookie 호출됨')

    //쿠키를 보는 친구
    res.send(req.cookies)
})


router.route('/process/setUserCookie').get(function(req,res){

    console.log('/process/setUserCookie 호출됨')

    //쿠키 만들기
    res.cookie('user',{
        id:'suzi',
        name:'배수지',
        authorize : true
    })
res.redirect('/process/showCookie')

})


//라우터는 express 서버(app)가 컨트롤하므로 app안에 라우터 넣기
//항상 맨 마지막에 쓰기
app.use('/',router)


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