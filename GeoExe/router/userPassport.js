module.exports = function(router,passport){

    console.log('userPassport 호출됨')

    //홈 화면(조회)
    router.route('/').get(function(req,res){
        res.render('index.ejs')
    })
  
  //로그인 화면(조회)
  router.route('/login').get(function(req,res){
  
    //login.ejs로 넘어갈 때 message(로그인할 때 에러메세지 )가 뜸
    res.render('login.ejs', {
      message:req.flash('loginMessage'),
    })
  })
  
  //로그인 요청
  router.route('/login').post(passport.authenticate('local-login',{
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash :true,
  }))
  
  //회원가입 화면 조회
  //login.ejs로 넘어갈 때 message(로그인할 때 에러메세지 )가 뜸
  router.route('/signup').get(function(req,res){
  
    res.render('signup.ejs',{
        message:req.flash('signupMessage'),
    })
  
  })
  
  
  
  //회원가입 요청
  // /signup 주소가 왔을 때 패스포트 local-signup 찾아가라
  router.route('/signup').post(passport.authenticate('local-signup',{
      successRedirect : '/profile',
      failureRedirect : '/signup',
      failureMessage: true
  }))
  
  //사용자 프로필 보기
  router.route('/profile').get(function(req,res){
    
  console.log('req.user : ' +  req.user)
  
  if(!req.user){
      console.log('사용자 인증이 안된 상태임!')
      res.redirect('/')
      return
    }
    
    console.log('사용자 인증이 성공 상태임!')
  
    if(Array.isArray(req,res)){
  
      res.render('profile.ejs',{user:req.user[0]._doc})
      
    }else{
        res.render('profile.ejs',{user:req.user})
      }
  })
  
  
  //로그아웃
  router.route('/logout').get(function(req,res){
  
    req.logout(function(err){
      if(err) throw err
    })
  
    res.redirect('/')
  
  })

}