
Page({
  data: {
    logs: [],
    list:[],
    windowHeight:0,
    type:'all',
    currentTab:0,
    userInfo:'',
    pub_url:'',
    pinChang:'',
    pinSuccess:'',
    pinFail:'',
    pinOk:'',
    isSponsor: false,
  },
  onLoad: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    this.setData({
      windowHeight: windowHeight
    })
    var that = this;
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url: pub_url
    })
  },
  onShow:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        that.setData({
          userInfo: json
        })
        var data = {
          userId: json.id,
          terminal: 'ios'
        }
        that.loadList();
      },
      fail(err) {

      }
    })
  },
  goDetail: function (opt) {
    console.log(opt.currentTarget.dataset.ordertime);
    const id = opt.currentTarget.dataset.ordertime.id;
    const isSponsor = opt.currentTarget.dataset.ordertime.advertImg && opt.currentTarget.dataset.ordertime.advertImg !== '' ? true : false;
    const sponsorId = opt.currentTarget.dataset.ordertime.sponsorId;
    wx.navigateTo({
      url: '../order-detail/order-detail?id=' + id + '&sponsorId=' + sponsorId + '&isSponsor=' + isSponsor,
    })
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadList();
  },
  upper: function () {

    wx.startPullDownRefresh()
  },
  loadList: function () {
    var userId = this.data.userInfo.id;
    var pub_url = this.data.pub_url;
    var that = this;
    var data = {
      status: '',
      userId: userId,
      pageCurrent: 0,
      pageSize: 100,
      terminal: 'ios'
    }
    wx.request({
      url: pub_url + '/streetball/Pay/MyOrder/queryMyOrders',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh()
      },
      success(res) {
        console.log(res);
        if (res.data.retCode == '000') {
          var tempList = res.data.data;
          var list = [];
          var pinChang = [];
          var pinSuccess = [];
          var pinFail = [];
          var pinOk = [];
          for (var i = 0; i < tempList.length; i++) {
            if (tempList[i] !== null) {list.push(tempList[i]);}
          }

          if (res.data.retCode == '000') {
            for (var i = 0; i < list.length; i++) {
              if (list[i] !== null) {
                if (list[i].status == 'matching') {
                  pinChang.push(list[i])
                }
                if (list[i].status == 'succeed') {
                  pinSuccess.push(list[i])
                }
                if (list[i].status == 'failed') {
                  pinFail.push(list[i])
                }
                if (list[i].status == 'finished') {
                  pinOk.push(list[i])
                }
              }
            }

            that.setData({
              list:list,
              pinChang:pinChang,
              pinSuccess:pinSuccess,
              pinFail:pinFail,
              pinOk:pinOk
            })

            // wx.hideLoading();
            setTimeout(function(){
              wx.hideLoading();
            },1000)

          } else {

          }
        } else {
          wx.showToast({
            title: res.rtnMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(error) {
        wx.showToast({
          title: '网络无法连接，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  bindOrder:function(event){
    var page = event.detail.current;
    var type = '';
    if(page == 0){
      type = 'all';
    }
    if(page == 1){
      type = 'pin';
    }
    if(page == 2){
      type = 'success'
    }
    if(page == 3){
      type = 'fail'
    }
    if(page == 4){
      type = 'ok'
    }
    this.setData({
      type:type
    })
  },
  chose:function(opt){
    var type = opt.currentTarget.id;
    var currentTab = 0;
    if(type == 'all'){
      currentTab = 0
    }
    if(type == 'pin'){
      currentTab = 1
    }
    if(type == 'success'){
      currentTab = 2
    }
    if(type == 'fail'){
      currentTab = 3
    }
    if(type == 'ok'){
      currentTab = 4
    }
    this.setData({
      type:type,
      currentTab: currentTab
    })
  },
  onPullDownRefresh() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(function () {
      wx.stopPullDownRefresh({
        complete(res) {
          wx.hideToast()
        }
      })
    }, 1000)

  },
})
