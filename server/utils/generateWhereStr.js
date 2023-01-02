// 接受数组格式为
// [{name:xxx}]  则会转化为 `where name=xxx`
// [{name:xxx},{id:111}]  则会转化为 `where name=xxx and id=111`
exports.generateWhere = (arr) => {
  if(arr.length === 0){
    return ``
  }
  if(arr.length === 1){
    let str = `where`
    for(const key in arr[0]){
      return str += ` ${key} like "%${arr[0][key]}%"`
    }
  }else{
    let str = `where`
    const fristArr = arr.shift()
    for(const key in fristArr){
      str += ` ${key} like "%${fristArr[key]}%"`
    }
    arr.forEach(item=>{
      for(const key in item){
        str += ` and ${key} like "%${item[key]}%"`
      }
    })
    return str
  }
}