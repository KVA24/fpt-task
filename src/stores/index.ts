import {authStore} from "./AuthStore"
import {appStore} from "./appStore.ts"

export const stores = {
  authStore,
  appStore,
}

export type RootStore = typeof stores
