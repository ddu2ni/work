//Session 세션


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

var expressSession = require('express-session')

//express 객체 생성
var app = express()

//미들웨어를 가진 app -> 3개
//포트 설정 (넣을 땐 set / 가지고 올 땐 get)
app.set('port', process.env.PORT || 3000) 

//post방식을 지원하겠음 
app.use(express.urlencoded({extended:true}))
app.use('/public',serveStatic(path.join(__dirname,'templates')))


//쿠키 미들웨어 추가
app.use(cookieParser()) //line 17번에 의해 쿠키함수 불러옴


//세션설정
app.use(expressSession({
    //secret = 'my key'내가 만든 키값  + 플러스해서 암호화시킴
    //resave = 세션을 항상 저장할거야?
    //saveUninitialized = 세션을 한번 만들면 그 세션을 변경시키지 않겠음
    secret: 'my key',
    resave: true, 
    saveUninitialized: true
}))


//라우터 객체 (내장객체를 가지고있기때문에 객체생성 따로 안해도됨)
var router = express.Router();

//라우팅 함수 추가
//process/showCookie명령을 get방식으로 주게 되면
router.route('/process/login').post(function(req,res){

    console.log('/process/login 호출됨')

    var id = req.body.id;
    var pwd = req.body.pwd;

    //세션에 user가 있으면
    if(req.session.user){
        console.log('로그인 되어있음')
        res.redirect('/public/product.html')
    }else{
        if(id=='suzi' && pwd == 'a123'){

            //세션에 저장 ( =세션만들기)
            req.session.user = {
                id : id,
                name : '배수지',
                authorized : true
            }

            res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
            res.write('<h1>로그인 성공</h1>')
            res.write('<div>ID: ' + id + '</div>')
            res.write('<div>PWD: ' + pwd + '</div>')
            res.write('<div>NAME: ' + req.session.user.name + '</div>')
            res.write("<br/><br/><a href='/process/product'>상품페이지</a>")
            res.end()
        
        }else{
            console.log('아이디나 패스워드가 틀립니다')
            res.redirect('/public/login3.html')
        }
    }
})


router.route('/process/product').get(function(req,res){

    //상품정보
    console.log('/process/product 호출됨')
    
    if(req.session.user){
        //상품정보를 클릭했을 때 로그인이 되어있으면 보여주면 됨
        console.log('로그인 되어있음')
        res.redirect('/public/product.html')

        //로그인이 안되어있으면 보여주면 안됨 -> 로그인 주소로 보냄
    }else{
        console.log('로그인 먼저 하세요')
        res.redirect('/public/login3.html')
    }
})

router.route('/process/logout').get(function(req,res){

    //로그아웃
    console.log('/process/logout 호출됨')
    
    if(req.session.user){
        console.log('로그아웃 합니다')

        //세션삭제 (비동기방식)
        req.session.destroy(function(err){
            
            if(err) throw err;

            console.log('세션을 삭제하고 로그아웃되었습니다')
            res.redirect('/public/login3.html')

        })

    }else{
        console.log('아직 로그인되어있지 않습니다')
        res.redirect('/public/login3.html')
    }
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