/**
 * Created by CWQ on 2017/6/4.
 */

var express = require('express')
var url = require('url') // 解析url
var cors = require('cors') // 解决跨域问题
var jsonfile = require('jsonfile') // 解析json格式文件
var bodyParser = require('body-parser') // 获取post请求内容
var path = require('path')

module.exports = function(dbname,port){
    console.log('connected database:',dbname)

    var app = express()
    // 解析post请求
    app.use(bodyParser.urlencoded( { extended: false }))
    app.use(cors())
    // 路由解析
    app.all('*',function(req,res){
        //  过滤辣鸡请求
        if(req.originalUrl=="/favicon.ico") return

        // 解析路由请求
        var pathname = url.parse(req.originalUrl).pathname.replace(/^\//,'').replace(/\/$/,'').split('/'),
            tablename = pathname[0],
            database = ''

        if(/\.js$/.test(dbname)){
            // handle *.js 数据格式（动态数据，函数式）
            var p = path.join(__dirname,dbname)
            database = require(p)()
        }else{
            // handle *.json 数据格式（静态数据）
            database = jsonfile.readFileSync(dbname)
        }
        // 解析请求方式
        var id = pathname.length > 1 ? pathname[1] : -1,
            _get = req.method == 'GET',
            _getAll = ( _get && id == -1 ), // 例如: users
            _getOne = ( _get && id > -1 ), // 例如: users/1
            _post = req.method == 'POST',
            _patch = req.method == 'PATCH',
            _delete = req.method == 'DELETE',
            _put = req.method == 'PUT'

        if(_get){
            // 请求db不存在时返回error
            if(!database[tablename]){
                return res.send({'error':'table not exist'})
            }
            // console.log('request table: ',tablename)
            if(_getAll){
                return res.send(database[tablename])
            }
            if(_getOne){
                var data = database[tablename]
                // filter 返回数组，find 如果只有一项则返回对象
                var obj = data.find(function(obj){
                    return obj.id == id
                })
                obj = obj || {'error':'item not exist'}
                return res.send(obj);
            }
        }
        if(_post){
            var body= req.body,
                tb = database[tablename]

            body.id  = body.id || tb[tb.length-1].id*1 + 1
            body.single = (body.single=='true') ? true : false
            database[tablename].push(body)
            jsonfile.writeFileSync(dbname, database,{spaces: 4})

            res.send(database[tablename])
        }
    })

    // 设置服务器监听
    app.listen(port,function(){
        console.log('server start at port ',port)
    })
}