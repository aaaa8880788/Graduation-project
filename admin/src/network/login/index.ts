import type { LoginAccount,UserId } from "./type";
import { dRequest2,dRequest1 } from "../index";

export function accountLoginRequest(url: string, account: LoginAccount) {
  return dRequest2.post({
    url: url,
    data: account,
  });
}

export function getMenuList(url: string, id: UserId) {
  return dRequest1.get({
    url: url,
    params: {
      id
    },
  });
}
