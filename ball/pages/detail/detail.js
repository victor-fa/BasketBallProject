
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
    userInfo:'none',
    lockList:'',
    userId:'',
    type:'',
    lockType: '',
    sponsorId: '',
    title: '',
    sponsorDetailId: '',
    stadiumId: '',
    isSponsor: 'false',
    animationData:'',
    clickInfo:'',
    showType:'success',
    content: '',
    routineImg: '',
    sponsorName: '',
    isLock: 'false',
    actualNum: '',
  },
  mapOpen: function (e) {
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
  getBack:function(){
    this.aniSuccess();
    wx.navigateBack();
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.loadDetail()
  },
  userClick:function(opt){
    
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
       
        if (res.data.retCode == '000') {
          that.userInfoAni();
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
  //   console.log('123');
  //   const number = opt.target.id;
  //   var that = this;
  //   var pub_url = this.data.pub_url;
  //   var data = {
  //     orderId: this.data.id,
  //   }
  //   var orderDetailId = '';
  //   console.log(this.data.lockList);
  //   console.log(that.data.isSponsor);
  //   // 规则：1、有本人 2、是赞助场 3、第一个人不可换
  //   for (let i = 0; i < this.data.lockList.length; i++) {
  //     if (this.data.lockList[i] && this.data.lockList[i].id !== undefined) {
  //       if (this.data.userId === this.data.lockList[i].id && that.data.isSponsor === 'true') {  // 赞助场都可以
  //         orderDetailId = this.data.lockList[i].orderDetailId;
  //       }
  //       if (this.data.userId === this.data.lockList[i].id && that.data.isSponsor === 'false' && i !== 0) {
  //         orderDetailId = this.data.lockList[i].orderDetailId;
  //       }
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
  //         console.log(lockSiteNumArr);
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
  close:function(){
    this.userInfoAni();
  },
  onShareAppMessage(res) {
    var id = this.data.id;
    var sponsorId = this.data.sponsorId;
    var stadiumId = this.data.stadiumId;
    var isSponsor = this.data.isSponsor;
    var sponsorDetailId = this.data.sponsorDetailId;
    var type = res.target.id;
    var title = '';
    var isLock = 'false';
    if(type == 'lock'){
      title = '我偷偷给你留了位置…';
      isLock = 'true';
    }else{
      title = '篮球激情对决，就差你一人…';
      isLock = 'false';
    }

    if (res.from === 'button') {
    }
    console.log(this.data.isSponsor);
    return {
      title: this.data.isSponsor === 'true' ? this.data.content : title,
      path: 'pages/index/index?id=' + id + '&type=' + type + '&page=detail' + '&sponsorId=' + sponsorId + '&stadiumId=' + stadiumId + '&isSponsor=' + isSponsor + '&sponsorDetailId=' + sponsorDetailId + '&isLock=' + isLock,
      imageUrl: this.data.isSponsor === 'true' ? getApp().globalData.url + this.data.routineImg : ''
    }
  },
  onShow:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        that.setData({
          userId: json.id,
          userImg: json.photo
        })
        that.loadDetail();
      },
      fail(err) {
        console.log('err')
        that.loadDetail();
      }
    })
  },
  onLoad: function (opt) {
    wx.hideShareMenu();
    var pub_url = getApp().globalData.url;
    wx.login({
      success(ress) {
        var code = ress.code

        wx.request({
          url: pub_url + '/streetball/Pay/MiniProgramPay/getOpenId',
          method: 'GET',
          data: {
            terminal: 'ios',
            code: code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)

            if (res.data.retCode == '000') {
              var data = JSON.parse(res.data.object);
              getApp().globalData.openid = data.openid
              getApp().globalData.session_key = data.session_key
              getApp().globalData.unionid = data.unionid
            } else {

            }
          },
          fail(error) {
            console.log(error)
          }
        })
      }
    })

    console.log(opt);
    console.log(opt.isLock);
    var id = opt.id;  
    var that = this;
    var lockType = opt.type;
    var sponsorId = opt.sponsorId;  // 赞助商id
    var sponsorDetailId = opt.sponsorDetailId;  // 赞助场次id
    var stadiumId = opt.stadiumId;  // 球场id
    var isSponsor = opt.isSponsor === 'undefined' ? 'false' : opt.isSponsor;  // 是否为赞助商的球场
    var isLock = opt.isLock === 'undefined' ? 'false' : opt.isLock; // 没传默认不是锁位邀请进来的
    console.log(isLock);
    if (isSponsor === 'true') { // 来自赞助商
      wx.setNavigationBarTitle({
        title: '邀你打球'
      })
    }

    this.setData({
      id: id,
      pub_url: pub_url,
      lockType: lockType,
      sponsorId: sponsorId,
      sponsorDetailId: sponsorDetailId,
      stadiumId: stadiumId,
      isSponsor: isSponsor,
      isLock: isLock,
    })

    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth

    this.setData({
      scroll_height: windowHeight,
    })
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res)
              var gender = res.userInfo.gender;
              if (gender == 1) {
                var sex = 'B'
              } else {
                var sex = 'G'
              }
              that.setData({
                type: 'phone',
                screen_name: res.userInfo.nickName,
                gender: sex,
                iconurl: res.userInfo.avatarUrl
              })
            }
          })
        } else {
          that.setData({
            type: 'wx',
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var url = getApp().globalData.url;
      var that = this;
      var sessionKey = getApp().globalData.session_key;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv

      wx.showLoading();
      wx.request({
        url: url + '/streetball/user/minProgramDecrypt',
        method: 'GET',
        data: {
          terminal: 'ios',
          sessionKey: sessionKey,
          encryptedData: encryptedData,
          iv: iv
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.retCode == '000') {
            var obj = JSON.parse(res.data.object);

            that.setData({
              recNum: obj.phoneNumber
            })
            that.zLogin();
          } else {
            wx.showToast({
              title: res.data.rtnMsg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(error) {
          console.log(error)
        }
      })
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    }
  },

  zLogin: function () {
    var url = getApp().globalData.url;
    var recNum = this.data.recNum;
    var unionid = getApp().globalData.openid;
    var screen_name = this.data.screen_name;
    var gender = this.data.gender;
    var iconurl = this.data.iconurl;
    var that = this;

    wx.request({
      url: url + '/streetball/user/checkAndLogin',
      method: 'GET',
      data: {
        terminal: 'ios',
        mobilePhone: recNum,
        weixinId: unionid,
        nickName: screen_name,
        gender: gender,
        iconurl: iconurl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {

          if (res.data.object.city == '') {
            var id = res.data.object.id;
            wx.navigateTo({
              url: '../user-data/user-data?id=' + id,
            })
          } else {
            var user_data = JSON.stringify(res.data.object);

            that.setData({
              userId:res.data.object.id
            })

            wx.setStorage({
              key: 'user_data',
              data: user_data
            })
            wx.showToast({
              title: res.data.rtnMsg,
              icon: 'none',
              duration: 1000
            })

            that.loadDetail();
          }

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
          title: '网络异常，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  bindGetUserInfo(e) {
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      var res = e.detail;
      var gender = res.userInfo.gender;
      if (gender == 1) {
        var sex = 'B'
      } else {
        var sex = 'G'
      }
      wx.showToast({
        title: '授权成功',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        that.setData({
          type: 'phone',
          phoneLogin: false,
          screen_name: res.userInfo.nickName,
          gender: sex,
          iconurl: res.userInfo.avatarUrl
        })
      }, 500)
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  loadDetail:function(){
    var pub_url = this.data.pub_url;
    var id = this.data.id;
    var that = this;
    var userId = this.data.userId;
    var lock = this.data.lockType;
    var sponsorId = this.data.sponsorId;
    var sponsorDetailId = this.data.sponsorDetailId;
    var stadiumId = this.data.stadiumId;
    lock = lock === 'lock' ? 'Y' : 'N';
    wx.request({
      url: pub_url + '/streetball/stadium/ballTeamInfo',
      method: 'GET',
      data: {
        terminal: 'ios',
        orderId: id,
        userId: userId,
        lock: lock,
        sponsorId: sponsorId,
        sponsorDetailId: sponsorDetailId,
        stadiumId: stadiumId,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: function () {
        wx.stopPullDownRefresh()
      },
      success(res) {
        console.log(res);
        if (res.data.retCode == '000' || res.data.retCode == '111') {

          var ob = res.data.object;
          console.log(ob);
          var actualNum = ob.actualNum;
          console.log(that.data.isSponsor);
          if (ob.status == 'failed' || ob.status == 'finished' || ob.actualNum == ob.actualSize){
            if (ob.routine_img === '' || ob.status == 'finished') { // 不是自己
              that.setData({showType: 'failed'})
            }
            if (ob.actualNum === ob.actualSize) { // 是自己的，且满人了的，什么都不展示
              that.setData({ showType: 'done', success: 'block' })  
            }
            that.aniSuccess();
          }

          var time = res.data.object.time;
          time = time.split('  ');
          var images = res.data.object.images;

          var lockNum = parseFloat(res.data.object.lockNum);
          var lockList = [];
          var imageList = [];
          lockList.push(images[0])
          for (var i = 0; i < lockNum; i++) {
            var ix = i
            if (ix == 0) {
              ix = '0a'
            }
            lockList.push(ix)
          }
          for (var i = 1; i < images.length; i++) {
            lockList.push(images[i])
          }
          // 在此进行处理
          // var lockSiteNumArr = res.data.ext.lockSiteNum ? res.data.ext.lockSiteNum.split(",") : [];
          // console.log(lockSiteNumArr);
          // if (images.length > 0) {
          //   if (that.data.isSponsor === 'true') { // 赞助场时，需要处理一下
          //     for (var i = 0; i < images.length; i++) {
          //       lockList[(Number(images[i].number) - 1)] = images[i];
          //     }
          //   } else {
          //     lockList.push(images[0])
          //     for (var i = 1; i < images.length; i++) {
          //       lockList[(Number(images[i].number) - 1)] = images[i];
          //     }
          //   }
          // }
          // for (let i = 1; i < lockList.length; i++) { // 用于解决冲突
          //   if (lockList[i]) {
          //     for (let j = 0; j < lockSiteNumArr.length; j++) {
          //       if ((Number(lockSiteNumArr[j])+1) === Number(lockList[i].number)) {  // 若有锁位数组里面，与number有得匹配，则清除该锁位数组
          //         lockSiteNumArr.splice(j, 1); 
          //       }
          //     }
          //   }
          // }
          // console.log(lockSiteNumArr);
          // console.log(lockList);
          // if (lockSiteNumArr.length > 0) {
          //   for (var i = 0; i < lockSiteNumArr.length; i++) {
          //     if (Number(lockSiteNumArr[i]) === 1) {
          //       lockList[Number(lockSiteNumArr[i])] = '0a';
          //     } else {
          //       lockList[Number(lockSiteNumArr[i])] = Number(lockSiteNumArr[i]) - 1;
          //     }
          //   }
          // }
          console.log(lockList);
          console.log(that.data.isSponsor);
          console.log(that.data.isInitiato);
          that.setData({
            info:res.data.object,
            day:time[0],
            time:time[1],
            lockList: lockList,
            content: ob.content,
            sponsorName: ob.sponsorName,
            routineImg: ob.routine_img,
            actualNum: actualNum,
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

  userInfoAni:function(){
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
  aniSuccess:function(){
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    const animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    var menusFlag = this.data.success;
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
      animationData: animation.export()
    })
    var that = this
    setTimeout(function () {
      that.setData({
        success: flag
      })
      animation.scale(1, 1).step({ duration: 500 })

      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  formSubmit:function(opt){
    var formId = opt.formId;
    var lockType = this.data.lockType;
    var that = this;
    if(!lockType){
      lockType = '';
    }
    // var number = 0;
    // if (that.data.isLock === 'true') {  // 锁位的情况
    //   for (let i = 0; i < that.data.lockList.length; i++) { // 加入空位置
    //     if (that.data.lockList[i] === '0a' || that.data.lockList[i] === 2 || that.data.lockList[i] === 3 || that.data.lockList[i] === 4) { // 锁位时候拿到值
    //       console.log(i);
    //       number = i + 1;
    //       break;
    //     }
    //   }
    // } else {  // 正常的情况
    //   if (Number(that.data.actualNum) === that.data.lockList.length) { // 最后一个
    //     for (let i = 0; i < that.data.lockList.length; i++) { // 加入空位置
    //       if (!that.data.lockList[i]) { // 有空位
    //         console.log(i);
    //         number = i+1;
    //         break;
    //       }
    //     }
    //   } else {
    //     number = that.data.lockList.length+1;
    //   }
    // }
    // console.log(number);
    console.log(this.data.info);
    if (this.data.info.price > 0) {
      // if (number === 0) {
      var orderId = this.data.info.orderId;
      var priceDes = this.data.info.priceDes;
      var address = this.data.info.address;
      var stadiumPlace = this.data.info.stadiumPlace;
      var time = this.data.info.time;
      wx.navigateTo({
        url: '../join-team/join-team?priceDes=' + priceDes + '&address=' + address + '&stadiumPlace=' + stadiumPlace + '&time=' + time + '&orderId=' + orderId + '&lockType=' + lockType,
      })
    } else {
      if (lockType == 'lock') {
        lockType = 'Y'
      }else{
        lockType = ''
      }
      wx.showLoading({
        title: '加载中',
      })

      var pub_url = this.data.pub_url;
      var that = this;
      var price = this.data.info.priceDes;
      var id = this.data.id;
      price = parseFloat(price.substring(1));
      var userId = this.data.userId;
      var openId = getApp().globalData.openid;
      wx.showLoading({
        title: '加载中',
      })

      console.log(that.data.lockList);
      var data = {
        terminal: 'ios',
        orderId: id,
        price: price,
        userId: userId,
        formId: formId,
        openId: openId,
        lockShare: lockType,
        // number: number,
      }
      
      wx.request({
        url: pub_url + '/streetball/Pay/Order/createOrderDetail',
        method: 'GET',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          if (res.data.retCode == '000') {
            that.aniSuccess();
            wx.hideLoading()
            that.loadDetail()
            
            setTimeout(function () {
              that.aniSuccess();
            }, 2000)

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

    }
    // }
    // if (number === 0) {
    //   wx.showToast({ title: '人员已满', icon: 'none', duration: 2000 })
    // }
  },
  goGroup:function(){

  },
  chose:function(e){
    console.log(e)
  }
})
