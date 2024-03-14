//스타벅스 정보를 저장하는 함수
const add = function(req,res){
   
    console.log('starbucks - add 호출됨');

    let name = req.body.name;
    let addr = req.body.addr;
    let tel = req.body.tel;
    let longitude = req.body.longitude; //위도
    let latitude = req.body.latitude; //경도

    //DB 연결
    let database = req.app.get('database');

    if (database) {
        addStarbucks(database, name, addr, tel, longitude, latitude, function (err, result) {
            if (err) throw err;

            if (result) {
                res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 추가 성공!</h2>');
                res.end();
            } else {
                res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 추가 실패!</h2>');
                res.end();
            }
        });

    } else {
        res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
        res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
        res.write('<h2>데이터 베이스 연결 실패!</h2>');
        res.end();
    }
}



//--------------------------------------------------------------------------------------
//스타벅스 정보를 조회하는 함수

const list = function(req,res){

    console.log('starbucks - list 호출됨');

    //DB 연결
    let database = req.app.get('database');

    if (database) {

        database.StarModel.findAll(function(err,result){

            if (err) throw err;

            if (result) {
                res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 리스트 성공!</h2>');
                res.write('<div><ul>')

                for(let i=0;i<result.length;i++){

                    let name = result[i].name
                    let addr = result[i].addr
                    let tel = result[i].tel
                    let longitude = result[i].geometry.coordinates[0] //경도
                    let latitude = result[i].geometry.coordinates[1] //위도

                    res.write('<li>#' + (i+1) + ' : ' + name + ', ' + addr + ', ' + tel + ', ' + longitude + ', ' + latitude + '</li>')

                }
                res.write('</ul></div>')
                res.end();

            } else {

                res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 조회 실패!</h2>');
                res.end();

            }
        });

    } else {
        res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
        res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
        res.write('<h2>데이터 베이스 연결 실패!</h2>');
        res.end();
    }


}

//--------------------------------------------------------------------------------------
//가장 가까운 스타벅스 정보를 조회하는 함수

const findNear = function(req,res){

    console.log('starbucks - findNear 호출됨');
    
    let maxDistance = 150 //10:100m 내, 100:1km 내

    let longitude = req.body.longitude; //위도
    let latitude = req.body.latitude; //경도

    //DB 연결
    let database = req.app.get('database');

    if (database) {

        database.StarModel.findNear(longitude,latitude,maxDistance,function(err,result){

            if (err) throw err;

            if (result) {
                res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
                res.write('<h2>가장 가까운 스타벅스 리스트</h2>');
                res.write('<div><ul>')

                for(let i=0;i<result.length;i++){

                    let name = result[i].name
                    let addr = result[i].addr
                    let tel = result[i].tel
                    let longitude = result[i].geometry.coordinates[0] //경도
                    let latitude = result[i].geometry.coordinates[1] //위도

                    res.write('<li>#' + (i+1) + ' : ' + name + ', ' + addr + ', ' + tel + ', ' + longitude + ', ' + latitude + '</li>')

                }
                res.write('</ul></div>')
                res.end();

            } else {

                res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
                res.write('<h2>스타벅스 조회 실패!</h2>');
                res.end();

            }
        });

    } else {
        res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
        res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
        res.write('<h2>데이터 베이스 연결 실패!</h2>');
        res.end();
    }


}


//--------------------------------------------------------------------------------------
//가장 가까운 스타벅스 - 지도 조회하는 함수

const findNear2 = function(req,res){

  console.log('starbucks - findNear2 호출됨');
  
  let maxDistance = 150 //10:100m 내, 100:1km 내

  let longitude = req.body.longitude; //위도
  let latitude = req.body.latitude; //경도

  //DB 연결
  let database = req.app.get('database');

  if (database) {

      database.StarModel.findNear(longitude,latitude,maxDistance,function(err,result){

          if (err) throw err;

          if (result) {
             
            res.render('findNear.ejs',{result:result[0]._doc,longitude:longitude,latitude:latitude})

          } else {

              res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
              res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
              res.write('<h2>스타벅스 조회 실패!</h2>');
              res.end();

          }
      });

  } else {
      res.writeHeader('200', { 'Content-Type': 'text/html;charset=utf-8' });
      res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
      res.write('<h2>데이터 베이스 연결 실패!</h2>');
      res.end();
  }


}


