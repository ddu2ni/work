require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const serveStatic = require("serve-static");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const mongoose = require('mongoose');
const { setInterval } = require("timers/promises");

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
    //스키마 : 데이터 규칙
    UserSchema = mongoose.Schema({
      id:String,
      name:String,
      password:String
      
    })
    console.log('UserSchema 정의함')
    
    //Users에 스키마가 떠야함 ( Model : 어디에 정의하는지? )
    UserModel = mongoose.model('users',UserSchema)
    console.log('UserModel 정의함')
  })

  database.on('error',console.error.bind(console,'몽구스 에러...'))
  
  database.on('disconnected',function(){
    console.log('연결이 끊어졌습니다. 5초후에 재연결 합니다')
    setInterval(connectDB,5000)
    
  })
}

// 익스프레스 객체 생성
const app = express();

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

//------------------------------------------

//사용자를 인증하는 함수
const authUser = function (database, id, pwd, callback) {
  
  //const users = database.collection("users");

  UserModel.find({ id: id, password: pwd },function (err, result) {
    if (err) {
      callback(err, null);
      return;
    }

    if (result.length > 0) {
      callback(null, result);
    } else {
      console.log("일치하는 사용자를 찾지 못함");
      callback(null, null);
    }
  });
};

//사용자를 추가하는 함수
const addUser = function (database, id, pwd, name, callback) {
 
  //UserModel검사한 뒤, users에 넣어둠
  const users = new UserModel({ id: id, password: pwd, name: name })

// 'id':id 뒤에는 변수의 값을 가져오므로 그냥 id
  users.save(function (err, result) {
      if (err) {
        callback(err, null);
        return;
      }

      if (result) {
        console.log("사용자 데이터 추가됨");
      } else {
        console.log("추가된 데이터가 없음");
      }

      callback(null, result);
    }
  );
};

//------------------------------------------

//라우팅 함수
const router = express.Router();

//사용자 로그인 라우터
router.route("/process/login").post(function (req, res) {
  console.log("/process/login 호출됨");

  const id = req.body.id || req.query.id;
  const pwd = req.body.pwd || req.query.pwd;

  if (database) {
    authUser(database, id, pwd, function (err, result) {
      //err와 널이면
      if (err) throw err;

      //result가오면
      if (result) {
        const userName = result[0].name;
        // console.log(userName);

        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>로그인 성공</h1>");
        res.write("<div>ID: " + id + "</div>");
        res.write("<div>NAME: " + userName + "</div>");
        res.write("<br/><br/><a href='/public/login.html'>로그인</a>");
        res.end();
      } else {
        //result값이 없을 때
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>로그인 실패</h1>");
        res.write("<div>아이디와 패스워드를 다시 확인해주세요.</div>");
        res.write("<br/><br/><a href='/public/login.html'>로그인</a>");
        res.end();
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<h1>데이터베이스 연결 실패</h1>");
    res.end();
  }
});

//사용자 추가 라우팅
router.route("/process/addUser").post(function (req, res) {
  console.log("/process/addUser 호출됨");

  const id = req.body.id || req.query.id;
  const pwd = req.body.pwd || req.query.pwd;
  const name = req.body.name || req.query.name;

  if (database) {
    addUser(database, id, pwd, name, function (err, result) {
      if (err) throw err;

      if (result) {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>사용자 추가 성공</h1>");
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>사용자 추가 실패</h1>");
        res.end();
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<h1>데이터베이스 연결 실패</h1>");
    res.end();
  }
});

app.use("/", router);

//-------------------------------------------
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
