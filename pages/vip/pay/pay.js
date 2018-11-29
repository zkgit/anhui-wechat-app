const app = getApp();
const { Stepper, extend } = require('../../../style/dist/index');
Page(extend({}, Stepper, {
  /**
   * 页面的初始数据
   */
  data: {
    zanPopupShow: false,//模态框默认值
    stepper: {
      stepper: 1,//默认值
      min: 1,//最小
      max: 20
    },
    currentPrice: '',//初始化当前价格
    currentNum: 1,//初始化数量
  },
  //接口数据请求
  getInitData: function () {
    var url = {
      API_URL: app.globalData.user + 'wxapp/goods/getGoodsList',
      data: {
        'openId': app.globalData.openId,
      }
    }
    app.fetch.newData.result(url).then(res => {
      const data = res.data;
      var priceRange = data.small + '-' + data.max;//价格范围
      if (!!data) {
        this.setData({
          cardList: data.goodsList,
          sales: data.SalesSum,//销量
          surplus: data.SurplusSum,//剩余
          priceRange: priceRange,
          currentPrice: priceRange,
        });
      }
    })
  },
  //更新详情页面信息
  isUpdateInfo: function () {
    var that = this;
    var itemInfo = that.data.itemInfo;
    if (!!itemInfo.name && !!that.data.currentNum) {
      this.setData({
        showSelectInfo: true,
        currentNumText: that.data.currentNum,//数量
        curTypeText: itemInfo.name,//会员卡类型
        sales: itemInfo.sales,//销量 
        surplus: itemInfo.surplus,//剩余
        goodsId: itemInfo.goodsId,//id
      });
    }
  },
  //模态框显示控制
  closeModal: function () {
    var that = this;
    if (!!that.data.zanPopupShow && !!that.data.itemInfo) that.isUpdateInfo();
    that.setData({
      zanPopupShow: !that.data.zanPopupShow,
    })
  },
  //选中版本切换价格
  changePrice: function (e) {
    var itemInfo = e.currentTarget.dataset.item;
    this.setData({
      itemInfo: itemInfo,
      currentPrice: itemInfo.price,//赋值价格
      btnActive: itemInfo.goodsId,//控制选中颜色字段
    });
  },
  //steper修改购买数量
  handleZanStepperChange(e) {
    var componentId = e.componentId;
    var stepper = e.stepper;//当前数量
    this.setData({
      [`${componentId}.stepper`]: stepper,
      currentNum: stepper
    });
  },
  //确定选择
  makeSureChose: function () {
    var that = this;
    that.isUpdateInfo();
    that.toBuy();
  },
  //点击购买
  toBuy: function () {
    var that = this;
    if (!!that.data.goodsId && !!that.data.currentNum) {
      wx.navigateTo({
        url: "../order/order?goodsId=" + that.data.goodsId + "&number=" + that.data.currentNum,
      });
      that.setData({//关闭底部模块
        zanPopupShow: false,
      });
    } else {
      wx.showToast({
        title: '请选择套餐类型',
        icon: 'none',
        duration: 1500
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getInitData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

}))

