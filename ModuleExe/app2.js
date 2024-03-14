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

//user.js 모듈 불러오기
const user = require('./router/user.js')
const config = require('./config')
const routerLoader = require('./router/routerLoader')

//데이터베이스 연결 객체
let database = require('./database/database')

// 익스프레스 객체 생성
var app = express()

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

//라우팅 함수
const router = express.Router();

routerLoader.init(app,router)

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
  database.init(app,config)
});
