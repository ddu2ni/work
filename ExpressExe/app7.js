//File Upload

//임포트
require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const serveStatic = require("serve-static");
const expressErrorHandler = require("express-error-handler");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const multer = require("multer");

//익스프레스 객체 생성
const app = express();

//포트 설정 (port 설정값 or 3000 포트)
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: true }));

//쿠키 추가
app.use(cookieParser());

//세션 설정
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true, //세션 변경시키지 않음
  })
);

//가상 주소 설정 ex./public/login.html
app.use("/public", serveStatic(path.join(__dirname, "templates")));
app.use("/upload", serveStatic(path.join(__dirname, "uploads")));

//storage 저장기준
const storageMethod = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads"); //문제 생기면 null
  },

  
  filename: function (req, file, callback) {
    const extention = path.extname(file.originalname); //확장자
    const basename = path.basename(encoding(file.originalname), extention); //파일이름
    //encoding 하면 한글 안깨짐

    //이름 연결 설정
    callback(null, basename + extention); //파일 이름.확장자
    //callback(null, file.originalname); //파일 이름.확장자
    //callback(null, basename + Date.now() + extention); //파일 이름 + 날짜.확장자
    //callback(null, Date.now().toString() + path.extname(file.originalname)); //날짜.확장자
  },
});

const fileUpload = multer({
  storage: storageMethod,
  limits: {
    files: 10,
    fileSize: 1024 * 1024 * 1024,
  },
});

//라우터 설정
//const router = express.Router();

//라우팅 함수 추가
//router.post("/process/file",fileUpload.array("upload", 5), function (req, res) {
//router.route("/process/file").post(fileUpload.array("upload", 5),function(req,res){
app.post("/process/file",fileUpload.array("upload", 5), function (req, res) {

      console.log('/process/file 호출됨')

    try {
      const files = req.files;
      // console.log(req.files[0]);

      // 파일 정보를 저장할 변수
      let originalName = "";
      let fileName = "";
      let mimeType = "";
      let size = 0;

      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.write("<h1>파일 업로드 성공</h1>");

      if (Array.isArray(files)) {
        console.log("파일 갯수: " + files.length);

        for (let i = 0; i < files.length; i++) {
          originalName = encoding(files[i].originalname);
          fileName = files[i].filename;
          mimeType = files[i].mimetype;
          size = files[i].size;

          res.write("<hr/>");
          res.write("<div>파일명: " + originalName + "</div>");
          res.write("<div>저장된 파일명: " + fileName + "</div>");
          res.write("<div>MIME Type: " + mimeType + "</div>");
          res.write("<div>파일크기: " + size + "</div>");

        }
      }
      res.end();

    } catch (error) {
      console.dir(err.stack);
    }
  });

  //한글 안깨지게 하는 함수
function encoding (str) {
    return Buffer.from(str,'latin1').toString('utf-8')
}

//라우터 객체 app에 등록
//app.use("/", router);

//에러처리
const errorHandler = expressErrorHandler({
  static: {
    404: "./templates/404.html",
  },
});

app.use(expressErrorHandler.httpError(404)); //404에러 인식 핸들러
app.use(errorHandler); //지정한 핸들러 사용

//Express 서버 시작
http.createServer(app).listen(app.get("port"), function () {
  console.log("익스프레스 서버 시작: " + app.get("port"));
});