//--------------------------------------------------------------------------------------
//범위내 스타벅스 조회
const findWithin = function (req, res) {
    console.log("starbucks - findWithin 호출됨");
  
    // 위도와 경도 정보를 요청 객체에서 가져오기
    const topleft_longitude = req.body.tl_longitude;
    const topleft_latitude = req.body.tl_latitude;
    const bottomright_longitude = req.body.br_longitude;
    const bottomright_latitude = req.body.br_latitude;
  
    // DB 연결
    const database = req.app.get("database");
  
    if (database) {
      // 데이터베이스에서 가장 가까운 스타벅스 정보를 조회
      database.StarModel.findWithin(topleft_longitude, topleft_latitude, bottomright_longitude, bottomright_latitude, function (err, result) {
        if (err) throw err;
  
        if (result) {
          // 결과를 클라이언트로 응답
          res.writeHeader("200", { "Content-Type": "text/html;charset=utf-8" });
          res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
          res.write("<h2>가장 가까운 스타벅스 리스트</h2>");
          res.write("<div><ul>");
  
          for (let i = 0; i < result.length; i++) {
            const name = result[i].name;
            const addr = result[i].addr;
            const tel = result[i].tel;
            const longitude = result[i].geometry.coordinates[0]; // 경도
            const latitude = result[i].geometry.coordinates[1]; // 위도
  
            res.write("<li>#" + (i + 1) + " : " + name + ", " + addr + ", " + tel + ", " + longitude + ", " + latitude + "</li>");
          }
  
          res.write("</ul></div>");
          res.end();
        } else {
          // 조회된 결과가 없을 경우 응답
          res.writeHeader("200", { "Content-Type": "text/html;charset=utf-8" });
          res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
          res.write("<h2>스타벅스 조회 실패</h2>");
          res.end();
        }
      });
    } else {
      // 데이터베이스 연결 실패 시 응답
      res.writeHeader("200", { "Content-Type": "text/html;charset=utf-8" });
      res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
      res.write("<h2>데이터 베이스 연결 실패!</h2>");
      res.end();
    }
  };


//--------------------------------------------------------------------------------------
//반지름 내 스타벅스 정보 조회하는 함수
const findCircle = function (req, res) {
    console.log("starbucks - findCircle 호출됨");
  
    // 위도와 경도 정보를 요청 객체에서 가져오기
    const centerLongitude = req.body.center_longitude;
    const centerLatitude = req.body.center_latitude;
    const radius = req.body.radius;
  
    // DB 연결
    const database = req.app.get("database");
  
    if (database) {
      // 데이터베이스에서 가장 가까운 스타벅스 정보를 조회
      database.StarModel.findCircle(centerLongitude, centerLatitude,radius, function (err, result) {
        if (err) throw err;
  
        if (result) {
          // 결과를 클라이언트로 응답
          res.writeHeader("200", { "Content-Type": "text/html;charset=utf-8" });
          res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
          res.write("<h2>가장 가까운 스타벅스 리스트</h2>");
          res.write("<div><ul>");
  
          for (let i = 0; i < result.length; i++) {
            const name = result[i].name;
            const addr = result[i].addr;
            const tel = result[i].tel;
            const longitude = result[i].geometry.coordinates[0]; // 경도
            const latitude = result[i].geometry.coordinates[1]; // 위도
  
            res.write("<li>#" + (i + 1) + " : " + name + ", " + addr + ", " + tel + ", " + longitude + ", " + latitude + "</li>");
          }
  
          res.write("</ul></div>");
          res.end();
        } else {
          // 조회된 결과가 없을 경우 응답
          res.writeHeader("200", { "Content-Type": "text/html;charset=utf-8" });
          res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
          res.write("<h2>스타벅스 조회 실패</h2>");
          res.end();
        }
      });
    } else {
      // 데이터베이스 연결 실패 시 응답
      res.writeHeader("200", { "Content-Type": "text/html;charset=utf-8" });
      res.write("<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1'>");
      res.write("<h2>데이터 베이스 연결 실패!</h2>");
      res.end();
    }
  };


const addStarbucks = function(database,name,addr,tel,longitude,latitude,callback){

    console.log('addStarbucks 호출됨')

    let starbucks = new database.StarModel(
        {name:name,addr:addr,tel:tel,
        geometry:{
            type:'Point',
            coordinates:[longitude,latitude]
        }}
    )

    starbucks.save(function(err){
        
        if(err){
            callback(err,null)
            return
        }
        console.log('스타벅스 데이터 추가됨')
        callback(null,starbucks)
    })
}


module.exports.add = add
module.exports.list = list
module.exports.findNear = findNear
module.exports.findWithin = findWithin
module.exports.findCircle = findCircle
module.exports.findNear2 = findNear2