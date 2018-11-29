// pages/vip/order_status/order_status.js
var app = getApp();
const { Toast, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, {

  /**
   * 页面的初始数据
   */
  data: {
    order_hid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    this.notice(params)
  },
  // 订单通知
  notice: function (params) {
    var that = this;
    var url = {
      API_URL: app.globalData.user + 'wxapp/pay/successNotice',
      data: {
        'orderId': params.orderId,
        'openId': app.globalData.openId
      }
    }
    app.fetch.newData.result(url).then(res => {
      res.data.return_code == 'SUCCESS' && (that.setData({
        info: res.data.parm,
        order_hid: true
      }, that.clearZanToast()))

      res.data.return_code == 'SUCCESS' || (this.showZanToast({
        title: 'API错误，请返回',
        icon: 'fail',
      }, -1))

    }).catch(res => {
      this.showZanToast({
        title: 'API错误，请返回',
        icon: 'fail',
      }, -1)
    })

  }
}));