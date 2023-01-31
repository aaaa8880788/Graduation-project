exports.getRandomArrayElements = (arr, count) => {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

exports.confirmIsToday = (time) =>{
  //把今天的日期时分秒设置为00：00：00，返回一个时间戳, 
  // todayDate就是今天00：00：00时刻的时间戳
  let todayDate= new Date().setHours(0,0,0,0);
  //给new Date()传入时间，并返回传入时间的时间戳
  let paramsDate = new Date(time).setHours(0,0,0,0);
  //时间戳相同时 True 就为今天 
  return todayDate===paramsDate
}