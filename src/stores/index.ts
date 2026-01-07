import {authStore} from "./AuthStore"
import {taskStore} from "./taskStore.ts"
import {cartStore} from "./CartStore.ts"
import {orderStore} from "./OrderStore.ts";

export const stores = {
  authStore,
  taskStore,
  cartStore,
  orderStore
}

export type RootStore = typeof stores
