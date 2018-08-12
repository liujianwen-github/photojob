/*
 * @Author: 刘建文 
 * @Date: 2018-08-08 11:41:38 
 * @Last Modified by: 刘建文
 * @Last Modified time: 2018-08-08 14:30:25
 * @description 上传图片脚本
 */
var http = require('http')
var fs = require('fs')
var path = require('path')
var util = require('util')
var url = require('url')
var request = require('request')

// var xlsx = require('node-xlsx')
var xlsx = require('xlsx')

// var queue = []

// 读取excel文件
var workbook = xlsx.readFile('11090442(1).xlsx')
const sheetNames = workbook.SheetNames
// console.log(sheetNames)
var workSheet = workbook.Sheets[sheetNames[0]]
// console.log(xlsx.parse(__dirname + '/11090442_1.xlsx')[1].data)
// 获取读取文件内容
var json_data = xlsx.utils.sheet_to_json(workSheet)
// console.log(json_data)
// var arr = JSON.parse(json_data.toString())
// console.log(arr)
// for(let i in json_data){
//   console.log(json_data[i]['姓名'])
// }
console.log(json_data[0])
// console.log(json_data[1]['__EMPTY'])
function findDesc(str,arr){
  var res = ''
  for(var i =0 ;i<arr.length;i++){
    if(str.indexOf(arr[i]['学号'])!=-1){
      res = arr[i]['留言']
      break
    }
  }
  return res
}
// return



fileDisplay('./imgs', function(filedir, filename) {
    fs.readFile(filedir, function(err, data) {
      console.log(filename,findDesc(filename,json_data),'查留言')
      // return
      // 暂时使用文件名字作为标题
      console.log(`准备上传，title:${filename},desc:${findDesc(filename,json_data)}`)
      upload({
        title: filename,
        imgs: fs.createReadStream(filedir),
        desc:findDesc(filename,json_data)||''
      })
    })
})
/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath, callback) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function(eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败')
          } else {
            var isFile = stats.isFile() //是文件
            var isDir = stats.isDirectory() //是文件夹
            if (isFile) {
              console.log(filedir,typeof callback)
              if(callback){
                callback(filedir, filename)
              }
            }
            if (isDir) {
              fileDisplay(filedir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}

function upload(formdata) {
  var req = request.post(
    {
      url: 'http://47.104.7.232:8001/photo/item',
      formData: formdata
    },
    function(err, resp, body) {
      if (err) {
        console.log('Error!')
      } else {
        console.log('URL: ' + body)
      }
    }
  )
}
