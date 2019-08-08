//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banners:[],
    bannerList:[],
    ballList:[],
    windowWidth:0,
    nMargin:30,
    pMargin:30,
    sLeft:30,
    sRight:15,
    scroll: true,
    page:0,
    latitude:'',
    longitude:'',
    bannerPage:0,
    msgList:[]
  },
  bindBanner: function (event) {
    var bannerPage = event.detail.current;
    this.setData({
      bannerPage: bannerPage
    })
  },
  qianwang: function (opt){
    console.log(opt);
    var id = opt.currentTarget.id;
    const sponsorDetailId = opt.currentTarget.dataset.ordertime.sponsorDetailId;
    const sponsorId = opt.currentTarget.dataset.ordertime.sponsorId;
    const stadiumId = opt.currentTarget.dataset.ordertime.stadiumId;
    const isSponsor = sponsorDetailId && sponsorDetailId !== '' ? true : false;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&sponsorId=' + sponsorId + '&sponsorDetailId=' + sponsorDetailId + '&isSponsor=' + isSponsor + '&stadiumId=' + stadiumId,
    })
  },
  getOpenId: function () {

  },
  goPlace:function(opt){
    var id = opt.currentTarget.id;
    wx.navigateTo({
      url: '../place/place?id=' + id,
    })
  },
  allBall:function(){
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  msgSearch:function(){
    var that = this;
    var pub_url = this.data.pub_url;
    wx.request({
      url: pub_url + '/streetball/msg/AppMessage/queryMsgs',
      method: 'GET',
      data: {
        terminal: 'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            msgList:res.data.data
          })
        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadBallPlace()
  },
  bannerDetail:function(e){
    var avid = e.currentTarget.dataset.avid;
    var idx = e.currentTarget.id;
    var bannerList = this.data.bannerList;
    var bannerData = bannerList[idx];

    if (bannerData.imgPath != '' || bannerData.referUrl != ''){
      wx.navigateTo({
        url: '../banner-detail/banner-detail?id=' + avid,
      })
    }

  },
  loadBanner:function(){
    var that = this;
    var pub_url = this.data.pub_url;
    wx.request({
      url: pub_url + '/streetball/advert/getAdvert',
      method: 'GET',
      data: {
        terminal: 'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            bannerList: res.data.data
          })
        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  locationRes:function(){
    var that = this;
    wx.showLoading({
      title: '定位中',
    })
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userLocation']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
              that.setData({
                latitude: latitude,
                longitude: longitude
              })
              wx.showToast({
                title: '定位成功',
                icon: 'none',
                duration: 2000
              })
            },
            fail: function () {
              wx.showToast({
                title: '定位失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '还未获取您的定位服务，前往开启？',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {

                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  loadBallPlace:function(){
    var that = this;
    var pub_url = this.data.pub_url;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;

    wx.request({
      url: pub_url + '/streetball/stadium/stadiumHomePage',
      method: 'GET',
      data: {
        terminal: 'ios',
        longitude: longitude,
        latitude: latitude
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh()
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            ballList:res.data.data
          })
          wx.hideLoading()
        }else{
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(error) {
        wx.showToast({
          title: '网络无法连接，稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  userData:function(){
    wx.navigateTo({
      url: '../user-data/user-data',
    })
  },
  onShow:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy;
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        that.loadBallPlace();

      },
      fail() {
        that.loadBallPlace();
      }
    })
    this.loadBanner();
    this.msgSearch();
   
  },
  onLoad: function (opt) {
    var share_page = opt.page;

    if (opt.type == 'place'){
      var place_id = opt.id;
      wx.navigateTo({
        url: '../place/place?id=' + place_id
      })
    }

    // if(opt.type == 'order'){
    //   var id = opt.id;
    //   var sponsorId = opt.sponsorId;
    //   var stadiumId = opt.stadiumId;
    //   var isSponsor = opt.isSponsor;
    //   var title = opt.title;
    //   wx.navigateTo({
    //     url: '../order-detail/order-detail?id=' + id + '&sponsorId=' + sponsorId + '&stadiumId=' + stadiumId + '&isSponsor=' + isSponsor + '&title=' + title
    //   })
    // }

    if(share_page == 'detail'){
      console.log(opt);
      var share_id = opt.id;
      var share_type = opt.type;
      var sponsorId = opt.sponsorId;
      var stadiumId = opt.stadiumId;
      var isSponsor = opt.isSponsor;
      var title = opt.title;
      // var number = opt.number;
      var sponsorDetailId = opt.sponsorDetailId;
      var isLock = opt.isLock;
      wx.navigateTo({
        url: '../detail/detail?id=' + share_id + '&type=' + share_type + '&sponsorId=' + sponsorId + '&stadiumId=' + stadiumId + '&isSponsor=' + isSponsor + '&sponsorDetailId=' + sponsorDetailId + '&isLock=' + isLock
      })
    }
   
    let windowWidth = wx.getSystemInfoSync().windowWidth

    var pub_url = getApp().globalData.url;

    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      pub_url:pub_url
    })
    this.getOpenId();
    
    this.setData({
      windowWidth: windowWidth
    })
  },
  onShareAppMessage() {
    return {
      title: '一起来篮球',
      path: 'pages/index/index'
    }
  },
  changeS:function(e){
    var page = e.detail.current;
    if(page == 0){
      this.setData({
        sLeft:30,
        sRight:15
      })
    } else if (page == banners.length){
      this.setData({
        sLeft: 30,
        sRight: 15
      })
    }else{
      this.setData({
        sLeft: 15,
        sRight: 15
      })
    }
  }
})
