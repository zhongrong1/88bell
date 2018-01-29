var app = getApp();
Page({
  data:{
    openid:"",
    money:"",
    outMoney:"",
    disabled: true,
  },
  onShow: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载...',
    })
    var openid = app.globalData.openid;
    that.setData({
      openid: app.globalData.openid
    })
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/goWithdrawals',
      data: {
        OPENID: openid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if(res.data == "-1"){
          var page = getCurrentPages().pop();
          page.onLoad();
        }else{
          console.log(res.data)
          that.setData({
            money: res.data
          })
        }
        
      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading()
        that.setData({
          disabled: false
        })
      }
    })
  },
  textinput: function (event) {
    var type = event.currentTarget.dataset.type;
    if (type == 1) {
      this.setData({
        outMoney: event.detail.value
      })
    } else if (type == 2) {
      
    } else if (type == 3) {
      
    }
    
  },
  withdrawals:function(e){
    var that = this;
    that.setData({
      disabled: true
    })
    wx.showLoading({
      title: '请稍候...',
    })
    var openid = app.globalData.openid;
    var formData = e.detail
    var dataValue = formData.value
    var form_id = formData.formId
    var money = dataValue.outMoney
    if(!openid){
      var page = getCurrentPages().pop();
      page.onLoad();return;
    }
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/withdrawals',
      data: {
        MONEY: money,
        OPENID: openid,
        form_id: form_id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        var json = res.data;
        if(json.status == "2"){
          app.okcash("提示", json.content);
        }else{
          app.okcash("提示", json.content);
        }
      },
      fail: function () {
        
      },
      complete: function () {
        var page = getCurrentPages().pop();
        page.onLoad();
        wx.hideLoading()
        that.setData({
          disabled: false,
          outMoney: null
        })
      }
    })
  },
  onPullDownRefresh: function () {
    var page = getCurrentPages().pop();
    page.onLoad();
    wx.stopPullDownRefresh()
  }
})
