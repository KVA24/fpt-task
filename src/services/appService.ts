import {APICore} from "@/api/apiCore.ts";
import {appStore} from "@/stores/AppStore.ts";

const api = new APICore();

class AppService {
  public getProfile() {
    const requestUrl = `/v1/shop/user/profile`;
    return api.get(requestUrl);
  }
  
  public getAllCategory() {
    if (appStore.isLocal === null) {
      const requestUrl = `/v1/pub/shop/product/popular?size=20`;
      return api.get(requestUrl);
    } else {
      const requestUrl = `/v1/pub/shop/product/category?isInternational=${Boolean(appStore.isLocal)}`;
      return api.get(requestUrl);
    }
  }
  
  public getAllGroupByCategory(id: any) {
    const requestUrl = `/v1/pub/shop/product/category/${id}?isInternational=${Boolean(appStore.isLocal)}`;
    return api.get(requestUrl);
  }
  
  public getProductGroupDetail(id: any) {
    const requestUrl = `/v1/pub/shop/product/group/${id}`;
    return api.get(requestUrl);
  }
  
  public searchProduct(keyWord: string) {
    const requestUrl = `/v1/pub/shop/product/group?keyword=${encodeURIComponent(keyWord) || ""}`;
    return api.get(requestUrl);
  }
  
  public getDeviceCompatible() {
    const requestUrl = `/v1/pub/shop/compatible-device/all`;
    return api.get(requestUrl);
  }
}

export const appService = new AppService();
