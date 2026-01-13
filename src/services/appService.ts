import {APICore} from "@/api/apiCore.ts";
import {appStore} from "@/stores/appStore.ts";

const api = new APICore();

class AppService {
  public getProfile() {
    const requestUrl = `/v1/engine/user/profile`;
    return api.get(requestUrl);
  }
  
  public getAllCategory() {
    const requestUrl = `/v1/engine/task/category`;
    return api.get(requestUrl);
  }
  
  public getAllTask() {
    const requestUrl = `/v1/engine/task`;
    return api.get(requestUrl);
  }
  
  public getLeaderBoard(type: string, isMe?: boolean) {
    const requestUrl = isMe ? `/v1/engine/leaderboard/${type === "WEEKLY" ? 'weekly' : 'monthly'}/me` : `/v1/engine/leaderboard?periodType=${type}&limit=${appStore.rankLimit}&offset=0`;
    return api.get(requestUrl);
  }
}

export const appService = new AppService();
