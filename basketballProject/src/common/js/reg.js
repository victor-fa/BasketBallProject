
const regs = {
  // 0到9的数字(replace)
  regNumber: /[^0-9]/g,
  // 带小数点的数字(replace)
  regNumberDot: /[^0-9.]/g,
  //去空格(replace)
  regNoSpace: /\s+/g,
  // 只能输入字母和数字(replace)
  regLetterAndNumber: /[\W]/g,
  // 电话号码(replace)
  regPhoneNum: /[^0-9-]/g,
  // 特殊符号
  regSymbol: new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/\\-\\+\\-\\ ?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"),
  // 判断小数点
  regDot: /.*\..*/,
  // 1-9的正整数
  regNumber19: /^[1-9]\d*$/,
  // 两位小数的正数
  regNumberDot2: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
  // 验证是否是字母和数字
  regLetterAndNum: /^[A-Za-z0-9]+$/,
  //用户名正则，4到16位（字母，数字，下划线，减号）
  regUserName: /^[a-zA-Z0-9_-]{4,16}$/,
  //8-16位数字和字母
  regPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
}

export default regs