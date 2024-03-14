
const localLogin = require('./localLogin')
const localSignup = require('./localSignup')

module.exports = function(app,passport){

    console.log('passport.js 호출됨')


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
    


    //인증방식 설정
    passport.use('local-login',localLogin)
    passport.use('local-signup',localSignup)
}