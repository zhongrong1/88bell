//index.js
var app = getApp();
Page({
  data: {
    user: {},
    encryptedData: "",
    content: "",
    money: "",
    count: "",
    openid: "",
    url: "",
    filePaths:"",
    title:"",
    content:"",
    disv:"none",
    REDTASK_ID:""
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
                    openid: OPENID,
                    REDTASK_ID: REDTASK_ID
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
 


  titleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  contentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  chooseimage: function () {  
    var that = this; 
    wx.chooseImage({  
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
       that.setData({
         filePaths: res.tempFilePaths[0],
         disv:"block"
       })  
          
      }  
    })  
  } ,

 savefile:function(){

   if (this.data.filePaths == ''){
     app.okcash("提示", "请先选择图片");
     return
   }
   if (this.data.title == '') {
     app.okcash("提示", "请输入标题");
     return
   }
   if (this.data.content == '') {
     app.okcash("提示", "请输入情信息");
     return
   }

   wx.uploadFile({
     url: app.globalData.bathpath + '/MiniProgram/add_self.do',
     filePath: this.data.filePaths,//图片路径，如tempFilePaths[0]
     name: 'image',
     header: {
       "Content-Type": "multipart/form-data"
     },
     formData:
     {
       OPENID: this.data.openid ,//附加信息为用户ID
       TILTLE: this.data.title,
       CONTENT: this.data.content,
       REDTASK_ID: this.data.REDTASK_ID
     },
     success: function (res) {
       var json = res.data
       if(json.status == "1"){
         wx.navigateTo({
           url: '../custom1/custom1?REDTASK_ID=' + this.data.REDTASK_ID
         })
       }
       if(json.status == "2"){
         wx.showToast({ title: json.content, image: '/images/no.png', duration: 4000 })
       }
       
     },
     fail: function (res) {
       console.log(res);
     },
     complete: function (res) {

     }
   })
 }
 


});
