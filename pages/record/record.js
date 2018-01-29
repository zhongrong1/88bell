Page({
  data: {
    user: {},
    rtabArray:[
      { "id":"1",changetColor:true,changeColor:true,txt:"我发出的"},
      {"id":"2",changetColor:false,changeColor:false,txt:"我收到的" }
    ]
  },
  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // success
        that.setData({
          user: res.userInfo,
          encryptedData: res.encryptedData
        })

      },
      fail: function () {
        // fail
        console.log("获取失败！")
        
      },
      complete: function () {
        // complete
        console.log("获取用户信息完成！")
      }
    })
  },
  //点击顶部tab
  clickTab:function(event){
    var that=this
    var rtabArray=[]
    //遍历一次更改颜色
    for (var i = 0; i < this.data.rtabArray.length; i++) {
      if (event.target.id == this.data.rtabArray[i].id) {
        rtabArray[i] = { id: i + 1, changetColor:true, changeColor: true, txt: this.data.rtabArray[i].txt }
      } else {
        rtabArray[i] = { id: i + 1, changetColor:false, changeColor: false, txt: this.data.rtabArray[i].txt }
      }
    }
    that.setData({
      rtabArray:rtabArray
    })
  }
});