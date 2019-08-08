// pages/sponsor/sponsor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    sponsorId: '',
    stadiumId: '',
    info: '',
    sponsorInfo: '',
    userInfo: '',
    number: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    var that = this;
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    var sponsorId = opt.sponsorId;
    var stadiumId = opt.stadiumId;
    var number = opt.number;

    this.setData({
      windowWidth: windowWidth,
      pub_url: pub_url,
      sponsorId: sponsorId,
      stadiumId: stadiumId,
      number: Number(number),
    })
  },
  // 获取赞助信息
  loadInfo: function () {
    var that = this;
    var pub_url = this.data.pub_url;
    var sponsorId = this.data.sponsorId;  // 赞助商id
    var stadiumId = this.data.stadiumId;

    wx.request({
      url: pub_url + '/streetball/sponsor/getSponsorDetailList',
      method: 'GET',
      data: {
        terminal: 'ios',
        sponsorId: sponsorId,
        stadiumId: stadiumId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh(function () {
          console.log('stopPullDownRefresh')
        })
        that.setData({
          onPull: 'down'
        })
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            info: res.data.data
          })
          wx.hideLoading()
        } else {
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
  // 球场信息
  loadSponsor: function () {
    var that = this;
    var pub_url = this.data.pub_url;
    var stadiumId = this.data.stadiumId;  // 球场id

    wx.request({
      url: pub_url + '/streetball/sponsor/getSponsorData',
      method: 'GET',
      data: {
        terminal: 'ios',
        stadiumId: stadiumId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh(function () {
          console.log('stopPullDownRefresh')
        })
        that.setData({
          onPull: 'down'
        })
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            sponsorInfo: res.data.data
          })
          wx.hideLoading()
        } else {
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        that.setData({
          userInfo: json
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    this.loadSponsor();
    this.loadInfo();
    // this.loadSponsor();
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
    wx.showLoading({
      title: '加载中',
    })
    this.loadInfo();
    this.loadSponsor();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 跳转组队详情
  goTeamDetail: function (opt) {
    console.log(opt);
    const id = opt.currentTarget.dataset.ordertime.id;
    const sponsorDetailId = opt.currentTarget.dataset.ordertime.sponsorDetailId;
    const sponsorId = opt.currentTarget.dataset.ordertime.sponsorId;
    const isSponsor = sponsorId && sponsorId !== '' ? true : false;
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&sponsorId=' + this.data.sponsorId + '&sponsorDetailId=' + sponsorDetailId + '&isSponsor=' + isSponsor + '&stadiumId=' + this.data.stadiumId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})