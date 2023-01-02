// 检验手机号
export const checkMobile = (
  rule: any,
  value: any,
  callback: any,
  source: any,
  options: any
) => {
  const regMobile =
    /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/;
  if (regMobile.test(value)) {
    // 合法手机号
    return callback();
  }
  callback(new Error("请输入合法的手机或电话号码"));
};

// 检验电影片长自定义规则
export const checkMovieTime = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("片长信息不能为空"));
  } else {
    if (/^[1-9]{1}[0-9]+分钟$/.test(value)) {
      callback();
    } else {
      callback(new Error("格式应为xx分钟"));
    }
  }
};

// 校验格式(小时:分钟——————23:05)
export const checkHourM = (rule: any, value: any, callback: any) => {
  const pattern = /^([0-1]{1}\d|2[0-3]):([0-5]\d)$/;
  if (!value) {
    callback(new Error("时间信息不能为空"));
  } else {
    if (pattern.test(value)) {
      callback();
    } else {
      callback(new Error("格式应为XX:XX"));
    }
  }
};
