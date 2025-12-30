import {APICore} from "@/api/apiCore.ts";

const api = new APICore();

class CartService {
  public getCart() {
    const requestUrl = `/v1/pub/shop/cart/get?guestId=${localStorage.getItem("wii-guestId") || ""}`;
    return api.get(requestUrl);
  }
  
  public addToCart(data: any, sign?: any) {
    const requestUrl = `/v1/pub/shop/cart/create?sign=${sign || ""}`;
    return api.create(requestUrl, data);
  }
  
  public updateCart(data: any, sign?: any) {
    const requestUrl = `/v1/pub/shop/cart/update?sign=${sign || ""}`;
    return api.update(requestUrl, {
      items: data,
      guestId: localStorage.getItem("wii-guestId") || ""
    });
  }
  
  public mergeCart(sign?: any) {
    const requestUrl = `/v1/pub/shop/cart/merge?sign=${sign || ""}`;
    return api.create(requestUrl, {guestId: localStorage.getItem("wii-guestId") || ""});
  }
  
  public getCheckout(data?: any, sign?: any, voucherCode?: string, email?: string) {
    const requestUrl = `/v1/pub/shop/cart/checkout?sign=${sign || ""}`;
    return api.create(requestUrl, {
      productVariantId: data?.productVariantId,
      quantity: data?.quantity,
      guestId: localStorage.getItem("wii-guestId") || "",
      voucherCode: voucherCode,
      email: email,
    });
  }
  
  public createOrder(data: any, sign?: any) {
    const requestUrl = `/v1/pub/shop/orders/onepay/create?sign=${sign || ""}`;
    return api.create(requestUrl, data);
  }
}

export const cartService = new CartService();
