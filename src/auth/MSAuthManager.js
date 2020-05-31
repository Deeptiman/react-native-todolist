import { AsyncStorage } from 'react-native';
import { authorize, refresh } from 'react-native-app-auth';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import { Utils } from '../components/utils/Utils';

const config = {
  clientId: Utils.MICROSOFT_AZURE_CLIENT_ID,
  redirectUrl: Platform.OS === 'ios' ? Utils.MICROSOFT_AZURE_REDIRECT_IOS_URL : Utils.MICROSOFT_AZURE_REDIRECT_ANDROID_URL,
  scopes: [
    'openid',
    'offline_access',
    'profile',
    'user.read',
    'Calendars.ReadWrite',
    'Files.ReadWrite.All',
    'Sites.ReadWrite.All',
    'MailboxSettings.ReadWrite'
  ],
  additionalParameters: { prompt: 'select_account' },
  serviceConfiguration: {
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  }
};

export class MSAuthManager {

  static signInAsync = async () => {
    const result = await authorize(config);

    console.log("Microsoft Access Token --> "+result.accessToken)

    // Store the access token, refresh token, and expiration time in storage
    await AsyncStorage.setItem('userToken', result.accessToken);
    await AsyncStorage.setItem('refreshToken', result.refreshToken);
    await AsyncStorage.setItem('expireTime', result.accessTokenExpirationDate);

    const firebaseUserCredential = await auth().signInAnonymously();
    console.log("Microsoft --> "+JSON.stringify(firebaseUserCredential.user.toJSON()));
    
    //const credential = firebase.auth.OAuthProvider('microsoft.com').credential(result.idToken, result.accessToken)
    //const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
    //console.log("Microsoft --> "+JSON.stringify(firebaseUserCredential.user.toJSON()));

    return result
  }

  static signOutAsync = async () => {
    // Clear storage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('expireTime');
  }

  static getAccessTokenAsync = async() => {
    const expireTime = await AsyncStorage.getItem('expireTime');

    if (expireTime !== null) {
      // Get expiration time - 5 minutes
      // If it's <= 5 minutes before expiration, then refresh
      const expire = moment(expireTime).subtract(5, 'minutes');
      const now = moment();

      if (now.isSameOrAfter(expire)) {
        // Expired, refresh
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        const result = await refresh(config, {refreshToken: refreshToken});

        // Store the new access token, refresh token, and expiration time in storage
        await AsyncStorage.setItem('userToken', result.accessToken);
        await AsyncStorage.setItem('refreshToken', result.refreshToken);
        await AsyncStorage.setItem('expireTime', result.accessTokenExpirationDate);

        return result.accessToken;
      }

      // Not expired, just return saved access token
      const accessToken = await AsyncStorage.getItem('userToken');
      return accessToken;
    }

    return null;
  }
}