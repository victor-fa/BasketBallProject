
Page({
  data: {
    logs: [],
    userInfo:'',
    pub_url:'',
    sex:'B',
    shengao:'',
    age:'',
    tizhong:'',
    zhouqi:'',
    weizhi:'',
    level:'',
    sheng:[],
    shi:[],
    qu:[],
    userId:'',
    citiesId:'',
    picker:'none',
    arr:[0,0,0],
    addrName:'活动范围',
    btnFlag:false,
    data_provinceId: 1,
    data_cityId: 1,
    data_areaId: 1,
    type:''
  },
  checkParam:function(){
    var sex = this.data.sex;
    var shengao = this.data.shengao;
    var age = this.data.age;
    var tizhong = this.data.tizhong;
    var zhouqi = this.data.zhouqi;
    var weizhi = this.data.weizhi;
    var level = this.data.level;
    var data_provinceId = this.data.data_provinceId;
    var data_cityId = this.data.data_cityId;
    var data_areaId = this.data.data_areaId;
    var btnFlag = false;

    if(sex == '' || shengao == '' || age == '' || tizhong == '' || zhouqi == '' || weizhi == '' || level == '' || data_provinceId == '' || data_cityId == '' || data_areaId == ''){
      btnFlag = false;
    }else{
      btnFlag = true;
    }

    this.setData({
      btnFlag:btnFlag
    })
  },
  pickerClick:function(){
    this.setData({
      picker:'block'
    })
    this.checkParam();
  },
  cancel:function(){
    this.setData({
      picker: 'none'
    })
    this.checkParam();
  },
  down:function(){
    var arr = this.data.arr;
    console.log(arr)
    var sheng = this.data.sheng;
    var shi = this.data.shi;
    var qu = this.data.qu;

    var data_provinceId = sheng[arr[0]].provinceId;
    var data_cityId = shi[arr[1]].cityId;
    var data_areaId = qu[arr[2]].areaId;

    console.log(shi)
    console.log(qu)

    var addrName = shi[arr[1]].city + ' ' + qu[arr[2]].area;


    this.setData({
      picker: 'none',
      data_provinceId: data_provinceId,
      data_cityId: data_cityId,
      data_areaId: data_areaId,
      addrName: addrName

    })
    this.checkParam();
  },
  sexChose:function(opt){
    console.log(opt)
    var sex = opt.currentTarget.id;
    this.setData({
      sex:sex
    })
    this.checkParam();
  },
  shengao:function(e){
    var shengao = e.detail.value;
    this.setData({
      shengao: shengao
    });
    this.checkParam();
  },
  age: function (e) {
    var age = e.detail.value;
    this.setData({
      age: age
    });
    this.checkParam();
  },
  weizhiClick: function () {
    var list = ['大前锋','小前锋','控球后卫','得分后卫','中锋','不好说'];
    var that = this;
    wx.showActionSheet({
      itemList: list,
      success(res) {
        console.log(res.tapIndex)
        var index = res.tapIndex;
        var weizhi = list[index];
        that.setData({
          weizhi: weizhi
        })
        that.checkParam();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },
  loadUserData: function () {
    var that = this;
    var pub_url = this.data.pub_url;
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
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: pub_url + '/streetball/userInfo/getUserInfo',
          data: data,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)

            if (res.data.retCode == '000') {

              var datas = res.data.object;
              wx.hideLoading()

              that.setData({
                shengao:datas.height,
                age:datas.age,
                tizhong:datas.weight,
                level:datas.level,
                weizhi:datas.position,
                zhouqi:datas.frequency,
                sex:datas.gender
              })
              // userId: userId,
              // height: this.data.shengao,
              // age: this.data.age,
              // weight: this.data.tizhong,
              // provinceId: this.data.data_provinceId,
              // cityId: this.data.data_cityId,
              // areaId: this.data.data_areaId,
              // level: this.data.level,
              // position: this.data.weizhi,
              // frequency: this.data.zhouqi,
              // terminal: 'ios',
              // gender: this.data.sex
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
      fail(err) {
        wx.hideLoading()
      }
    })
  },
  levelClick: function () {
    var list = ['小白', '专精', '精英'];
    var that = this;
    wx.showActionSheet({
      itemList: list,
      success(res) {
        console.log(res.tapIndex)
        var index = res.tapIndex;
        var level = list[index];
        that.setData({
          level: level
        })
        that.checkParam();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  zhouqiClick:function(){
    var list = ['经常打球', '偶尔打球','很少打球'];
    var that = this;
    wx.showActionSheet({
      itemList: list,
      success(res) {
        console.log(res.tapIndex)
        var index = res.tapIndex;
        var zhouqi = list[index];
        that.setData({
          zhouqi:zhouqi
        })
        that.checkParam();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  tizhong: function (e) {
    var tizhong = e.detail.value;
    this.setData({
      tizhong: tizhong
    });
    this.checkParam();
  },
  sub:function(){
    var pub_url = this.data.pub_url;
    var that = this;
    var userId = this.data.userId;

    // userId: 用户id
    // height: 身高
    // age: 年龄
    // weight: 体重
    // provinceId：省编号
    // cityId: 市编号
    // areasId: 区编号
    // level: 篮球水平级别(
    //   小白.junior 
    //   专精.intermediate 
    //   精英.senior)
    // position：篮球场上的位置（
    // 控球后卫.pointGuard
    // 得分后卫.shootingGuard
    // 小前锋.smallForward
    // 大前锋.powerForward
    // 中锋.center）
    // frequency：打球频率(
    //   偶尔.occasionally
    //   经常.regularly)
    var data = {
      userId:userId,
      height:this.data.shengao,
      age:this.data.age,
      weight:this.data.tizhong,
      provinceId:this.data.data_provinceId,
      cityId:this.data.data_cityId,
      areaId:this.data.data_areaId,
      level:this.data.level,
      position:this.data.weizhi,
      frequency:this.data.zhouqi,
      terminal:'ios',
      gender:this.data.sex
    }

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: pub_url + '/streetball/user/modifyTheUser',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)

        if (res.data.retCode == '000') {
          var user_data = JSON.stringify(res.data.object);
          wx.setStorage({
            key: 'user_data',
            data: user_data
          })
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack()
          },1000)
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
  bindChange:function(e){

  },
  onShow:function(){
    var pub_url = this.data.pub_url;
    var that = this;

    var userId = this.data.userId;
    if(!userId){
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
                  sex: sex,
                })
              }
            })
          } else {
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    }else{
      this.loadUserData()
    }
  },
  loadQu:function(){

  },
  loadShi:function(){

  },
  onLoad: function (opt) {
    var that = this;
    console.log(opt)
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url: pub_url,
      userId:opt.id,
      type:opt.type
    })
  }
})
