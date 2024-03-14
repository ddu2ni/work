const moment = require('moment')
const login = function (req, res) {
  console.log("user.js 모듈 안에 login 호출됨");

  const id = req.body.id || req.query.id;
  const pwd = req.body.pwd || req.query.pwd;

  //app에 미들웨어 가져올 땐 get
  //app에 미들웨어 추가할 땐 set
  const database = req.app.get("database");

  if (database) {
    authUser(database, id, pwd, function (err, result) {
      //err와 널이면
      if (err) throw err;

      //result가오면
      if (result) {

        const userName = result[0].name;

        //{사용자 정의 : id , 사용자정의: Line19의 userName}
        //이 두개의 값이 login.ejs로 넘어감 
        const context = {userId:id,userName:userName}

      //.ejs생략가능
      //합쳐서 렌더역할을 해서 html
      req.app.render('login_Success',context,function(err,html){

        if(err) throw err

        console.log('rendered: '+ html)

        res.end(html)

      })

      } else {
        //result값이 없을 때
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write("<h1>로그인 실패</h1>");
        res.write("<div>아이디와 패스워드를 다시 확인해주세요.</div>");
        res.write("<br/><br/><a href='/public1/login.html'>로그인</a>");
        res.end();
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<h1>데이터베이스 연결 실패</h1>");
    res.end();
  }
};

const addUsers = function (req, res) {
  console.log("user.js 모듈 안에 addUser 호출됨");

  const id = req.body.id || req.query.id;
  const pwd = req.body.pwd || req.query.pwd;
  const name = req.body.name || req.query.name;

  const database = req.app.get("database");

  if(database){

    addUser(database,id,pwd,name,function(err,result){

        if(err) throw err

        if(result){

            var context = {title:'사용자 추가 성공(View - jade)'}

            req.app.render('addUser_Success',context,function(err,html){

                if(err) throw err

                res.end(html)

            })

        }else{

            res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
            res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
            res.write('<h1>사용자 추가 실패</h1>')
            res.end()

        }
    })

}else{
     res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})
     res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>")
     res.write('<h1>데이테베이스 연결 실패</h1>')
     res.end()
}


}

const listUser = function (req, res) {
  console.log("user.js 모듈 안에 listUser 호출됨");

  const database = req.app.get("database");

  if (database) {
    database.UserModel.findAll(function (err, result) {
      if (err) {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write(
          "<meta name='viewport' content='width=device-width, initial-scale=1.0' />"
        );
        res.write("<h1>사용자 리스트 조회 실패</h1>");
        res.end();
      }

      if (result) {
      
        let context = {result:result, moment:moment}

        req.app.render('listUserResp_Success',context,function(err,html){

          if(err) throw err

          res.end(html)

        })


      } else {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.write(
          "<meta name='viewport' content='width=device-width, initial-scale=1.0' />"
        );
        res.write("<h1>사용자 리스트 조회 실패</h1>");
        res.end();
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write(
      "<meta name='viewport' content='width=device-width, initial-scale=1.0' />"
    );
    res.write("<h1>데이터베이스 연결 실패</h1>");
    res.end();
  }
};

//사용자를 인증하는 함수
//로그인할 때 사용
//내부 라우터(위)에서 호출당하는 함수임
const authUser = function (database, id, pwd, callback) {
  database.UserModel.findById(id, function (err, result) {
    if (err) {
      callback(err, null);
      return;
    }

    if (result.length > 0) {
      console.log("아이디가 일치하는 사용자 검색됨");

      //패스워드 비교

      let user = new database.UserModel({ id: id });

      //true = 아이디가 맞음
      //pwd=위~ 함수의 input pwd
      let authenticate = user.authenticate(
        pwd,
        result[0]._doc.salt,
        result[0].hashed_password
      );

      if (authenticate) {
        console.log("비밀번호가 일치함");
        callback(null, result);
      } else {
        console.log("비밀번호가 일치하지 않음");
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
  const users = new database.UserModel({ id: id, password: pwd, name: name });

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
  });
};

//module.exports.init = init
module.exports.login = login;
module.exports.addUser = addUsers;
module.exports.listUser = listUser;
