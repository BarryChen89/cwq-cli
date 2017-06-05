#!/usr/bin/env node

// 解析终端输入信息
var program = require('commander')
// 终端字体美化
var chalk = require('chalk')
// file system
var fs = require('fs')
var path = require('path')

require('shelljs/global')

var log = function(msg){
    console.log(chalk.magenta.bold(msg))
}

var createProject = require('./create') //create 服务
    watchJson = require('./watch') // watch服务

// init program
program
    .version('1.0.4')
    .option('-r --resume','my total resume',function(){
        log('My name is Chenwenqi(Barry).')
        log('I`m 28 years old.')
        log('I`m a front-end developer engineer.')
    })
    .option('-p, --port <port>','watch port')
    .option('-t --type <type>','project type')

// create program
program
    .command('create <name>')
    .action(function(name){
        var projectType = program.type
        if(!projectType){
            log('Create project_name -t project_type','jquery','react','vue')
            return
        }
        var projList = ['jquery','vue','react']
        if(projList.indexOf(projectType) == -1){
            log('Only support types with jquery,react,vue!')
            return
        }

        console.log(name,projectType);
        createProject(name,projectType);
    })

// watch program
program
    .command('watch <db>')
    .action(function(dbname){
        //console.log(program.port);
        watchJson(dbname,program.port);
    })
//解析commandline arguments
program.parse(process.argv)