// pages/report/report.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    phone:"",
    repName:""
  },
  onShow: function () {
    var that = this
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/report_list',
      data: {},
      method: 'POST',
      success: function (res) {
        var json = res.data;
        var arr = json.arr;
        console.log(arr)
        that.setData({
          arr: arr
        })
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  
  report: function(){
    var phone = this.data.phone
    var repName = this.data.repName
    if (repName == ""){
      app.okcash("提示", "请选择举报原因!");
      return;
    }
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/report',
      data: {
        phone: phone,
        repName: repName
      },
      method: 'POST',
      success: function (res) {
        if(res.data){
          app.okcash("提示", "提交成功!");
        }else{
          app.okcash("提示", "提交失败,联系管理员!");
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  textinput: function (event){
    this.setData({
      phone: event.detail.value
    })
  },
  radioChange: function (e){
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      repName: e.detail.value
    })
  }

})