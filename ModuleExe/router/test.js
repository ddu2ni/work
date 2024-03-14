const testJade = function(req,res){

    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'})

    let context = {}
    req.app.render('jadeTest.jade',context,function(err,html){

        if(err) throw err
        
        console.log('rendered: ' +  html)
        res.end(html)

    })

}

module.exports.testJade = testJade;