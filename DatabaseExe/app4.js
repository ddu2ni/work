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
const crypto = require('crypto');


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

//------------------------------------------

function createUserSchema(){

   //스키마 : 데이터 규칙
    //required:true = not null - 반드시 써야함
    //unique:true = 똑같은 값을 넣을 수 없음 = pk
    //index를 넣는 이유?  처리속도 빠르려고
    //'default':20 : 데이터 안넣으면 기본 20살임

    UserSchema = mongoose.Schema({
      
      id:{type:String,required:true,unique:true},
      name:{type:String, index:'hashed'},
      hashed_password:{type:String,required:true},
      salt:{type:String,required:true},
      age:{type:Number,'default':20},
      created : {type:Date,'default':Date.now}
      
    })

    //this._password = this._내부적으로 정해져있음
    UserSchema
    .virtual('password')
    .set(function(password){
      this._password = password 
      this.salt =this.makeSalt(); 
      this.hashed_password = this.encryptPassword(password)
    })

    .get(function(){
        return this._password
    })


    //스키마에 메소드를 만들 수 있음 (1.static() / 2.method())
    //2.---------------------------------------------------
    UserSchema.method('makeSalt',function(){

      //salt key :  내 맘대로 만드는 키
      console.log('date: ' + new Date().valueOf()) //1654413131 나노타임
      console.log('math: ' + Math.random()) // 0.548843144 소수점

      //round = 반올림
      //salt키 생성!
      //+ '' 널 더하면 숫자 -> 문자처리됨
      return Math.round((new Date().valueOf() * Math.random())) + ''

    })

    //inputPwd :사용자가 입력한 pwd
    //inSalt : 솔트키를 넘겨줘야함
    UserSchema.method('encryptPassword',function(inputPwd,inSalt){

      if(inSalt){ //이미 암호화되어있다 = 로그인

        //sha1 : 쉬바
        //hex : 헥사
        //로그인할 때 암호화 푸는 것  \
        //inSalt : 저장되어있는 salt키
        return crypto.createHmac('sha1',inSalt).update(inputPwd).digest('hex')
     
      }else{
        //만들어낸 salt키
        return crypto.createHmac('sha1',this.salt).update(inputPwd).digest('hex')
      }

    })


    //로그인할때 입력된 암호화 된 비밀번호와 비교
    UserSchema.method('authenticate',function(inputPwd,inSalt,hashed_password){

      if(inSalt){

        console.log('사용자가 입력한 pwd : ' + inputPwd)
        console.log('사용자가 입력한 암호화된 pwd : ' + this.encryptPassword(inputPwd,inSalt)) 
        
        console.log('DB에 저장되어있는 pwd : ' + hashed_password)

        return this.encryptPassword(inputPwd,inSalt) === hashed_password //true면 로그인성공

      }
    })









    //1.[id로 검색]---------------------------------------------------
    //findById = 메서드이름
    UserSchema.static('findById',function(id,callback){
      return this.find({id:id},callback)
      
    }) 
    
    //1.[모든 데이터 검색]---------------------------------------------------
    UserSchema.static('findAll',function(callback){
      return this.find({},callback)

    }) 
    console.log('UserSchema 정의함')
    
    //Users에 스키마가 떠야함 ( Model : 어디에 정의하는지? )
    UserModel = mongoose.model('users3',UserSchema)
    console.log('UserModel 정의함')
  }



//사용자를 인증하는 함수
const authUser = function (database, id, pwd, callback) {
  
  //const users = database.collection("users");

 // =  UserSchema.static('findById',function(id,callback){
  UserModel.findById(id,function (err, result) {

    if (err) {
      callback(err, null);
      return;
    }

    if (result.length > 0) {

      console.log('아이디가 일치하는 사용자 검색됨')
      
      //패스워드 비교

      let user = new UserModel({id:id})

      //true = 아이디가 맞음
      //pwd=위~ 함수의 inputpwd
      let authenticate = user.authenticate(pwd,result[0]._doc.salt,result[0].hashed_password)


      if(authenticate){
        console.log('비밀번호가 일치함')
        callback(null, result);
      }else{
        console.log('비밀번호가 일치하지 않음')
        callback(null, null);
      }

    } else {
      
      console.log("아이디가 일치하는 사용자가 검색되지 않음");
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


//사용자 리스트 라우터
router.route('/process/listUser').post(function(req,res){

  console.log('/process/listUser 호출됨')

  if(database){

      UserModel.findAll(function(err,result){

        if(err){
          res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.write("<h1>사용자 리스트 조회 실패</h1>");
          res.end();
        }

        if(result){
          res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.write("<h1>사용자 리스트</h1>");
          res.write('<div><ul>')

          for(var i=0;i<result.length;i++){

            var id = result[i]._doc.id
            var name = result[i]._doc.name
            var age = result[i]._doc.age

            res.write('<li>' + (i+1) + ' : ' + id + ', ' + name + ', ' + age + '</li>')

          }

             res.write('</ul></div>')
             res.write("<br/><br/><a href='/public/listUser.html'>리스트</a>")
             res.end()
        
          }else{
            res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            res.write("<h1>사용자 리스트 조회 실패</h1>");
            res.end();
          }
      })

  }else{
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<h1>데이터베이스 연결 실패</h1>");
    res.end();
  }
})



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
