import type { LoginAccount } from "./type";
import { dRequest2 } from "../index";

export function accountLoginRequest(url: string, account: LoginAccount) {
  return dRequest2.post({
    url: url,
    data: account,
  });
}
