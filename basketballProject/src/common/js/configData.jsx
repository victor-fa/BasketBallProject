class configData {
  //所有的权限
  allAuthIdList = ['A001', 'A002', 'A003','A004','A005','A006','A007','B004_A003','B003_A003','B002_A003','B001_A003','B002_A004','B001_A004','B001_A005','B002_A005','B003_A005','B001_A006','B002_A006',]
  
  //订单类型
  orderClassList = [
    {key: 'ticket', name: '门票使用订单'},
    {key: 'toyRent', name: '玩具租赁订单'},
    {key: 'toySale', name: '玩具购买订单'},
    {key: 'goods', name: '家长专区订单'},
    {key: 'exchange', name: '门票兑换订单'},
    {key: 'recharge', name: '充值订单'},
  ]
}

export default new configData()