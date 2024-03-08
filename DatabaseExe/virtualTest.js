//최소한의 DB연결 서버 구성
const mongodb = require('mongodb');
const mongoose = require('mongoose');

let database
let UserSchema
let UserModel

function connectDB(){

  let databaseUrl = 'mongodb://localhost:27017/shopping'

  mongoose.connect(databaseUrl)
  database = mongoose.connection

  database.on('open',function(){

    console.log('데이터베이스 연결됨')

    //스키마 생성
    createUserSchema()

    //데이터 추가
    insertData()

  })

  database.on('error',console.error.bind(console,'데이터베이스 오류'))
  database.on('disconnected',console.error.bind(console,'데이터베이스 연결끊김'))

}

//스키마생성
function createUserSchema(){
  
  UserSchema = mongoose.Schema({
      id:{type:String},
      name:{type:String}
  })
  
  //info  정해주심 but, 사용자정의
  //info={'suzi,배수지'}
  UserSchema
  .virtual('info')
  .set(function(info){

    //넘어오는 데이터가 2개니까 배열로 만들거임
    
    let array = info.split(',')
    this.id = array[0]
    this.name = array[1] + '짱'

  })
 
  console.log('UserSchema 정의함')

  
  //스키마정리하고는 모델 생성해줘야함
  UserModel = mongoose.model('users3',UserSchema)
  console.log('UserModel 정의함')
  
}
  //데이터 추가
function insertData(){

  let user = new UserModel({'info':'suzi,배수지'})

  user.save(function(err){
    if(err) throw err

    console.log('사용자 추가 ')
  })

}

connectDB()