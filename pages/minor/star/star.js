// pages/minor/star/star.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_zhan:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options:options
    })
    this.getDetail();
    this.getList();
  },
  changedes:function(){
    this.setData({
       is_zhan:!this.data.is_zhan
    })
  },
  getDetail:function(){
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/star/profiles.json',
      data:{
        starId:that.data.options.starId,
        name:that.data.options.name
      }
    }).then(res => {
      var data=res.data;
      if(data.responseHeader.code=='200'){
        that.setData({
          detail: data.responseBody[0],
        })
      }
    })
  },
  getList:function(){
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/people/related.json',
      data: {
        starId: that.data.options.starId,
        type: that.data.options.columnType,
        pageNo:1,
        pageSize:9
      }
    }).then(res => {
      var data = res.data;
      if (data.responseHeader.code == '200'){
        that.setData({
          list: data.responseBody,
        })
      }
    })
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})