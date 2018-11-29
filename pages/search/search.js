// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'vod',
    iszhan: false,
    inputval: '',
    textList: [],
    isresult: false,//是否在搜索
    typearr: [
      { "k": "全部", "v": "" },
      { "k": "电影", "v": "film" },
      { "k": "电视剧", "v": "tv" },
      { "k": "动漫", "v": "anime" },
      { "k": "综艺", "v": "arts" },
      { "k": "纪录片", "v": "documentary" }],
    vodtype: 0,
    videoType: '',
    pageNo: 1,
    pageSize: 10,
    searchList: [],
    loadtext: '正在加载...',
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethot();
    var str = wx.getStorageSync('hissearch');
    this.setData({
      keyhistory: str ? str.split(',').slice(0, 6) : []
    })

  },
  nohistory: function () {
    this.setData({
      keyhistory: []
    })
    wx.setStorageSync('hissearch', '');
  },
  gethot: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/getHotVideo.json',
    }).then(res => {
      var data = res.data;
      if (data && data.response.responseHeader.code == 200) {
        that.setData({
          hotList: data.response.responseBody
        })
      }
    })
  },
  search_clear: function () {
    this.setData({
      isresult: false,
      inputval: '',
      searchList: []
    })
  },
  searchsub: function (e) {//点击点播或直播
    console.log(e)
    var that = this;
    that.setData({
      inputval: e.detail.value.replace(/\s/ig, ''),
      isresult: false
    })
    that.keylen()
  },
  changevodType: function (e) {
    this.setData({
      vodtype: e.currentTarget.dataset.vodtype,
      isresult: true,
    })
    this.sccol();
  },
  clicksearch: function () {//点击搜索按钮
    this.setData({
      isresult: true,
      list: [],
      textList: [],
      searchList: []
    })
    this.setLocal();
    this.getAjax();
  },
  setLocal: function () {
    var str = wx.getStorageSync('hissearch'),
      isin = false,
      strarr = [];
    if (str) {
      strarr = str.split(',');
      for (var i = 0; i < 6; i++) {
        if (this.data.inputval == strarr[i]) {
          isin = true;
        }
      }
      if (!isin) {
        if (strarr.length) {
          str = this.data.inputval + ',' + strarr.join(',').substr(0, 200);
        }
      }
    } else {
      str = this.data.inputval;
    }
    wx.setStorageSync('hissearch', str);
    this.setData({
      keyhistory: str.split(',').slice(0, 6)
    })
  },
  getAjax: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/searchLiveAndDemand.json',
      data: {
        key: that.data.inputval,
        type: that.data.type,
        way: that.data.type == 'vod' ? that.data.vodtype : '',
        videoType: that.data.videoType,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize
      }
    }).then(res => {
      var data = res.data;
      if (data && data.response.responseHeader.code == 200 && data.response.responseBody.totalrecords) {
        var _shlist = data.response.responseBody.list
        for (var i = 0; i < _shlist.length; i++) {
          _shlist[i].tags=_shlist[i].tags.split(';').slice(0, 3)
        }
        that.setData({
          searchList: that.data.searchList.concat(_shlist),
          flag: false
        })
        if (that.data.searchList.length == data.response.responseBody.totalrecords) {
          that.setData({
            loadtext: '已加载全部数据'
          })
        }

      } else {
        that.setData({
          loadtext: '暂无数据'
        })
      }
    })
  },
  scrollLower: function () {
    var that = this;
    if (!that.data.flag) {
      that.setData({
        pageNo: ++that.data.pageNo
      })
      that.getAjax();
    }
    that.setData({
      flag: true
    })

  },
  sccol: function (e) {//搜索初始化 点击点播的分类
    this.setData({
      loadtext: '正在加载...',
      searchList: [],
      pageNo: 1,
      videoType: e ? e.currentTarget.dataset.videotype : ''
    })
    this.getAjax();
  },
  keysearch: function (e) {//点击关键字搜索
    this.setData({
      inputval: e.currentTarget.dataset.key,
      textList: [],
      isresult: true,
      searchList: []
    })
    this.getAjax();
  },
  keylen: function () {//联想
    var that = this;
    if (that.data.inputval) {
      app.fetch.newData.result({
        API_URL: app.globalData.base + 'search/searchWordAssociate.json',
        data: {
          key: that.data.inputval,
          type: that.data.type,
          pageNo: 1,
          pageSize: 25
        }
      }).then(res => {
        var data = res.data;
        if (data && data.response.responseHeader.code == 200) {
          that.setData({
            textList: data.response.responseBody
          })
        }
      })
    } else {

    }
  },
  changezhan: function () {
    this.setData({
      iszhan: !this.data.iszhan
    })
  },
  changeType: function (e) {
    if (e.currentTarget.dataset.type!=this.data.type){
      this.setData({
        type: e.currentTarget.dataset.type,
        pageNo: 1,
        searchList: [],
        textList:[]       
      })
      if (this.data.inputval) {
        // this.keylen();
        this.setData({
          isresult: true,
          loadtext: '正在加载...'
        })
        this.getAjax();
      }
    }
    this.setData({
      iszhan: false,
    })
  },
  goback: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})