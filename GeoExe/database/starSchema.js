let Schema = {}

//테이블에 적용할 룰 만들기
Schema.createSchema = function (mongoose) {

    let StarSchema = mongoose.Schema({

        name:{type:String,index:'hashed'},
        addr:{type:String},
        tel:{type:String},
        geometry:{
            type:{type:String,'default':'Point'},
            coordinates:[{type:'Number'}]
        },
        created:{type:Date,'default':Date.now}
    })
    //index를 사용하면 DB 검색속도 높일 수 있음
    StarSchema.index({geometry:'2dsphere'})

    //모든 스타벅스 조회
    // return this.find{} = 조건 없음 = 전부 검색
    StarSchema.static('findAll',function(callback){
        return this.find({},callback)
    })



    //가장 가까운 스타벅스 조회
    StarSchema.static('findNear',function(longitude,latitude,maxDistance,callback){
       
        console.log('findNear 호출됨');

      
        this.find().where('geometry').near({center:{type:'Point',coordinates:[parseFloat(longitude),parseFloat(latitude)]},maxDistance:maxDistance}).limit(1).exec(callback)
    })



//일정 범위내 스타벅스 조회
StarSchema.static("findWithin", function (topleft_longitude, topleft_latitude, bottomright_longitude, bottomright_latitude, callback) {
    console.log("findWithin 호출됨");
    this.find()
      .where("geometry")
      .within({
        box: [
          [parseFloat(topleft_longitude), parseFloat(topleft_latitude)],
          [parseFloat(bottomright_longitude), parseFloat(bottomright_latitude)],
        ],
      })
      .exec(callback);
  });

  //일정 반경 내 스타벅스 조회
  StarSchema.static('findCircle',function(center_longitude,center_latitude,radius,callback){


    console.log('findCircle 호출됨');

    //1/6371 => 1km
    this.find().where('geometry').within({center:[parseFloat(center_longitude),parseFloat(center_latitude)],radius:parseFloat(radius/6371000),unique:true,spherical:true}).exec(callback)

  })
  console.log("StarSchema 정의함");
  return StarSchema;
};

module.exports = Schema;

