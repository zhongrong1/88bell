//app.js
App({
  globalData: {
    bathpath: "http://t.ixxxk.com",
    userInfo: "",
    openid: ""
  },
  onLaunch: function() {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo
        that.goLogin(res.userInfo);
      }
    })
    
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  goLogin: function (userInfo){
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var userInfo = that.globalData.userInfo;
          var NICKNAME = userInfo.nickName;
          var GENDER = userInfo.gender == 1 ? "男" : "女";
          var ADDRESS = userInfo.province + userInfo.city + userInfo.country;
          var AVATARURL = userInfo.avatarUrl;
          //发起网络请求
          wx.request({
            url: that.globalData.bathpath + '/MiniProgram/onLogin',
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
              that.globalData.openid = res.data.openid
              wx.setStorageSync('user', res.data);
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
  },
  nextLogin: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        wx.login({
          success: function (res) {
            if (res.code) {
              var NICKNAME = userInfo.nickName;
              var GENDER = userInfo.gender == 1 ? "男" : "女";
              var ADDRESS = userInfo.province + userInfo.city + userInfo.country;
              var AVATARURL = userInfo.avatarUrl;
              //发起网络请求
              wx.request({
                url: that.globalData.bathpath + '/MiniProgram/onLogin',
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
                  return res.data.openid;

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
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  okcash: function (title,content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          
        }
      }
    })
  }
  
})
