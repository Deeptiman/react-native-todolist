import React, { Component } from 'react';
import { View, Text, StatusBar, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging';
import ProgressLoader from 'rn-progress-loader';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import { MSAuthManager } from '../../auth/MSAuthManager';
import { MSGraphManager } from '../../auth/MSGraphManager';
import AuthRealmServices from '../../Realm/AuthRealm';
import styles from '../../styles/login/LoginStyles';
import GDrive from "../drive/GDrive";
import { connect } from 'react-redux';
import { Utils } from '../utils/Utils';
import { appLogin, addPlanner, saveMicrosoftPlanner } from '../../actions';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            visible: false,
        }
    }

    componentDidMount() {

        var user = AuthRealmServices.find();
        if (user != undefined) {
            var result = JSON.parse(JSON.stringify(user));

            if (result[0] != undefined && result[0].isLoggedIn && !result[0].isSynced) {
                this.props.navigation.navigate(Utils.SETUP_CALENDAR_SCREEN);
            } else if (result[0] != undefined && result[0].isLoggedIn && result[0].isSynced) {
                this.props.navigation.navigate(Utils.DASHBOARD_SCREEN);
            }
        }
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/calendar.readonly',
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.appdata',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.readonly',
                'https://www.googleapis.com/auth/drive.metadata.readonly',
                'https://www.googleapis.com/auth/drive.metadata',
                'https://www.googleapis.com/auth/drive.photos.readonly'],
            webClientId: Utils.GOOGLE_CLOUD_APP,
            offlineAccess: true,
            hostedDomain: '',
            forceConsentPrompt: true,
        });
    }

    _subscribeToAll = () => {
        messaging().subscribeToTopic(Utils.ALL_TOPIC).
            then((data) => {
                console.log("Success - subscribeToTopic = " + JSON.stringify(data))
            }).catch((error) => {
                console.log("Error - subscribeToTopic = " + JSON.stringify(error))
            });

        var user = AuthRealmServices.find();
        var result = JSON.parse(JSON.stringify(user));

        this.props.navigation.navigate(Utils.SETUP_CALENDAR_SCREEN);
    }

    _signInWithEmail = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.state.email.length < 3) {
            Alert.alert('Error', 'Minimum 3 characters to add Email');
        } else if (reg.test(this.state.email) === false) {
            Alert.alert('Error', 'Add proper email');
        } else if (this.state.password.length < 3) {
            Alert.alert('Error', 'Minimum 3 characters to add Password');
        } else {
            this.setState({ visible: true })
            setTimeout(() => {
                auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                    .then((data) => {
                        this.setState({
                            email: '',
                            password: '',
                            visible: false
                        })

                        this.userRef = database().ref('Users').child(data.user.uid)
                        this.userRef.once('value', snap => {
                            var sn = snap.val();

                            console.log("Firebase Login Email == " + sn.email)

                            var auth = {
                                id: data.user.uid,
                                name: sn.name,
                                email: sn.email,
                                phone: '000',
                                photoURL: '',
                                accessToken: 'demo',
                                loginType: Utils.FIREBASE_LOGIN_TYPE,
                                isLoggedIn: true,
                                isSynced: false,

                            }
                            AuthRealmServices.save(auth);
                            this._subscribeToAll()
                        });
                    })
                    .catch((error) => {
                        Alert.alert('Error', 'Signin Error - ' + error.message);
                    })
            }, 1000);
        }
    }

    _signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();

            GDrive.setAccessToken(tokens.accessToken);
            GDrive.init();

            console.log("GOOGLE ACCESS TOKEN :::: " + tokens.accessToken)

            if (userInfo.user.email !== undefined) {
                const credential = auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
                const firebaseUserCredential = await auth().signInWithCredential(credential);

                console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));

                var userInfoObj = {
                    id: userInfo.user.id,
                    name: userInfo.user.name,
                    email: userInfo.user.email,
                    photo: userInfo.user.photo,
                    loginType: Utils.GOOGLE_LOGIN_TYPE,
                }
                this.props.appLogin(userInfoObj);

                var realmAuth = {
                    id: userInfo.user.id,
                    name: userInfo.user.name,
                    email: userInfo.user.email,
                    phone: '000',
                    photoURL: userInfo.user.photo,
                    accessToken: tokens.accessToken,
                    loginType: Utils.GOOGLE_LOGIN_TYPE,
                    isLoggedIn: true,
                    isSynced: false,

                }
                AuthRealmServices.save(realmAuth);

                this._subscribeToAll()
            } else {
                Alert.alert('Info', 'No Email ID found in this account')
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.error("SIGN_IN_CANCELLED = " + error)
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.error("IN_PROGRESS = " + error)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.error("PLAY_SERVICES_NOT_AVAILABLE = " + error)
            } else {
                console.error("Other = " + error)
            }
        }
    }

    _signInWithMicrosoft = async () => {
        try {
            const microsoftAuth = await MSAuthManager.signInAsync();
            const user = await MSGraphManager.getUserAsync();

            if (user.mail !== undefined) {
                var userInfoObj = {
                    id: user.id,
                    name: user.displayName,
                    email: user.mail,
                    photo: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
                    loginType: Utils.MICROSOFT_LOGIN_TYPE,
                }
                this.props.appLogin(userInfoObj);

                console.log("MICRSOFT ACCESS TOKEN :::: " + microsoftAuth.accessToken)

                var auth = {
                    id: user.id,
                    name: user.displayName,
                    email: user.mail,
                    phone: '000',
                    accessToken: microsoftAuth.accessToken,
                    photoURL: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
                    loginType: Utils.MICROSOFT_LOGIN_TYPE,
                    isLoggedIn: true,
                    isSynced: false,
                }
                AuthRealmServices.save(auth);

                this._subscribeToAll()
            } else {
                Alert.alert('Info', 'No Email ID found in this account')
            }

        } catch (error) {
            alert(error);
        }
    }

    _signInWithFacebook = async () => {

        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            console.log('User cancelled the login process');
        } else {

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                console.log('Something went wrong obtaining access token');
            }
            console.log("FACEBOOK ACCESS TOKEN :::: " + data.accessToken)

            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            await auth().signInWithCredential(facebookCredential);

            const infoRequest = await new GraphRequest('/me', {
                parameters: {
                    'fields': {
                        'string': 'email,first_name,last_name,picture'
                    }
                }
            }, (err, res) => {

                var profile = JSON.parse(JSON.stringify(res))

                if (profile.email !== undefined) {

                    var userInfoObj = {
                        id: profile.id,
                        name: profile.first_name + " " + profile.last_name,
                        email: profile.email,
                        photo: profile.picture.data.url,
                        loginType: Utils.FACEBOOK_LOGIN_TYPE,
                    }
                    this.props.appLogin(userInfoObj);

                    var auth = {
                        id: profile.id,
                        name: profile.first_name + " " + profile.last_name,
                        email: profile.email,
                        phone: '000',
                        accessToken: data.accessToken,
                        photoURL: profile.picture.data.url,
                        loginType: Utils.FACEBOOK_LOGIN_TYPE,
                        isLoggedIn: true,
                        isSynced: false,
                    }
                    AuthRealmServices.save(auth);

                    this._subscribeToAll()
                } else {
                    Alert.alert('Info', 'No Email ID found in this account')
                }
            });
            await new GraphRequestManager().addRequest(infoRequest).start();
        }
    }

    render() {

        return (

            <View style={styles.container}>
                <View style={styles.header_container}>
                    <View style={styles.app_icon_view}>
                        <Image source={require('../../../assets/icons/ic_app_logo.png')} style={styles.icon_style_logo} />
                    </View>
                </View>
                <View style={styles.app_label_view}>
                    <Text style={styles.app_label}>TODO-List</Text>
                </View>
                <ProgressLoader
                    visible={this.state.visible}
                    isModal={true}
                    isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />
                <View style={styles.signin_email_container}>
                    <View style={styles.login_text_input_view} >
                        <TextInput
                            style={styles.login_text_input}
                            placeholder="Email..."
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({ email: text })} />
                    </View>
                    <View style={styles.login_text_input_view} >
                        <TextInput
                            style={styles.login_text_input}
                            secureTextEntry={true}
                            placeholder="Password..."
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({ password: text })} />
                    </View>
                </View>

                <Row size={13} style={styles.email_btn_container}>
                    <Col sm={3}>
                    </Col>
                    <Col sm={6}>
                        <TouchableOpacity
                            style={styles.email_login_btn_signin_view}
                            onPress={this._signInWithEmail}>
                            <View style={styles.login_btn_label_view}>
                                <Text style={styles.login_btn_signin_label}>Sign in with email</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                </Row>

                <Row size={13} style={styles.google_btn_container}>
                    <Col sm={3}>
                    </Col>
                    <Col sm={6}>
                        <GoogleSigninButton
                            style={{ width: 225, height: 60 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={this._signInWithGoogle} />
                    </Col>
                </Row>

                <Row size={13} style={styles.microsoft_btn_container}>
                    <Col sm={3}>
                    </Col>
                    <Col sm={6}>

                        <TouchableOpacity
                            style={styles.microsoft_login_btn_mview}
                            onPress={this._signInWithMicrosoft}>
                            <View style={styles.login_btn_icon_view}>
                                <Image source={require('../../../assets/icons/ic_microsoft.png')} style={styles.login_btn_micon} />
                            </View>
                            <View style={styles.login_social_btn_label_view}>
                                <Text style={styles.login_btn_mlabel}>Sign in with Microsoft</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                    <Col sm={1} md={4} lg={3}>

                    </Col>
                </Row>
                <Row size={13} style={styles.facebook_btn_container}>
                    <Col sm={3}>

                    </Col>
                    <Col sm={6}>
                        <TouchableOpacity
                            style={styles.facebook_login_btn_mview}
                            onPress={this._signInWithFacebook}>
                            <View style={styles.login_btn_icon_view}>
                                <Image source={require('../../../assets/icons/ic_facebook.png')} style={styles.login_btn_micon} />
                            </View>
                            <View style={styles.login_social_btn_label_view}>
                                <Text style={styles.login_btn_mlabel}>Sign in with Facebook</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                </Row>
                <View style={styles.or_container}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text style={styles.or_label}>Don't have an account? Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const dispatchProps = dispatch => ({
    appLogin: (userInfo) => dispatch(appLogin(userInfo)),
    addPlanner: (planner) => dispatch(addPlanner(planner)),
    saveMicrosoftPlanner: (planner) => dispatch(saveMicrosoftPlanner(planner))
});

const stateProps = state => ({
    appLoginPayload: state.appLoginPayload,
    addPlannerPayload: state.addPlannerPayload
});

export default connect(stateProps, dispatchProps)(LoginComponent)