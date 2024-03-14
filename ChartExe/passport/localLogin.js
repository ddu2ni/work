//Passport Stragety 방식
const LocalStrategy = require("passport-local").Strategy

module.exports = new LocalStrategy({

        usernameField: "email",
        passwordField: "pwd",
        passReqToCallback: true,
      
        //위에 Callback : true면 email, pwd, 클라이언트 넘어오는 request, 콜백함수로 다 넘겨주기 
        },function(req,email,pwd,done){
      
          //데이터 베이스 연결
          let database = req.app.get('database')
      
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
          })
        })
