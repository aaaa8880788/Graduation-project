// 权限名字转化
export function transFormPowerName(powerName:string){
  let str:string = ''
  switch (powerName) {
    case 'active':
      str = '活动'
      break;
    case 'article':
      str = '文章'
      break;
    case 'class':
      str = '班级'
      break;
    case 'comment':
      str = '评论'
      break;
    case 'faculty':
      str = '学院'
      break;
    case 'gift':
      str = '礼品'
      break;
    case 'manager':
      str = '管理员'
      break;
    case 'organization':
      str = '组织'
      break;
    case 'place':
      str = '地点'
      break;
    case 'practice':
      str = '题目'
      break;
    case 'role':
      str = '角色'
      break;
    case 'school':
      str = '学校'
      break;
    case 'user':
      str = '用户'
      break;
    case 'vedio':
      str = '视频'
      break;
    case 'order':
      str = '订单'
      break;
    case 'find':
      str = '查询'
      break;
    case 'add':
      str = '添加'
      break;
    case 'delete':
      str = '删除'
      break;
    case 'modify':
      str = '修改'
      break;
    case 'audit':
      str = '审核'
      break;
    case 'power':
      str = '权限'
      break;
  }
  return str
}