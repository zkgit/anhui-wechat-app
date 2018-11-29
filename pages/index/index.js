var app = getApp();
//首页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    newList: [],
    value: '热播搜索',
    pageNo: 1,
    values: '搜索',
    banners: [
      {
        name: '',
        picUrl: '../../image/active.png',
        url: '../vip/pay/pay'
      },
      {
        name: '',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/fhq.jpg'
      },
      {
        name: '',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/lnh.jpg'
      },

      {
        name: '',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/qr3.jpg'
      },
      {
        name: '',
        picUrl: 'http://miniapps.kanketv.com/image/apptest/ssz.jpg'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getUlike: function getUlike() {
    // 猜你喜欢
    this.setData({
      'pageNo': this.data.pageNo++,
      'pageSize': '6',
      'scope': this.data.pageNo++
    })
    console.info(this.data.pageNo++)
    this.like()
  },
  like: function like() {
    // 猜你喜欢
    var allMyVideo = {
      API_URL: app.globalData.base + 'home/allItU.json',
      data: {
        'pageNo': this.data.pageNo,
        'pageSize': '6',
        'scope': this.data.pageNo
      }
    }
    app.fetch.newData.result(allMyVideo).then(res => {
      this.setData({
        allMyVideo: res.data.response.responseBody.list
      })
    })
  },
  allList: function allList() {
    let that = this;
    //热播排行
    let hotVideo = {
      API_URL: app.globalData.base + 'home/hotVideo.json',
      // method: 'post',
      data: {
        'type': 'film',
        'pageNo': '1',
        'pageSize': '6'
      }
    },
      // 最新上线
      videoReserve = {
        API_URL: app.globalData.base + 'videoReserve.json',
        data: {
          'pageNo': '1',
          'pageSize': '6'
        }
      },
      // 正在热播
      hotLive = {
        API_URL: app.globalData.base + 'home/hotLive.json',
        data: {
          'pageNo': '1',
          'pageSize': '6'
        }
      }

    // 正在热播
    app.fetch.newData.result(hotLive)
      .then(res => {
        this.setData({
          hotLive: res.data.response.responseBody.list
        })
      })
    // 热播排行
    app.fetch.newData.result(hotVideo)
      .then(res => {
        this.setData({
          hotVideo: res.data.response.responseBody.list
        })
      })
      .then(
      // 最新上线
      // app.fetch.newData.result(videoReserve)
      //   .then(res => {
      //     this.setData({
      //       videoReserve: res.data.response.responseBody.list
      //     })
      //   })
      )
    // 加载猜你喜欢
    this.setData({
      'pageNo': 1,
      'pageSize': '6',
      'scope': 1
    })
    this.like()
  },
  onLoad: function (params) {
    let that = this;
    // 处理微信扫一扫boxid绑定
    if (params.scene) {
        let scene = decodeURIComponent(params.scene)
        wx.setStorageSync('boxId', scene)
        !app.globalData.openId || app.api.newData.result(scene, app.globalData).then(res => {
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            duration: 2000
          })
        })
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (params) {
    this.allList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})