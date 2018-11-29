'use strict';

/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
var wechat = require('./utils/wechat.js');
var util = require('./utils/util.js');
var fetch = require('./utils/fetch.js');
var api = require('./utils/api.js');

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    nickName: '',
    avatarUrl: '',
    activateStatus: ''
  },

  /**
   * WeChat API
   */
  wechat: wechat,
  /**
   * fetch API
   */
  fetch: fetch,
  /**
  * util API
  */
  util: util,

  api: api,

  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch(options) {

    // 登陆获取code给接口返回openid放在全局中
    this.wechat.login().then(res => {
      return res.code
    }).then(code => {
      this.wechat.getUserInfo().then(res => {
        console.log('info=', res)
        this.globalData.nickName = res.userInfo.nickName
        this.globalData.avatarUrl = res.userInfo.avatarUrl
        return res.rawData
      }).then(userInfo => {
        var _login = {
          API_URL: this.globalData.user + 'wxapp/system/init',
          data: {
            code: code,
            userInfo: userInfo
          }
        }
        this.fetch.newData.result(_login).then(res => {
          this.globalData.openId = res.data.openId;
          if (options.scene == '1011' || options.scene == '1012' || options.scene == '1013' || options.scene == '1047' || options.scene == '1048' || options.scene == '1049') {
             !this.globalData.openId || this.api.newData.result(wx.getStorageSync('boxId'), this.globalData).then(res => {
              wx.showToast({
                title: '绑定成功',
                icon: 'none',
                duration: 2000
              })
            })
          }
        })
      })
    })
    // 获取设备的信息并存储
    const _systemres = wx.getSystemInfoSync()
    this.wechat.setStorage('deciceW', _systemres.windowWidth)
    this.wechat.setStorage('deciceH', _systemres.windowHeight)
  },
  globalData: {
    server: 'https://miniapps.kanketv.com/',
    base: 'https://miniapps.kanketv.com/anhui-weixin-api/api/v1/',
    user:'https://miniapps.kanketv.com/wechat_programs/'
  },
  //推送获取鉴权
  activateBoxAccess: function () {
    var that = this;
    var _activate = {
      API_URL: this.globalData.user + 'wxapp/activate/boxAccess',
      data: {
        'boxId': wx.getStorageSync('boxId'),
      }
    }
    that.fetch.newData.result(_activate).then(res => {
      wx.setStorageSync('activateStatus', res.data.return_code);
    })
  },
  onShow: function (options) {
  
  }
})
