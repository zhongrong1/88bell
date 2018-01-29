var app = getApp();
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
Page({
  data:{
    REDTASK_ID:"",
    openid: app.nextLogin(),
    taskInfo:null,
    list:null,
    flag:"3",
    btnStr:"红包加载中..."
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '请稍候...',
    })
    var REDTASK_ID = decodeURIComponent(options.scene)
    console.log("scene:"+REDTASK_ID)
    that.setData({
      REDTASK_ID: REDTASK_ID
    })
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
                    openid: OPENID
                  })
                  that.loadPage(REDTASK_ID, OPENID);

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
  loadPage: function (REDTASK_ID, OPENID){
    var that = this;
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/showMyRed',
      data: {
        REDTASK_ID: REDTASK_ID,
        OPENID: OPENID
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var taskInfo = res.data.taskInfo
        var list = res.data.list
        var flag = res.data.flag
        var btnStr = res.data.btnStr
        wx.hideLoading()
        if (res.data.taskInfo){
          console.log(res.data.list)
          that.setData({
            taskInfo: taskInfo,
            list: list,
            flag: flag,
            btnStr: btnStr
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '红包加载失败,返回首页',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({ url: "/pages/index/index" });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })


          
        }
        
      },
      fail: function (res) {
        
      },
      complete: function (res) {

      }
    })
  },
  mytouchstart: function () {
    wx.showLoading({
      title: '开始录音',
    })
    var that = this;
    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
        wx.showLoading({
          title: '开始识别语音',
        })
        wx.uploadFile({
          url: app.globalData.bathpath + '/MiniProgram/getRed', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'OPENID': getApp().globalData.openid,
            'REDTASK_ID': that.data.REDTASK_ID
          },
          header: { //
            'Content-Type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading();
            var json = JSON.parse(res.data)
            console.log(json)
            if (json.status == "1"){
              wx.showToast({ title: json.content, image: '/images/yes.png', duration: 4000 })
              that.loadPage(that.data.REDTASK_ID, that.data.openid);
            } else{
              wx.showToast({ title: json.content, image: '/images/no.png', duration: 4000 })
            }
            
          }, fail: function (res) {
            wx.hideLoading();
            wx.showToast({ title: '语音匹配失败', image: '/images/no.png', duration: 4000 })
          },
          complete: function (res) {
            
          }
        })
      },
      fail: function (res) {
        wx.hideLoading();
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
    }, 20000)

  },
  mytouchend: function () {
    wx.hideLoading();
    wx.stopRecord()
  },
  //跳转到发口令页面
  sendpass:function(){
    wx.switchTab({url:"/pages/index/index"});
  },
  //去提现
  getmoney:function(){
    var that = this
    
    wx.switchTab({url:"/pages/money/money"});
  },
  playVoice: function(e){
    var src = app.globalData.bathpath+"/"+ e.currentTarget.dataset.voice+".mp3"
    var time = e.currentTarget.dataset.vtime*1000+500
    innerAudioContext.src = src
    innerAudioContext.onPlay(() => {console.log('开始播放')
      wx.showToast({ title: '播放中', image: '/images/laba.png', duration: time })
    })
    innerAudioContext.onEnded(() => {console.log('结束播放')
      
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play(() => { })
  },
  //去转发
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
  onPullDownRefresh: function () {
    var page = getCurrentPages().pop();
    page.onLoad();
    wx.stopPullDownRefresh()
  }
});