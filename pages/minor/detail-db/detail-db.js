// pages/minor/detail-db/detail-db.js

const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    is_shortdes: true,
    showPopup: false,
    backhome:false,
    showBottomPopup: false,
    colorValue:'#ffffff',//默认弹幕颜色
    currentSelect:1,//默认选中
    colorList:[{
        index:0,
        // color:'216,173,122',
        color: '#dbad7a',
      },
      {
        index: 1,
        // color: '255,255,255',
        color: '#ffffff',
      },
      {
        index: 2,
        // color: '46,46,46',
        color: '#2e2e2e',
      },
      {
        index: 3,
        // color: '254,241,4',
        color: '#fef104',
      }, 
      {
        index: 4,
        // color: '1,255,17',
        color: '#01ff11',
      }, 
      {
        index: 5,
        // color: '254,142,178',
        color: '#fe8eb2',
      }, 
      {
        index: 6,
        // color: '44,185,255',
        color: '#2cb9ff',
      }, 
      {
        index: 7,
        // color: '161,114,254',
        color: '#a172fe',
      }, 
      {
        index: 8,
        // color: '255,63,62',
        color: '#ff3f3e',
      },],
    dmparameter: {
      'transparency': '80',//透明度
      'typeface': '2',//字体大小
      'speed': '10',//速度
      'rows': '4',//行数
      'danmuShow': 'true'//是否显示弹幕
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      avatarUrl: app.globalData.avatarUrl
    })
    this.getDetail();
    this.getcomment();
    if (options.share) {
      this.setData({
        backhome: true
      })
    }
  },
  changedes: function () {
    var that = this;
    that.setData({
      is_shortdes: !that.data.is_shortdes
    })
  },
  getDetail: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'home/detail.json',
      data: {
        kankeId: '',
        id: that.data.options.id
      }
    }).then(res => {
      if (res.data.response.responseHeader.code == "200") {
        var detail = res.data.response.responseBody;
        detail.tags = detail.tags.split(';').slice(0, 3);
        detail.shortdes = detail.shortdes.length > 75 ? detail.shortdes.substr(0, 75) + '...' : detail.shortdes;
        detail.description = detail.description.length > 150 ? detail.description.substr(0, 150) + '...' : detail.description;
        that.setData({
          detail: res.data.response.responseBody,
          details: res.data.response.responseBody.details ? res.data.response.responseBody.details : ''
        })
        that.actor();
        // that.mystate();
        that.recommend()
        that.mystate()
        // 标题
        wx.setNavigationBarTitle({ title: that.data.detail.title });
      }
    })
  },
  mystate: function () {
    var url = {
      API_URL: app.globalData.base + 'users/state/check.json',
      data: {
        'openId': app.globalData.openId,
        'type': '0',
        'id': this.data.detail.id,
        'tag': ''
      }
    }
    app.fetch.newData.result(url).then(res => {
      const states = res.data.response.responseBody;
      if (states) {
        const data = ({
          is_collect: states.isCollectioned == '1' ? true : false,//是否收藏
          likenum: states.beLikeCount, //点赞数量
          is_like: states.beLike == '1' ? true : false, //是否点赞
          dislikenum: states.isBeLikedCount, //点踩数量
          is_dislike: states.isBeLiked == '1' ? true : false //是否点踩
        })
        this.setData({
          mystate: data
        })
      }
    })
  },
  actor: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/star/profiles.json',
      data: {
        directorId: that.data.detail.directorId,
        name: '',
        starId: that.data.detail.actorId.replace(/\;/g, ',')
      }
    }).then(res => {
      if (res.data.responseHeader.code == '200') {
        that.setData({
          actorlist: res.data.responseBody
        })
      }
    })
  },
  recommend: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/iti_vod.json',
      data: {
        pageNo: 1,
        pageSize: 6,
        kankeId: '',
        id: that.data.options.id,
        type: that.data.detail.videoType
      }
    }).then(res => {
      if (res.data.response && res.data.response.responseBody && res.data.response.responseBody.list.length > 0) {
        that.setData({
          tjlist: res.data.response.responseBody.list
        })
      }
    })
  },
  collect: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.base + 'users/collect/save.json',
      data: {
        'openId': app.globalData.openId,
        'type': '0',
        'id': this.data.detail.id,
        'operation': this.data.mystate.is_collect ? -1 : 1,
        'title': this.data.detail.title,
        'image': this.data.detail.image,
        'videoType': this.data.detail.videoType,
      }
    }
    app.fetch.newData.result(url).then(res => {
      if (res && res.data.response.responseHeader.code == "200") {
        that.setData({
          'mystate.is_collect': !that.data.mystate.is_collect
        })
        that.showZanToast({
          title: res.data.response.responseHeader.msg,
          icon: 'wechat'
        }, 1500);

      } else {
        that.showZanToast({
          title: '收藏失败',
          icon: 'fail'
        }, 1500);

      }

    })
  },
  goplay: function (e) {
    var that = this;
    if (!wx.getStorageSync('boxId')) {
      that.setData({
        showPopup: false
      });
      that.noidtip()
      return false
    }
    //推送鉴权
    // app.activateBoxAccess();
    // if (wx.getStorageSync('activateStatus') == 'SUCCESS') {
      
    // } else {
    //   that.setData({
    //     showPopup: false
    //   });
    //   this.showZanDialog({
    //     title: '无法观看',
    //     content: '此片为会员内容，请购买观看;如已购买，请激活会员',
    //     buttons: [
    //       {
    //         text: '取消', type: 'cancel'
    //       }, {
    //         text: '激活', color: '#ff5e00', type: 'active'
    //       }, {
    //         text: '购买', color: '#ff5e00', type: 'buy'
    //       },]
    //   }).then(({ type }) => {
    //     var btnType = `${type}`;
    //     if (btnType == 'buy') {
    //       wx.navigateTo({
    //         url: "/pages/vip/pay/pay"
    //       })
    //     };
    //     if (btnType == 'active') {
    //       wx.navigateTo({
    //         url: "/pages/minor/mine_orderlist/mine_orderlist"
    //       })
    //     };
    //   });
    //   return
    // }; 
    
    console.info(e)
    var index = this.data.options.columnType == 'film' ? '0' : e.currentTarget.dataset.index
    var url = {
      API_URL: app.globalData.user + 'message/videoMessage',
      data: {
        'boxId': wx.getStorageSync('boxId'),
        'mediaUri': that.data.fadedmt[index].playUrl,
        'title': that.data.fadedmt[index].name,
        'vid': that.data.fadedmt[index].movieCode,
        'cp': that.data.fadedmt[index].cpCode,
        'videoType': that.data.fadedmt[index].videoType,
        "episode": that.data.fadedmt[index].volumnCount
      }
    }
    app.fetch.newData.result(url).then(res => {
      if (res && res.data.result == "success") { 
        that.showZanToast({
          title: '推送电视成功',
          icon: 'wechat'
        }, 1500);
      } else {
        that.showZanToast({
          title: '推送电视失败',
          icon: 'fail'
        }, 1500);
      }
    })
    // 添加历史
    this.addhistory(index)
    this.setData({
      showPopup: false
    });
  },
  playtv: function () {
    var that = this;
    if (that.data.options.columnType == 'film') {
      that.tvDrama()
    } else if (that.data.options.columnType == 'tv' || that.data.options.columnType == 'anime') {
      that.tvDrama()
      that.setData({
        showPopup: !that.data.showPopup,
        tvDrama: true
      });
    } else {
      that.tvDrama()
      that.setData({
        showPopup: !that.data.showPopup,
        tvDrama: false
      });
    }

  },
  //关闭遮罩层
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  // 剧集
  tvDrama: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.base + 'vodHome/drama.json',
      data: {
        'seriesCode': that.data.detail.playCode,
        'pageSize': '100',
        'pageNo': '1'
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.setData({
        dmtotalrecords: res.data.response.responseBody.totalrecords,
        fadedmt: res.data.response.responseBody.list
      });
    }).then(res => {
      // 解决电影取剧集异步问题
      if (that.data.options.columnType == 'film') {
        that.goplay()
      }
    })
  },
  // 添加历史
  addhistory: function (e) {
    var that = this;
    var playNumber = that.data.options.columnType == 'film' ? '' : that.data.fadedmt[e].volumnCount
    var url = {
      API_URL: app.globalData.base + 'users/history/save.json',
      data: {
        'openId': app.globalData.openId,
        'id': that.data.detail.id,
        'code': that.data.detail.playCode,
        'recommend': that.data.options.recommend ? '1' : '0',
        'type': '0',
        'playNumber': playNumber
      }
    }
    app.fetch.newData.result(url).then(res => {

    })
  },
  // 未绑定设备提示
  noidtip: function () {
    this.showZanDialog({
      title: '您还没有绑定设备',
      content: '点击下方的扫一扫，绑定设备',
      buttons: [{
        text: '取消',
        type: 'cancel'
      }, {
        text: '扫一扫',
        color: '#ff5f00',
        type: 'scan'
      }]
    }).then(({ type }) => {
      if (`${type}` == 'scan') {
        wx.scanCode({
          success: (res) => {
            console.log(app.util.getUrlParam('scene', res.path))
            //设备用户关系绑定
            app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
              console.info(res)
            })
            // 缓存设备号
            app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
          }
        })
      }

    });
  },
  keyinput: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
    console.log(e.detail.value)
  },
  sendcomment: function () {
    var that = this;
    if (!that.data.inputVal) {
      wx.showToast({
        title: '评论内容不可为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      var url;
      if (that.data.replyId) {
        url = {
          API_URL: app.globalData.base + 'users/comment/save.json',
          data: {
            'openId': app.globalData.openId,
            'id': that.data.detail.id,
            'context': that.data.inputVal,
            'kankeId': '',
            'replyId': that.data.replyId,
            'type': 0,
            'name': app.globalData.nickName
          }
        }
      } else {
        url = {
          API_URL: app.globalData.base + 'users/comment/save.json',
          data: {
            'openId': app.globalData.openId,
            'id': that.data.detail.id,
            'context': that.data.inputVal,
            'kankeId': '',
            'replayId': '',
            'type': 0,
            'name': '',
            'title': that.data.detail.title
          }
        }
      }

      app.fetch.newData.result(url).then(res => {
        that.sendPopupMessage();
        wx.showToast({
          title: res.data.response.responseHeader.msg,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          inputVal: '',
          replyId: '',
          replyname: ''
        })
        that.getcomment();
      })

    }
  },
  changeInput: function (e) {
    this.setData({
      placeholder: '回复@' + e.currentTarget.dataset.nickname,
      focus: true,
      replyId: e.currentTarget.dataset.id,
      replyname: e.currentTarget.dataset.nickname
    })
  },
  getreply: function (e) {
    var that = this;
    var eq = e.currentTarget.dataset.eq;
    var total = e.currentTarget.dataset.total;
    if (total > 5 && (that.data.comment[eq].page.list.length < total)) {
      var url = {
        API_URL: app.globalData.base + 'users/reply/list.json',
        data: {
          'id': e.currentTarget.dataset.id,
          'pageNo': 1,
          'pageSize': total
        }
      }
      app.fetch.newData.result(url).then(res => {
        if (res.data.response.responseHeader.code) {
          that.data.comment[eq].page.list = res.data.response.responseBody.list;
          that.data.comment[eq].showreply = !that.data.comment[eq].showreply;
          that.setData({
            comment: that.data.comment
          })
        }

      })
    } else {
      that.data.comment[eq].showreply = !that.data.comment[eq].showreply;
      that.setData({
        comment: that.data.comment
      })
    }
  },
  blurfocus: function () {
    this.setData({
      focus: false,
      placeholder: ''
    })
  },
  getcomment: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.base + 'users/comment/list.json',
      data: {
        'openId': app.globalData.openId,
        'id': that.data.options.id,
        'kankeId': '',
        'type': 0,
        'pageNo': 1,
        'pageSize': 6
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.setData({
        comment: res.data.response.responseBody.list
      });
    })
  },

  like: function (e) {
    var that = this;
    if (e.currentTarget.dataset.status) {
      return false;
    }
    var url = {
      API_URL: app.globalData.base + 'users/like.json',
      data: {
        'openId': app.globalData.openId,
        'id': e.currentTarget.dataset.id,
        'tag': 'C',
        'type': 0,
        'operation': 1
      }
    }
    app.fetch.newData.result(url).then(res => {
      if (res.data.response.responseHeader.code == 200) {
        wx.showToast({
          title: '点赞成功',
          icon: 'none',
          duration: 2000
        })
        that.getcomment();
      } else {
        wx.showToast({
          title: '点赞失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 弹幕弹窗显示设置
  toggleBottomPopup(e) {
    var that = this
    if (!wx.getStorageSync('boxId')) {
      that.setData({
        showPopup: false
      });
      that.noidtip()
      return false
    }
    console.info(e.currentTarget.dataset.type)
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      dm: e.currentTarget.dataset.type,
    });
  },
  //选中弹幕颜色时值操作
  checkPopupColor: function (e) {
    var colorValue = e.currentTarget.dataset.text;
    var currentSelect = e.currentTarget.dataset.index;
    var that = this;
    that.setData({
      currentSelect: currentSelect,
      colorValue: colorValue
    })
  },
  //发送弹幕到盒子接口:实时弹幕
  sendPopupMessage: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.user + 'message/barrageMessage',
      data: {
        'boxId': wx.getStorageSync('boxId'),
        "colour": that.data.colorValue,
        "content": that.data.inputVal,
        "mediaType": "danmu",
        "msgType": "shake"
      }
    };
    app.fetch.newData.result(url).then(res => {
      that.setData({
        inputVal: '',
        colorValue: '',
      })
    })
  },
// 历史弹幕弹窗设置
  sliderChange: function (e) {
    var that = this
    const sid = e.currentTarget.dataset.sid
    const _value = e.detail.value
    var _dmdata ={}
    switch (sid) {
      case '1'://透明度
        _dmdata={
          'percentage': _value,
          'mediaType': "transparency",
          'msgType':"play",
          'boxId': wx.getStorageSync('boxId'),
        }
        // that.setData({
        //   'dmparameter.transparency': _value
        // });
        break;
      case '2'://字体大小
        _dmdata = {
          'size': _value, 
          'mediaType': "typeface",
          'msgType':"play",
          'boxId': wx.getStorageSync('boxId'),
        }
        // that.setData({
        //   'dmparameter.typeface': _value
        // });
        break;
      case '3'://速度
        _dmdata = {
          'velocity': _value,
          'mediaType':"speed",
          'msgType':"play",
          'boxId': wx.getStorageSync('boxId'),
        }
        // that.setData({
        //   'dmparameter.speed': _value
        // });
        break;
      case '4'://行数
        _dmdata = {
          'lines': _value,
          'mediaType': "rows",
          'msgType':"play",
          'boxId': wx.getStorageSync('boxId'),
        }
        // that.setData({
        //   'dmparameter.rows': _value
        // });
        break;
      case '5'://是否显示弹幕
      console.log(_value)
        _dmdata = {
          'display': _value,
          'mediaType': "danmuShow",
          'msgType':"play",
          'boxId': wx.getStorageSync('boxId'),
        }
        // that.setData({
        //   'dmparameter.danmuShow': _value
        // });
        break;
      default:
        return
    }
    var that = this;
    const dmparameter = that.data.dmparameter
    var url = {
      API_URL: app.globalData.user + 'message/barrageMessage',
      data: _dmdata
    }
    app.fetch.newData.result(url).then(res => {
        console.info('设置弹幕成功')
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.detail.title,
      path: '/pages/minor/detail-db/detail-db?id=' + this.data.detail.id + '&columnType=' + this.data.detail.videoType + '&share=true',
      success: function (res) {
        // 转发成功
        that.showZanToast({
          title: '分享成功',
          icon: 'wechat'
        }, 1500);

      },
      fail: function (res) {
        // 转发失败
        that.showZanToast({
          title: '分享失败',
          icon: 'fail'
        }, 1500);

      }
    }
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function onReady() {

  }
}));
