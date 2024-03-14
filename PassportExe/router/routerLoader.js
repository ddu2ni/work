//값 읽어와야해서 config파일 필요
const config = require('../config.js')

let routerLoader = {}

//라우터로더에서 호출 (app,라우터정보(=로그인/추가/리스트 라우터를 위해))
//init 호출 -> app2.js 그래서 app2.js에 require로 호출해줌
routerLoader.init =  function(app,router){

    return initRouters(app,router)

}

function initRouters(app,router){

    let infoLen = config.routeInfo.length

    for(let i=0;i<infoLen;i++){

        let curItem = config.routeInfo[i]

        let curModule = require(curItem.file) //routeInfo:[file:'./user']임   =   user.js를 읽어옴

        //라우팅 처리
        if(curItem.type=='get'){

           // router.route("/process/login").post(user.login)
           //config안에 있는 path를 불러와야하는데, 우린 그걸 19line에서 curItem으로 받았으므로 

           // router.route(curItem.path).get(user[login])
            router.route(curItem.path).get(curModule[curItem.method])
            
        }else if(curItem.type=='post'){

            router.route(curItem.path).post(curModule[curItem.method])
            
        }else{
            
            router.route(curItem.path).post(curModule[curItem.method])

        }

        console.log('라우팅 모듈 설정: ' + curItem.method )

    }
    
    app.use('/',router)
}

module.exports = routerLoader