import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import CardView from 'react-native-cardview';
import AuthRealmServices from '../../Realm/AuthRealm';
import PlannerRealmServices from '../../Realm/PlannerRealm';
import AnnouncementRealmServices from '../../Realm/AnnouncementRealm';
import RecordRealmServices from '../../Realm/RecordRealm';
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging'
import { GoogleSignin } from 'react-native-google-signin';
import { MSAuthManager } from '../../auth/MSAuthManager';
import ProgressLoader from 'rn-progress-loader';
import styles from '../../styles/settings/SettingsStyles';
import headerStyles from '../../styles/header/HeaderStyles';
import { fetchPlanners } from '../../actions';
import { connect } from 'react-redux';
import { Utils } from '../utils/Utils';

import { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

class SettingsComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  _signOutFacebook = async (accessToken) => {

    let logout =
      await new GraphRequest(
        "me/permissions/",
        {
          accessToken: accessToken,
          httpMethod: 'DELETE'
        },
        (error, result) => {
          if (error) {
            console.log('Error fetching data: ' + error.toString());
          } else {
            console.log("Facebook Logout - " + accessToken)
            LoginManager.logOut();
          }
        });
    await new GraphRequestManager().addRequest(logout).start();
  }

  _signOut = async (user) => {
    //console.log("signout - "+user.loginType+" :: ")
    this.setState({ visible: true })
    setTimeout(async () => {
      if (user.loginType === Utils.FIREBASE_LOGIN_TYPE) {
        await auth().signOut();
      } else if (user.loginType === Utils.GOOGLE_LOGIN_TYPE) {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
      } else if (user.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
        await MSAuthManager.signOutAsync();
      } else if (user.loginType === Utils.FIREBASE_LOGIN_TYPE) {
        await auth().signOut();
        await this._signOutFacebook(user.accessToken)
      }
      await AuthRealmServices.delete(user.email)
      await PlannerRealmServices.delete()
      await AnnouncementRealmServices.delete()
      await RecordRealmServices.delete()
      await this.props.fetchPlanners(false)
      
      if(Platform.OS === 'android') {
        await messaging().unregisterDeviceForRemoteMessages()
        await messaging().unregisterForRemoteNotifications()
      }
      await this.props.navigation.navigate(Utils.LOGIN_SCREEN);
    }, 1000);
  }

  render() {
    var result = Utils.currentUser()
    return (
      <View style={styles.container}>
        <CardView
          style={headerStyles.container}
          cardElevation={2}
          cardMaxElevation={2}>
          <Text style={headerStyles.header_label}>Settings</Text>
        </CardView>
        <ProgressLoader
          visible={this.state.visible}
          isModal={true}
          isHUD={true}
          hudColor={"#000000"}
          color={"#FFFFFF"} />
        <View style={headerStyles.header_container}>
          <View style={headerStyles.app_icon_view}>
            <Image source={result[0] && result[0].photoURL && result[0].photoURL.length != 0 ? { uri: result[0].photoURL } : require('../../../assets/icons/ic_person.png')} style={headerStyles.icon_style_logo} />
          </View>
        </View>
        <View style={headerStyles.app_label_view}>
          <Text style={headerStyles.app_label}>{result[0] && result[0].name}</Text>
        </View>
        <View style={headerStyles.app_label_view}>
          <Text style={headerStyles.app_label}>{result[0] && result[0].email}</Text>
        </View>
        <TouchableOpacity
          style={headerStyles.logout_btn_signout_container}
          onPress={this._signOut.bind(this, result[0])}>
          <View style={headerStyles.logout_btn_signout_view}>
            <View style={headerStyles.logout_btn_label_view}>
              <Text style={headerStyles.logout_btn_signout_label}>Sign Out</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const stateProps = state => ({
  plannerList: state.plannerList
});

const dispatchProps = dispatch => ({
  fetchPlanners: (type) => dispatch(fetchPlanners(type)),
});

export default connect(stateProps, dispatchProps)(SettingsComponent);