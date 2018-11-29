const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    checkAction:'',
    isActivation:false,
    zanActivateShow:false,
    zanAddShow:false,
    showAddDialog:false,
    listInfo:'',
    deviceList:'',//设备列表
    currentKeyId:'',
    showAddBtn:false,
    haveList:false,//没有数据时提示
  },

/**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
  this.getOrderList();
  this.getDeviceList();
},

getOrderList: function(){
  var that = this;
  app.fetch.newData.result({
    API_URL: app.globalData.user + 'wxapp/myorder/getMyOrder',
    data: {
      'openId': app.globalData.openId
    }
  }).then(res => {
    if (res.data.return_code == 'SUCCESS') {
      if (res.data.parm.length < 1 || !res.data.parm){
        that.setData({
          haveList: true
        })
      }else{
        that.setData({
          listInfo: res.data.parm,
          haveList: false
        })
      }
    }
  })
},

getDeviceList:function(){
  var that = this;
  var url = {
    API_URL: app.globalData.user + 'wxapp/system/findBoxByUser',
    data: {
      'openId': app.globalData.openId
    }
  };
  app.fetch.newData.result(url).then(res => {
    if (res.data.responseBody.list.length > 0) {
      for (var i in res.data.responseBody.list) {
        res.data.responseBody.list[i].checked = false
      }
      that.setData({
        deviceList: res.data.responseBody.list,
        showAddBtn: false,
      })
    }
  }).catch(res => {

  });
},
//设备选中状态控制
checkItemFun: function (e) {
  var that = this;
  // var index = e.currentTarget.dataset.index;
  // dataInfo[index].checked = !dataInfo[index].checked;
  var currentId = e.currentTarget.dataset.id;
  var dataInfo = that.data.deviceList;
  for (var i in dataInfo) {
    if (dataInfo[i].id == currentId){
      dataInfo[i].checked = !dataInfo[i].checked;
    }else{
      dataInfo[i].checked = false
    }
  }
  that.setData({
    deviceList: dataInfo,
  })
},
//激活使用
activationUse:function(){
  var that = this;
  var deviceList = that.data.deviceList;
  if (deviceList){
    for (var i in deviceList) {
      if (deviceList[i].checked == true) {
        var url = {
          API_URL: app.globalData.user + 'wxapp/activate/boxActivate',
          data: {
            boxId: deviceList[i].boxId,
            CDKey: that.data.currentKeyId,
            acType: 'phone'
          }
        };
        app.fetch.newData.result(url).then(res => {
          if (!!res && res.data.return_code == 'SUCCESS'){
            this.setData({
              zanActivateShow: false
            });
            wx.showToast({
              title: '激活成功',
              icon: 'none',
              duration: 1500
            });
            this.getOrderList();
          }else{ 
            this.setData({
              zanActivateShow: false
            });
            wx.showToast({
              title: '激活失败',
              icon: 'none',
              duration: 1500
            })
          }      
        }).catch(res => {});
      }else{
        wx.showToast({
          title: '请选择需要激活的设备',
          icon: 'none',
          duration: 1500
        });
      }
    }
  }else{
    wx.showToast({
      title: '没有可激活设备',
      icon: 'none',
      duration: 1500
    })
    return
  }
},

//调出激活弹窗
showActivationModal: function (e) {
  var that = this;
  if (!that.data.deviceList || that.data.deviceList.length==0){
    that.setData({
        showAddBtn: true,
    });
  }
  var status = e.currentTarget.dataset.status;
  var keyId = e.currentTarget.dataset.id;
  if (status==2){//已激活
    wx.showToast({
      title: '设备已激活',
      icon: 'none',
      duration: 1500
    })
  }else{
    that.setData({
      zanActivateShow: true,
      currentKeyId: keyId
    });
  }
},
  hideActivationModal: function () {
    this.setData({
      zanActivateShow: false
    })

  },
//添加设备弹窗
  showAddModal: function(){
    this.hideActivationModal();
    this.setData({
      showAddDialog: true
    })
  },
  hideAddModal:function(){
    this.setData({
      showAddDialog: false
    })
  },
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我的订购',
      path: '/pages/minor/mine_orderlist/mine_orderlist',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 1500
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
  },
  // 扫一扫
  scan: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(app.util.getUrlParam('scene', res.path))
        wx.showToast({
          title: '绑定成功',
          icon: 'none'
        }, 1500);
        app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path));
        app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
          that.getDeviceList();
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

}))