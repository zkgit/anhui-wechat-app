var app = getApp();
//首页
Page({
  /**
   * 页面的初始数据
   */
  data: {
    'pageNo': 1,
    loading: false,
    loadtxt: '正在加载...',
    list: []
  },
  getlist: function () {
    let that = this;
    let list = {
      API_URL: app.globalData.base + 'all/videoReserve.json',
      data: {
        'pageNo': this.data.pageNo,
        'pageSize': '15'
      }
    }
    // 热播排行
    app.fetch.newData.result(list)
      .then(res => {
        this.setData({
          list: this.data.list.concat(res.data.response.responseBody.list)
        })
        if (res.data.response.responseBody.list.length > 0) {
          this.setData({
            loading: false
          })
        } else {
          console.info('无')
          this.setData({
            loading: true,
            loadtxt: '无更多内容'
          })
        }
      }).catch(e => {
        this.setData({
          loading: false,
          loadtxt: '数据加载异常'
        })
        console.error(e);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    // 标题
    wx.setNavigationBarTitle({
      title: params.tag
    })
    this.getlist();

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
    if (!this.data.loading) {
      console.info('触底')
      this.setData({
        loading: true,
        pageNo: this.data.pageNo + 1
      })
      this.getlist()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})