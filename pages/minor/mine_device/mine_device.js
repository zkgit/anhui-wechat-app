const app = getApp()
const { Dialog, Toast, extend } = require('../../../style/dist/index');
Page(extend({}, Dialog, Toast ,{
  data: {
    ischeck: false,
    checkbable: false,
    showPopup: false,
    showBottomPopup:false,
    showTypeDialog:false,
    goodslistInfo:'',
  },
  onLoad: function (options) {
    this.getlist();
    this.getDoodsList();//获取激活类型弹窗列表
  },
  getlist: function () {
    var that = this
    var url = {
      API_URL: app.globalData.user + 'wxapp/system/findBoxByUser',
      data: {
        'openId': app.globalData.openId
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.setData({
        lists: res.data.responseBody.list
      })
      // 当前绑定设备存入缓存中
      if (res.data.responseBody.list.length>=1){
        for (var i in that.data.lists) {
          if (that.data.lists[i].level == '1') {
            app.wechat.setStorage('boxId', that.data.lists[i].boxId)
          }
        }
      }else{
        app.wechat.setStorage('boxId', '')
      }
      
    }).catch(res => {

    });
  },
  // 扫一扫
  scan: function () {
    var that= this;
    wx.scanCode({
      success: (res) => {
        console.log(app.util.getUrlParam('scene', res.path))
        that.showZanToast({
            title: '绑定成功',
            icon: 'wechat'
          }, 1500);
        app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
        //设备用户关系绑定
        // app.api.bdApi(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
        //  console.info(res)
        // })
        app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
          console.info(res)
          that.getlist()
        })
      }
    })
  },
  // 删除操作
  deletdevice: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.user + 'wxapp/system/deleteBind',
      data: {
        'openId': app.globalData.openId,
        'boxId': e
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        that.getlist()
      }
    })
  },
  // 切换绑定
  changebox:function(e){
    var that= this;
    var boxId = e.currentTarget.dataset.boxid
    var url = {
      API_URL: app.globalData.user + 'wxapp/system/changeBindBox',
      data: {
        'openId': app.globalData.openId,
        'boxId':boxId
      }
    }
    app.fetch.newData.result(url).then(res => {
      if(res.data.code=='200'){
        that.showZanToast({
          title: '切换设备成功',
          icon: 'wechat'
        }, 1500);
        that.getlist()
      }else{
        that.showZanToast({
          title: '切换设备失败',
          icon: 'fail'
        }, 1500);
      }
      
    }).catch(res => {
      that.showZanToast({
        title: '切换设备失败',
        icon: 'fail'
      }, 1500);
    });

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
      title: '删除设备',
      content: '删除设备后，将解锁该设备的绑定，是否要继续删除？',
      confirmColor: '#ff5f00',
      showCancel: true
    }).then(() => {
      var item_arr = new Array()
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i].boxId)
        }
      }
      console.info(JSON.stringify(item_arr))
      that.deletdevice(item_arr.toString())
    }).catch(() => {

    });
  },
  // 修改盒子名称
  editboxname:function(){
    this.setData({
      showPopup: true,
      showBottomPopup: false
    });
  },
  editConfirm: function (e) {
    console.info(e.detail.value.boxname)
    this.setData({
      showPopup: false
    });
    this.getlist()
  },
  
  //关闭遮罩层
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },

  showBottomModal: function () {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
      // showTypeDialog: !this.data.showTypeDialog
    });
  },
  showPouModal:function(){
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      showTypeDialog: !this.data.showTypeDialog
    });
  },
  hidePopModal:function(){
    this.setData({
      showTypeDialog: false
    });
  },

  getDoodsList:function(){
    var that = this;
    // var openId = app.globalData.openId;
    app.fetch.newData.result({
      API_URL: app.globalData.user + 'wxapp/myorder/getMyOrder',
      data: {
        'openId': app.globalData.openId
      }
    }).then(res => {
      if (res.data.return_code == 'SUCCESS') {
        for (var i in res.data.parm) {
          res.data.parm[i].checked = false
        }
        that.setData({
          goodslistInfo: res.data.parm
        })
      }
    })
  },
  checkItemFun: function (e) {
    var that = this;
    var currentID = e.currentTarget.dataset.key;
    var dataInfo = that.data.goodslistInfo;
    for (var i in dataInfo) {
      if (dataInfo[i].keyId == currentID) {
        dataInfo[i].checked = !dataInfo[i].checked;
      } else {
        dataInfo[i].checked = false
      }
    }
    that.setData({
      goodslistInfo: dataInfo,
    })
  },
  //激活使用
  activationUse: function () {
    var that = this;
    var goodslistInfo = that.data.goodslistInfo;
    if (goodslistInfo) {
      for (var i in goodslistInfo) {
        if (goodslistInfo[i].checked == true) {
          var url = {
            API_URL: app.globalData.user + 'wxapp/activate/boxActivate',
            data: {
              boxId: goodslistInfo[i].boxId,
              CDKey: goodslistInfo[i].id,
              acType: 'phone'
            }
          };
          app.fetch.newData.result(url).then(res => {
            if (!!res && res.data.return_code == 'SUCCESS') {
              this.setData({
                showTypeDialog: false
              });
              wx.showToast({
                title: '激活成功',
                icon: 'none',
                duration: 1500
              });
              this.getOrderList();
            } else {
              this.setData({
                showTypeDialog: false
              });
              wx.showToast({
                title: '激活失败',
                icon: 'none',
                duration: 1500
              })
            }
          }).catch(res => {});
        } else {
          wx.showToast({
            title: '请选择需要激活的类型',
            icon: 'none',
            duration: 1500
          });
        }
        return
      }

    } else {
      wx.showToast({
        title: '没有可激活类型',
        icon: 'none',
        duration: 1500
      })
    }
  },

}));