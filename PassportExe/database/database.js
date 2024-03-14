let mongoose = require('mongoose')

//database 객체에 database,schema,model 한꺼번에 추가
let database = {} 

database.init = function(app, config){
    connect(app,config)
}

function connect(app,config){

    console.log('connect() 호출됨')

    //데이터베이스 연결
    mongoose.connect(config.dbUrl)

    database = mongoose.connection

    //db에 연결되면 `데이터베이스에 연결되었습니다` 랑 `UserSchema 정의함`이 떠야함
    database.on('open',function(){
  
      console.log('데이터베이스에 연결되었습니다' + config.dbUrl)
  
      //스키마정의
      createSchema(app,config);
  
    })
  
    database.on('error',console.error.bind(console,'몽구스 에러...'))
    
    database.on('disconnected',function(){
      console.log('연결이 끊어졌습니다. 5초후에 재연결 합니다')
      setInterval(connectDB,5000)
    })
}


function createSchema(app,config){

    const schemaLen = config.dbSchemas.length

    for(let i=0;i<schemaLen;i++){

        const curItem = config.dbSchemas[i]

        //스키마 생성
        const curSchema = require(curItem.file).createSchema(mongoose)
        console.log('UserSchema 정의함')

        //모델 생성 (몽구스,정의한 스키마)
        const curModel = mongoose.model(curItem.collection,curSchema)
        console.log('UserModel 정의함')

        database[curItem.schemaName] = curSchema //스키마 추가
        database[curItem.modelName] = curModel //모델 추가

    }

    //미들웨어로 추가 
    app.set('database',database) //db,schema, model이 database 객체 안에 들어있음

}

module.exports = database