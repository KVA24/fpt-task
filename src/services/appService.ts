import {APICore} from "@/api/apiCore.ts";

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
    const requestUrl = `/v1/engine/leaderboard${isMe ? "/me" : ""}?periodType=${type}&limit=100&offset=0`;
    return api.get(requestUrl);
  }
}

export const appService = new AppService();
