require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const serveStatic = require("serve-static");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

//user.js 모듈 불러오기
const config = require("./config.js");
const routerLoader = require("./router/routerLoader.js");

//데이터베이스 연결 객체
let database = require("./database/database.js");

// passport 임포트
const passport = require("passport");
const flash = require("connect-flash");

//chat 모듈
const cors = require("cors");

// 익스프레스 객체 생성
var app = express();

//뷰엔진 설정
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
console.log("뷰 엔진 jade로 설정");

// 포트 설정 (port 설정값 or 3000 포트)
app.set("port", process.env.PORT || config.serverPort);
app.use(express.urlencoded({ extended: true }));
app.use("/public", serveStatic(path.join(__dirname, "templates")));

//cors 미들웨어 추가
app.use(cors());

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

//passport 사용 코딩
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//---------------------------------------------------------------------------------

//라우팅 함수
const router = express.Router();

routerLoader.init(app, router);

//---------------------------------------------------

//Passport 관련 라우팅 함수
const userPassport = require("./router/userPassport.js");
userPassport(router, passport);

//---------------------------------------------------

//Passport Strategy 방식
const configPassport = require("./passport/passport.js");
configPassport(app, passport);

//----------------------------------------------------------------------------------
// 에러처리
const errorHandler = expressErrorHandler({
  static: {
    404: "./templates/404.html",
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

process.on("uncaughtException", function (err) {
  console.log("서버 프로세스 종료하지 않고 유지함");
});

//Express 서버 시작
let host = "192.168.16.16";
const server = http.createServer(app).listen(app.get("port"), host, function () {
  console.log("✨ 익스프레스 서버 시작: " + app.get("port"));

  //데이터 베이스 시작
  database.init(app, config);
});

//Socket.io 모듈
const io = require("socket.io")(server);

let loginID = {};

io.sockets.on("connection", function (socket) {
  console.log("connection info: ", socket.request.connection._peername);

  //socket.remoteAddress = socket.request.connection._peername.address//ip들고옴
  //socket.remotePort = socket.request.connection._peername.port//port읽어옴

  //클라언트로 받은 login 처리
  socket.on("login", function (login) {
    //socket.id가 만들어주는 고유값 사용
    loginID[login.id] = socket.id;
    console.log("접속한 소켓 id: " + socket.id);

    socket.loginId = login.id;
    socket.loginAlias = login.alias;

    sendResponse(socket, "login", "200", socket.loginId + "(" + socket.loginAlias + ") 가 로그인 되었습니다.");

    console.log("접속한 클라이언트 ID 갯수: " + Object.keys(loginID).length + "개");
  });

  //클라언트로 받은 logout 처리
  socket.on("logout", function (logout) {
    sendResponse(socket, "logout", "444", logout.id + "가 로그아웃 되었습니다.");

    //object의 키를 삭제
    delete loginID[logout.id];
    console.log("접속한 클라이언트 ID 갯수: " + Object.keys(loginID).length + "개");
  });

  //클라이언트로 받은 message 처리
  socket.on("message", function (message) {
    console.log("클라이언트 message를 받았습니다.");
    console.log(message);
    if (message.receiver == "ALL") {
      io.sockets.emit("message", message);
    } else {
      if (loginID[message.receiver]) {
        io.to(loginID[message.receiver]).emit("message", message);
        sendResponse(socket, "message", "200", message.receiver + "에게 메세지를 전송했습니다.");
      } else {
        //로그인하지 않은 경우
        sendResponse(socket, "login", "404", "상대방의 로그인ID를 찾을 수 없습니다.");
      }
    }
  });
});

function sendResponse(socket, command, code, message) {
  const returnMessage = { command: command, code: code, message: message };
  socket.emit("response", returnMessage);
}
