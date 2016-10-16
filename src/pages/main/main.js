const spider = require('../../utils/spider.js')

const getCurrentPos = function() {
  wx.getLocation({
    type: 'wgs84', // or 'gcj02' for open location
    success: function(res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy
      console.log("pos")
      page.setData({
        lat: latitude,
        lon: longitude
      })
      getAuroraData(latitude, longitude)

    }
  })
}

let page = null

const getDPIndex = function(lat, lon) {

  const coder = spider.getTheCoderLookup(lat, lon)
  console.log("coder=" + coder)

  wx.request({
    url: "https://www.softservenews.com/response.php",
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    data: "coder=" + coder,
    success: function(res) {
      //use data from res.data
      console.log(res)
      console.log(res.data[0])
      console.log(res.data[1])
    },
    fail: function(e) {
      console.log(e)
    }
  })

}

function getAuroraData(lat, lon) {
  const url = "https://www.jrustonapps.com/app-apis/aurora/get-data.php?latitude=" + lat + "&longitude=" + lon
  wx.request({
    url: url,
    method: "GET",
    success: function(res) {
      //use data from res.data
      console.log(res)
    },
    fail: function(e) {
    }
  })
}

Page({
  data:{
    // text:"这是一个页面"
    cityName: "Beijing",
    kpPoint: 2
  },
  onLoad: function(options){
    // 页面初始化 options为页面跳转所带来的参数
    page = this
  },
  onReady: function(){
    // 页面渲染完成
  },
  onShow: function(){
    // 页面显示
  },
  onHide: function(){
    // 页面隐藏
  },
  onUnload: function(){
    // 页面关闭
  },
  getPos: getCurrentPos
})

