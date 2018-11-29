/*
* @Author: zk
* @Date:   2018-01-16 10:33:45
* @Last Modified by:   zk
*/



var newData = {

  //API_URL : 'http://api3.kanketv.com/wechat-2.0-api/api/v1/vod/myvideo.json',

  fetchApi: function (params) {

    var that = this;

    return new Promise((resolve, reject) => {
      wx.request({
        url: params.API_URL,
        data: Object.assign({}, params.data),
        method: params.method,
        header: {
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      })
    })

  },

  result: function (params) {

    var that = this;

    return that.fetchApi(params).then(res => res)

  }

}


module.exports = { newData: newData };
