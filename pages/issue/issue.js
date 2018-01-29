var app = getApp();
Page({
  data:{
    qtArray:[],
    kf: false
  },
  onShow: function () {
    var that = this
    wx.request({
      url: app.globalData.bathpath + '/MiniProgram/issue_list',
      data: {},
      method: 'POST',
      success: function (res) {
        var json = res.data;
        var qtArray = json.qtArray;
        var kf = json.kf
        console.log(qtArray)
        that.setData({
          qtArray: qtArray,
          kf: kf
        })
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  clickTab:function(e){
    console.log(e)
    var that=this
    var uqtArray=[]
    //遍历一次显示答案
    for(var i=0;i<this.data.qtArray.length;i++){
      if(e.target.id==this.data.qtArray[i].id){
        uqtArray[i]={id:i+1,question:this.data.qtArray[i].question,qtColor:true,showAs:true,answer:this.data.qtArray[i].answer}
      }else{
        uqtArray[i] = { id: i + 1, question: this.data.qtArray[i].question, qtColor: false, showAs: false, answer: this.data.qtArray[i].answer }
      }
    }
    that.setData({
      qtArray:uqtArray
    })
  },
  report: function(){
    wx.navigateTo({
      url: '/pages/report/report'
    })
  }
});