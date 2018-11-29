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
    checkbable: false,
    addtime: {
      today: -1,
      yesterday: -1,
      earlier: -1
    }
  },
  // 列表
  orderlist: function () {
    var that = this
    var url = {
      API_URL: app.globalData.base + 'users/history/list.json',
      data: {
        'openId': app.globalData.openId,
        'pageNo': 1,
        'pageSize': 150
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.setData({
        lists: res.data.response.responseBody.list,
        loading: false
      })
      if (res.data.response.responseBody.list.length < 1) {
        that.setData({
          nodata: true
        })
      }
      for (var i in that.data.lists) {
        var tem = that.data.lists[i].addTime.slice(0, 10);
        if (that.data.addtime.today >= 0) {
        } else {
          if (app.util.GetDateStr(0) == tem) {

            that.setData({
              'addtime.today': i
            })
          }
        }
        if (that.data.addtime.yesterday >= 0) {
        } else {
          if (app.util.GetDateStr(-1) == tem) {
            that.setData({
              'addtime.yesterday': i
            })
            continue;
          }
        }

        if (that.data.addtime.earlier >= 0) {
          // continue;
        } else {
          if (app.util.GetDateStr(-1) > tem) {
            that.setData({
              'addtime.earlier': i
            })
            continue;
          }
        }
      }
      if (that.data.addtime.yesterday >= 0) {

        var daylists = 'lists[' + that.data.addtime.yesterday + '].yesterday'
        that.setData({
          [daylists]: true
        })
      }
      if (that.data.addtime.today >= 0) {
        var daylists = 'lists[' + that.data.addtime.today + '].today'
        console.info(daylists)
        that.setData({
          [daylists]: true
        })
      }
      if (that.data.addtime.earlier >= 0) {
        var daylists = 'lists[' + that.data.addtime.earlier + '].earlier'
        that.setData({
          [daylists]: true
        })
      }
    }).catch(res => {
      this.setData({
        nodata: true
      })
    });
  },
  // 删除操作
  deletorder: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.base + 'users/history/delete.json',
      method: "POST",
      data: {
        'openId': app.globalData.openId,
        'id': e
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        that.orderlist()
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
    var list_item = "lists[" + eq + "].ischeck"
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
  allcheck: function () {
    var that = this
    this.setData({
      isallcheck: !that.data.isallcheck
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
    var that = this
    this.showZanDialog({
      title: '删除历史',
      content: '确定删除观看历史吗？',
      confirmColor: '#ff5f00',
      showCancel: true
    }).then(() => {
      var item_arr = new Array()
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i].id)
        }
      }
      console.log(item_arr);
      that.deletorder(item_arr)
    }).catch(() => {
      console.log('取消');
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