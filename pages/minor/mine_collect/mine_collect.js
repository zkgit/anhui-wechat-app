// pages/minor/mine_collect/mine_collect.js
var app = getApp()
const { extend, Tab, Dialog , TopTips} = require('../../../style/dist/index');
 
Page(extend({}, Tab, Dialog , TopTips,{
  /**
     * 页面的初始数据
     */
  data: {
    selectedId:'0',
    nodata: false,
    loading: true,
    checkbable: false,
    tab1: {
      list: [{
        id: 'sp',
        title: '视频'
      }, {
        id: 'pd',
        title: '频道'
      }],
      selectedId: 'sp'
    }
  },
  // 列表
  collect: function (e) {
    var url = {
      API_URL: app.globalData.base + 'users/collect/list.json',
      data: {
        'openId': app.globalData.openId,
        'type': e,
        'pageNo': 1,
        'pageSize': 150
      }
    }
    app.fetch.newData.result(url).then(res => {
      this.setData({
        lists: res.data.response.responseBody.list,
        loading: false
      })
      if (res.data.response.responseBody.list.length < 1) {
        this.setData({
          nodata: true
        })
      }
      this.showZanTopTips(res.data.response.responseBody.count+'个更新未看');
    }).catch(res => {
      this.setData({
        nodata: false
      })
    });
  },
  // 删除操作
  deletcollect: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.base + 'users/collect/delete.json',
      method: "POST",
      data: {
        'openId': app.globalData.openId,
        'id': e,
        'type': that.data.selectedId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        that.collect(that.data.selectedId)
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
      title: '删除收藏',
      content: '确定删除收藏吗？',
      confirmColor: '#ff5f00',
      showCancel: true
    }).then(() => {
      var item_arr =[]
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i].id)
        }
      }
      console.log(item_arr);
      that.deletcollect(item_arr)
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },

  onLoad: function (options) {
    this.collect('0')
  },
  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    console.info(componentId, selectedId)
    if (selectedId == 'sp') {
      this.setData({
        selectedId:'0',
        lists: '',
        loading: true,
        nodata: false
      })
      this.collect('0')
    } else if (selectedId == 'pd') {
      this.setData({
        selectedId: '1',
        lists: '',
        loading: true,
        nodata: false
      })

      this.collect('1')
    }
    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {


  },

 
}));