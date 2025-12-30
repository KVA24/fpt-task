import {APICore} from "@/api/apiCore.ts";
import {orderStore} from "@/stores/OrderStore.ts";
import {format} from "date-fns";

const api = new APICore();

class OrderService {
  public getOrders(page: number) {
    const requestUrl = `/v1/pub/shop/orders?page=${page}&guestId=${localStorage.getItem('wii-guestId')}${orderStore.paymentState ? `&paymentState=${orderStore.paymentState}` : ""}${orderStore.startDate ? `&startDate=${format(orderStore.startDate, 'yyyy-MM-dd')}` : ""}${orderStore.endDate ? `&endDate=${format(orderStore.endDate, 'yyyy-MM-dd')}` : ""}`;
    return api.get(requestUrl);
  }
  
  public getDetailOrder(id: string | undefined) {
    const requestUrl = `/v1/pub/shop/orders/${id}`;
    return api.get(requestUrl);
  }
  
  public getSimStatus(iccid: string | undefined) {
    const requestUrl = `/v1/pub/shop/orders/sims/${iccid}`;
    return api.get(requestUrl);
  }
}

export const orderService = new OrderService();
