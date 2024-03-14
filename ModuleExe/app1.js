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
const mongoose = require('mongoose');

//user.js 모듈 불러오기
const user = require('./router/user.js')


//데이터베이스 연결 객체
let database;

//데이터베이스 스키마 객체 
let UserSchema

//데이터베이스 모델 객체
let UserModel


//데이터베이스 연결
function connectDB() {

  //const databaseUrl = "mongodb://127.0.0.1:27017/shopping";
  const databaseUrl = "mongodb://localhost:27017/shopping";

  mongoose.connect(databaseUrl)

  database = mongoose.connection

  //db에 연결되면 `데이터베이스에 연결되었습니다` 랑 `UserSchema 정의함`이 떠야함
  database.on('open',function(){

    console.log('데이터베이스에 연결되었습니다' + databaseUrl)

    //스키마정의
    createUserSchema();

  })

  database.on('error',console.error.bind(console,'몽구스 에러...'))
  
  database.on('disconnected',function(){
    console.log('연결이 끊어졌습니다. 5초후에 재연결 합니다')
    setInterval(connectDB,5000)
    
  })
}

// 익스프레스 객체 생성
var app = express()

// 포트 설정 (port 설정값 or 3000 포트)
app.set("port", process.env.PORT || 3000);
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

//-------------------------------------------------------------------------------------

function createUserSchema(){


   //userSchema.js 모듈 호출
    UserSchema = require('./database/userSchema').createSchema(mongoose)

    //Users에 스키마가 떠야함 ( Model : 어디에 정의하는지? )
    UserModel = mongoose.model('users3',UserSchema)
    console.log('UserModel 정의함')

    user.init(database,UserSchema,UserModel)
    
  }

//---------------------------------------------------------------------------------

//라우팅 함수
const router = express.Router();

//사용자 로그인 라우터
router.route("/process/login").post(user.login)

//사용자 추가 라우팅
router.route("/process/addUser").post(user.addUser)

//사용자 리스트 라우터
router.route('/process/listUser').post(user.listUser)


app.use("/", router);

//----------------------------------------------------------------------------------
// 에러처리
const errorHandler = expressErrorHandler({
  static: {
    404: "./templates/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//Express 서버 시작
http.createServer(app).listen(app.get("port"), function () {
  console.log("익스프레스 서버 시작: " + app.get("port"));

  //데이터 베이스 시작
  connectDB();
});
