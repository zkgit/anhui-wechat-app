
// 用户扫一扫绑定操作统一管理
var newData = {

  //API_URL : 'http://api3.kanketv.com/wechat-2.0-api/api/v1/vod/myvideo.json',

  bdApi: function (boxId, globalData) {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: globalData.user + 'wxapp/system/bindBox',
        data:{
          boxId: boxId,
          openId: globalData.openId
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      })
    })
  },

  result: function (boxId, globalData) {
    var that = this;
    return that.bdApi(boxId, globalData).then(res => res)
  }
}


module.exports = { newData: newData };