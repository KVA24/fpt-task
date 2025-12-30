import {APICore} from "@/api/apiCore.ts";

const api = new APICore();

class AuthService {
  public getProfile() {
    const requestUrl = `/v1/shop/profile`;
    return api.get(requestUrl);
  }
  
  public login(data: any, sign: any) {
    const requestUrl = `/v1/shop/auth/login?sign=${sign}`;
    return api.create(requestUrl, data);
  }
}

export const authService = new AuthService();
