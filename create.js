/**
 * Created by wenqi.chen on 2017/6/5.
 */

var chalk = require('chalk')
var fs = require('fs')
var path = require('path')

var log = function(msg){
    console.log(chalk.magenta.bold(msg))
}

function createProject(name,type){
    var p = process.cwd()
    cd(p)

    if(fs.existsSync(name)){
        log('project exists,please rename it')
        process.exit()
    }

    var newPath = path.join(__dirname,'projects',type+'_proj')
    console.log(newPath)
    // 复制项目文件夹
    cp('-R',newPath + '/',name)
    log('复制' + type + '项目原文件成功！')

    // 进入新项目目录
    cd(name)
    log('Set TaoBao npm mirror: npm config set registry http://registry.npm.taobao.org')
    // 重定向 npm 库
    exec('npm config set registry http://registry.npm.taobao.org')
    log('Install: npm install')
    log('Installation will take a long time,please wait...You can also "CRTL + C" to stop the installation')
    // 安装npm库及依赖库
    exec('npm install')

    if(type != 'jquery'){
        log('正在启动项目')
        exec('npm start')
    }
}

module.exports = createProject