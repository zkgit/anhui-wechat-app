var app = getApp();

Page({
  data: {
    tabs: [{
      name: '电影', type: 'film'
    }, {
      name: '电视剧', type: 'tv'
    }, {
      name: '综艺', type: 'arts'
    }, {
      name: '动漫', type: 'anime'
    }, {
      name: '纪录片', type: 'documentary'
    }],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    value: '热播搜索',
    categories: '',
    siftings:'',
    region: 0,
    tag: 0,
    year: 0,
    loading: true,
    loadtxt: '正在加载...',
    pageNo:1,
    isFromType:true 
  },
  onLoad: function (options) {
    try {
      let { tabs } = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }
    this.getdb(this.data.tabs[this.data.activeTab].type)
  },
  getdb: function getdb(e) {
    this.setData({
      region: '0',
      tag: '0',
      year: '0',
      pageNo: 1,
      siftings:'',
      loading: true,
      isFromType: true ,
      loadtxt: '正在加载...'
    })
    var category = {
      API_URL: app.globalData.base + 'vodHome/column/category.json',
      data: {
        'type': e,
      }
    }
    app.fetch.newData.result(category).then(res => {
      this.setData({
        categories: res.data.response.responseBody
      })
     
    }).then(res=>{
      this.tabClick()
    })
    
  },
  tabClick: function tabClick(e) {
    
    if (e) {
      switch (e.currentTarget.dataset.type) {
        case "region":
          this.data.region = e.currentTarget.id
          this.setData({
            region: e.currentTarget.id
          })
          break;
        case "tag":
          this.data.tag = e.currentTarget.id
          this.setData({
            tag: e.currentTarget.id
          })
          break;
        case "year":
          this.data.year = e.currentTarget.id
          this.setData({
            year: e.currentTarget.id
          })
          break;
      }
      if (this.data.isFromType){
        this.setData({
          siftings: '',
          pageNo: 1,
          loading: true,
          loadtxt: '正在加载...'
        })
      }
    }

    var siftings = {
      API_URL: app.globalData.base + 'search/siftings.json',
      data: {
        'tag': this.data.categories.tag[this.data.tag],
        'year': this.data.categories.year[this.data.year],
        'region': this.data.categories.region[this.data.region],
        'pageNo': this.data.pageNo,
        'pageSize': 9,
        'type': this.data.tabs[this.data.activeTab].type
      }
    }

    app.fetch.newData.result(siftings).then(res => {
      this.setData({
        siftings: this.data.isFromType ? res.data.response.responseBody.list : this.data.siftings.concat(res.data.response.responseBody.list),
        isFromType: true
      })
      if (res.data.response.responseBody.list.length>0){
        this.setData({
          loading: false
        })
      }else{
        this.setData({
          loading: true,
          loadtxt:'无更多内容'
        })
      }
    }).catch(e => {
      this.setData({
        loading: false,
        loadtxt: '数据加载异常'        
      })
      console.error(e);
    });
  },
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0];
    let { stv } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    let { tabs, stv, activeTab } = this.data;
    let { offset, windowWidth } = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {

        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    this.setData({ stv: this.data.stv })
  },
  _updateSelectedPage(page) {
    let { tabs, stv, activeTab } = this.data;
    activeTab = page;
    this.setData({ activeTab: activeTab })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
    this.getdb(e.currentTarget.dataset.type)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.loading){
      console.info('触底')
      this.setData({
        loading: true,
        isFromType:false,
        pageNo: this.data.pageNo + 1
      })
      this.tabClick()
    }
      
  }
})