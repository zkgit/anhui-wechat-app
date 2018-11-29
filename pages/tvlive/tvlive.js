var app = getApp();
Page({
  data: {
    tabs: '',
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    value: '热播搜索',
    jmtime: '',
    leftbarIndex: 0,
    activeDate: '',
    arr: ['回看', '直播', '预约']
  },
  onLoad: function (options) {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'epg/liveCate.json'
    }).then(res => {
      that.setData({
        tabs: res.data.response.responseBody,
        type: res.data.response.responseBody[0].channel_en,
      })
      that.week();
      that.tab_type();
    })
  },
  week: function () {
    var jmtime = [];
    var that = this;
    var data = new Date(),
      str = '',
      wkarr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      day = data.getDay();
    data.setDate(data.getDate() - 7);
    for (var i = 0; i < 7; i++) {
      data.setDate(data.getDate() + 1);
      var obj = {};
      var ts = (data.getMonth() + 1 < 10 ? ('0' + (data.getMonth() + 1)) : (data.getMonth() + 1)) + '-' + (data.getDate() >= 10 ? data.getDate() : ('0' + data.getDate()));
      obj.timestr = ts;
      obj.day = wkarr[data.getDay()];
      obj.data = data.getFullYear() + ts.replace('-', '');
      jmtime.push(obj)
    }
    jmtime.reverse()
    that.setData({
      jmtime: jmtime,
      activeDate: jmtime[0].data
    })
    console.log(that.data.jmtime[0])
  },
  tab_type: function (event) {
    //点击最上边导航
    var that = this;
    if (event) {
      that.setData({
        type: event.currentTarget.dataset.channel_en,
        activeDate: that.data.jmtime[0].data,
        leftbar: [],
        leftbarIndex: 0,
        isshow_default: false
      })
    }
    this.getEpg(that.data.jmtime[0].data, 0, '')
  },
  changeTime: function (event) {
    //点击周一到周日
    this.setData({
      activeDate: event.currentTarget.dataset.date,
      leftbar: [],
      leftbarIndex: 0, isshow_default: false
    })
    this.getEpg(event.currentTarget.dataset.date, 0, '')
  },
  changeleft: function (event) {
    var that = this;
    that.setData({
      list: [],
      leftbarIndex: event.currentTarget.dataset.index, isshow_default: false
    })
    that.getEpg(that.data.activeDate, 1, event.currentTarget.dataset.channelId)
  },
  getEpg: function (date, scope, channelId) {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'epg/liveEpg.json',
      data: {
        date: date,
        channelId: channelId,
        type: that.data.type,
        pageNo: 1,
        pageSize: 100,
        scope: scope
      }
    }).then(res => {
      if (scope == 0) {
        that.setData({
          list: [],
        })
        console.info('0')
        if ((res.data.response.responseHeader.code == 200) && res.data.response.responseBody) {
          that.setData({
            leftbar: res.data.response.responseBody.list,
          })
          if (res.data.response.responseBody.channels) {
            that.setData({
              list: res.data.response.responseBody.channels,
              isshow_default: false
            })
          } else {
            that.setData({
              isshow_default: true
            })
          }
        } else {
          that.setData({
            isshow_default: true
          })
        }

        // that.getEpg(date, 1, res.data.response.responseBody.list[0].channelId);
        // that.getEpg(date, 1,'chancp000011a2242213000002930093');
      } else if (scope == 1) {
        console.info('1')
        if ((res.data.response.responseHeader.code == 200) && res.data.response.responseBody && res.data.response.responseBody.list) {
          that.setData({
            list: res.data.response.responseBody.list,
            isshow_default: false
          })
        } else {
          that.setData({
            isshow_default: true
          })
        }
      }
      if (that.data.jmtime[0].data == date) {
        that.scrollFun();
      } else {
        that.setData({
          toView: 0,
        })
      }
    })
  },
  //设置scroll-into-view值定位正在直播模块
  scrollFun: function(){
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].flag == 1) {
        this.setData({
          toView: i - 1,
        })
        break;
      }
    }
  }

})