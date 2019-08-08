
import React from 'react'
import {message} from 'antd'

class myTool {
  sesStorSetItem = (name, data) => {
    let str = JSON.stringify(data);
    window.sessionStorage.setItem(name, str);
  };

  sesStorGetItem = name => {
    let str = window.sessionStorage.getItem(name);
    return JSON.parse(str);
  };

  sesStorRemoveItem = name => {
    window.sessionStorage.removeItem(name);
  };

  locStorSetItem = (name, data) => {
    let str = JSON.stringify(data);
    window.localStorage.setItem(name, str);
  };

  locStorGetItem = name => {
    let str = window.localStorage.getItem(name);
    return JSON.parse(str);
  };

  locStorRemoveItem = name => {
    window.localStorage.removeItem(name);
  };

  //表格操作按钮筛选
  choiceTabelBtn = (list, keys) => {
    return list.filter(item => keys.some(i => i === item.key) )
  };

  removeTabelBtn = (list, keys) => {
    return list.filter(item => !keys.some(i => i === item.key) )
  }

  //过滤object空值，返回新object
  delObjVoidKey = obj => {
    var param = {};
    if (obj === null || obj === undefined || obj === "") return param;
    for (var key in obj) {
      if (obj[key] === "Object") {
        param[key] = myTool.delObjVoidKey(obj[key]);
      } else if (
        obj[key] !== null &&
        obj[key] !== undefined &&
        obj[key] !== ""
      ) {
        param[key] = obj[key];
      }
    }
    return param;
  };

  //判断两个对象是否相等
  diffObject = (obj1, obj2) => {
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (!o1 || !o2) {
      /*  判断不是对象  */
      return obj1 === obj2;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
      //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }
    for (var attr in obj1) {
      var t1 = obj1[attr] instanceof Object;
      var t2 = obj2[attr] instanceof Object;
      if (t1 && t2) {
        return myTool.diffObject(obj1[attr], obj2[attr]);
      } else if (obj1[attr] !== obj2[attr]) {
        return false;
      }
    }
    return true;
  };

  //深复制对象或数组
  deepCopy = obj => {
    return JSON.parse(JSON.stringify(obj))
  }

  //表格时间换行处理
  DataBr = ({ data }) => {
    let Text;
    if (data) {
      const textArr = data.split(" ");
      Text = (
        <React.Fragment>
          {textArr[0]}
          <br />
          {textArr[1]}
        </React.Fragment>
      );
    } else {
      Text = null;
    }
    return Text;
  };

  //截取日期
  formatDate = (date = '') => {
    return date.split(' ')[0]
  }

  //图片数组转字符串
  formatImgArrToStr = (imgArr = []) => {
    const arr = imgArr.map(item => {
      let img = "";
      img = item.url;
      return img;
    });
    return arr.toString();
  };

  //格式化显示图片列表
  formatViewImgList = (img = '') => {
    let list = [];
    if (img) {
      list = img
        .toString()
        .split(",")
        .filter(i => i)
        .map((item, index) => {
          let data = {};
          data.name = index;
          data.url = item;
          return data;
        });
    }
    return list;
  };

  //判断是否是json格式
  isJSON = (str) => {
    let isJS = false
    if (typeof str === 'string') {
      try {
        let obj = JSON.parse(str)
        if (typeof obj == 'object' &&  obj) {
          isJS = true
        }
      } catch(e) {
        isJS = false
      }
    }
    return isJS
  }

  //格式化显示图片列表有宽高
  formatViewImgListWH = (list = []) => {
    return list.map(item => {
      let i = {}
      i.url = item.url || ''
      i.width = item.width || ''
      i.height = item.height || ''
      i.name = item.name || ''
      return i
    })
  }

  //处理用户当前选择的数据
  selectedData = (tableDataSource = [], selectedRowKeys = []) => {
    return tableDataSource.filter(item => selectedRowKeys.some(i => i === item.key) )
  };

  //返回数组中的id
  getArrId = (arr = [], key = 'id') => {
    return arr.map(item => {
      const i = {...item}
      let id = ''
      id = i[key]
      return id
    })
  }

  //读取cookie
  getCookie = name => {
    let cookievalue = "";
    let search = name + "=";
    if (document.cookie.length > 0) {
      let offset = document.cookie.indexof(search);
      if (offset !== -1) {
        offset += search.length;
        let end = document.cookie.indexof(";", offset);
        if (end === -1) {
          end = document.cookie.length;
        }
        cookievalue = unescape(document.cookie.substring(offset, end));
      }
    }
    return cookievalue;
  };

  //用于表格自适应浏览器高
  tableScrollTool = () => {
    const appWrapH = window.innerHeight;
    let tableScrollHeight;
    if (appWrapH <= 400) {
      tableScrollHeight = 400;
    }
    if (appWrapH > 400 && appWrapH <= 866) {
      tableScrollHeight = 475;
    }
    if (appWrapH > 866 && appWrapH <= 1200) {
      tableScrollHeight = 588;
    }
    if (appWrapH > 1200 && appWrapH <= 1300) {
      tableScrollHeight = 870;
    }
    if (appWrapH > 1300) {
      tableScrollHeight = 990;
    }
    return tableScrollHeight;
  };

  //处理接口请求结果
  getApiData = (res = {}, callback, errorCallback, unshowErr) => {
    if (res.data.retCode === '000') {
      callback()
    } else {
      !unshowErr && message.error(res.data.rtnMsg)
      errorCallback && errorCallback()
    }
  }

  //处理接口请求结果
  getApiPromise = (res = {}) => {
    return new Promise((resolve, reject) => {
      if (res.data.retCode === '000') {
        resolve(res)
      } else {
        reject(res.data.rtnMsg)
      }
    })
  }


  //数组添加key=id
  arrAddKey = (arr = [], key = 'id') => {
    return arr.map(item => {
      const i = {...item}
      let obj = {}
      obj = i
      obj.key = i[key]
      return obj
    })
  }

  //数组key求和
  sumArrKey = (arr = [], key = '') => {
    let num = 0
    arr.forEach(i => {
      num += Number(i[key])
    })
    return num
  }
  //数组添加key=index
  arrAddIndexKey = (arr = []) => {
    return arr.map((item, index) => {
      const i = {...item}    
      let obj = {}
      obj = i
      obj.key = index
      return obj
    })
  }

  //限制输入框只能输入1位小数
  formatPrice = (value = '', dot, hasComma) => { 
    let v = `${value}`
    v = v.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
    v = v.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
    v = v.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    v = dot === 2 ? v.replace(/^()*(\d+)\.(\d\d).*$/,'$1$2.$3') : v.replace(/^()*(\d+)\.(\d).*$/,'$1$2.$3');//只能输入两个小数  
    if (v.indexOf(".")< 0 && v !== "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
      v = parseFloat(v); 
    } 
    return hasComma ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : v
  }

}

export default new myTool();
