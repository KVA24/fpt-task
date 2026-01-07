import {APICore} from "@/api/apiCore.ts";

const api = new APICore();

class TaskService {
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
}

export const appService = new TaskService();
