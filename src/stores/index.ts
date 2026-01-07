import {authStore} from "./AuthStore"
import {appStore} from "./taskStore.ts"
import {cartStore} from "./CartStore.ts"
import {orderStore} from "./OrderStore.ts";

export const stores = {
  authStore,
  appStore,
  cartStore,
  orderStore
}

export type RootStore = typeof stores
