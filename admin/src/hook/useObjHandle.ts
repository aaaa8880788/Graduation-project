const objRemoveNullHandle = (obj:any) => {
  const newObj:any = {}
    for(const key in obj){
      if(![null,undefined,''].includes(obj[key])){
        newObj[key] = obj[key]
      }
    }
  return newObj
}

function deepClone(target:any,map = new Map()) {
  // 如果是对象，且不是原始值null
  if (typeof target === 'object' && target !== 'null') {
    // 克隆前判断数据之前是否克隆过
    const cache = map.get(target);
    if (cache) {
      // 如果克隆过了，则直接返回
      return cache;
    }
    // 创建容器
    const result:any = Array.isArray(target) ? [] : {};
    
    // target为要被克隆的数据，result为克隆的结果
    // 把target做为键，result作为值
    // Map的好处在于键可以为任意类型
    // 等下如果又克隆到了相同的target，就直接从Map中读取数据
    map.set(target, result);
    
    const keys = Object.keys(target);
    keys.forEach(key => {
      // 我们需要把map传到函数deepclone中保留map的数据
      result[key] = deepClone(target[key],map)  //**** 真是机智啊
    })

    
    return result;
  }
  // 如果是原始值，则直接返回
  return target;
}

export {
  objRemoveNullHandle
}