const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmptyObject(e) { //判断Object对象是否为空
  let t;
  for (t in e)
    return !1;
  return !0

}

function typecn(){
  if (str == "tv") {
    return "电视剧";
  } else if (str == "film") {
    return "电影";
  } else if (str == "arts") {
    return "综艺";
  } else if (str == "anime") {
    return "动漫";
  } else if (str == "documentary") {
    return "纪录片";
  } else {
    return str;
  }
}
//n天后的日期
function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  }
  if (d < 10) {
    d = '0' + d;
  }
  return y + "-" + m + "-" + d;
}
function getUrlParam(name,url) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = url.split('?')[1].match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}
//处理图片加载404
function errImgFun(e, that) {
  var _errImg = e.target.dataset.errImg;
  // var _errObj = {};
  // _errObj[_errImg] = "../image/mx_image.png";
  // that.setData({_errObj});
  that.setData({ [_errImg]: "http://miniapps.kanketv.com/image/apptest/mx_image.png" });
} 

module.exports = {
  formatTime: formatTime,
  isEmptyObject: isEmptyObject,
  GetDateStr: GetDateStr,
  getUrlParam: getUrlParam,
  errImgFun: errImgFun
}
