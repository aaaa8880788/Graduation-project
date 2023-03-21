import { RouteRecordRaw } from 'vue-router'

// 从菜单列表中遍历出来的第一个路径
let firstMenuPath = ''
// 菜单路由映射关系函数
async function mapMenusToRoutes(userMenus: any[]): Promise<RouteRecordRaw[]> {
  if(!userMenus.length){
    return []
  }
  const routes: RouteRecordRaw[] = []

  // 1.先去加载默认所有的routes(导入动态路由的所有路由信息)
  const allRoutes: RouteRecordRaw[] = []
  const routeFiles:any = import.meta.glob('@/router/home/**/**.ts')
  const routeFilesValue:any[] = Object.values(routeFiles)
  for(const item of routeFilesValue){
    const route = await item()
    allRoutes.push(route.default)
  }
  // 2.根据菜单获取需要添加的routes
  console.log('userMenus---',userMenus);
  console.log('allRoutes---',allRoutes);
  console.log('routes---',routes);
  
  for (const menu of userMenus) {
    const route = allRoutes.find((route) => route.name === menu.name)
    if (route) {
      routes.push(route)    
    }
  }
  firstMenuPath = routes[0].path
  return routes
}
// 获取权限
function mapMenusToPermissions(userMenus: any[]) {
  const permissions: any[] = []
  userMenus.forEach(item => {
    permissions.push({
      name:item.name,
      permission:item.permission
    })
  })
  return permissions
}

export { mapMenusToRoutes,mapMenusToPermissions,firstMenuPath }
