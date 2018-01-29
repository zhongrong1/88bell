var app = getApp();
Page({
  data:{
    openid:"",
    REDTASK_ID:"",
    userInfo: app.globalData.userInfo,
    wxcode:"",
    content:""
  },
  onLoad: function (options){
    var that = this;
    var REDTASK_ID = options.REDTASK_ID;
    that.setData({
      REDTASK_ID: REDTASK_ID
    })
    if (!this.data.userInfo){
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    that.getWxacode(REDTASK_ID);
    
  },
  getWxacode: function (REDTASK_ID){
    var that = this;
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/shareMyRed',
      data: {
        REDTASK_ID: REDTASK_ID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data)
        that.setData({
          wxcode: app.globalData.bathpath +"/" + res.data.WXACODE,
          content:res.data.CONTENT
        })
        
      },
      fail: function () {},
      complete: function () {}
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    var REDTASK_ID = that.data.REDTASK_ID
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '送福利来咯',
      path: '/pages/command/command?scene=' + REDTASK_ID,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //点击回调发口令页面
  stry:function(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  friend: function(){
    var REDTASK_ID = this.data.REDTASK_ID
    wx.navigateTo({ url: "/pages/command/command?scene=" + REDTASK_ID });
  },
  onPullDownRefresh: function () {
    var page = getCurrentPages().pop();
    page.onLoad();
    wx.stopPullDownRefresh()
  },
  tocustom: function () {
    var REDTASK_ID = this.data.REDTASK_ID
    wx.navigateTo({ url: "/pages/custom/custom?REDTASK_ID=" + REDTASK_ID });
  }
});