// pages/remote/remote.js
const app = getApp();
const { Dialog, extend } = require('../../style/dist/index');
Page(extend({}, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    is_staticvol: false,
    keynum: 'default',
    svgbg: 'http://miniapps.kanketv.com/image/apptest/svg_default.png',
    touchmove: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  noidtip: function () {
    this.showZanDialog({
      title: '您还没有绑定设备',
      content: '点击下方的扫一扫，绑定设备',
      buttons: [{
        text: '取消',
        type: 'cancel'
      }, {
        text: '扫一扫',
        color: '#ff5f00',
        type: 'scan'
      }]
    }).then(({ type }) => {
      if (`${type}` == 'scan') {
        wx.scanCode({
          success: (res) => {
            console.log(app.util.getUrlParam('scene', res.path))
            console.log(wx.getStorageSync('boxId'))
            //设备用户关系绑定
            app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
              console.info(res)
            })
            // 缓存设备号
            app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
          }
        })
      }

    });
  },
  changeVol: function () {
    var that = this;
    that.setData({
      is_staticvol: !that.data.is_staticvol
    })
  },
  shownum: function (e) {
    this.setData({
      keynum: e.currentTarget.dataset.key
    })
  },
  svgpress: function (e) {
    console.info(e)
    wx.vibrateShort()
    var that = this;
    that.setData({
      touchmove: true
    })
    var keyCode = e.target.dataset.keycode;
    if (keyCode == '38') {//up
      that.setData({
        svgbg: 'http://miniapps.kanketv.com/image/apptest/svg_top.png'
      })
    } else if (keyCode == '39') {//right
      that.setData({
        svgbg: 'http://miniapps.kanketv.com/image/apptest/svg_right.png'
      })
    } else if (keyCode == '40') {//bottom
      that.setData({
        svgbg: 'http://miniapps.kanketv.com/image/apptest/svg_bottom.png'
      })
    } else if (keyCode == '37') {//left
      that.setData({
        svgbg: 'http://miniapps.kanketv.com/image/apptest/svg_left.png'
      })
    }
    that.sent(e.target.dataset.keycode)
  },
  svgmove: function (e) {
    var that = this;
    if (that.data.touchmove) {
      that.setData({
        touchmove: false
      })
    }
  },
  sent: function (e) {
    var that = this;
    console.log(wx.getStorageSync('boxId'))
    if (!wx.getStorageSync('boxId')) {
      that.noidtip()
      return false
    }
    var control = {
      API_URL: app.globalData.user + 'message/controlMessage',
      data: {
        'keyCode': e,
        'boxId': wx.getStorageSync('boxId')
      }
    }
    app.fetch.newData.result(control).then(res => {

    })

  },
  svgend: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        svgbg: 'http://miniapps.kanketv.com/image/apptest/svg_default.png'
      })
    }, 200);
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
}));