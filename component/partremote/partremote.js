
// 设备的可视区域
const app = getApp();
Component({
  properties: {
    _wid_pro: {
      type: Number,
      value: 55
    },
    _left_pro: {
      type: Number,
      value: 0
    },
    _top_pro: {
      type: Number,
      value: 1
    },
    _bottom_pro: {
      type: Number,
      value: 0
    }
  },
  data: {
    barTop:'',
    barLeft: '',
    _deciceW: wx.getStorageSync('deciceW'),
    _deciceH: wx.getStorageSync('deciceH'),
    pressBtn: false,
    showRomoteStatus: false,
    verticalLine: '../../image/remote-vertical.png',
    horisonLine: '../../image/remote-horizon.png',
  },
  methods: {
    // 点击
    handelClick: function (e) {
      var that = this;
      that.setData({
        showRomoteStatus: !that.data.showRomoteStatus
      });
    },
    // 触摸开始
    touchStartEvent: function (e) {
      var that = this
      that.setData({
        _trs: false,
        _trmo: true,
      });
    },
    // 触摸滑动
    touchMoveEvent: function (e) {
      // var touchs = e.touches[0],cy = touchs.pageY - this.data.nsty, cx = touchs.pageX - this.data.nstx;
      // //   sty = 250, stx = this.data.screenWidth - 50;
      // // console.info(nsty, cy, sty, nstx, cx, stx)   
      var that = this
      that.setData({
        barTop: e.touches[0].clientY,
        barLeft: e.touches[0].clientX
      });
    },
    // 触摸结束
    touchEndEvent: function (e) {
      var that = this
      var y = that.data.barTop, x = that.data.barLeft;
      var maxleft = that.data._deciceW - that.properties._wid_pro - that.properties._left_pro,
        minleft = 0,
        maxtop = that.data._deciceH - that.properties._wid_pro - that.properties._bottom_pro,
        mintop = that.properties._top_pro

      if (y < mintop && y) {
        that.setData({
          _trs: true,
          _trmo: false,
          barTop: mintop,
          barLeft: maxleft
        });
        console.info('1')
      } else if (y > maxtop && y) {
        console.info('2')
        that.setData({
          _trs: true,
          _trmo: false,
          barTop: maxtop,
          barLeft: maxleft
        });
      } else if (y >= mintop && y <= maxtop && y) {
        console.info('3')
        that.setData({
          _trs: true,
          _trmo: false,
          barLeft: maxleft
        });
      }
    },
    // //中间上下左右控制
    // pressMidBtn:function(e){
    //   var that = this;
    //   that.sent(e.target.dataset.keycode);
    //   var pressBtn = e.target.dataset.pressbtnsel;
    //   that.setData({
    //     pressBtn: pressBtn
    //   });
    // },
    // //点击按钮切换
    // pressBtnFun: function (e) {
    //   var that = this;
    //   that.sent(e.target.dataset.keycode);
    // },
    // //失去点击事件切换图标
    // moveBtnFun: function (e) {
    //   var that = this;
    //     that.setData({
    //       pressBtn: !that.data.pressBtn
    //     })
    // },
    sent: function (e) {
      var that = this;
      console.log(wx.getStorageSync('boxId'))
      if (!wx.getStorageSync('boxId')) {
        return false
      }
      var keycode = e.currentTarget.dataset.keycode
      var control = {
        API_URL: app.globalData.user + 'message/controlMessage',
        data: {
          'keyCode': keycode,
          'boxId': wx.getStorageSync('boxId')
        }
      }
      app.fetch.newData.result(control).then(res => {

      })
    },
  },

})
