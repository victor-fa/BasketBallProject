import axios from 'axios'
import qs from 'qs'

class Http {
  get(url, params = {}) {
    return axios.get( url, params)
  }
  post(url, params = {}) {
    const config = {
      timeout: 5000,
      // withCredentials: true,
    }
    return axios.post(url, qs.stringify(params), config)
  }
}

const http = new Http();

let basicUrl = ''
let spUrl = ''

const CURRENT = 'www'

switch (CURRENT) {
  case 'www':
    basicUrl = 'toys.dbajoy.com'
    // basicUrl = 'test.toys.dbajoy.com'
    break;
  case 'mediahx':
    basicUrl = 'toys.mediahx.com'
    break; 
  case 'dev108':
    basicUrl = 'toys.dev108.com'
    break;
  default :
    basicUrl = ''
}

const BASIC_URL = basicUrl

// const API_7995 = `/api`
 
// const API_7992 = `http://${BASIC_URL}`
const API_7995 = `https://${BASIC_URL}`


// const API_ROOT = process.env.NODE_ENV === 'development' ? '' : API_7992

class Api {
  checkLogin = (parmas) => http.post(`${API_7995}/streetball_admin/toysAdminLogin/checkLoginForReact`, parmas)
  loginCodeImg = (parmas) => http.post(`${API_7995}/streetball_admin/toysAdminLogin/getCodeForReact`, parmas)

  //进入店铺地址
  spUrl = spUrl
  //地图
  placeSearch = (parmas) => http.post('https://webapi.amap.com/maps?v=1.4.14&key=746ffc3fe07804538f84482f40484b60&plugin=AMap.PlaceSearch', parmas)

  //图片地址
  IMG_BASIC_URL = `https://${BASIC_URL}/`

  //文件上传
  upLoadFile = `${API_7995}/streetball_admin/advert/advertUpload`
  //文件上传/有宽高
  getImagePathWidthHeight = `${API_7995}/streetball_admin/itemImage/getImagePathWidthHeight`

