var app = getApp();
Page({
  data: {
    user: {},
    encryptedData: "",
    url: ""  
  },
  onLoad: function (options) {
    var that = this;
    var REDTASK_ID = decodeURIComponent(options.REDTASK_ID)
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          user: userInfo
        })
        wx.login({
          success: function (res) {
            if (res.code) {
              var NICKNAME = userInfo.nickName;
              var GENDER = userInfo.gender == 1 ? "男" : "女";
              var ADDRESS = userInfo.province + userInfo.city + userInfo.country;
              var AVATARURL = userInfo.avatarUrl;
              //发起网络请求
              wx.request({
                url: app.globalData.bathpath + '/MiniProgram/onLogin',
                data: {
                  code: res.code,
                  NICKNAME: NICKNAME,
                  GENDER: GENDER,
                  ADDRESS: ADDRESS,
                  AVATARURL: AVATARURL,
                },
                method: 'POST',
                success: function (res) {
                  if (res.data == "0") {
                    return;
                  }
                  var OPENID = res.data.openid
                  that.setData({
                    url: app.globalData.bathpath + "/MiniProgram/toselfshow.do?OPENID=" + REDTASK_ID
                  })
                },
                fail: function (res) {

                },
                complete: function (res) {

                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },

  onShareAppMessage(options) {
    var that = this
    var return_url = options.webViewUrl
    return {
      title: that.data.title,
      path: return_url,
      success: function (res) {
        that.web_url = return_url
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})