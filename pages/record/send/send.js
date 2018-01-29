var app = getApp();
Page({
  data: {
    user: app.globalData.userInfo,
    COUNTALL:"0",
    MONEYALL:"0",
    OPENID: "",
    RedMyTaskArray:[],
    rtabArray: [
      { "id": "1", changetColor: true, changeColor: true, txt: "我发出的" },
      { "id": "2", changetColor: false, changeColor: false, txt: "我收到的" }
    ]
  },
  onShow: function () {
    this.setData({
      user: app.globalData.userInfo
    })
    wx.showLoading({
      title: '加载中...',
    })
    var openid = app.globalData.openid;
    if(!openid){
      var page = getCurrentPages().pop();
      page.onLoad();
    }
    this.gettingAll(openid);
  },


  /***获取数据 */
  gettingAll: function (OPENID) {
    wx.hideLoading()
    var that = this;
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/getTaskMylist',
      data: {
        CUSTOMERAPPID: OPENID,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var json = res.data
        var status = json.status
        if(status == "1"){
          that.setData({
            RedMyTaskArray: json.arr
          })
        }else{
          wx.showToast({ title: json.msg, image: '/images/no.png', duration: 4000 })
        }
      },
      fail: function () {
        console.log("失败");
      },
      complete: function () {
        // complete
      }
    })

    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/getCountAll',
      data: {
        CUSTOMERAPPID: OPENID,
        istask: "1",
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var json = res.data
        if(json.status == 1){
          that.setData({
            COUNTALL: json.COUNTALL,
            MONEYALL: json.REDALL,
          })
        }else{
          wx.showToast({ title: json.msg, image: '/images/no.png', duration: 4000 })
        }
        
      },
      fail: function () {
        console.log("失败");
      },
      complete: function () {
        // complete
      }
    })
  },


 //红包详情
  toast: function (event) {
    var p = event.currentTarget.id

    wx.navigateTo({
      url: '/pages/command/command?scene=' + p
    })
  },

  //切换页面
  clickTab: function (event) {
    console.log(+event.target.id)
    if(event.target.id==1){
      wx.switchTab({
        url: '../send/send',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      }) 
     
    }else{
      wx.navigateTo({
        url: "../receive/receive",
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
      
    }
  },
  onPullDownRefresh: function () {
    var page = getCurrentPages().pop();
    page.onLoad();
    wx.stopPullDownRefresh()
  }
});