  //地址查询-查询全部省或单个省
  findprovince = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/findProvinces`, parmas)
  //地址查询-查询全部市或单个省下所有市或单个市
  findcity = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/findCities`, parmas)
  //地址查询-查询所有区或单个市下所有区或单个区
  findarea = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/findAreas`, parmas)

  //app管理-平台广告首页(分页)
  advertHome = (parmas) => http.post(`${API_7995}/streetball_admin/advert/advertHome`, parmas)
  //app管理-平台发布、编辑广告
  editAdvert = (parmas) => http.post(`${API_7995}/streetball_admin/advert/editAdvert`, parmas)
  //app管理-平台开启、关闭广告
  statusAdvert = (parmas) => http.post(`${API_7995}/streetball_admin/advert/statusAdvert`, parmas)
  //app管理-平台删除广告
  delAdvert = (parmas) => http.post(`${API_7995}/streetball_admin/advert/delAdvert`, parmas)
  //店铺管理-广告栏目
  queryAdvertColumns = (parmas) => http.post(`${API_7995}/streetball_admin/advert/queryAdvertColumns`, parmas)

  //权限管理-获取所有权限
  getAllAuthList = (parmas) => http.post(`${API_7995}/streetball_admin/privilege/getPrivilegeList`, parmas)
  //权限管理-权限角色列表
  getAuthRoleList = (parmas) => http.post(`${API_7995}/streetball_admin/privilege/getJobPrivilegeList`, parmas)
  //权限管理-创建权限角色
  createAuthRole = (parmas) => http.post(`${API_7995}/streetball_admin/privilege/saveJobPrivilege`, parmas)
  //权限管理-编辑权限角色
  editAuthRole = (parmas) => http.post(`${API_7995}/streetball_admin/privilege/updateJobPrivilege`, parmas)
  //权限管理-删除权限角色
  delAuthRole = (parmas) => http.post(`${API_7995}/streetball_admin/privilege/deleteJobPrivilege`, parmas)
  //权限管理-人员列表
  getWorkerList = (parmas) => http.post(`${API_7995}/streetball_admin/pfUser/getPfUserList`, parmas)
  //权限管理-创建人员
  createWorker = (parmas) => http.post(`${API_7995}/streetball_admin/pfUser/savePfUser`, parmas)
  //权限管理-编辑人员
  editWorker = (parmas) => http.post(`${API_7995}/streetball_admin/pfUser/updatePfUser`, parmas)
  //权限管理-删除人员
  delWorder = (parmas) => http.post(`${API_7995}/streetball_admin/pfUser/deletePfUser`, parmas)

  //用户管理-用户列表
  getUserList = (parmas) => http.post(`${API_7995}/streetball_admin/appUser/getUserList`, parmas)
  //用户管理-批量启用、禁用
  setUserStatus = (parmas) => http.post(`${API_7995}/streetball_admin/appUser/setUserStatus`, parmas)
  //用户管理-用户详情：基本信息
  getUserInfo = (parmas) => http.post(`${API_7995}/streetball_admin/appUser/getUserInfo`, parmas)
  //用户管理-修改用户信息
  updateTheUser = (parmas) => http.post(`${API_7995}/streetball_admin/appUser/updateTheUser`, parmas)
  

  //资金管理-充值列表
  rechargeConsume = (parmas) => http.post(`${API_7995}/toysburg_admin/fundManage/rechargeList/rechargeConsume`, parmas)
  //资金管理-余额消费列表
  gameCoinConsume = (parmas) => http.post(`${API_7995}/toysburg_admin/fundManage/gameCoinList/gameCoinConsume`, parmas)
  //资金管理-现金消费列表
  cashConsume = (parmas) => http.post(`${API_7995}/toysburg_admin/fundManage/cashList/cashConsume`, parmas)
  //资金管理-积分消费列表
  pointConsume = (parmas) => http.post(`${API_7995}/toysburg_admin/fundManage/integralList/integralConsume`, parmas)

  //球场管理-球场信息
  getStadiumList = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/getStadiumList`, parmas)
  //球场管理-球场上下架
  setStadiumStatus = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/setStadiumStatus`, parmas)
  //球场管理-场地设置(前移/后移)
  getSetting = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/getSetting`, parmas)
  //球场管理-编辑球场
  updateStadium = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/updateStadium`, parmas)
  //球场管理-获取单个月的基础数据
  getMonthSetting = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/getMonthSetting`, parmas)
  //球场管理-复制上月计划
  copyMonthSetting = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/copyMonthSetting`, parmas)
  //球场管理-编辑场地设置 
  updateSetting = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/updateSetting`, parmas)
  //球场管理-场地月详情 
  getMonthStadiumDetail = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/getMonthStadiumDetail`, parmas)
  //球场管理-场次详情 
  getMonthDay = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/getMonthDay`, parmas)
  //球场管理-场次下架 
  setStadiumDetailStatus = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/setStadiumDetailStatus`, parmas)
  //球场管理-编辑场次 
  updateStadiumDetail = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/updateStadiumDetail`, parmas)

  //订单管理-列表 
  queryOrders = (parmas) => http.post(`${API_7995}/streetball_admin/orderManage/queryOrders`, parmas)
  //订单管理-订单详情 
  queryOrderDetail = (parmas) => http.post(`${API_7995}/streetball_admin/orderManage/queryOrderDetail`, parmas)
  //订单管理-查询所有球场名字 
  queryAllNames = (parmas) => http.post(`${API_7995}/streetball_admin/orderManage/queryAllNames`, parmas)
  //订单管理-退款 
  refund = (parmas) => http.post(`${API_7995}/streetball_admin/orderManage/refund`, parmas)
  //订单管理-删除订单
  delOrder = (parmas) => http.post(`${API_7995}/streetball_admin/orderManage/deleteOrder`, parmas)

  //赞助商管理-赞助商列表 
  querySponsors = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/querySponsorList`, parmas)
  // querySponsors = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/getSponsorStadium`, parmas)
  //赞助商管理-赞助商详情 
  querySponsorDetail = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/querySponsorDetailList`, parmas)
  //赞助商管理-创建或修改赞助商
  updateSponsors = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/createOrEditSponsor`, parmas)
  //赞助商管理-删除赞助商
  delSponsor = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/deleteSponsor`, parmas)
  //赞助商管理-删除赞助商场次
  delSponsorDetail = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/deleteSponsorDetails`, parmas)
  //赞助商管理-场次上架下架
  changeShelfApi = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/upDownData`, parmas)
  //文件上传
  upLoadSponsorFile = `${API_7995}/streetball_admin/sponsor/uploadImg`
  //文件上传
  GetSponsorFile = `${API_7995}/streetball_admin/upload/sponsor`
  //赞助商管理-球场下拉【废弃，因为下面接口重复了】
  // queryCourtPull = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/getSponsorStadium`, parmas)
  //赞助商管理-赞助商下拉
  querySponsorPull = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/getSponsorStadium`, parmas)
  //赞助商管理-发起赞助
  createSponsorDetail = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/createSponsorDetail`, parmas)
  //赞助商管理-修改赞助
  editSponsorDetailData = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/editSponsorDetailData`, parmas)
  //赞助商管理-获取场次详情
  getStadiumDetail = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/getStadiumDetail`, parmas)
  //赞助商管理-获取某赞助商赞助的某球场的详情
  getSponsorDetailData = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/getSponsorDetailData`, parmas)
  //赞助商管理-删除场次时间
  deleteSponDetailData = (parmas) => http.post(`${API_7995}/streetball_admin/sponsor/deleteSponDetailData`, parmas)


  //资金管理-列表 
  fundPage = (parmas) => http.post(`${API_7995}/streetball_admin/stadium/fundPage`, parmas)

}

export {
  BASIC_URL,
  // API_7992,
}

export default new Api()