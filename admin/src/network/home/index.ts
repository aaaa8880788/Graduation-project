import type { 
  findType,
  UserId,
  PlaceId,
  ActiveId,
  ArticleId,
  FacultyId,
  GiftId,
  OrganizationId,
  PracticeId
} from "./type";
import { dRequest1 } from "../index";

// 获取登录用户信息
export function getUserInfoRequest(url: string, id: UserId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    },
  });
}

// 获取后台用户管理列表
export function getManagersRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 删除后台用户管理员
export function deleteManager(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 添加后台用户管理员
export function addManager(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑后台用户管理员
export function updateManager(url: string, data:any, id: UserId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 通过id获取后台用户管理信息
export function findManagerById(url: string, id: UserId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 获取权限列表
export function findPowers(url: string){
  return dRequest1.get({
    url: url
  });
}

// 获取活动地点列表
export function getPlacesRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取活动地点信息
export function findPlaceById(url: string, id: PlaceId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加活动地点
export function addPlace(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑活动地点
export function updatePlace(url: string, data:any, id: PlaceId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除活动地点
export function deletePlace(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 获取活动列表
export function getActivesRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取活动信息
export function findActiveById(url: string, id: ActiveId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加活动
export function addActive(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑活动
export function updateActive(url: string, data:any, id: ActiveId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除活动
export function deleteActive(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 获取文章列表
export function getArticlesRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取文章信息
export function findArticleById(url: string, id: ArticleId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加文章
export function addArticle(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑文章
export function updateArticle(url: string, data:any, id: ArticleId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除文章
export function deleteArticle(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 获取学院列表
export function getFacultiesRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取学院信息
export function findFacultyById(url: string, id: FacultyId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加学院
export function addFaculty(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑学院
export function updateFaculty(url: string, data:any, id: FacultyId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除学院
export function deleteFaculty(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 获取礼品列表
export function getGiftsRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取礼品信息
export function findGiftById(url: string, id: GiftId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加礼品
export function addGift(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑礼品
export function updateGift(url: string, data:any, id: GiftId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除礼品
export function deleteGift(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 获取组织列表
export function getOrganizationsRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取组织信息
export function findOrganizationById(url: string, id: OrganizationId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加组织
export function addOrganization(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑组织
export function updateOrganization(url: string, data:any, id: OrganizationId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除组织
export function deleteOrganization(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}

// 获取题目列表
export function getPracticesRequest(url: string, findParams:findType) {  
  const { page,pageSize,queryInfo } = findParams
  return dRequest1.get({
    url: url,
    params: {
      page,
      pageSize,
      ...queryInfo
    },
  });
}

// 通过id获取题目信息
export function findPracticeById(url: string, id: PracticeId) {  
  return dRequest1.get({
    url: url,
    params: {
      id
    }
  });
}

// 添加题目
export function addPractice(url: string, data:any) {  
  return dRequest1.post({
    url: url,
    data: data
  });
}

// 编辑题目
export function updatePractice(url: string, data:any, id: PracticeId) {  
  return dRequest1.post({
    url: url,
    data: data,
    params:{
      id
    }
  });
}

// 删除题目
export function deletePractice(url: string, data:any) {  
  return dRequest1.delete({
    url: url,
    data: data
  });
}