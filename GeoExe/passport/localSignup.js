//Passport Stragety 방식
const LocalStrategy = require("passport-local").Strategy

module.exports = new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd",
      passReqToCallback: true,
    },
    function (req, email, pwd, done) {
      const name = req.body.name;
      process.nextTick(function () {

        const database = req.app.get("database");

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
            })
          }
        })
      })
    })