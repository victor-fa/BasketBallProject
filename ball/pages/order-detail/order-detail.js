
Page({
  data: {
    logs: [],
    list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    scroll:true,
    id:0,
    day:'',
    time:'',
    info:'',
    success:'none',
    orderTime:'',
    userInfo:'none',
    lockList:'',
    userId:'',
    sponsorId: '',
    isSponsor: 'false',
    stadiumId: '',
    title: '',
    content: '',
    routineImg: '',
    isMyInfo: 'false',
    sponsorDetailId: '',
    isLock: false,
  },
  mapOpen: function (e) {
    console.log(this.data);
    var info = this.data.info;
    var latitude = parseFloat(info.latitude);
    var longitude = parseFloat(info.longitude);
    var that = this
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18
    })
  },
  userInfo:function(){
    this.setData({
      userInfo:'block'
    })
  },
  close:function(){
    this.setData({
      userInfo:'none'
    })
  },
  onLoad: function (opt) {
    wx.hideShareMenu();
    console.log(opt);
    var id = opt.id;
    var sponsorId = opt.sponsorId;
    var title = opt.title;
    var isSponsor = opt.isSponsor === 'undefined' ? 'false' : opt.isSponsor;  // 是否为赞助商的球场
    var that = this;
    var pub_url = getApp().globalData.url;
    var openId = getApp().globalData.openid;
    var isLock = opt.isLock === 'undefined' ? 'false' : opt.isLock; // 没传默认不是锁位邀请进来的
    this.setData({
      id: id,
      pub_url: pub_url,
      openId: openId,
      sponsorId: sponsorId,
      isSponsor: isSponsor,
      title: title,
      isLock: isLock,
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        that.setData({
          userId: json.id,
          userImg: json.photo
        })
        console.log(that.data.userId)
        that.loadDetail();
      },
      fail(err) {

      }
    })
  },
  userInfoAni: function () {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var menusFlag = this.data.userInfo;
    var begin = 0;
    var end = 0;
    var flag = '';
    if (menusFlag == 'block') {
      begin = 0;
      end = -220;
      flag = 'none';
    } else {
      begin = -220;
      end = 0;
      flag = 'block';
    }
    animation.scale(0.1, 0.1).step({ duration: 500 })

    this.setData({
      userInfoAni: animation.export()
    })
    var that = this
    setTimeout(function () {
      that.setData({
        userInfo: flag
      })
      animation.scale(1, 1).step({ duration: 500 })

      that.setData({
        userInfoAni: animation.export()
      })
    }, 200)
  },
  userClick: function (opt) {

    var that = this;
    var pub_url = this.data.pub_url;
    var id = opt.currentTarget.id;
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      userId: id,
      terminal: 'ios'
    }
    wx.request({
      url: pub_url + '/streetball/userInfo/getUserInfo',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.userInfoAni();
        if (res.data.retCode == '000') {
          that.setData({
            clickInfo: res.data.object
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
          title: '网络无法连接，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // changeSeat: function (opt) {
  //   if (this.data.isLock === 'true') {  // 锁位邀请进来的，不能更换位置
  //     return;
  //   }
  //   console.log('321');
  //   const number = opt.target.id;
  //   var that = this;
  //   var pub_url = this.data.pub_url;
  //   var data = {
  //     orderId: this.data.id,
  //   };
  //   var orderDetailId = '';
  //   // 规则：1、有本人 2、是赞助场 3、第一个人不可换
  //   for (let i = 0; i < this.data.lockList.length; i++) {
  //     if (this.data.lockList[i] && this.data.lockList[i].id !== undefined) {
  //         if (this.data.userId === this.data.lockList[i].id && that.data.isSponsor === 'true') {  // 赞助场都可以
  //           orderDetailId = this.data.lockList[i].orderDetailId;
  //         }
  //         if (this.data.userId === this.data.lockList[i].id && that.data.isSponsor === 'false' && i !== 0) {
  //           orderDetailId = this.data.lockList[i].orderDetailId;
  //         }
  //     }
  //   }
  //   console.log(orderDetailId);
  //   if (orderDetailId !== undefined && orderDetailId !== '') {
  //     wx.request({
  //       url: pub_url + '/streetball/sponsor/changeSeat?terminal=ios&' + orderDetailId + '=' + Number(number),
  //       data: data,
  //       header: {
  //         'content-type': 'application/json' // 默认值
  //       },
  //       success(res) {
  //         console.log(res)
  //         if (res.data.retCode == '000') {
  //           that.queryPhotos();
  //         } else {
  //           wx.showToast({
  //             title: res.data.rtnMsg,
  //             icon: 'none',
  //             duration: 2000
  //           })
  //         }
  //       },
  //       fail(error) {
  //         wx.showToast({
  //           title: '网络无法连接，请稍后重试！',
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     })
  //   }
  // },
  // queryPhotos: function () {
  //   var that = this;
  //   var pub_url = this.data.pub_url;
  //   var data = {
  //     terminal: 'ios',
  //     orderId: this.data.id
  //   }
  //   wx.request({
  //     url: pub_url + '/streetball/sponsor/queryPhotos',
  //     data: data,
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       console.log(res)
  //       if (res.data.retCode == '000') {
  //         var images = res.data.data;
  //         var lockSiteNumArr = res.data.ext.lockSiteNum ? res.data.ext.lockSiteNum.split(",") : [];
  //         var lockList = [];
  //         for (var i = 0; i < images.length; i++) {
  //           lockList[(Number(images[i].number) - 1)] = images[i];
  //         }
  //         if (lockSiteNumArr.length > 0) {
  //           for (var i = 0; i < lockSiteNumArr.length; i++) {
  //             if (Number(lockSiteNumArr[i]) === 1) {
  //               lockList[Number(lockSiteNumArr[i])] = '0a';
  //             } else {
  //               lockList[Number(lockSiteNumArr[i])] = Number(lockSiteNumArr[i]) - 1;
  //             }
  //           }
  //         }
  //         console.log(lockList);
  //         that.setData({
  //           clickInfo: res.data.object,
  //           lockList: lockList,
  //         })
  //       } else {
  //         wx.showToast({
  //           title: res.data.rtnMsg,
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     },
  //     fail(error) {
  //       wx.showToast({
  //         title: '网络无法连接，请稍后重试！',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  close: function () {
    this.userInfoAni();
  },

  onShareAppMessage(res) {
    var id = this.data.id;
    var sponsorId = this.data.sponsorId;
    var stadiumId = this.data.stadiumId;
    var isSponsor = this.data.isSponsor;
    var sponsorDetailId = this.data.sponsorDetailId;
    console.log(res);
    var type = res.target.id;
    var isLock = false;
    var title = '';
    if (type == 'lock') {
      title = '我偷偷给你留了位置…';
      isLock = true;
    } else {
      title = '篮球激情对决，就差你一人…';
      isLock = false;
    }
    if (res.from === 'button') {
    }
    return {
      title: this.data.isSponsor === 'true' ? this.data.content : title,
      path: 'pages/index/index?id=' + id + '&type=' + type + '&page=detail' + '&sponsorId=' + sponsorId + '&stadiumId=' + stadiumId + '&isSponsor=' + isSponsor + '&title=' + title + '&sponsorDetailId=' + sponsorDetailId + '&isLock=' + isLock,
      imageUrl: this.data.isSponsor === 'true' ? getApp().globalData.url + this.data.routineImg : ''
    }
  },
  loadDetail:function(){
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var that = this;
    var userId = this.data.userId;

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: pub_url + '/streetball/Pay/MyOrder/queryMyOrderDetail',
      method: 'GET',
      data: {
        terminal: 'ios',
        orderId: id,
        userId:userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.object);
        if (res.data.retCode == '000') {
          var time = res.data.object.time;
          time = time.split('  ');
          var images = res.data.object.photo;
          var lockNum = parseFloat(res.data.object.lockSize);
          var lockList = [];
          var isMyInfo = 'false';
          lockList.push(images[0])
          for (var i = 0; i < lockNum; i++) {
            var ix = i
            console.log(i)
            if (ix == 0) {
              ix = '0a'
            }
            lockList.push(ix)
          }
          for (var i = 1; i < images.length; i++) {
            lockList.push(images[i])
          }
          // var lockSiteNumArr = res.data.object.photo.length > 0 ? res.data.object.photo[0].lockSiteNum ? res.data.object.photo[0].lockSiteNum.split(",") : [] : [];
          // console.log(lockSiteNumArr);

          // if (that.data.isSponsor === 'true') { // 赞助场时，需要处理一下
          //   for (var i = 0; i < images.length; i++) {
          //     lockList[(Number(images[i].number) - 1)] = images[i];
          //   }
          // } else {
          //   lockList.push(images[0])
          //   for (var i = 1; i < images.length; i++) {
          //     lockList[(Number(images[i].number) - 1)] = images[i];
          //   }
          // }
          // for (let i = 1; i < lockList.length; i++) { // 用于解决冲突
          //   if (lockList[i]) {
          //     for (let j = 0; j < lockSiteNumArr.length; j++) {
          //       if ((Number(lockSiteNumArr[j]) + 1) === Number(lockList[i].number)) {  // 若有锁位数组里面，与number有得匹配，则清除该锁位数组
          //         lockSiteNumArr.splice(j, 1);
          //       }
          //     }
          //   }
          // }
          // console.log(lockSiteNumArr);
          console.log(lockList);
          if (images[0].id === that.data.userId) {  // 第一个人是自己，则就是自己的场子
            isMyInfo = 'true';
          }
          // if (lockSiteNumArr.length > 0) {
          //   for (var i = 0; i < lockSiteNumArr.length; i++) {
          //     if (Number(lockSiteNumArr[i]) === 1) {
          //       lockList[Number(lockSiteNumArr[i])] = '0a';
          //     } else {
          //       lockList[Number(lockSiteNumArr[i])] = Number(lockSiteNumArr[i])-1;
          //     }
          //   }
          // }
          console.log(isMyInfo);
          console.log(lockList);
          var orderTime = res.data.object.orderTime;
          var time = new Date(orderTime);
          var y = time.getFullYear();
          var m = time.getMonth() + 1;
          var d = time.getDate();
          var h = time.getHours();
          var mm = time.getMinutes();
          var s = time.getSeconds();
          orderTime = (y + '.' + (m) + '.' + (d) + ' ' + (h) + ':' + (mm))
          that.setData({
            info:res.data.object,
            day:time[0],
            time:time[1],
            lockList: lockList,
            orderTime: orderTime,
            content: res.data.object.content,
            routineImg: res.data.object.routineImg,
            orderDetailId: res.data.object.photo[0].orderDetailId,
            isMyInfo: isMyInfo,
            sponsorDetailId: res.data.object.sponsorDetailId,
            stadiumId: res.data.object.stadiumId,
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
          title: '网络无法连接，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  joinTeam:function(){
    
  },
  goGroup:function(){

  },
  chose:function(e){
    console.log(e)
  }
})
