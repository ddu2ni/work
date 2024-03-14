//패스워드 암호화
//crypto(pwd + salt key)
//단방향 암호화 : 한번 암호화한걸 되돌릴 수 없음 (회원가입)
//양방향 암호화(복호화) : 되돌릴 수 있음 (로그인)

require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const serveStatic = require("serve-static");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const config = require('./config.js')
const routerLoader = require('./router/routerLoader.js')
const database = require('./database/database.js')

const passport = require('passport')
const flash = require('connect-flash')


// 익스프레스 객체 생성
var app = express()

//뷰엔진 설정
// /views라는 폴더 만들거임
app.set('views',__dirname + '/views')
app.set('view engine','ejs')
console.log('뷰 엔진이 ejs 설정되었습니다')

// 포트 설정 (port 설정값 or 3000 포트)
app.set("port", process.env.PORT || config.serverPort);
app.use(express.urlencoded({ extended: true }));
app.use("/public", serveStatic(path.join(__dirname, "templates")));

// 쿠키 미들웨어 추가
app.use(cookieParser());

// 세션설정
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

//---------------------------------------------------------------------------------
//passport 사용
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//---------------------------------------------------------------------------------

//라우팅 함수
const router = express.Router();

routerLoader.init(app,router)


//---------------------------------------------------------------------------------
//Passport 관련 라우팅

//홈 화면(조회)
router.route('/').get(function(req,res){
  res.render('index.ejs')
})

//로그인 화면(조회)
router.route('/login').get(function(req,res){

  //login.ejs로 넘어갈 때 message(로그인할 때 에러메세지 )가 뜸
  res.render('login.ejs', {
    message:req.flash('loginMessage'),
  })
})

//로그인 요청
router.route('/login').post(passport.authenticate('local-login',{
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash :true,
}))

//회원가입 화면 조회
//login.ejs로 넘어갈 때 message(로그인할 때 에러메세지 )가 뜸
router.route('/signup').get(function(req,res){

  res.render('signup.ejs',{
      message:req.flash('signupMessage'),
  })

})



//회원가입 요청
// /signup 주소가 왔을 때 패스포트 local-signup 찾아가라
router.route('/signup').post(passport.authenticate('local-signup',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureMessage: true
}))

//사용자 프로필 보기
router.route('/profile').get(function(req,res){
  
console.log('req.user : ' +  req.user)

if(!req.user){
    console.log('사용자 인증이 안된 상태임!')
    res.redirect('/')
    return
  }
  
  console.log('사용자 인증이 성공 상태임!')

  if(Array.isArray(req,res)){

    res.render('profile.ejs',{user:req.user[0]._doc})
    
  }else{
      res.render('profile.ejs',{user:req.user})
    }
})


//로그아웃
router.route('/logout').get(function(req,res){

  req.logout(function(err){
    if(err) throw err
  })

  res.redirect('/')

})


//---------------------------------------------------------------------------------

//Passport Stragety 방식
const LocalStrategy = require("passport-local").Strategy;

//Passport 로그인 설정
passport.use(
  "local-login",
  new LocalStrategy(
    {
  usernameField: "email",
  passwordField: "pwd",
  passReqToCallback: true,

  //위에 Callback : true면 email, pwd, 클라이언트 넘어오는 request, 콜백함수로 다 넘겨주기 
  },function(req,email,pwd,done){

    //데이터 베이스 연결
    let database = app.get('database')

    //user로 email검색결과가 들어오게 되는데,
    database.UserModel.findOne({'email':email},function(err,user){

      //그 user가 없으면
      if(!user){

        console.log('등록된 계정이 없습니다')
        return done(null,false,req.flash('loginMessage','등록된 계정이 없습니다'))

      }

      //비밀번호가 일치하지 않는 경우 
      //authenticated : true,false = db에서 가져와서 인증하는거
      const authenticated = user.authenticate(
        pwd,
        user._doc.salt,
        user._doc.hashed_password
      );

      if (!authenticated) {
        console.log("비밀번호 일치하지 않음");
        return done(
          null,
          false,
          req.flash("loginMessage", "비밀번호가 일치하지 않습니다")
        );
      }

      console.log("비밀번호 일치");
      return done(null, user);
    });
  }
)
);



//패스포트 회원가입 설정
//Passport 회원가입 설정
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd",
      passReqToCallback: true,
    },
    function (req, email, pwd, done) {
      const name = req.body.name;
      process.nextTick(function () {
        const database = app.get("database");
        database.UserModel.findOne({ email: email }, function (err, user) {
          if (err) throw err;
          if (user) {
            console.log("회원가입이 되어있습니다.");
            return done(
              null,
              false,
              req.flash("signupMessage", "회원가입이 되어있습니다. ")
            );
          } else {
            const user = new database.UserModel({
              email: email,
              password: pwd,
              name: name,
            });
            user.save(function (err) {
              if (err) throw err;
              console.log("사용자 추가 완료");
              return done(null, user);
            });
          }
        });
      });
    }
  )
);

//---------------------------------------------------

//---------------------------------------------------

//사용자 인증 성공시 호출
passport.serializeUser(function (user, done) {
  console.log("serializeUser 호출됨");
  console.log("user:" + user);
  done(null, user); //객체 정보 전달
});

//사용자 인증 이후 사용자 요청시마다 호출
passport.deserializeUser(function (user, done) {
  console.log("deserializeUser 호출됨");
  console.log("user:" + user);
  done(null, user); //객체 정보 전달
});



//----------------------------------------------------------------------------------
// 에러처리
const errorHandler = expressErrorHandler({
  static: {
    404: "./templates/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

process.on('uncaughtException', function(err){
  console.log('서버프로세스 종료하지 않고 유지함')
})

//Express 서버 시작
let host = '192.168.16.16'
http.createServer(app).listen(app.get("port"),host,function () {
  console.log("익스프레스 서버 시작: " + app.get("port"));

  //데이터 베이스 시작
  database.init(app,config)
});
