const crypto = require('crypto')

const Schema = {}

//외부에서 호출하면 스키마를 return 할거임
Schema.createSchema = function(mongoose){


     //스키마 : 데이터 규칙
    //required:true = not null - 반드시 써야함
    //unique:true = 똑같은 값을 넣을 수 없음 = pk
    //index를 넣는 이유?  처리속도 빠르려고
    //'default':20 : 데이터 안넣으면 기본 20살임

    UserSchema = mongoose.Schema({
      
        email:{type:String,required:true,unique:true},
        name:{type:String, index:'hashed'},
        hashed_password:{type:String,required:true},
        salt:{type:String,required:true},
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
  
  
  
      //1.[email로 검색]---------------------------------------------------
      //findById = 메서드이름
      UserSchema.static('findByEmail',function(email,callback){
        return this.find({email:email},callback)
        
      }) 
      
      //1.[모든 데이터 검색]---------------------------------------------------
      UserSchema.static('findAll',function(callback){
        return this.find({},callback)
  
      }) 
      

      return UserSchema;

}


//외부에서 Schema 사용할 수 있게 해wna
module.exports = Schema