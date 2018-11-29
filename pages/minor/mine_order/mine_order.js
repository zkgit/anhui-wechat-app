// pages/minor/mine_order/mine_order.js
const app = getApp()
const { Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    nodata: false,
    loading: true,
    checkbable: false
  },
  // 列表
  orderlist: function () {
    var url = {
      API_URL: app.globalData.base + 'users/userReserveInfo.json',
      data: {
        'openId': app.globalData.openId,
        'type': 1
      }
    }
    app.fetch.newData.result(url).then(res => {
      this.setData({
        lists: res.data.response.responseBody,
        loading: false
      })
      if (res.data.response.responseBody.length < 1) {
        this.setData({
          nodata: true
        })
      }
    }).catch(res => {
      this.setData({
        nodata: true
      })
    });
  },
  // 删除操作
  deletorder:function(e){
    var that = this;
    wx.request({
      url: app.globalData.base + 'users/myLiveReserve.json',
      method: "POST",
      data: {
        'isReserve': '0',
        'openId': app.globalData.openId,
        'methodType': 'POST',
        'reserve': JSON.stringify(e)
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        that.orderlist()
        // if (res && res.data.response.responseHeader.code == "200") {
        //   that.showZanToast({
        //     title: msg + '成功',
        //     icon: 'wechat'
        //   }, 1500);
        // } else {
        //   that.showZanToast({
        //     title: msg + '失败',
        //     icon: 'fail'
        //   }, 1500);
        // }
      }
    })
  },
  // 显示底部删除
  deletefcn: function () {
    var that = this
    this.setData({
      checkbable: true
    })
  },
  // 选中按钮
  checkboxChange: function (e) {
    var that = this
    var eq = parseInt(e.currentTarget.dataset.index)
    var list_item = "lists[" + eq +"].ischeck"
    console.log(e, eq)
    this.setData({
      [list_item]: !that.data.lists[eq].ischeck
    })
  },
  // 底部取消
  cancel: function () {
    var that = this
    this.setData({
      checkbable: false,
      isallcheck: false
    })
    for (var i in this.data.lists) {
      var list_item = "lists[" + i + "].ischeck"
      this.setData({
        [list_item]: false
      })
    }
  },
  // 底部全选、取消全选
  allcheck:function(){
    var that = this
    this.setData({
        isallcheck:!that.data.isallcheck
    })
    for (var i in this.data.lists) {
      var list_item = "lists[" + i + "].ischeck"
      this.setData({
        [list_item]: that.data.isallcheck
      })
    }
  },
   // 底部删除
  deleteButton: function () {
    var that =this
    this.showZanDialog({
      title: '取消预约',
      content: '取消预约后，节目即将播放时，无法收到提醒，是否要继续取消？',
      confirmColor: '#ff5f00',
      showCancel: true
    }).then(() => {
      var item_arr = new Array()
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck==true){
          item_arr.push(that.data.lists[i])
        } 
      }
      that.deletorder(item_arr)
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },

  onLoad: function (options) {
    this.orderlist()
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   

  }

}));