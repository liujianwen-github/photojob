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

// var queue = []


/**
 * @description 执行队列
 *
 * @param {any} args 初始执行队列
 */
// function Queue(args) {
//   this.line = args || []
//   this.checkStatus = null
//   this.checkTime = 1000
//   this.count = {}
//   this.prototype.set = function(arg) {
//     this.line.push(arg)
//   }
//   this.prototype.start = function() {
//     this.checkStatus = setInterval(function() {
//       if (this.line.length != 0) {
//         this.line[0]()
//       }
//     }, this.checkTime)
//   }
//   this.prototype.stop = function() {
//     clearInterval(this.checkStatus)
//   }
//   this.prototype.run = function() {
//     var _this = this
//     try {
//       this.line[0](function() {
//         this.line.splice(0, 1)
//         _this.run()
//       })
//     } catch (error) {
//       this.stop()
//     }
//   }
// }

fileDisplay('./imgs', function(filedir, filename) {
    fs.readFile(filedir, function(err, data) {
      // 暂时使用文件名字作为标题
      upload({
        title: filename,
        imgs: fs.createReadStream(filedir)
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
