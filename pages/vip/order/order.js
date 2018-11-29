// pages/order/order.js
var app = getApp();
const { Toast, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, {
  data: {
    info: '',
    order_hid: false
  },
  onLoad: function (params) {
    this.showZanToast({
      title: '订单生成中...',
      icon: 'loading',
    }, -1);
    // 创建订单
    this.creatOrder(params)
  },
  // 创建订单
  creatOrder: function (params) {
    var that = this;
    var url = {
      API_URL: app.globalData.user + 'wxapp/pay/creatOrder',
      data: {
        'goodsId': params.goodsId,
        'number': params.number,
        'openId': app.globalData.openId
      }
    }
    app.fetch.newData.result(url).then(res => {
      res.data.return_code == 'SUCCESS' && (that.setData({
        info: res.data.parm,
        order_hid: true
      }, that.clearZanToast()))

      res.data.return_code == 'SUCCESS' || (this.showZanToast({
        title: '订单生成失败',
        icon: 'fail',
      }, -1))

    }).catch(res => {
      this.showZanToast({
        title: '订单生成失败',
        icon: 'fail',
      }, -1)
    })

  },
  // 唤醒微信支付
  orderAction: function () {
    var that = this
    var url = {
      API_URL: app.globalData.user + 'wxapp/pay/unifiedorder',
      data: {
        'openId': app.globalData.openId,
        'orderId': that.data.info.orderId,
        'payType': 'JSAPI'
      }
    }
    app.fetch.newData.result(url).then(res => {
      if (res.data.return_code == 'SUCCESS') {
        console.info('1')
        that.wxpay(res.data.parm)
        
      } else {
        console.info('2')
        that.showZanToast('发起支付失败');
      }
    }).catch(res => {
      // console.info('3')
      // that.showZanToast('发起支付失败');
    })
  },
  wxpay: function (res) {
    console.info('4')
    var that =this
    // var timestamp = Date.parse(new Date());
    // timestamp = (timestamp / 1000).toString();
    console.log(res.timeStamp, res.nonceStr, 'prepay_id=' + res.prepay_id, res.paySign);  
    
    wx.requestPayment({
      'timeStamp': res.timeStamp.toString(),
      'nonceStr': res.nonceStr,
      'package': 'prepay_id='+res.prepay_id,
      'signType': 'MD5',
      'paySign': res.paySign,
      'success': function (res) {
        wx.navigateTo({
          url: "../order_status/order_status?orderId=" + that.data.info.orderId
        });
        console.info('成功:',res)
      },
      'fail': function (res) {
        // wx.navigateTo({
        //   url: "../order_status/order_status?orderId=" + that.data.info.orderId
        // });
        console.info('失败:',res )
        that.showZanToast({
          title: '支付失败',
          icon: 'fail',
        })
      }
    })
  }
}));