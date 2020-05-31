import { MSAuthManager } from './MSAuthManager';

export class GraphAuthProvider {
  getAccessToken = async() => {
    return await MSAuthManager.getAccessTokenAsync();
  }
}